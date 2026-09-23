# Libre Excel

A lightweight, modern web-based spreadsheet application built with React, TypeScript, and Tailwind CSS. It provides an intuitive Excel-like interface directly in the browser with formula evaluation, data formatting, charts, and import/export capabilities.

---

## Features

- **Grid & Editing**: Cell selection, multi-cell range selection, drag-to-fill, cut/copy/paste, and inline editing.
- **Formulas & Calculation**: Support for standard spreadsheet functions (`SUM`, `AVERAGE`, `COUNT`, `MIN`, `MAX`, `IF`, etc.) with real-time recalculation.
- **Styling & Formatting**: Bold, italic, underline, strikethrough, text color, background fill, alignment, and number formatting (currency, percentage, decimals).
- **Import & Export**:
  - Open and import `.xlsx` and `.csv` files.
  - Export sheets to `.xlsx`, `.csv`, or PDF.
- **Charts**: Generate bar, line, and pie charts directly from selected data ranges.
- **Multiple Sheets**: Add, rename, switch, and delete sheets within the same workbook.
- **Templates**: Pre-built spreadsheet templates for common use cases (budgeting, tracking, invoices).
- **Find & Replace**: Search and replace values across cells.
- **Themes & Modes**: Dark and light mode toggle, plus a view-only mode for inspecting sheets safely.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Chart.js & react-chartjs-2
- **File Parsing**: SheetJS (`xlsx`)
- **PDF Export**: jsPDF + html2canvas
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (version 18 or higher recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pourushsiddharth/libre-excel.git
   cd libre-excel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## Available Scripts

- `npm run dev` - Starts the local development server.
- `npm run build` - Type-checks the code and builds the production bundle in `dist/`.
- `npm run preview` - Locally previews the production build.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

[![Deploys by Netlify](https://www.netlify.com/assets/badges/netlify-badge-color-bg.svg)](https://www.netlify.com)
