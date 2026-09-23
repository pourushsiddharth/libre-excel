import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Calculator, 
  Keyboard, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Info,
  ChevronRight,
  Share2,
  Table,
  BarChart3,
  Layers
} from 'lucide-react';
import { useSpreadsheetStore } from '../../store/useSpreadsheetStore';

interface FormulaDoc {
  name: string;
  syntax: string;
  category: 'Math & Stats' | 'Text' | 'Logical & Lookup' | 'Date & Time';
  desc: string;
  example: string;
  result: string;
}

const FORMULAS_CATALOG: FormulaDoc[] = [
  // Math & Stats
  {
    name: 'SUM',
    syntax: '=SUM(number1, [number2], ...)',
    category: 'Math & Stats',
    desc: 'Adds all numbers in a range of cells or comma-separated values.',
    example: '=SUM(B4:B8)',
    result: 'Calculates total sum of range B4:B8'
  },
  {
    name: 'AVERAGE',
    syntax: '=AVERAGE(number1, [number2], ...)',
    category: 'Math & Stats',
    desc: 'Returns the numerical arithmetic mean of selected numbers or range.',
    example: '=AVERAGE(C2:C10)',
    result: 'Average score or value rounded to 2 decimals'
  },
  {
    name: 'COUNT',
    syntax: '=COUNT(value1, [value2], ...)',
    category: 'Math & Stats',
    desc: 'Counts the number of cells that contain numbers.',
    example: '=COUNT(A1:D20)',
    result: 'Number of numeric entries'
  },
  {
    name: 'COUNTA',
    syntax: '=COUNTA(value1, [value2], ...)',
    category: 'Math & Stats',
    desc: 'Counts the number of non-empty cells in a range.',
    example: '=COUNTA(A1:A50)',
    result: 'Count of all non-empty cells'
  },
  {
    name: 'MAX',
    syntax: '=MAX(number1, [number2], ...)',
    category: 'Math & Stats',
    desc: 'Returns the largest numerical value in a set of values.',
    example: '=MAX(D5:D30)',
    result: 'Highest value in range'
  },
  {
    name: 'MIN',
    syntax: '=MIN(number1, [number2], ...)',
    category: 'Math & Stats',
    desc: 'Returns the smallest numerical value in a set of values.',
    example: '=MIN(D5:D30)',
    result: 'Lowest value in range'
  },
  {
    name: 'ROUND',
    syntax: '=ROUND(number, num_digits)',
    category: 'Math & Stats',
    desc: 'Rounds a numerical value to a specified number of decimal digits.',
    example: '=ROUND(3.14159, 2)',
    result: '3.14'
  },
  {
    name: 'SQRT',
    syntax: '=SQRT(number)',
    category: 'Math & Stats',
    desc: 'Returns the positive square root of a positive number.',
    example: '=SQRT(144)',
    result: '12'
  },
  {
    name: 'ABS',
    syntax: '=ABS(number)',
    category: 'Math & Stats',
    desc: 'Returns the absolute value of a number (without negative sign).',
    example: '=ABS(-45.2)',
    result: '45.2'
  },
  {
    name: 'POWER',
    syntax: '=POWER(base, exponent)',
    category: 'Math & Stats',
    desc: 'Returns the result of a number raised to an exponent power.',
    example: '=POWER(2, 8)',
    result: '256'
  },

  // Logical & Lookup
  {
    name: 'IF',
    syntax: '=IF(logical_test, value_if_true, [value_if_false])',
    category: 'Logical & Lookup',
    desc: 'Checks whether a condition is met, returning one value if True, and another if False.',
    example: '=IF(B5>100, "Bonus", "Standard")',
    result: '"Bonus" or "Standard"'
  },
  {
    name: 'VLOOKUP',
    syntax: '=VLOOKUP(lookup_val, table_range, col_index, [exact_match])',
    category: 'Logical & Lookup',
    desc: 'Searches for a value in the first column of a table and returns a value in the same row from a specified column.',
    example: '=VLOOKUP("MacBook", A5:D10, 3, FALSE)',
    result: 'Returns Unit Price from Column 3'
  },

  // Text
  {
    name: 'CONCAT',
    syntax: '=CONCAT(text1, [text2], ...)',
    category: 'Text',
    desc: 'Combines multiple text strings or cell values into one continuous string.',
    example: '=CONCAT(A2, " - ", B2)',
    result: 'Concatenated string'
  },
  {
    name: 'UPPER',
    syntax: '=UPPER(text)',
    category: 'Text',
    desc: 'Converts all letters in a text string or cell reference to uppercase.',
    example: '=UPPER(A1)',
    result: 'Uppercase string'
  },
  {
    name: 'LOWER',
    syntax: '=LOWER(text)',
    category: 'Text',
    desc: 'Converts all letters in a text string or cell reference to lowercase.',
    example: '=LOWER(A1)',
    result: 'Lowercase string'
  },
  {
    name: 'TRIM',
    syntax: '=TRIM(text)',
    category: 'Text',
    desc: 'Removes all leading, trailing, and excessive internal spaces from text.',
    example: '=TRIM(A1)',
    result: 'Cleaned text string'
  },
  {
    name: 'LEN',
    syntax: '=LEN(text)',
    category: 'Text',
    desc: 'Returns the number of characters in a text string.',
    example: '=LEN(A5)',
    result: 'Length of text'
  },

  // Date & Time
  {
    name: 'TODAY',
    syntax: '=TODAY()',
    category: 'Date & Time',
    desc: 'Returns the current calendar date formatted according to system locale.',
    example: '=TODAY()',
    result: 'Current Date'
  },
  {
    name: 'NOW',
    syntax: '=NOW()',
    category: 'Date & Time',
    desc: 'Returns the current calendar date and time formatted together.',
    example: '=NOW()',
    result: 'Current Date & Time'
  }
];

