/**
 * env-engine.js — EnvMoss
 *
 * Core Comparison Engine:
 *   - parseEnv(text, side)
 *   - compareEnvFiles(baseText, targetText)
 *
 * Sesuai aturan PRD 02-prd-envmoss.md:
 *   - Pemrosesan deterministik murni di memori, tanpa manipulasi DOM.
 *   - Tidak menampilkan atau mengekspos value env variable di objek hasil komparasi publik untuk UI.
 *   - Deteksi 4 status: Missing, Orphan, Duplicate, Mismatch.
 *   - Aturan Duplicate: 1 record per kelompok duplikat per file, deklarasi terakhir menjadi value efektif.
 *   - Parsing warnings untuk baris tidak valid tanpa menyertakan secret.
 */

// ---------------------------------------------------------------------------
// Konstanta & Regex
// ---------------------------------------------------------------------------

/**
 * Validasi nama key:
 * Harus diawali huruf atau underscore, lalu dapat berisi huruf, angka, underscore, titik, atau tanda hubung.
 */
const KEY_NAME_REGEX = /^[A-Za-z_][A-Za-z0-9_.-]*$/;

// ---------------------------------------------------------------------------
// Helper Parsing
// ---------------------------------------------------------------------------

/**
 * Menghapus UTF-8 BOM jika ada di awal string.
 *
 * @param {string} text
 * @returns {string}
 */
export function stripBOM(text) {
  if (typeof text !== 'string') return '';
  if (text.charCodeAt(0) === 0xFEFF) {
    return text.slice(1);
  }
  return text;
}

/**
 * Memeriksa apakah nama key valid sesuai spesifikasi EnvMoss.
 *
 * @param {string} key
 * @returns {boolean}
 */
export function isValidKeyName(key) {
  return typeof key === 'string' && KEY_NAME_REGEX.test(key);
}

/**
 * Mengurai baris tunggal environment variable.
 * Mengembalikan objek parsed atau parsing warning.
 *
 * @param {string} rawLine - Isi baris mentah
 * @param {number} lineNumber - Nomor baris (1-based)
 * @returns {{ type: 'empty' } | { type: 'comment' } | { type: 'entry', key: string, value: string, line: number } | { type: 'warning', line: number, reason: string, reasonKey: string }}
 */
