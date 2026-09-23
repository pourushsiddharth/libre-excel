import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Globe, 
  Link2
} from 'lucide-react';
import { useSpreadsheetStore } from '../../store/useSpreadsheetStore';
import { coordsToCellId, generateShareSignature } from '../../engine/helpers';
import confetti from 'canvas-confetti';

export const ShareModal: React.FC = () => {
  const { 
    isShareModalOpen, 
    setIsShareModalOpen, 
    documentTitle,
    docId,
    sheets,
    activeSheetId,
    activeCell,
    permissionMode
  } = useSpreadsheetStore();

  const [copied, setCopied] = useState(false);
  const [permission, setPermission] = useState<'edit' | 'view'>('view');
  const [emailInput, setEmailInput] = useState('');
  const [linkToCell, setLinkToCell] = useState(true);

  // Active sheet & cell info
  const activeSheet = sheets.find(s => s.id === activeSheetId) || sheets[0];
  const sheetName = activeSheet ? activeSheet.name : 'Sheet1';
  const cellId = coordsToCellId(activeCell.col, activeCell.row);

  // Sync state to storage
  useEffect(() => {
    if (isShareModalOpen && typeof window !== 'undefined') {
      const ownerId = localStorage.getItem('libre_owner_token') || 'owner_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('libre_owner_token', ownerId);
      localStorage.setItem(
        'libre_doc_' + docId,
        JSON.stringify({ documentTitle, sheets, activeSheetId, ownerId })
      );
    }
  }, [isShareModalOpen, docId, documentTitle, sheets, activeSheetId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isShareModalOpen) {
        setIsShareModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShareModalOpen, setIsShareModalOpen]);

  if (!isShareModalOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const searchParams = new URLSearchParams();
  searchParams.set('doc', docId);
  searchParams.set('sheet', sheetName);
  if (linkToCell) {
    searchParams.set('cell', cellId);
  }
  searchParams.set('mode', permission);
  // Cryptographic token to verify integrity of the permission mode
  const token = generateShareSignature(docId, permission);
  searchParams.set('token', token);

  const exactSheetUrl = `${origin}${pathname}?${searchParams.toString()}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(exactSheetUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = exactSheetUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 }
      });
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      prompt('Copy shareable link:', exactSheetUrl);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 animate-in fade-in duration-150"
      onClick={() => setIsShareModalOpen(false)}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 w-full max-w-[490px] overflow-hidden border border-slate-200/80 text-slate-800 animate-in zoom-in-95 duration-150 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-2">
          <h2 className="text-[17px] font-medium text-slate-800 tracking-wide">
            Share "{documentTitle || 'Workbook'}"
          </h2>
          <button 
            onClick={() => setIsShareModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-7 py-4 space-y-5">
          {/* People & Groups input */}
          <div>
            <input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Add people, groups, or emails"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl text-xs text-slate-800 tracking-wide placeholder:text-slate-400 outline-none transition"
            />
          </div>

          {/* People with access list */}
          <div>
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              People with access
            </h4>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-medium text-xs flex items-center justify-center shadow-2xs tracking-wide">
                  You
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 leading-tight tracking-wide">You</div>
                  <div className="text-[11px] text-slate-400 tracking-wide">owner@vexcel.local</div>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium tracking-wide">Owner</span>
            </div>
          </div>

          {/* General access */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              General access
            </h4>
            <div className="flex items-start justify-between py-1 gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-900 leading-tight">
                    Anyone with the link
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Anyone on the internet with this link can {permission === 'edit' ? 'edit' : 'view'}
                  </div>
                </div>
              </div>

              <select
                value={permission}
                onChange={(e) => {
                  const val = e.target.value as 'edit' | 'view';
                  setPermission(val);
                }}
                className="text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md px-2.5 py-1 outline-none cursor-pointer transition shrink-0"
              >
                <option value="view">Viewer</option>
                <option value="edit">Editor</option>
              </select>
            </div>
          </div>

          {/* Target Sheet & Cell option */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="text-gray-400">Target:</span>
              <span className="font-semibold text-gray-800">{sheetName}</span>
              {linkToCell && <span className="text-emerald-700 font-semibold">• cell {cellId}</span>}
            </span>
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none hover:text-gray-900 transition">
              <input
                type="checkbox"
                checked={linkToCell}
                onChange={(e) => setLinkToCell(e.target.checked)}
                className="rounded text-[#0f7b0f] focus:ring-[#0f7b0f] cursor-pointer"
              />
              <span>Focus cell {cellId}</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/80 border-t border-gray-100">
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold transition cursor-pointer active:scale-95 ${
              copied
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Link copied</span>
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5 text-gray-600" />
                <span>Copy link</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsShareModalOpen(false)}
            className="px-6 py-1.5 bg-[#0f7b0f] hover:bg-[#0b630b] text-white rounded-full text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
