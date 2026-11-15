/**
 * Test & Verifikasi Milestone 3 — Core Comparison Engine
 * Menguji semua skenario dari PRD Seksi 18 dan aturan Seksi 8 & 9.
 */

import { parseEnv, compareEnvFiles, stripBOM, isValidKeyName } from '../js/env-engine.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  FAIL: ${testName}`);
    failedTests++;
  }
}

console.log('--- 1. Testing stripBOM & isValidKeyName ---');
assert(stripBOM('\uFEFFAPP_NAME=test') === 'APP_NAME=test', 'stripBOM removes BOM character');
assert(stripBOM('APP_NAME=test') === 'APP_NAME=test', 'stripBOM leaves clean string untouched');
assert(isValidKeyName('API_KEY'), 'API_KEY is valid key');
assert(isValidKeyName('_PRIVATE_VAR'), '_PRIVATE_VAR is valid key');
assert(isValidKeyName('VITE_APP.CONFIG-ITEM_1'), 'VITE_APP.CONFIG-ITEM_1 is valid key');
assert(!isValidKeyName('123_INVALID'), '123_INVALID is invalid (starts with number)');
assert(!isValidKeyName('INVALID SPACE'), 'INVALID SPACE is invalid (contains space)');
assert(!isValidKeyName(''), 'Empty string is invalid key');

console.log('\n--- 2. PRD Skenario A — Missing ---');
const scenarioA_Base = `APP_NAME=EnvMoss\nAPI_KEY=`;
const scenarioA_Target = `APP_NAME=EnvMoss`;
const resultA = compareEnvFiles(scenarioA_Base, scenarioA_Target);
assert(resultA.summary.missingCount === 1, 'Scenario A: missingCount is 1');
assert(resultA.missing.length === 1 && resultA.missing[0].key === 'API_KEY', 'Scenario A: API_KEY is Missing');
assert(resultA.summary.orphanCount === 0, 'Scenario A: orphanCount is 0');

console.log('\n--- 3. PRD Skenario B — Orphan ---');
const scenarioB_Base = `APP_NAME=EnvMoss`;
const scenarioB_Target = `APP_NAME=EnvMoss\nCUSTOM_FLAG=true`;
const resultB = compareEnvFiles(scenarioB_Base, scenarioB_Target);
assert(resultB.summary.orphanCount === 1, 'Scenario B: orphanCount is 1');
assert(resultB.orphan.length === 1 && resultB.orphan[0].key === 'CUSTOM_FLAG', 'Scenario B: CUSTOM_FLAG is Orphan');
assert(resultB.summary.missingCount === 0, 'Scenario B: missingCount is 0');

console.log('\n--- 4. PRD Skenario C — Duplicate & Last Declaration Wins ---');
const scenarioC_Target = `API_KEY=first\nAPI_KEY=second\nAPI_KEY=third`;
const parsedC = parseEnv(scenarioC_Target, 'Target');
assert(parsedC.duplicates.length === 1, 'Scenario C: exactly 1 duplicate record group');
assert(parsedC.duplicates[0].key === 'API_KEY', 'Scenario C: duplicate key is API_KEY');
assert(parsedC.duplicates[0].count === 3, 'Scenario C: count is 3');
assert(JSON.stringify(parsedC.duplicates[0].lines) === JSON.stringify([1, 2, 3]), 'Scenario C: lines are [1, 2, 3]');
assert(parsedC.keys.get('API_KEY').effectiveValue === 'third', 'Scenario C: effective value is "third" (last declaration)');

// Bandingkan dengan Base yang memiliki value 'third' vs 'other'
const baseC = `API_KEY=third`;
const resultC = compareEnvFiles(baseC, scenarioC_Target);
assert(resultC.summary.mismatchCount === 0, 'Scenario C: effective value matches Base (no mismatch)');
assert(resultC.summary.targetDuplicateCount === 1, 'Scenario C: targetDuplicateCount is 1');

console.log('\n--- 5. PRD Skenario D — Mismatch ---');
const scenarioD_Base = `DATABASE_URL=localhost`;
const scenarioD_Target = `DATABASE_URL=production-db`;
const resultD = compareEnvFiles(scenarioD_Base, scenarioD_Target);
assert(resultD.summary.mismatchCount === 1, 'Scenario D: mismatchCount is 1');
assert(resultD.mismatch[0].key === 'DATABASE_URL', 'Scenario D: key is DATABASE_URL');
assert(resultD.summary.missingCount === 0, 'Scenario D: not marked as Missing');
assert(resultD.summary.orphanCount === 0, 'Scenario D: not marked as Orphan');
// Pastikan value rahasia tidak diekspos di object mismatch UI
assert(!('value' in resultD.mismatch[0]), 'Scenario D: secret value is NOT exposed in mismatch result');

