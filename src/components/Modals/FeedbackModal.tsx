import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, CheckCircle2, Star } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<string>('Feature Request');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    'Feature Request',
    'Bug Report',
    'User Experience & Design',
    'General Feedback'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('vexcel_user_feedbacks') || '[]');
      existing.push({
        rating,
        category,
        text: feedbackText.trim(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('vexcel_user_feedbacks', JSON.stringify(existing));
    } catch (err) {
      console.warn('Unable to persist feedback:', err);
    }

    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFeedbackText('');
    setRating(5);
    setCategory('Feature Request');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-150 font-sans"
      onClick={handleResetAndClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800 tracking-wide">
                Send Feedback
              </h2>
              <p className="text-[12px] text-slate-400 font-normal tracking-wide mt-0.5">
                Help us make VExcel (Vedval Excel) even better
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800 tracking-wide">
                Thank you for your feedback!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed tracking-wide">
                Your input has been recorded and will help shape future releases of VExcel Pro.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold tracking-wide shadow-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Rating Stars */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                How would you rate your experience?
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-200 hover:text-amber-400 focus:outline-none transition cursor-pointer"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= rating 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-slate-200 hover:text-amber-300'
                      }`} 
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-500 ml-2 tracking-wide font-medium">
                  {rating === 5 && 'Outstanding 🌟'}
                  {rating === 4 && 'Very Good 👍'}
                  {rating === 3 && 'Average 🙂'}
                  {rating === 2 && 'Needs Work ⚠️'}
                  {rating === 1 && 'Poor 👎'}
                </span>
              </div>
            </div>

            {/* Category Selectors */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Feedback Type
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition cursor-pointer border ${
                      category === cat
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Your Thoughts or Request
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What features would you love to see? Or tell us what went well..."
                rows={4}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl text-xs text-slate-800 tracking-wide placeholder:text-slate-400 outline-none transition resize-none leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!feedbackText.trim()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
