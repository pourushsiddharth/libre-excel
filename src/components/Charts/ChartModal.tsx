import React, { useState } from 'react';
import { X, BarChart3, PieChart, TrendingUp, Sparkles } from 'lucide-react';
import { useSpreadsheetStore } from '../../store/useSpreadsheetStore';
import { coordsToCellId } from '../../engine/helpers';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const ChartModal: React.FC = () => {
  const { isChartModalOpen, setIsChartModalOpen, sheets, activeSheetId, selection } = useSpreadsheetStore();
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'doughnut'>('bar');
  const [chartTitle, setChartTitle] = useState('Data Distribution Chart');

  if (!isChartModalOpen) return null;

  const currentSheet = sheets.find(s => s.id === activeSheetId) || sheets[0];

  const minRow = Math.min(selection.start.row, selection.end.row);
  const maxRow = Math.max(selection.start.row, selection.end.row);
  const minCol = Math.min(selection.start.col, selection.end.col);
  const maxCol = Math.max(selection.start.col, selection.end.col);

  // Extract labels and numbers from selection
  const labels: string[] = [];
  const datasetValues: number[] = [];

  for (let r = minRow; r <= maxRow; r++) {
    const labelCellId = coordsToCellId(minCol, r);
    const valCellId = coordsToCellId(maxCol, r);

    const lbl = currentSheet.data[labelCellId]?.value ?? ('Row ' + (r + 1));
    const rawVal = currentSheet.data[valCellId]?.value;
    const num = parseFloat(rawVal);

    if (!isNaN(num)) {
      labels.push(String(lbl));
      datasetValues.push(num);
    }
  }

  const chartData = {
    labels: labels.length > 0 ? labels : ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    datasets: [
      {
        label: chartTitle,
        data: datasetValues.length > 0 ? datasetValues : [6000, 3600, 1800, 4200],
        backgroundColor: [
          'rgba(16, 185, 129, 0.75)',
          'rgba(59, 130, 246, 0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(239, 68, 68, 0.75)',
          'rgba(139, 92, 246, 0.75)',
          'rgba(236, 72, 153, 0.75)'
        ],
        borderColor: [
          '#10b981',
          '#3b82f6',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#ec4899'
        ],
        borderWidth: 1.5,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chartTitle,
        font: { size: 14, weight: 'bold' as const }
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 backdrop-blur-[3px] p-4 animate-in fade-in duration-150 font-sans"
      onClick={() => setIsChartModalOpen(false)}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 w-full max-w-2xl overflow-hidden border border-slate-200/80 flex flex-col animate-in zoom-in-[0.98] duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-[15px] tracking-wide">Interactive Visuals & Charts</h3>
              <p className="text-[12px] text-slate-400 font-normal tracking-wide mt-0.5">Live dynamic charts generated from active cell selection</p>
            </div>
          </div>
          <button
            onClick={() => setIsChartModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-7 space-y-4 bg-slate-50/30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-slate-700 font-medium text-[12px] tracking-wide mb-1.5">Chart Title</label>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                className="w-full text-xs text-slate-800 tracking-wide px-3.5 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 font-medium bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium text-[12px] tracking-wide mb-1.5">Chart Type</label>
              <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-slate-100/70">
                <button
                  onClick={() => setChartType('bar')}
                  className={
                    'px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition cursor-pointer ' +
                    (chartType === 'bar' ? 'bg-white shadow-2xs text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900')
                  }
                >
                  Bar
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={
                    'px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition cursor-pointer ' +
                    (chartType === 'line' ? 'bg-white shadow-2xs text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900')
                  }
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={
                    'px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition cursor-pointer ' +
                    (chartType === 'pie' ? 'bg-white shadow-2xs text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900')
                  }
                >
                  Pie
                </button>
                <button
                  onClick={() => setChartType('doughnut')}
                  className={
                    'px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition cursor-pointer ' +
                    (chartType === 'doughnut' ? 'bg-white shadow-2xs text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900')
                  }
                >
                  Doughnut
                </button>
              </div>
            </div>
          </div>

          {/* Chart Display Canvas */}
          <div className="h-72 w-full bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
            {chartType === 'bar' && <Bar data={chartData} options={options} />}
            {chartType === 'line' && <Line data={chartData} options={options} />}
            {chartType === 'pie' && <Pie data={chartData} options={options} />}
            {chartType === 'doughnut' && <Doughnut data={chartData} options={options} />}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-7 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => setIsChartModalOpen(false)}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition tracking-wide cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