console.log('\n--- 6. PRD Skenario E — Parsing Warning ---');
const scenarioE_Input = `APP_NAME=EnvMoss\nTHIS IS NOT VALID`;
const parsedE = parseEnv(scenarioE_Input, 'Base');
assert(parsedE.warnings.length === 1, 'Scenario E: 1 warning generated');
assert(parsedE.warnings[0].line === 2, 'Scenario E: warning is on line 2');
assert(!parsedE.keys.has('THIS IS NOT VALID'), 'Scenario E: invalid line not added as key');
// Pastikan isi baris mentah tidak ada di pesan alasan
assert(!parsedE.warnings[0].reason.includes('THIS IS NOT VALID'), 'Scenario E: reason does not leak raw line');

console.log('\n--- 7. PRD Skenario F — Tidak Ada Missing (Cocok Sempurna) ---');
const scenarioF_Text = `KEY_ONE=val1\nKEY_TWO=val2`;
const resultF = compareEnvFiles(scenarioF_Text, scenarioF_Text);
assert(resultF.summary.missingCount === 0, 'Scenario F: missingCount is 0');
assert(resultF.summary.orphanCount === 0, 'Scenario F: orphanCount is 0');
assert(resultF.summary.mismatchCount === 0, 'Scenario F: mismatchCount is 0');
assert(resultF.summary.matchCount === 2, 'Scenario F: matchCount is 2');

console.log('\n--- 8. Advanced Parsing & Edge Cases ---');
// Case sensitivity
const caseBase = `API_KEY=val1\napi_key=val2`;
const caseParsed = parseEnv(caseBase);
assert(caseParsed.keys.size === 2, 'API_KEY and api_key are treated as two distinct keys (case-sensitive)');

// Export keyword
const exportText = `export PORT=3000\nexport   HOST=127.0.0.1`;
const exportParsed = parseEnv(exportText);
assert(exportParsed.keys.has('PORT') && exportParsed.keys.get('PORT').effectiveValue === '3000', 'export PORT handled');
assert(exportParsed.keys.has('HOST') && exportParsed.keys.get('HOST').effectiveValue === '127.0.0.1', 'export HOST handled');

// Quoted values and inline comments
const quotesText = `
APP_URL=https://example.com/#section
DOUBLE_QUOTES="secret#with#hash" # comment after quote
SINGLE_QUOTES='literal $var value'
EMPTY_VAL=
`;
const quotesParsed = parseEnv(quotesText);
assert(quotesParsed.keys.get('APP_URL').effectiveValue === 'https://example.com/#section', 'URL with #section preserved');
assert(quotesParsed.keys.get('DOUBLE_QUOTES').effectiveValue === 'secret#with#hash', 'Double quotes with # inside preserved, comment stripped');
assert(quotesParsed.keys.get('SINGLE_QUOTES').effectiveValue === 'literal $var value', 'Single quotes preserved literally');
assert(quotesParsed.keys.get('EMPTY_VAL').effectiveValue === '', 'Empty value parsed as empty string');

// Unclosed quotes and extra trailing chars
const errQuotes = `BAD_DOUBLE="unclosed quote\nBAD_TRAILING="good" extra text not comment`;
const errParsed = parseEnv(errQuotes);
assert(errParsed.warnings.length === 2, 'Two warnings for bad quotes syntax');
assert(errParsed.warnings[0].line === 1, 'Line 1 unclosed quote warning');
assert(errParsed.warnings[1].line === 2, 'Line 2 trailing text warning');

// CRLF and CR line endings
const crlfText = "LINE1=a\r\nLINE2=b\rLINE3=c\nLINE4=d";
const crlfParsed = parseEnv(crlfText);
assert(crlfParsed.keys.size === 4, 'All 4 lines parsed across CRLF, CR, and LF');

console.log(`\n========================================`);
console.log(`Hasil Test: ${passedTests} passed, ${failedTests} failed`);
console.log(`========================================`);

if (failedTests > 0) {
  process.exit(1);
}
