import React, { useRef, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  FolderDown, 
  Upload, 
  Printer, 
  LayoutTemplate, 
  Undo2, 
  Redo2, 
  Scissors, 
  Copy, 
  Clipboard, 
  Search, 
  BarChart3, 
  Table, 
  HelpCircle, 
  Eye, 
  Filter, 
  ArrowUpDown,
  MessageSquare
} from 'lucide-react';
import { useSpreadsheetStore } from '../../store/useSpreadsheetStore';
import { exportToXLSX, exportToCSV, importFileToWorksheet } from '../../engine/io';
import confetti from 'canvas-confetti';

export const MenuBar: React.FC = () => {
  const { 
    activeRibbonTab, 
    setActiveRibbonTab,
    activeMenu, 
    setActiveMenu,
    documentTitle,
    sheets,
    activeSheetId,
    undo,
    redo,
    replaceActiveWorksheet,
    addSheet,
    clearSelection,
    setIsChartModalOpen,
    setIsTemplatesModalOpen,
    setIsFindReplaceOpen,
    setIsShortcutsModalOpen,
    setIsFeedbackModalOpen,
    setZoomLevel
  } = useSpreadsheetStore();

  const menuContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeSheet = sheets.find(s => s.id === activeSheetId) || sheets[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setActiveMenu]);

  const handleExportXLSX = () => {
    exportToXLSX(activeSheet, documentTitle.replace(/\s+/g, '_') + '.xlsx');
    setActiveMenu(null);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.1 } });
  };

  const handleExportCSV = () => {
    exportToCSV(activeSheet, documentTitle.replace(/\s+/g, '_') + '.csv');
    setActiveMenu(null);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.1 } });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const importedWs = await importFileToWorksheet(file);
      replaceActiveWorksheet(importedWs);
      setActiveMenu(null);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.15 } });
    } catch (err) {
      alert('Error importing spreadsheet. Please verify file format.');
    }
  };

  const menuTabs = [
    { id: 'file', label: 'File' },
    { id: 'home', label: 'Home' },
    { id: 'insert', label: 'Insert' },
    { id: 'layout', label: 'Page Layout' },
    { id: 'formulas', label: 'Formulas' },
    { id: 'data', label: 'Data' },
    { id: 'review', label: 'Review' },
    { id: 'view', label: 'View' },
    { id: 'help', label: 'Help' },
  ];

  return (
    <div ref={menuContainerRef} className="h-7 bg-white border-b border-gray-200 px-2 flex items-center gap-0.5 text-xs text-gray-700 select-none relative z-40 font-sans">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".xlsx, .xls, .csv" 
        className="hidden" 
      />

      {menuTabs.map((tab) => {
        const isRibbonActive = activeRibbonTab === tab.id;
        const isMenuOpen = activeMenu === tab.id;

        return (
          <div key={tab.id} className="relative">
            <button
              onClick={() => {
                if (tab.id === 'file') {
                  setActiveMenu(isMenuOpen ? null : 'file');
                } else {
                  setActiveRibbonTab(tab.id);
                  setActiveMenu(null);
                }
              }}
              onMouseEnter={() => {
                if (activeMenu) setActiveMenu(tab.id);
              }}
              className={`px-2.5 py-1 rounded transition text-xs font-medium ${
                isMenuOpen 
                  ? 'bg-gray-100 text-gray-900 font-semibold' 
                  : isRibbonActive
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-600 rounded-none'
                  : 'hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>

            {/* File Menu Dropdown */}
            {isMenuOpen && tab.id === 'file' && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => { addSheet(); setActiveMenu(null); }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>New Worksheet</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Ctrl+N</span>
                </button>

                <button
                  onClick={() => { fileInputRef.current?.click(); }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Open / Import...</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Ctrl+O</span>
                </button>

                <div className="h-px bg-gray-200 my-1" />

                <button
                  onClick={handleExportXLSX}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FolderDown className="w-4 h-4 text-emerald-700" />
                    <span>Export as Excel (.xlsx)</span>
                  </div>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                    <span>Export as CSV (.csv)</span>
                  </div>
                </button>

                <div className="h-px bg-gray-200 my-1" />

                <button
                  onClick={() => { setIsTemplatesModalOpen(true); setActiveMenu(null); }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4 text-indigo-600" />
                    <span>Load Template</span>
                  </div>
                </button>

                <button
                  onClick={() => { setIsShortcutsModalOpen(true); setActiveMenu(null); }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    <span>Keyboard Shortcuts</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Ctrl+/</span>
                </button>

                <button
                  onClick={() => { setIsFeedbackModalOpen(true); setActiveMenu(null); }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Send Feedback</span>
                  </div>
                </button>

                <button
                  onClick={() => { window.print(); setActiveMenu(null); }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Printer className="w-4 h-4 text-gray-600" />
                    <span>Print</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Ctrl+P</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
