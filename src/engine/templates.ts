import { Worksheet } from '../types/spreadsheet';

export interface TemplateItem {
  name: string;
  category: 'Finance' | 'Analytics' | 'Operations' | 'Commercial' | 'Productivity';
  description: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  highlight: string;
  worksheet: Worksheet;
}

export const TEMPLATES: Record<string, TemplateItem> = {
  budget: {
    name: 'Personal Budget & Expense Tracker',
    category: 'Finance',
    description: 'Track monthly income, fixed & variable expenses, savings targets, and net balance.',
    tags: ['Personal Finance', 'Monthly Tracker', 'Auto-Sum Formulas'],
    metrics: [
      { label: 'Projected Net', value: '$3,930' },
      { label: 'Categories', value: '8 Types' },
      { label: 'Formulas', value: '6 Live' }
    ],
    highlight: 'Automated variance calculation between projected vs actual cashflow.',
    worksheet: {
      id: 'sheet_budget',
      name: 'Monthly Budget',
      rowCount: 30,
      colCount: 15,
      data: {
        'A1': { raw: 'PERSONAL MONTHLY BUDGET PLANNER', value: 'PERSONAL MONTHLY BUDGET PLANNER', style: { bold: true, fontSize: 16, textColor: '#166534' } },
        'A3': { raw: 'Income Source', value: 'Income Source', style: { bold: true, bgColor: '#dcfce7', align: 'left' } },
        'B3': { raw: 'Projected ($)', value: 'Projected ($)', style: { bold: true, bgColor: '#dcfce7', align: 'right' } },
        'C3': { raw: 'Actual ($)', value: 'Actual ($)', style: { bold: true, bgColor: '#dcfce7', align: 'right' } },
        'D3': { raw: 'Difference ($)', value: 'Difference ($)', style: { bold: true, bgColor: '#dcfce7', align: 'right' } },
        
        'A4': { raw: 'Primary Salary', value: 'Primary Salary' },
        'B4': { raw: '5000', value: 5000, style: { format: 'currency', align: 'right' } },
        'C4': { raw: '5200', value: 5200, style: { format: 'currency', align: 'right' } },
        'D4': { raw: '=C4-B4', value: 200, style: { format: 'currency', align: 'right' } },

        'A5': { raw: 'Freelancing & Consulting', value: 'Freelancing & Consulting' },
        'B5': { raw: '1200', value: 1200, style: { format: 'currency', align: 'right' } },
        'C5': { raw: '1450', value: 1450, style: { format: 'currency', align: 'right' } },
        'D5': { raw: '=C5-B5', value: 250, style: { format: 'currency', align: 'right' } },

        'A6': { raw: 'Dividends & Investments', value: 'Dividends & Investments' },
        'B6': { raw: '300', value: 300, style: { format: 'currency', align: 'right' } },
        'C6': { raw: '380', value: 380, style: { format: 'currency', align: 'right' } },
        'D6': { raw: '=C6-B6', value: 80, style: { format: 'currency', align: 'right' } },

        'A7': { raw: 'Total Income', value: 'Total Income', style: { bold: true, bgColor: '#f0fdf4' } },
        'B7': { raw: '=SUM(B4:B6)', value: 6500, style: { bold: true, format: 'currency', align: 'right', bgColor: '#f0fdf4' } },
        'C7': { raw: '=SUM(C4:C6)', value: 7030, style: { bold: true, format: 'currency', align: 'right', bgColor: '#f0fdf4' } },
        'D7': { raw: '=SUM(D4:D6)', value: 530, style: { bold: true, format: 'currency', align: 'right', bgColor: '#f0fdf4' } },

        'A9': { raw: 'Expense Category', value: 'Expense Category', style: { bold: true, bgColor: '#fee2e2' } },
        'B9': { raw: 'Budgeted ($)', value: 'Budgeted ($)', style: { bold: true, bgColor: '#fee2e2', align: 'right' } },
        'C9': { raw: 'Spent ($)', value: 'Spent ($)', style: { bold: true, bgColor: '#fee2e2', align: 'right' } },
        'D9': { raw: 'Variance ($)', value: 'Variance ($)', style: { bold: true, bgColor: '#fee2e2', align: 'right' } },

        'A10': { raw: 'Housing / Rent', value: 'Housing / Rent' },
        'B10': { raw: '1800', value: 1800, style: { format: 'currency', align: 'right' } },
        'C10': { raw: '1800', value: 1800, style: { format: 'currency', align: 'right' } },
        'D10': { raw: '=B10-C10', value: 0, style: { format: 'currency', align: 'right' } },

        'A11': { raw: 'Groceries & Food', value: 'Groceries & Food' },
        'B11': { raw: '600', value: 600, style: { format: 'currency', align: 'right' } },
        'C11': { raw: '650', value: 650, style: { format: 'currency', align: 'right' } },
        'D11': { raw: '=B11-C11', value: -50, style: { format: 'currency', align: 'right' } },

        'A12': { raw: 'Utilities & Internet', value: 'Utilities & Internet' },
        'B12': { raw: '250', value: 250, style: { format: 'currency', align: 'right' } },
        'C12': { raw: '230', value: 230, style: { format: 'currency', align: 'right' } },
        'D12': { raw: '=B12-C12', value: 20, style: { format: 'currency', align: 'right' } },

        'A13': { raw: 'Entertainment & Leisure', value: 'Entertainment & Leisure' },
        'B13': { raw: '350', value: 350, style: { format: 'currency', align: 'right' } },
        'C13': { raw: '420', value: 420, style: { format: 'currency', align: 'right' } },
        'D13': { raw: '=B13-C13', value: -70, style: { format: 'currency', align: 'right' } },

        'A14': { raw: 'Total Expenses', value: 'Total Expenses', style: { bold: true, bgColor: '#fef2f2' } },
        'B14': { raw: '=SUM(B10:B13)', value: 3000, style: { bold: true, format: 'currency', align: 'right', bgColor: '#fef2f2' } },
        'C14': { raw: '=SUM(C10:C13)', value: 3100, style: { bold: true, format: 'currency', align: 'right', bgColor: '#fef2f2' } },
        'D14': { raw: '=SUM(D10:D13)', value: -100, style: { bold: true, format: 'currency', align: 'right', bgColor: '#fef2f2' } },

        'A16': { raw: 'NET SAVINGS', value: 'NET SAVINGS', style: { bold: true, bgColor: '#e0e7ff', fontSize: 13 } },
        'B16': { raw: '=B7-B14', value: 3500, style: { bold: true, format: 'currency', align: 'right', bgColor: '#e0e7ff' } },
        'C16': { raw: '=C7-C14', value: 3930, style: { bold: true, format: 'currency', align: 'right', bgColor: '#e0e7ff' } },
        'D16': { raw: '=C16-B16', value: 430, style: { bold: true, format: 'currency', align: 'right', bgColor: '#e0e7ff' } },
      }
    }
  },
  sales: {
    name: 'Sales Performance & Commission Tracker',
    category: 'Analytics',
    description: 'Track regional sales targets, actual performance, and commission percentages.',
    tags: ['Sales Dashboard', 'Quota Tracking', 'Regional Breakdown'],
    metrics: [
      { label: 'Q1 Realized', value: '$190.7k' },
      { label: 'Avg Quota', value: '112%' },
      { label: 'Reps', value: '4 Execs' }
    ],
    highlight: 'Dynamic commission ratios with percentage conversion formatting.',
    worksheet: {
      id: 'sheet_sales',
      name: 'Sales Dashboard',
      rowCount: 30,
      colCount: 15,
      data: {
        'A1': { raw: 'ANNUAL SALES REPORT & TARGETS', value: 'ANNUAL SALES REPORT & TARGETS', style: { bold: true, fontSize: 16, textColor: '#1e40af' } },
        'A3': { raw: 'Sales Executive', value: 'Sales Executive', style: { bold: true, bgColor: '#dbeafe' } },
        'B3': { raw: 'Region', value: 'Region', style: { bold: true, bgColor: '#dbeafe' } },
        'C3': { raw: 'Target Q1', value: 'Target Q1', style: { bold: true, bgColor: '#dbeafe', align: 'right' } },
        'D3': { raw: 'Achieved Q1', value: 'Achieved Q1', style: { bold: true, bgColor: '#dbeafe', align: 'right' } },
        'E3': { raw: 'Completion Rate', value: 'Completion Rate', style: { bold: true, bgColor: '#dbeafe', align: 'right' } },

        'A4': { raw: 'Rajesh Sharma', value: 'Rajesh Sharma' },
        'B4': { raw: 'North India', value: 'North India' },
        'C4': { raw: '50000', value: 50000, style: { format: 'currency', align: 'right' } },
        'D4': { raw: '62000', value: 62000, style: { format: 'currency', align: 'right' } },
        'E4': { raw: '=D4/C4', value: '1.24', style: { format: 'percent', align: 'right' } },

        'A5': { raw: 'Priya Patel', value: 'Priya Patel' },
        'B5': { raw: 'West Region', value: 'West Region' },
        'C5': { raw: '45000', value: 45000, style: { format: 'currency', align: 'right' } },
        'D5': { raw: '49500', value: 49500, style: { format: 'currency', align: 'right' } },
        'E5': { raw: '=D5/C5', value: '1.10', style: { format: 'percent', align: 'right' } },

        'A6': { raw: 'Amit Verma', value: 'Amit Verma' },
        'B6': { raw: 'South Region', value: 'South Region' },
        'C6': { raw: '40000', value: 40000, style: { format: 'currency', align: 'right' } },
        'D6': { raw: '38000', value: 38000, style: { format: 'currency', align: 'right' } },
        'E6': { raw: '=D6/C6', value: '0.95', style: { format: 'percent', align: 'right' } },

        'A7': { raw: 'Sneha Rao', value: 'Sneha Rao' },
        'B7': { raw: 'East Region', value: 'East Region' },
        'C7': { raw: '35000', value: 35000, style: { format: 'currency', align: 'right' } },
        'D7': { raw: '41200', value: 41200, style: { format: 'currency', align: 'right' } },
        'E7': { raw: '=D7/C7', value: '1.17', style: { format: 'percent', align: 'right' } },

        'A8': { raw: 'Total Summary', value: 'Total Summary', style: { bold: true, bgColor: '#eff6ff' } },
        'B8': { raw: 'All Territories', value: 'All Territories', style: { bold: true, bgColor: '#eff6ff' } },
        'C8': { raw: '=SUM(C4:C7)', value: 170000, style: { bold: true, format: 'currency', align: 'right', bgColor: '#eff6ff' } },
        'D8': { raw: '=SUM(D4:D7)', value: 190700, style: { bold: true, format: 'currency', align: 'right', bgColor: '#eff6ff' } },
        'E8': { raw: '=D8/C8', value: '1.12', style: { bold: true, format: 'percent', align: 'right', bgColor: '#eff6ff' } },
      }
    }
  },
  project: {
    name: 'Executive Project Tracker & Milestones',
    category: 'Operations',
    description: 'Monitor cross-functional deliverables, status tags, owners, and completion dates.',
    tags: ['Roadmap', 'Sprint Milestones', 'Owner Assignments'],
    metrics: [
      { label: 'Active Phases', value: '3 Stages' },
      { label: 'Completion', value: '50% Done' },
      { label: 'Lead Owners', value: '4 Leads' }
    ],
    highlight: 'Clean status callout tags with priority and due date indicators.',
    worksheet: {
      id: 'sheet_project',
      name: 'Project Status',
      rowCount: 30,
      colCount: 15,
      data: {
        'A1': { raw: 'ENTERPRISE PRODUCT ROADMAP', value: 'ENTERPRISE PRODUCT ROADMAP', style: { bold: true, fontSize: 16, textColor: '#0f172a' } },
        'A3': { raw: 'Milestone / Task', value: 'Milestone / Task', style: { bold: true, bgColor: '#f1f5f9', align: 'left' } },
        'B3': { raw: 'Lead Owner', value: 'Lead Owner', style: { bold: true, bgColor: '#f1f5f9', align: 'left' } },
        'C3': { raw: 'Phase', value: 'Phase', style: { bold: true, bgColor: '#f1f5f9', align: 'center' } },
        'D3': { raw: 'Status', value: 'Status', style: { bold: true, bgColor: '#f1f5f9', align: 'center' } },
        'E3': { raw: 'Target Date', value: 'Target Date', style: { bold: true, bgColor: '#f1f5f9', align: 'center' } },

        'A4': { raw: 'Architecture & Scalability Review', value: 'Architecture & Scalability Review' },
        'B4': { raw: 'Sarah Jenkins', value: 'Sarah Jenkins' },
        'C4': { raw: 'Phase 1', value: 'Phase 1', style: { align: 'center' } },
        'D4': { raw: 'COMPLETED', value: 'COMPLETED', style: { bold: true, textColor: '#15803d', bgColor: '#dcfce7', align: 'center' } },
        'E4': { raw: '2026-03-15', value: '2026-03-15', style: { align: 'center' } },

        'A5': { raw: 'Real-time Web Worker Calculation Engine', value: 'Real-time Web Worker Calculation Engine' },
        'B5': { raw: 'Alex Chen', value: 'Alex Chen' },
        'C5': { raw: 'Phase 2', value: 'Phase 2', style: { align: 'center' } },
        'D5': { raw: 'IN PROGRESS', value: 'IN PROGRESS', style: { bold: true, textColor: '#0369a1', bgColor: '#e0f2fe', align: 'center' } },
        'E5': { raw: '2026-04-01', value: '2026-04-01', style: { align: 'center' } },

        'A6': { raw: 'Security Audit & RBAC Permissions', value: 'Security Audit & RBAC Permissions' },
        'B6': { raw: 'David Miller', value: 'David Miller' },
        'C6': { raw: 'Phase 2', value: 'Phase 2', style: { align: 'center' } },
        'D6': { raw: 'UNDER REVIEW', value: 'UNDER REVIEW', style: { bold: true, textColor: '#b45309', bgColor: '#fef3c7', align: 'center' } },
        'E6': { raw: '2026-04-20', value: '2026-04-20', style: { align: 'center' } },

        'A7': { raw: 'Public Launch & Regional Rollout', value: 'Public Launch & Regional Rollout' },
        'B7': { raw: 'Elena Rostova', value: 'Elena Rostova' },
        'C7': { raw: 'Phase 3', value: 'Phase 3', style: { align: 'center' } },
        'D7': { raw: 'PLANNED', value: 'PLANNED', style: { bold: true, textColor: '#64748b', bgColor: '#f1f5f9', align: 'center' } },
        'E7': { raw: '2026-05-15', value: '2026-05-15', style: { align: 'center' } },
      }
    }
  },
  invoice: {
    name: 'Clean Commercial Invoice & Billing',
    category: 'Commercial',
    description: 'Itemized billing statements with automatic subtotal, tax rate, and net payable calculations.',
    tags: ['Invoice Statement', 'Tax Calculation', 'Client Billing'],
    metrics: [
      { label: 'Total Due', value: '$13,750' },
      { label: 'Tax Rate', value: '10%' },
      { label: 'Items', value: '3 Line Items' }
    ],
    highlight: 'Production-ready billing format with line-item multiplication and automatic subtotal tax sums.',
    worksheet: {
      id: 'sheet_invoice',
      name: 'Invoice Statement',
      rowCount: 30,
      colCount: 15,
      data: {
        'A1': { raw: 'COMMERCIAL INVOICE', value: 'COMMERCIAL INVOICE', style: { bold: true, fontSize: 18, textColor: '#1e293b' } },
        'A2': { raw: 'Invoice No: INV-2026-089', value: 'Invoice No: INV-2026-089', style: { textColor: '#64748b', fontSize: 11 } },

        'A4': { raw: 'Item Description', value: 'Item Description', style: { bold: true, bgColor: '#f8fafc', align: 'left' } },
        'B4': { raw: 'Qty', value: 'Qty', style: { bold: true, bgColor: '#f8fafc', align: 'right' } },
        'C4': { raw: 'Unit Price ($)', value: 'Unit Price ($)', style: { bold: true, bgColor: '#f8fafc', align: 'right' } },
        'D4': { raw: 'Total ($)', value: 'Total ($)', style: { bold: true, bgColor: '#f8fafc', align: 'right' } },

        'A5': { raw: 'Cloud Architecture Consulting & Setup', value: 'Cloud Architecture Consulting & Setup' },
        'B5': { raw: '40', value: 40, style: { align: 'right' } },
        'C5': { raw: '150', value: 150, style: { format: 'currency', align: 'right' } },
        'D5': { raw: '=B5*C5', value: 6000, style: { format: 'currency', align: 'right' } },

        'A6': { raw: 'Custom Web Worker Formula Engine Module', value: 'Custom Web Worker Formula Engine Module' },
        'B6': { raw: '1', value: 1, style: { align: 'right' } },
        'C6': { raw: '3500', value: 3500, style: { format: 'currency', align: 'right' } },
        'D6': { raw: '=B6*C6', value: 3500, style: { format: 'currency', align: 'right' } },

        'A7': { raw: 'UI/UX Design System Refinement', value: 'UI/UX Design System Refinement' },
        'B7': { raw: '25', value: 25, style: { align: 'right' } },
        'C7': { raw: '120', value: 120, style: { format: 'currency', align: 'right' } },
        'D7': { raw: '=B7*C7', value: 3000, style: { format: 'currency', align: 'right' } },

        'A9': { raw: 'Subtotal', value: 'Subtotal', style: { bold: true } },
        'D9': { raw: '=SUM(D5:D7)', value: 12500, style: { bold: true, format: 'currency', align: 'right' } },

        'A10': { raw: 'Tax (10%)', value: 'Tax (10%)', style: { textColor: '#64748b' } },
        'D10': { raw: '=D9*0.1', value: 1250, style: { format: 'currency', align: 'right', textColor: '#64748b' } },

        'A11': { raw: 'TOTAL BALANCE DUE', value: 'TOTAL BALANCE DUE', style: { bold: true, fontSize: 13, bgColor: '#f1f5f9', textColor: '#0f172a' } },
        'D11': { raw: '=D9+D10', value: 13750, style: { bold: true, fontSize: 13, format: 'currency', align: 'right', bgColor: '#f1f5f9', textColor: '#0f172a' } },
      }
    }
  },
  startup: {
    name: 'SaaS Unit Economics & Burn Rate Model',
    category: 'Productivity',
    description: 'Financial forecasting sheet calculating ARR, MRR churn, runway months, and CAC payback period.',
    tags: ['Financial Model', 'SaaS Metrics', 'Runway Calculator'],
    metrics: [
      { label: 'Runway', value: '18 Months' },
      { label: 'MoM Growth', value: '14.2%' },
      { label: 'CAC Payback', value: '7 Months' }
    ],
    highlight: 'Standard venture-grade financial model with runway and burn rate projections.',
    worksheet: {
      id: 'sheet_startup',
      name: 'Financial Model',
      rowCount: 30,
      colCount: 15,
      data: {
        'A1': { raw: 'SAAS UNIT ECONOMICS & RUNWAY', value: 'SAAS UNIT ECONOMICS & RUNWAY', style: { bold: true, fontSize: 16, textColor: '#0f172a' } },
        'A3': { raw: 'Key Metric', value: 'Key Metric', style: { bold: true, bgColor: '#f8fafc', align: 'left' } },
        'B3': { raw: 'Q1 Target', value: 'Q1 Target', style: { bold: true, bgColor: '#f8fafc', align: 'right' } },
        'C3': { raw: 'Q2 Target', value: 'Q2 Target', style: { bold: true, bgColor: '#f8fafc', align: 'right' } },
        'D3': { raw: 'Q3 Target', value: 'Q3 Target', style: { bold: true, bgColor: '#f8fafc', align: 'right' } },

        'A4': { raw: 'Monthly Recurring Revenue (MRR)', value: 'Monthly Recurring Revenue (MRR)' },
        'B4': { raw: '32000', value: 32000, style: { format: 'currency', align: 'right' } },
        'C4': { raw: '42000', value: 42000, style: { format: 'currency', align: 'right' } },
        'D4': { raw: '58000', value: 58000, style: { format: 'currency', align: 'right' } },

        'A5': { raw: 'Customer Acquisition Cost (CAC)', value: 'Customer Acquisition Cost (CAC)' },
        'B5': { raw: '450', value: 450, style: { format: 'currency', align: 'right' } },
        'C5': { raw: '420', value: 420, style: { format: 'currency', align: 'right' } },
        'D5': { raw: '390', value: 390, style: { format: 'currency', align: 'right' } },

        'A6': { raw: 'Gross Margin %', value: 'Gross Margin %' },
        'B6': { raw: '0.82', value: 0.82, style: { format: 'percent', align: 'right' } },
        'C6': { raw: '0.84', value: 0.84, style: { format: 'percent', align: 'right' } },
        'D6': { raw: '0.86', value: 0.86, style: { format: 'percent', align: 'right' } },

        'A7': { raw: 'Net Monthly Burn', value: 'Net Monthly Burn', style: { bold: true, bgColor: '#fef2f2' } },
        'B7': { raw: '18500', value: 18500, style: { bold: true, format: 'currency', align: 'right', bgColor: '#fef2f2' } },
        'C7': { raw: '16200', value: 16200, style: { bold: true, format: 'currency', align: 'right', bgColor: '#fef2f2' } },
        'D7': { raw: '12800', value: 12800, style: { bold: true, format: 'currency', align: 'right', bgColor: '#fef2f2' } },
      }
    }
  }
};
