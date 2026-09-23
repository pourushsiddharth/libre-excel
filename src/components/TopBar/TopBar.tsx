import React, { useState, useRef, useEffect } from 'react';
import { 
  Grid as AppGrid, 
  Cloud, 
  Search, 
  MessageSquare, 
  Settings, 
  Check, 
  X, 
  ChevronDown,
  History,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { useSpreadsheetStore } from '../../store/useSpreadsheetStore';

export const TopBar: React.FC = () => {
  const { 
    documentTitle, 
    setDocumentTitle, 
    searchQuery, 
    setSearchQuery,
    isShareModalOpen,
    setIsShareModalOpen,
    setIsChartModalOpen,
    setIsTemplatesModalOpen,
    setIsShortcutsModalOpen,
    permissionMode,
    setPermissionMode,
    isLockedView,
    setIsFeedbackModalOpen
  } = useSpreadsheetStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(documentTitle);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isEditingMenuOpen, setIsEditingMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'q' || e.key === 'Q')) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (topBarRef.current && !topBarRef.current.contains(e.target as Node)) {
        setIsEditingMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      setDocumentTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const quickTools = [
    { label: 'Help Center & Process Guide', icon: '❓', action: () => useSpreadsheetStore.getState().setIsHelpModalOpen(true) },
    { label: 'Send Feedback & Suggestions', icon: '💬', action: () => useSpreadsheetStore.getState().setIsFeedbackModalOpen(true) },
    { label: 'Share Document & Collaborate', icon: '🔗', action: () => setIsShareModalOpen(true) },
    { label: 'Keyboard Shortcuts Cheatsheet (Ctrl+/)', icon: '⌨️', action: () => setIsShortcutsModalOpen(true) },
    { label: 'Insert Dynamic Chart', icon: '📊', action: () => setIsChartModalOpen(true) },
    { label: 'Load Budget Template', icon: '📑', action: () => setIsTemplatesModalOpen(true) },
    { label: 'AutoSum active column', icon: 'Σ', action: () => alert('Quick AutoSum triggered') },
  ].filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div ref={topBarRef} className="h-10 bg-[#f3f4f6] border-b border-gray-200 px-3 flex items-center justify-between select-none relative z-50 text-xs text-gray-700">
      {/* Left Section: Excel Icon, Title & Cloud Save */}
      <div className="flex items-center gap-2">

        {/* Excel 365 Green Workbook Icon */}
        <div className="w-6 h-6 rounded bg-[#107c41] flex items-center justify-center text-white shadow-xs font-bold text-xs">
          <span>X</span>
        </div>

        {/* Document Title & Status */}
        <div className="flex items-center gap-1.5 ml-1">
          {isEditingTitle && !isLockedView ? (
            <input 
              type="text" 
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="px-1.5 py-0.5 font-semibold text-gray-900 bg-white border border-emerald-500 rounded outline-none w-36 text-xs shadow-inner"
            />
          ) : (
            <span 
              onClick={() => { 
                if (isLockedView) return;
                setIsEditingTitle(true); 
                setTempTitle(documentTitle); 
              }}
              className={`font-semibold text-gray-800 px-1.5 py-0.5 rounded truncate max-w-[140px] ${
                isLockedView ? 'cursor-default' : 'hover:bg-gray-200 cursor-pointer transition'
              }`}
              title={isLockedView ? "View-only document" : "Click to rename document"}
            >
              {documentTitle}
            </span>
          )}

          {/* Cloud Saved Icon */}
          <div className="flex items-center gap-1 text-gray-500 hover:text-gray-800 cursor-pointer px-1 py-0.5 rounded hover:bg-gray-200 transition" title="Saved to VExcel Cloud">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">cloud_done</span>
            <span className="text-[10px] text-gray-500 hidden md:inline">Saved</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Center Search Pill */}
      <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
        <div className={`flex items-center bg-white border rounded-full px-3 py-1 shadow-2xs transition ${
          isSearchFocused ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-gray-300 hover:border-gray-400'
        }`}>
          <span className="material-symbols-outlined text-[17px] text-gray-400 mr-1.5 shrink-0">search</span>
          <input 
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search for tools, help, and more (Alt+Q)"
            className="w-full bg-transparent outline-none text-xs text-gray-800 placeholder-gray-400 font-normal"
          />
          <kbd className="hidden lg:inline text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 shrink-0 font-sans">
            Alt+Q
          </kbd>
        </div>

        {/* Quick Search Popover */}
        {isSearchFocused && searchQuery && (
          <div className="absolute left-0 right-0 top-9 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in duration-150">
            <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions & Features</div>
            {quickTools.length > 0 ? (
              quickTools.map((t, i) => (
                <div 
                  key={i}
                  onMouseDown={() => { t.action(); setSearchQuery(''); }}
                  className="px-3 py-1.5 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer flex items-center gap-2 text-xs transition"
                >
                  <span>{t.icon}</span>
                  <span className="font-medium">{t.label}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-gray-500 italic">No match for "{searchQuery}"</div>
            )}
          </div>
        )}
      </div>

      {/* Right Section: Feedback, Comments, Catch up, Editing, Share Button & Avatar */}
      <div className="flex items-center gap-1.5">
        <button 
          onClick={() => setIsFeedbackModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-gray-200/80 rounded-md transition font-medium cursor-pointer"
          title="Send feedback or feature request"
        >
          <span className="material-symbols-outlined text-[16px] text-emerald-600">rate_review</span>
          <span>Feedback</span>
        </button>

        <button 
          onClick={() => alert('Cell comments: Right-click any cell to Add Comment!')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition"
        >
          <span className="material-symbols-outlined text-[17px] text-gray-500">chat_bubble</span>
          <span>Comments</span>
        </button>

        <div className="relative">
          {isLockedView ? (
            /* Locked View-only pill badge (Google Docs / Sheets style: recipient cannot switch to edit) */
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-amber-100/90 text-amber-900 border border-amber-300/80 rounded-md font-semibold select-none shadow-2xs"
              title="View only: You do not have permission to edit this document."
            >
              <span className="material-symbols-outlined text-[15px] text-amber-800">lock</span>
              <span>Viewing</span>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setIsEditingMenuOpen(!isEditingMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition font-medium cursor-pointer ${
                  permissionMode === 'view' 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {permissionMode === 'view' ? 'visibility' : 'edit'}
                </span>
                <span>{permissionMode === 'view' ? 'Viewing' : 'Editing'}</span>
                <span className="material-symbols-outlined text-[15px] text-gray-400">arrow_drop_down</span>
              </button>
              {isEditingMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 text-xs">
                  <div 
                    onClick={() => { setPermissionMode('edit'); setIsEditingMenuOpen(false); }}
                    className={`px-3 py-1.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between ${
                      permissionMode === 'edit' ? 'font-semibold text-emerald-800 bg-emerald-50/50' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-emerald-700">edit</span>
                      <div>
                        <div className="font-semibold">Editing</div>
                        <div className="text-[10px] text-gray-500 font-normal">Make direct changes</div>
                      </div>
                    </div>
                    {permissionMode === 'edit' && <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>}
                  </div>

                  <div 
                    onClick={() => { setPermissionMode('view'); setIsEditingMenuOpen(false); }}
                    className={`px-3 py-1.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between ${
                      permissionMode === 'view' ? 'font-semibold text-amber-800 bg-amber-50/50' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-amber-700">visibility</span>
                      <div>
                        <div className="font-semibold">Viewing</div>
                        <div className="text-[10px] text-gray-500 font-normal">Read-only protection</div>
                      </div>
                    </div>
                    {permissionMode === 'view' && <span className="material-symbols-outlined text-[16px] text-amber-600">check</span>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Share Pill Button */}
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#0f7b0f] hover:bg-[#0b630b] text-white rounded-full font-semibold shadow-xs transition transform active:scale-95 text-xs cursor-pointer"
          title="Share document (Collaborate in real-time)"
        >
          <span className="material-symbols-outlined text-[17px]">share</span>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
