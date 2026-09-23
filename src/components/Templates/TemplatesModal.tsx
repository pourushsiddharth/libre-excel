import React, { useState } from 'react';
import { 
  X, 
  LayoutTemplate, 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  CheckSquare, 
  FileText, 
  Rocket, 
  Search, 
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useSpreadsheetStore } from '../../store/useSpreadsheetStore';
import { TEMPLATES } from '../../engine/templates';
import confetti from 'canvas-confetti';

export const TemplatesModal: React.FC = () => {
  const { isTemplatesModalOpen, setIsTemplatesModalOpen, loadTemplate } = useSpreadsheetStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedKey, setSelectedKey] = useState<string>('budget');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isTemplatesModalOpen) return null;

  const categories = ['All', 'Finance', 'Analytics', 'Operations', 'Commercial', 'Productivity'];

  const templateList = Object.entries(TEMPLATES).map(([key, item]) => ({
    key,
    ...item
  }));

  const filteredTemplates = templateList.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    const matchQuery = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  const activeTemplate = TEMPLATES[selectedKey] || TEMPLATES['budget'];

  const handleApply = (key: string) => {
    loadTemplate(key);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } });
  };

  const getTemplateIcon = (key: string) => {
    switch (key) {
      case 'budget':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'sales':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'project':
        return <CheckSquare className="w-4 h-4 text-purple-600" />;
      case 'invoice':
        return <FileText className="w-4 h-4 text-slate-600" />;
      case 'startup':
        return <Rocket className="w-4 h-4 text-amber-600" />;
      default:
        return <LayoutTemplate className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-[3px] p-3 sm:p-6 animate-in fade-in duration-150 font-sans"
      onClick={() => setIsTemplatesModalOpen(false)}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 w-full max-w-4xl max-h-[88vh] overflow-hidden border border-slate-200/80 flex flex-col animate-in zoom-in-[0.98] duration-150 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with authentic minimal luxury typography */}
        <div className="flex items-center justify-between px-7 py-4.5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 flex items-center justify-center shrink-0">
              <LayoutTemplate className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-800 text-[15px] tracking-wide">
                  Template Library & Starter Models
                </h3>
                <span className="text-[10px] font-medium tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                  Curated Worksheets
                </span>
              </div>
              <p className="text-[12px] text-slate-400 font-normal tracking-wide mt-0.5">
                Executive-ready financial models, automated trackers, and commercial invoices with pre-built formulas
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTemplatesModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search and Category Navigation Bar */}
        <div className="px-7 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates or tags..."
              className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-800 tracking-wide bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto custom-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap border select-none ${
                  activeCategory === cat
                    ? 'bg-slate-900 border-slate-900 text-white font-medium shadow-xs'
                    : 'bg-white border-slate-200/80 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area: Master-Detail Editorial Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[420px]">
          {/* Left Column: Clean Editorial Document Index (No Boxy Cards) */}
          <div className="w-full md:w-[46%] border-r border-slate-100 overflow-y-auto custom-scrollbar bg-white divide-y divide-slate-100">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((item) => {
                const isSelected = selectedKey === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => setSelectedKey(item.key)}
                    className={`px-7 py-4.5 transition-all cursor-pointer relative select-none group ${
                      isSelected
                        ? 'bg-slate-50/90'
                        : 'hover:bg-slate-50/40'
                    }`}
                  >
                    {/* Left Active Indicator Bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-900 rounded-r-full" />
                    )}

                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[13px] tracking-wide transition-colors ${
                          isSelected ? 'font-semibold text-slate-900' : 'font-medium text-slate-700 group-hover:text-slate-900'
                        }`}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-[12px] text-slate-500 font-normal tracking-wide mt-1.5 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-400 font-normal tracking-wide">
                      <span className="text-slate-600 font-medium">{item.metrics[0]?.label}: {item.metrics[0]?.value}</span>
                      <span>•</span>
                      <span>{item.tags[0]}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs tracking-wide">
                No templates found matching "{searchQuery}"
              </div>
            )}
          </div>

          {/* Right Column: Editorial Detail & Live Document Sheet View */}
          <div className="w-full md:w-[54%] overflow-y-auto p-8 flex flex-col justify-between custom-scrollbar bg-white">
            <div className="space-y-6">
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Template Specification & Preview
                  </span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                    {activeTemplate.category}
                  </span>
                </div>
                <h4 className="text-[18px] font-semibold text-slate-900 tracking-wide">
                  {activeTemplate.name}
                </h4>
                <p className="text-[13px] text-slate-600 tracking-wide leading-relaxed font-normal">
                  {activeTemplate.description}
                </p>
              </div>

              {/* Editorial Highlight Quote */}
              <div className="py-2.5 pl-4 border-l-2 border-slate-300 text-slate-600 text-xs tracking-wide leading-relaxed">
                <span className="font-medium text-slate-800">Workflow highlight: </span>
                {activeTemplate.highlight}
              </div>

              {/* Technical Metrics Inline Bar */}
              <div className="py-3 border-y border-slate-100 flex items-center justify-between">
                {activeTemplate.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{m.label}</div>
                    <div className="text-[14px] font-semibold text-slate-800 tracking-wide mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Data Structure Live Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-700 tracking-wide">
                    Live Data Preview
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Sheet: {activeTemplate.worksheet.name}</span>
                </div>

                <div className="border border-slate-200/80 rounded-xl overflow-hidden text-[11px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                        <th className="py-2 px-3 font-semibold">Row & Item</th>
                        <th className="py-2 px-3 font-semibold text-right">Raw Value</th>
                        <th className="py-2 px-3 font-semibold text-right">Computed Formula</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
                      <tr>
                        <td className="py-2 px-3 font-sans text-slate-800 font-normal">{activeTemplate.worksheet.data['A4']?.value || 'Primary Field'}</td>
                        <td className="py-2 px-3 text-right text-slate-500">{activeTemplate.worksheet.data['B4']?.value || '$0.00'}</td>
                        <td className="py-2 px-3 text-right text-slate-900 font-semibold">{activeTemplate.worksheet.data['C4']?.value || 'Evaluated'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-slate-800 font-normal">{activeTemplate.worksheet.data['A5']?.value || 'Secondary Field'}</td>
                        <td className="py-2 px-3 text-right text-slate-500">{activeTemplate.worksheet.data['B5']?.value || '$0.00'}</td>
                        <td className="py-2 px-3 text-right text-slate-900 font-semibold">{activeTemplate.worksheet.data['C5']?.value || 'Evaluated'}</td>
                      </tr>
                      <tr className="bg-slate-50/50 font-semibold">
                        <td className="py-2 px-3 font-sans text-slate-900">Total Calculated Summary</td>
                        <td className="py-2 px-3 text-right text-slate-700">{activeTemplate.worksheet.data['B7']?.value || activeTemplate.worksheet.data['B8']?.value || 'Formula'}</td>
                        <td className="py-2 px-3 text-right text-slate-900 font-bold">{activeTemplate.worksheet.data['C7']?.value || activeTemplate.worksheet.data['C8']?.value || 'Active'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Action in Right Column */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 tracking-wide font-normal">
                Initializes active sheet with all formulas & styles.
              </span>
              <button
                onClick={() => handleApply(selectedKey)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs tracking-wide shadow-sm flex items-center gap-2 transition cursor-pointer"
              >
                <span>Open {activeTemplate.category} Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-3 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Excel 365 formula syntax compatible</span>
          </div>
          <button
            onClick={() => setIsTemplatesModalOpen(false)}
            className="px-3.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition tracking-wide cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
