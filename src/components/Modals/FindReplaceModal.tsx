import React, { useState } from 'react';
import { X, Search, Replace, ChevronRight, Check } from 'lucide-react';
import { useSpreadsheetStore } from '../../store/useSpreadsheetStore';
import { cellIdToCoords } from '../../engine/helpers';

export const FindReplaceModal: React.FC = () => {
  const { 
    isFindReplaceOpen, 
    setIsFindReplaceOpen, 
    sheets, 
    activeSheetId, 
    setCellValue, 
    setActiveCell,
    setSelection
  } = useSpreadsheetStore();

  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [activeTab, setActiveTab] = useState<'find' | 'replace'>('find');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isFindReplaceOpen) return null;

  const activeSheet = sheets.find((s) => s.id === activeSheetId) || sheets[0];

  const handleFindNext = () => {
    if (!findText.trim()) return;

    const query = matchCase ? findText : findText.toLowerCase();
    const cellKeys = Object.keys(activeSheet.data);

    for (const key of cellKeys) {
      const cell = activeSheet.data[key];
      const val = String(cell.value ?? '');
      const testVal = matchCase ? val : val.toLowerCase();

      if (testVal.includes(query)) {
        const coords = cellIdToCoords(key);
        if (coords) {
          setActiveCell(coords);
          setSelection({ start: coords, end: coords });
        }
        setStatusMessage(`Found in cell ${key}`);
        return;
      }
    }

    setStatusMessage('No matches found.');
  };

  const handleReplaceAll = () => {
    if (!findText.trim()) return;

    const query = matchCase ? findText : findText.toLowerCase();
    let replaceCount = 0;
    const cellKeys = Object.keys(activeSheet.data);

    for (const key of cellKeys) {
      const cell = activeSheet.data[key];
      const val = String(cell.value ?? '');
      const testVal = matchCase ? val : val.toLowerCase();

      if (testVal.includes(query)) {
        const flags = matchCase ? 'g' : 'gi';
        const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
        const newVal = val.replace(regex, replaceText);
        setCellValue(key, newVal);
        replaceCount++;
      }
    }

    setStatusMessage(`Replaced ${replaceCount} occurrence(s).`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 w-full max-w-md border border-slate-200/80 overflow-hidden text-slate-800 text-xs font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 border border-slate-200/60 text-slate-700 rounded-xl">
              <Search className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-800 tracking-wide">Find and Replace</h3>
              <p className="text-[11px] text-slate-400 font-normal tracking-wide mt-0.5">Search workbook data and formulas</p>
            </div>
          </div>
          <button
            onClick={() => setIsFindReplaceOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 px-6 pt-2 gap-5 bg-white">
          <button
            onClick={() => setActiveTab('find')}
            className={`pb-2 text-[12px] tracking-wide transition cursor-pointer ${
              activeTab === 'find'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-semibold'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            Find
          </button>
          <button
            onClick={() => setActiveTab('replace')}
            className={`pb-2 text-[12px] tracking-wide transition cursor-pointer ${
              activeTab === 'replace'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-semibold'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            Replace
          </button>
        </div>

        {/* Inputs */}
        <div className="p-6 space-y-3.5">
          <div>
            <label className="block text-slate-700 font-medium text-[12px] tracking-wide mb-1.5">Find what:</label>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFindNext()}
              placeholder="Text or number to search..."
              className="w-full px-3.5 py-2 text-xs text-slate-800 tracking-wide border border-slate-300 rounded-xl outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 transition"
              autoFocus
            />
          </div>

          {activeTab === 'replace' && (
            <div>
              <label className="block text-slate-700 font-medium text-[12px] tracking-wide mb-1.5">Replace with:</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replacement value..."
                className="w-full px-3.5 py-2 text-xs text-slate-800 tracking-wide border border-slate-300 rounded-xl outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="matchCase"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="matchCase" className="text-slate-600 cursor-pointer text-[12px] tracking-wide">
              Match case
            </label>
          </div>

          {statusMessage && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl text-[11px] tracking-wide flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => setIsFindReplaceOpen(false)}
            className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium text-xs tracking-wide transition cursor-pointer"
          >
            Close
          </button>
          {activeTab === 'replace' && (
            <button
              onClick={handleReplaceAll}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-xs tracking-wide shadow-xs transition cursor-pointer"
            >
              Replace All
            </button>
          )}
          <button
            onClick={handleFindNext}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium text-xs tracking-wide shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Find Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