function parseLine(rawLine, lineNumber) {
  // 1. Abaikan baris kosong
  if (!rawLine || rawLine.trim().length === 0) {
    return { type: 'empty' };
  }

  // 2. Abaikan komentar penuh (diawali '#' setelah whitespace awal)
  const trimmedStart = rawLine.trimStart();
  if (trimmedStart.startsWith('#')) {
    return { type: 'comment' };
  }

  // 3. Tangani prefix 'export '
  let lineContent = rawLine.trim();
  if (/^export\s+/.test(lineContent)) {
    lineContent = lineContent.replace(/^export\s+/, '').trim();
  }

  // 4. Cari tanda assignment '='
  const eqIndex = lineContent.indexOf('=');
  if (eqIndex === -1) {
    return {
      type: 'warning',
      line: lineNumber,
      reason: "Format assignment tidak dikenali: tidak ditemukan pemisah '='",
      reasonKey: 'engine.warn.noEquals'
    };
  }

  // 5. Ekstrak dan validasi nama key
  const rawKey = lineContent.slice(0, eqIndex).trim();
  if (!isValidKeyName(rawKey)) {
    return {
      type: 'warning',
      line: lineNumber,
      reason: 'Nama key tidak valid: harus diawali huruf/underscore dan hanya memuat karakter alfanumerik, underscore, titik, atau tanda hubung',
      reasonKey: 'engine.warn.invalidKey'
    };
  }

  // 6. Ekstrak value
  const rawValue = lineContent.slice(eqIndex + 1);
  const valTrimmedStart = rawValue.trimStart();

  let finalValue = '';

  if (valTrimmedStart.startsWith('"')) {
    // Value dengan tanda petik ganda
    const closingIndex = valTrimmedStart.indexOf('"', 1);
    if (closingIndex === -1) {
      return {
        type: 'warning',
        line: lineNumber,
        reason: 'Tanda petik ganda pembuka tidak ditutup',
        reasonKey: 'engine.warn.unclosedDouble'
      };
    }

    finalValue = valTrimmedStart.slice(1, closingIndex);
    const remainder = valTrimmedStart.slice(closingIndex + 1);
    const trimmedRem = remainder.trim();

    // Setelah kutipan penutup, hanya whitespace dan komentar yang diizinkan
    if (trimmedRem.length > 0 && !trimmedRem.startsWith('#')) {
      return {
        type: 'warning',
        line: lineNumber,
        reason: 'Terdapat teks tambahan yang tidak valid setelah tanda petik penutup',
        reasonKey: 'engine.warn.trailingAfterQuote'
      };
    }

  } else if (valTrimmedStart.startsWith("'")) {
    // Value dengan tanda petik tunggal
    const closingIndex = valTrimmedStart.indexOf("'", 1);
    if (closingIndex === -1) {
      return {
        type: 'warning',
        line: lineNumber,
        reason: 'Tanda petik tunggal pembuka tidak ditutup',
        reasonKey: 'engine.warn.unclosedSingle'
      };
    }

    finalValue = valTrimmedStart.slice(1, closingIndex);
    const remainder = valTrimmedStart.slice(closingIndex + 1);
    const trimmedRem = remainder.trim();

    if (trimmedRem.length > 0 && !trimmedRem.startsWith('#')) {
      return {
        type: 'warning',
        line: lineNumber,
        reason: 'Terdapat teks tambahan yang tidak valid setelah tanda petik penutup',
        reasonKey: 'engine.warn.trailingAfterQuote'
      };
    }

  } else {
    // Value tanpa tanda petik
    // Inline comment dimulai dengan '#' yang didahului setidaknya satu whitespace.
    // URL seperti https://example.com/#section dipertahankan karena '#' tidak didahului spasi.
    const commentIndex = rawValue.search(/\s+#/);
    if (commentIndex !== -1) {
      finalValue = rawValue.slice(0, commentIndex).trim();
    } else {
      finalValue = rawValue.trim();
    }
  }

  return {
    type: 'entry',
    key: rawKey,
    value: finalValue,
    line: lineNumber
  };
}

// ---------------------------------------------------------------------------
// Parser Environment File
// ---------------------------------------------------------------------------

/**
 * Mengurai string environment variable menjadi struktur data terorganisir.
 *
 * @param {string} text - Teks file .env
 * @param {'Base'|'Target'} [side='Base'] - Label sisi file untuk konteks warning
 * @returns {{
 *   entries: Array<{ key: string, value: string, line: number }>,
 *   keys: Map<string, { key: string, count: number, lines: number[], effectiveValue: string, firstLine: number, lastLine: number }>,
 *   duplicates: Array<{ key: string, count: number, lines: number[] }>,
 *   warnings: Array<{ side: string, line: number, reason: string, reasonKey: string }>
 * }}
 */
export function parseEnv(text, side = 'Base') {
  const cleanText = stripBOM(text || '');
  // Pisahkan baris (mendukung LF, CRLF, dan CR)
  const lines = cleanText.split(/\r\n|\r|\n/);

  const entries = [];
  const warnings = [];
  const keyMap = new Map();

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const result = parseLine(lines[i], lineNumber);

    if (result.type === 'warning') {
      warnings.push({
        side,
        line: result.line,
        reason: result.reason,
        reasonKey: result.reasonKey
      });
    } else if (result.type === 'entry') {
      entries.push({
        key: result.key,
        value: result.value,
        line: result.line
      });

      if (!keyMap.has(result.key)) {
        keyMap.set(result.key, {
          key: result.key,
          count: 1,
          lines: [result.line],
          effectiveValue: result.value,
          firstLine: result.line,
          lastLine: result.line
        });
      } else {
        const item = keyMap.get(result.key);
        item.count += 1;
        item.lines.push(result.line);
        // Aturan last declaration wins untuk value efektif
        item.effectiveValue = result.value;
        item.lastLine = result.line;
      }
    }
  }

  // Kumpulkan duplicate records (urutan mengikuti kemunculan pertama key di file)
  const duplicates = [];
  for (const item of keyMap.values()) {
    if (item.count > 1) {
      duplicates.push({
        key: item.key,
        count: item.count,
        lines: [...item.lines]
      });
    }
  }

  return {
    entries,
    keys: keyMap,
    duplicates,
    warnings
  };
}

// ---------------------------------------------------------------------------
// Core Comparison Engine
// ---------------------------------------------------------------------------

/**
 * Membandingkan Base Environment dan Target Environment.
 * Menghasilkan struktur data komparasi tanpa membocorkan isi secret ke UI.
 *
 * @param {string} baseText - Teks Base Environment
 * @param {string} targetText - Teks Target Environment
 * @returns {{
 *   summary: {
 *     missingCount: number,
 *     orphanCount: number,
 *     duplicateGroupCount: number,
 *     baseDuplicateCount: number,
 *     targetDuplicateCount: number,
 *     mismatchCount: number,
 *     matchCount: number,
 *     totalUniqueBaseKeys: number,
 *     totalUniqueTargetKeys: number,
 *     hasWarnings: boolean
 *   },
 *   missing: Array<{ key: string, line: number, lines: number[] }>,
 *   orphan: Array<{ key: string, line: number, lines: number[] }>,
 *   mismatch: Array<{ key: string, baseLine: number, targetLine: number, status: string }>,
 *   duplicates: {
 *     base: Array<{ key: string, count: number, lines: number[] }>,
 *     target: Array<{ key: string, count: number, lines: number[] }>
 *   },
 *   warnings: {
 *     base: Array<{ side: string, line: number, reason: string, reasonKey: string }>,
 *     target: Array<{ side: string, line: number, reason: string, reasonKey: string }>
 *   },
 *   board: {
 *     base: Array<{ key: string, line: number, lines: number[], status: 'Missing'|'Mismatch'|'Match', isDuplicate: boolean, duplicateCount: number }>,
 *     target: Array<{ key: string, line: number, lines: number[], status: 'Orphan'|'Mismatch'|'Match', isDuplicate: boolean, duplicateCount: number }>
 *   }
 * }}
 */