export const HelpModal: React.FC = () => {
  const { 
    isHelpModalOpen, 
    setIsHelpModalOpen,
    setIsShortcutsModalOpen,
    setIsTemplatesModalOpen,
    setIsChartModalOpen,
    setCellValue,
    activeCell
  } = useSpreadsheetStore();

  const [activeTab, setActiveTab] = useState<'getting_started' | 'formulas' | 'features' | 'about'>('getting_started');
  const [searchQuery, setSearchQuery] = useState('');
  const [formulaCategory, setFormulaCategory] = useState<string>('All');

  if (!isHelpModalOpen) return null;

  const formulaCategories = ['All', 'Math & Stats', 'Logical & Lookup', 'Text', 'Date & Time'];

  const filteredFormulas = FORMULAS_CATALOG.filter((f) => {
    const matchCat = formulaCategory === 'All' || f.category === formulaCategory;
    const matchSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.syntax.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const insertFormulaToCell = (syntax: string) => {
    const defaultTemplate = syntax.split('(')[0] + '()';
    const cellId = String.fromCharCode(65 + activeCell.col) + (activeCell.row + 1);
    setCellValue(cellId, defaultTemplate);
    setIsHelpModalOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200 font-sans"
      onClick={() => setIsHelpModalOpen(false)}
    >
      <div 
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-emerald-950/15 w-full max-w-4xl max-h-[88vh] flex flex-col border border-slate-200/90 overflow-hidden text-slate-800 animate-in zoom-in-[0.98] duration-200 ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with clean Fluent aesthetics */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-slate-800 tracking-wide">Help & Documentation Center</h2>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium tracking-wide rounded-full border border-emerald-100">
                  Pro v2.4
                </span>
              </div>
              <p className="text-[12px] text-slate-400 font-normal tracking-wide mt-0.5">Excel 365 Compatible · Reactive Engine · Formulas & Tutorials</p>
            </div>
          </div>
          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal Underline Tab Navigation (Apple / Linear / Vercel style) */}
        <div className="px-7 bg-white border-b border-slate-200/80 flex items-center justify-between">
          <nav className="flex items-center gap-7 -mb-px overflow-x-auto custom-scrollbar">
            {[
              { id: 'getting_started', label: 'Overview & Process', icon: BookOpen },
              { id: 'formulas', label: 'Formula Catalog', icon: Calculator },
              { id: 'features', label: 'Features & Tools', icon: Sparkles },
              { id: 'about', label: 'Specs & System', icon: Info },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group py-3.5 flex items-center gap-2 text-[13px] font-medium tracking-wide transition-colors cursor-pointer relative select-none whitespace-nowrap ${
                    isActive
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <span>{tab.label}</span>

                  {/* Active Underline Pill Indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-normal tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-slate-500 font-medium">Verified System Docs</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 custom-scrollbar space-y-6">
          {/* TAB 1: OVERVIEW & PROCESS */}
          {activeTab === 'getting_started' && (
            <div className="space-y-6 max-w-3xl">
              {/* Introduction Paragraph */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-800 tracking-wide flex items-center gap-2">
                  <span>Getting Started with VExcel Pro (Vedval Excel)</span>
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">User Manual</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed tracking-wide">
                  VExcel Pro (Vedval Excel) brings full desktop-class Microsoft Excel 365 spreadsheet functionality straight into your modern web browser. It combines a high-speed reactive formula calculation engine, native <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono text-[11px]">.xlsx</code> and <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono text-[11px]">.csv</code> file interoperability, rich typographical styling, and secure cryptographic document sharing with zero setup required.
                </p>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Step-by-Step Flow as Clean Paragraphs */}
              <div className="space-y-5">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  How to use — Step-by-Step Workflow
                </h4>

                {/* Step 1 */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-800 tracking-wide">1. Navigating and Editing Cells</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed tracking-wide pl-4 border-l-2 border-slate-200">
                    Click any cell directly or navigate fluidly using your <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-700">Arrow Keys</kbd>. Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-700">Enter</kbd> or double-click to start typing values, formulas, or labels. Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-700">Tab</kbd> to confirm and advance to the next column, or press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-700">Esc</kbd> to discard any in-progress edits.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-800 tracking-wide">2. Writing Calculations & Formulas</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed tracking-wide pl-4 border-l-2 border-slate-200">
                    Begin typing with an equals sign (<code className="text-emerald-700 font-mono text-[11px] font-semibold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">=</code>) to activate formula computation. You can perform direct mathematical expressions like <code className="text-emerald-700 font-mono text-[11px] font-semibold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">=B5*C5</code> or utilize standard Excel 365 functions such as <code className="text-emerald-700 font-mono text-[11px] font-semibold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">=SUM(B5:B10)</code>, <code className="text-emerald-700 font-mono text-[11px] font-semibold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">=AVERAGE(A1:A20)</code>, and <code className="text-emerald-700 font-mono text-[11px] font-semibold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">=IF(B2 &gt; 100, "High", "Low")</code>. All dependent cells recalculate immediately upon edit.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-800 tracking-wide">3. Formatting, Styles & Visual Presentation</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed tracking-wide pl-4 border-l-2 border-slate-200">
                    Customize your worksheet's appearance using the <strong>Home Tab</strong> in the ribbon. Format numbers as currency (<kbd className="px-1 py-0.2 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">$</kbd>), percentages (<kbd className="px-1 py-0.2 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">%</kbd>), or adjust decimal places. Apply conditional formatting rules to highlight key metrics, set font families (Calibri, Aptos 365, Inter), and select from authentic Microsoft Office 365 table themes.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700">4. Importing, Exporting & Collaboration</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-200">
                    Use <strong>File &rarr; Open / Import</strong> to open existing Microsoft Excel spreadsheets or CSV files. Export your work with one click via <strong>File &rarr; Export as Excel</strong>. For collaboration, click the <strong>Share</strong> button in the top bar to generate cryptographic links with View-Only or Edit permissions, ensuring full data security and audit compliance.
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Clean Inline Links (No bulky boxes) */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="font-semibold text-slate-700">Quick Tools:</span>
                <button
                  onClick={() => {
                    setIsHelpModalOpen(false);
                    setIsShortcutsModalOpen(true);
                  }}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-4 decoration-emerald-300 hover:decoration-emerald-700 transition cursor-pointer"
                >
                  Keyboard Shortcuts (Ctrl + /)
                </button>
                <span>·</span>
                <button
                  onClick={() => {
                    setIsHelpModalOpen(false);
                    setIsTemplatesModalOpen(true);
                  }}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-4 decoration-emerald-300 hover:decoration-emerald-700 transition cursor-pointer"
                >
                  Spreadsheet Templates
                </button>
                <span>·</span>
                <button
                  onClick={() => {
                    setIsHelpModalOpen(false);
                    setIsChartModalOpen(true);
                  }}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-4 decoration-emerald-300 hover:decoration-emerald-700 transition cursor-pointer"
                >
                  Interactive Charts
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FORMULA CATALOG */}
          {activeTab === 'formulas' && (
            <div className="space-y-4">
              {/* Search & Category Pills */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-2 border-b border-slate-100">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search formula (e.g. SUM, IF, VLOOKUP)..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/80 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto custom-scrollbar py-0.5">
                  {formulaCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFormulaCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap border select-none ${
                        formulaCategory === cat
                          ? 'bg-slate-900 border-slate-900 text-white font-medium shadow-xs'
                          : 'bg-white border-slate-200/80 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formula Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
                {filteredFormulas.map((f) => (
                  <div
                    key={f.name}
                    className="p-3.5 bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-bold text-emerald-800 text-xs px-2 py-0.5 bg-emerald-100/70 rounded-md border border-emerald-200/50">
                          {f.name}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2.5">{f.desc}</p>
                      
                      <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-1 text-[11px] font-mono shadow-2xs">
                        <div className="text-slate-500 truncate">
                          <span className="text-slate-400">Syntax:</span> {f.syntax}
                        </div>
                        <div className="text-emerald-700 font-semibold truncate">
                          <span className="text-slate-400">Example:</span> {f.example}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 italic truncate max-w-[210px]">
                        Result: {f.result}
                      </span>
                      <button
                        onClick={() => insertFormulaToCell(f.syntax)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="Insert into active cell"
                      >
                        <span>Insert</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FEATURES & TOOLS */}
          {activeTab === 'features' && (
            <div className="space-y-5 max-w-3xl">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Pro Spreadsheet Capabilities
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  VExcel Pro (Vedval Excel) is designed from the ground up to replace clunky legacy software with fluid, browser-native computational power.
                </p>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Dynamic Cell-Reactive Charts</h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-200">
                    Insert Bar, Line, Pie, and Doughnut charts connected live to your worksheet cells. Whenever any referenced cell changes, the underlying graph recalculates and animates in real-time without requiring manual page reloads or formula refreshes.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Pre-built Business & Financial Models</h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-200">
                    Jumpstart your workflows with tested spreadsheet templates including Monthly Personal Budgets, Sales Pipelines, Project Gantt Trackers, and Academic Gradebooks, fully pre-loaded with cross-cell math and formatted tables.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Cryptographic Sharing & Audit Protection</h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-200">
                    Generate secure sharable links with cryptographic HMAC signatures. Enforce strict View-Only protection to lock formulas and numbers from unintended tampering, or issue editable collaboration tokens for trusted teammates.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Office 365 Table Gallery</h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-200">
                    Instantly format data tables with official Microsoft Fluent palettes including Emerald Corporate, Cobalt Executive, Crimson Accent, Minimal Charcoal, and Warm Amber, complete with alternating row bands and header borders.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPECS & SYSTEM */}
          {activeTab === 'about' && (
            <div className="space-y-5 max-w-3xl">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 tracking-wide flex items-center gap-2">
                  <span>System Architecture & Technical Specs</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">v2.4 Production</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed tracking-wide">
                  Engineered with zero third-party bloat, VExcel Pro (Vedval Excel) delivers microsecond cell evaluation and instant state persistence across browser sessions.
                </p>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-800 tracking-wide">Frontend Runtime & Reactive State Engine</h4>
                  <p className="text-xs text-slate-600 leading-relaxed tracking-wide pl-4 border-l-2 border-slate-200">
                    Built upon React 18, Vite, and TypeScript. State is driven by Zustand with a 30-step deep snapshot undo/redo history, continuous LocalStorage replication, and an AST formula evaluator supporting nested arithmetic and range operations.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-800 tracking-wide">Design System & Compatibility</h4>
                  <p className="text-xs text-slate-600 leading-relaxed tracking-wide pl-4 border-l-2 border-slate-200">
                    Styled with Tailwind CSS using Microsoft Fluent 365 typography, standard 26x100 virtualized grid coordinates, and full SheetJS interoperability for seamless opening and saving of desktop Microsoft Excel files.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-800 tracking-wide">Offline & Data Sovereignty</h4>
                  <p className="text-xs text-slate-600 leading-relaxed tracking-wide pl-4 border-l-2 border-slate-200">
                    Your data stays completely private in your local browser sandbox. No proprietary cloud vendor lock-in or unencrypted server uploads; your worksheets remain accessible offline anytime.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-7 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 tracking-wide">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Search any command or formula instantly with <kbd className="font-mono bg-white px-1.5 py-0.5 border border-slate-200 rounded text-[10px] text-slate-700 shadow-2xs">Alt + Q</kbd></span>
            </div>
            <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />
            <a 
              href="https://www.netlify.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Deploys by Netlify"
              className="inline-flex items-center opacity-80 hover:opacity-100 transition-opacity"
            >
              <img 
                src="https://www.netlify.com/assets/badges/netlify-badge-color-bg.svg" 
                alt="Deploys by Netlify" 
                className="h-4 w-auto"
              />
            </a>
          </div>
          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium text-xs tracking-wide shadow-xs transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};