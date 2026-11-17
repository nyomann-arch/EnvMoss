<p align="center">
  <img src="assets/icons/envmoss_logo.svg" width="450">
</p>

> **Compare. Validate. Keep Your Secrets Local.**

EnvMoss is a static web developer utility that helps developers compare two environment files (`.env`) locally, directly in browser memory. EnvMoss detects configuration structure mismatches, duplicate declarations, and value differences across environments without ever sending your file contents or credentials to a server.

[![Live Demo](https://img.shields.io/badge/demo-envmoss.vercel.app-3D6B4F?style=flat-square)](https://envmoss.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/github-nyomann--arch%2FEnvMoss-1A2E22?style=flat-square&logo=github)](https://github.com/nyomann-arch/EnvMoss)
[![License: MIT](https://img.shields.io/badge/License-MIT-6B9B7A?style=flat-square)](LICENSE)

🌐 **Language:** [English](README.md) · [Bahasa Indonesia](README.id.md)

---

## Quick Links

- **Live Application:** [https://envmoss.vercel.app/](https://envmoss.vercel.app/)
- **Source Code:** [https://github.com/nyomann-arch/EnvMoss](https://github.com/nyomann-arch/EnvMoss)
- **License:** [MIT License](LICENSE)

---

## Site Pages

EnvMoss is a small multi-page static site:

- **Landing (`/`)** — overview of what EnvMoss does, the four result statuses, and the privacy promise.
- **Tool (`/app/`)** — the comparison utility itself: enter Base and Target `.env` files and inspect the results.
- **Guide (`/guide/`)** — step-by-step usage guide, supported syntax, and troubleshooting.

---

## The Problem It Solves

In software development, developers often manage multiple environment files (such as `.env.example`, `.env.local`, `.env.staging`, and `.env.production`). Differences in structure between these files frequently cause issues:

- New keys added to `.env.example` are missed and never defined in the local or staging environment.
- Extra keys exist on the target server that are not documented in the repository.
- The same variable is accidentally declared multiple times within a single file.
- Using a conventional online diff tool risks leaking API keys, database passwords, and other secrets to third-party servers.

EnvMoss solves these problems by providing a fast, informative structure inspection tool that runs entirely on the client side.

---

## Key Features

### 1. Dual Environment Input
Compares two environment files side by side:
- **Base Environment:** The reference file, usually `.env.example`.
- **Target Environment:** The file being inspected, such as `.env.local` or `.env.production`.

Each input slot offers three flexible input methods:
- **Drag-and-Drop:** Drag and drop a file directly onto the dropzone.
- **File Picker:** Choose a file from your device through the file picker button.
- **Textarea Editor:** Paste or edit text directly. The textarea acts as the *single source of truth* for the comparison process.

### 2. Four-State Comparison Engine
The EnvMoss comparison engine processes variable structure and groups findings into four primary statuses:

| Status | Indicator | Meaning & Technical Explanation |
|---|---|---|
| **Missing** | 🔴 Red | Key exists in Base but is not found in Target. Needs to be added to the Target environment. |
| **Orphan / Extra** | 🟡 Yellow | Key exists in Target but is not found in Base. Indicates environment-specific configuration and is not automatically considered a stale key. |
| **Duplicate** | 🟠 Orange | The same key is declared more than once in the same file. Duplicates are recorded per key group per file, with a *last declaration wins* rule for the effective value. |
| **Mismatch** | 🔵 Blue | Key exists in both files but has a different effective value. This is informational about configuration differences across environments, not an error. |
| **Match** | ⚪ Neutral | Key and effective value are identical in both files. |

### 3. Side-by-Side Diff Board
Comparison results are displayed in two aligned panels (Base on the left, Target on the right) with mapped rows:
- Includes original line numbers (`L${line}`) and colored status badges.
- When a key is Missing, the Target side shows an empty slot marker `— Not found in Target —`.
- When a key is Orphan, the Base side shows an empty slot marker `— Not registered in Base —`.
- **Value Privacy:** Actual variable values are **never displayed** on the comparison board. All values are masked with the placeholder `= [value hidden]`.

### 4. Isolated Parsing Warnings
If a file contains lines that do not meet the supported `.env` format, EnvMoss does not silently ignore them:
- Displays a separate warning box containing the file side and relevant line number.
- Does not include the raw line text in the warning message so secrets cannot leak.
- Lines that produce warnings are isolated and excluded from key analysis.

---

## Actionable Outputs

After running a comparison, EnvMoss provides two follow-up actions that can be used directly in your development workflow:

### 1. Copy Markdown Checklist
Generates a Markdown task list containing only **Missing** keys without including secret values:

```markdown
## Checklist Environment

- [ ] Tambahkan `API_KEY` ke Target Environment
- [ ] Tambahkan `DATABASE_URL` ke Target Environment
```

- Copied directly to the device clipboard via the Clipboard API.
- The button is automatically disabled when there are no Missing keys to prevent copying a misleading empty list.
- The checklist language follows the active interface language (English or Bahasa Indonesia).

### 2. Download Merged `.env`
Generates a new configuration file named `envmoss-merged.env` locally via the Blob API:
- **Preserves Target Integrity:** The entire original Target content is preserved 100% unchanged as a prefix (including comments, blank lines, and existing duplicates).
- **Missing Key Addition:** Each Missing key is appended once at the bottom with an empty value (`KEY=`), preceded by a marker comment.
- **Format Consistency:** Follows the original Target line-ending style (`CRLF` or `LF`).
- **No Missing Keys:** If there are no Missing keys, the download is identical to the original Target file with no marker comment.
- *Reminder:* You should fill in the empty variable values before using the file in your application.

---

## How to Use (Quick Usage)

1. Open [https://envmoss.vercel.app/](https://envmoss.vercel.app/) in your browser.
2. Enter the reference file (e.g. `.env.example`) in the **Base Environment** card via drag-and-drop, the **Choose File** button, or paste into the textarea.
3. Enter the target file (e.g. `.env.local` or `.env.production`) in the **Target Environment** card.
4. Click the **Compare** button to run the local comparison.
5. Review the status summary and inspect differences on the **Comparison Board**.
6. Use **Copy Markdown Checklist** to record a to-do list, or click **Download Merged .env** to get a target file completed with missing keys.
7. Use **Clear All** to wipe all inputs, results, and state from page memory.

The interface is available in English and Bahasa Indonesia — switch anytime from the EN/ID control in the navbar; your choice is remembered on this device.

---

## Parsing Limits & Compatibility

EnvMoss uses a simple, deterministic internal parser designed specifically for structure comparison. The parser supports:

- Standard assignment format `KEY=value` and `export KEY=value`.
- Empty lines and full-line comments starting with `#`.
- Whitespace around the `=` sign (trimmed automatically).
- Key name validation: must start with a letter or underscore, and contain only alphanumeric characters, underscore, dot, or hyphen (`^[A-Za-z_][A-Za-z0-9_.-]*$`).
- Case-sensitive key names (`API_KEY` differs from `api_key`).
- Empty values (`API_KEY=`).
- Single-quoted (`'...'`) and double-quoted (`"..."`) values. Quotes are stripped and content inside is treated literally (a `#` inside quotes is part of the value).
- Inline comments on unquoted values preceded by whitespace (`\s+#`). A `#` in URLs (such as `https://example.com/#section`) is preserved as part of the value.
- UTF-8 BOM (`\uFEFF`) removal at the start of the file.
- Line-ending normalization for LF (`\n`), CRLF (`\r\n`), and CR (`\r`).

**Limits (Not Supported in MVP v1.0):**
- Multiline values (values spanning multiple lines).
- Variable interpolation (expansion of variables such as `${HOST}:${PORT}`).
- *Note:* EnvMoss does not claim full compatibility with every variation of `dotenv` library implementations or external shell parsers. Lines that do not meet the format above produce a *Parsing Warning*.

---

## Privacy & Security

EnvMoss strictly upholds *privacy-first* principles:

- **100% Client-Side Processing:** Files are read using the Browser File API (`FileReader`). All parsing, comparison calculation, and output file generation execute in the user's browser memory.
- **No Backend & No API:** There is no backend server, processing API endpoint, database, or third-party analytics/telemetry service.
- **No Persistent Storage:** File contents, key names, and values are never written to `localStorage`, `sessionStorage`, `IndexedDB`, or cookies. Data lives only in the active tab's memory and is cleared when the tab is closed, refreshed, or when **Clear All** is pressed. The only stored preferences are the UI language (`envmoss:language`) and theme (`envmoss:theme`) codes.
- **Variable Value Protection:** Environment variable values are never printed to the comparison interface, never logged to `console.log`, and never included in the Markdown Checklist.
- **Privacy Statement:**
  > *"Your `.env` file is processed locally in your browser. EnvMoss does not upload your configuration file contents to any application server."*
- *Transparency Note:* When you first open the EnvMoss website, your browser downloads static assets (HTML, CSS, JS) from Vercel hosting. Loading these static website assets is entirely separate from your `.env` files, which never leave your browser.

---

## Technology

EnvMoss is built with a lean modern web architecture — no framework, no bundler, and no runtime dependencies:

| Component | Technology | Purpose |
|---|---|---|
| **Markup** | Semantic HTML5 | Accessible, structured interface skeleton |
| **Styling** | Pure CSS3 (Custom Properties) | Design tokens, Moss-themed UI components, responsive layout |
| **Application Logic** | Vanilla JavaScript (ES6+) | User interaction management and DOM manipulation |
| **Code Architecture** | Native JavaScript ES Modules | Clean separation of code responsibilities |
| **File Reading** | Browser File API / FileReader | Asynchronous reading of user-local files |
| **Data Copying** | Clipboard API | Copying the Markdown Checklist to the clipboard |
| **File Generation** | Blob API & Object URL | Producing the `envmoss-merged.env` download locally |
| **Public Hosting** | Vercel | Static web hosting for public files |

---

## Running the Project Locally

Because the project uses native browser JavaScript modules (`<script type="module">`), it is recommended to run EnvMoss through a local static HTTP server so the browser does not restrict module loading due to CORS policy.

### Prerequisites
- Git
- Python 3 **or** Node.js

### 1. Clone the Repository
```bash
git clone https://github.com/nyomann-arch/EnvMoss.git
cd EnvMoss
```

### 2. Start a Local Server

**Option A — Using Python 3 (Recommended):**
```bash
python -m http.server 3000
```

**Option B — Using npx serve (If Node.js is installed):**
```bash
npx serve .
```
*(Note: `npx serve` only acts as a simple local static file server, not an application dependency or build step.)*

### 3. Open in Your Browser
Visit the following address in your browser:
```text
http://localhost:3000
```

> **Developer Note:** This project is a pure static web application with no build step. It does not require an external package manager or build runner.

---

## Repository Structure

```text
EnvMoss/
├── css/
│   ├── styles.css          # Design tokens, global .site- components, dark theme
│   ├── tool.css            # Comparison Tool specific styles
│   ├── landing.css         # Landing page styles
│   └── guide.css           # Guide page styles
├── docs/
│   ├── 01-agent-rules.md   # Technical architecture and project constraint guide
│   ├── 02-prd-envmoss.md   # EnvMoss Product Requirements Document (PRD)
│   └── 03-design-systems.md# Visual design system and tokens reference
├── js/
│   ├── app.js              # Tool UI interactions, input handling, DOM rendering
│   ├── env-engine.js       # Core comparison engine and parser (DOM-independent)
│   ├── output-generator.js # Markdown Checklist and Merged .env generation
│   ├── i18n.js             # Local EN/ID translation dictionary and DOM application
│   └── site.js             # Global behavior: navbar, language, theme
├── index.html              # Landing page
├── app/
│   └── index.html          # Comparison Tool
├── guide/
│   └── index.html          # Guide
├── LICENSE                 # MIT open-source license file
├── README.md               # English documentation
└── README.id.md            # Bahasa Indonesia documentation
```

---

## Deployment

EnvMoss can be deployed instantly to any static web hosting platform without special server configuration:

- **Live Demo on Vercel:** [https://envmoss.vercel.app/](https://envmoss.vercel.app/)
- **GitHub Pages:** Point the publish source to the `main` branch at the root `/` directory.
- **Netlify:** Connect the repository with the root (`.`) public directory.

---

## Contributing & Feedback

Contributions for bug fixes, additional test scenarios, and documentation improvements are very welcome!

1. Report issues or discuss new feature ideas via [GitHub Issues](https://github.com/nyomann-arch/EnvMoss/issues).
2. Submit code or documentation fixes via [Pull Request](https://github.com/nyomann-arch/EnvMoss/pulls).

---

## License

This project is licensed under the [MIT License](LICENSE) © 2026 nyomann-arch.