export function compareEnvFiles(baseText, targetText) {
  const baseParsed = parseEnv(baseText, 'Base');
  const targetParsed = parseEnv(targetText, 'Target');

  const missing = [];
  const orphan = [];
  const mismatch = [];
  const matches = [];

  const boardBase = [];
  const boardTarget = [];

  // 1. Analisis dari sisi Base
  // Urutan Missing & Mismatch mengikuti kemunculan pertama di Base
  for (const baseItem of baseParsed.keys.values()) {
    const key = baseItem.key;
    const isBaseDuplicate = baseItem.count > 1;

    if (!targetParsed.keys.has(key)) {
      // Missing: Ada di Base, tidak ada di Target
      missing.push({
        key,
        line: baseItem.firstLine,
        lines: [...baseItem.lines]
      });

      boardBase.push({
        key,
        line: baseItem.firstLine,
        lines: [...baseItem.lines],
        status: 'Missing',
        isDuplicate: isBaseDuplicate,
        duplicateCount: baseItem.count
      });
    } else {
      const targetItem = targetParsed.keys.get(key);
      const isMismatch = baseItem.effectiveValue !== targetItem.effectiveValue;

      if (isMismatch) {
        // Mismatch: Ada di kedua file, tapi value efektif berbeda
        // PENTING: Jangan sertakan value sebenarnya di hasil publik UI
        mismatch.push({
          key,
          baseLine: baseItem.firstLine,
          targetLine: targetItem.firstLine,
          status: 'Mismatch'
        });

        boardBase.push({
          key,
          line: baseItem.firstLine,
          lines: [...baseItem.lines],
          status: 'Mismatch',
          isDuplicate: isBaseDuplicate,
          duplicateCount: baseItem.count
        });
      } else {
        // Match: Key dan value efektif sama
        matches.push({
          key,
          baseLine: baseItem.firstLine,
          targetLine: targetItem.firstLine,
          status: 'Match'
        });

        boardBase.push({
          key,
          line: baseItem.firstLine,
          lines: [...baseItem.lines],
          status: 'Match',
          isDuplicate: isBaseDuplicate,
          duplicateCount: baseItem.count
        });
      }
    }
  }

  // 2. Analisis dari sisi Target (untuk Orphan & board Target)
  // Urutan Orphan mengikuti kemunculan pertama di Target
  for (const targetItem of targetParsed.keys.values()) {
    const key = targetItem.key;
    const isTargetDuplicate = targetItem.count > 1;

    if (!baseParsed.keys.has(key)) {
      // Orphan: Ada di Target, tidak ada di Base
      orphan.push({
        key,
        line: targetItem.firstLine,
        lines: [...targetItem.lines]
      });

      boardTarget.push({
        key,
        line: targetItem.firstLine,
        lines: [...targetItem.lines],
        status: 'Orphan',
        isDuplicate: isTargetDuplicate,
        duplicateCount: targetItem.count
      });
    } else {
      const baseItem = baseParsed.keys.get(key);
      const isMismatch = baseItem.effectiveValue !== targetItem.effectiveValue;

      boardTarget.push({
        key,
        line: targetItem.firstLine,
        lines: [...targetItem.lines],
        status: isMismatch ? 'Mismatch' : 'Match',
        isDuplicate: isTargetDuplicate,
        duplicateCount: targetItem.count
      });
    }
  }

  // 3. Ringkasan status
  const baseDuplicateCount = baseParsed.duplicates.length;
  const targetDuplicateCount = targetParsed.duplicates.length;
  const duplicateGroupCount = baseDuplicateCount + targetDuplicateCount;

  const hasWarnings = baseParsed.warnings.length > 0 || targetParsed.warnings.length > 0;

  return {
    summary: {
      missingCount: missing.length,
      orphanCount: orphan.length,
      duplicateGroupCount,
      baseDuplicateCount,
      targetDuplicateCount,
      mismatchCount: mismatch.length,
      matchCount: matches.length,
      totalUniqueBaseKeys: baseParsed.keys.size,
      totalUniqueTargetKeys: targetParsed.keys.size,
      hasWarnings
    },
    missing,
    orphan,
    mismatch,
    duplicates: {
      base: baseParsed.duplicates,
      target: targetParsed.duplicates
    },
    warnings: {
      base: baseParsed.warnings,
      target: targetParsed.warnings
    },
    board: {
      base: boardBase,
      target: boardTarget
    }
  };
}
