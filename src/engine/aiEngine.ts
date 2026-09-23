import { SheetData } from '../types/spreadsheet';

export interface AIResponse {
  formula?: string;
  explanation: string;
  targetCellSuggestion?: string;
  insight?: string;
}

export function querySpreadsheetAI(prompt: string, activeCell: string, data: SheetData): AIResponse {
  const p = prompt.toLowerCase();

  // 1. Total / Sum Queries
  if (p.includes('sum') || p.includes('total') || p.includes('jod') || p.includes('plus') || p.includes('pura yog')) {
    const rangeMatch = prompt.match(/([a-z]+[0-9]+)\s*(?:se|to|-|:)\s*([a-z]+[0-9]+)/i);
    if (rangeMatch) {
      const r = rangeMatch[1].toUpperCase() + ':' + rangeMatch[2].toUpperCase();
      return {
        formula: '=SUM(' + r + ')',
        explanation: 'Calculates the total sum of all values from ' + r + '.',
        targetCellSuggestion: activeCell
      };
    }
    return {
      formula: '=SUM(A1:A10)',
      explanation: 'Calculates the total sum. You can customize the cell range (e.g., A1:A10).',
      targetCellSuggestion: activeCell
    };
  }

  // 2. Average / Ausat Queries
  if (p.includes('average') || p.includes('mean') || p.includes('ausat') || p.includes('avg')) {
    const rangeMatch = prompt.match(/([a-z]+[0-9]+)\s*(?:se|to|-|:)\s*([a-z]+[0-9]+)/i);
    const r = rangeMatch ? rangeMatch[1].toUpperCase() + ':' + rangeMatch[2].toUpperCase() : 'B2:B20';
    return {
      formula: '=AVERAGE(' + r + ')',
      explanation: 'Calculates the arithmetic average (mean) of values in ' + r + '.',
      targetCellSuggestion: activeCell
    };
  }

  // 3. GST or Tax Calculation
  if (p.includes('gst') || p.includes('tax') || p.includes('18%') || p.includes('vat')) {
    const target = activeCell || 'A1';
    return {
      formula: '=' + target + '*0.18',
      explanation: 'Calculates 18% GST/Tax on the selected amount. For 12% or 5%, replace 0.18 with 0.12 or 0.05.',
      targetCellSuggestion: activeCell
    };
  }

  // 4. Percentage / Profit Margin
  if (p.includes('percentage') || p.includes('percent') || p.includes('profit') || p.includes('margin') || p.includes('pratishat')) {
    return {
      formula: '=(B2-C2)/C2',
      explanation: 'Calculates percentage profit/growth margin between values. Remember to format the cell as Percentage (%).',
      targetCellSuggestion: activeCell
    };
  }

  // 5. IF Condition / Pass Fail / Target
  if (p.includes('if') || p.includes('agar') || p.includes('condition') || p.includes('pass') || p.includes('fail') || p.includes('target')) {
    return {
      formula: '=IF(C2>=40, "Pass", "Fail")',
      explanation: 'Checks condition: If score in C2 is 40 or higher returns "Pass", otherwise "Fail".',
      targetCellSuggestion: activeCell
    };
  }

  // 6. Max / Min / Highest / Lowest
  if (p.includes('highest') || p.includes('max') || p.includes('sabse bada')) {
    return {
      formula: '=MAX(A1:A50)',
      explanation: 'Finds the highest numerical value in the specified range.',
      targetCellSuggestion: activeCell
    };
  }

  if (p.includes('lowest') || p.includes('min') || p.includes('sabse chota')) {
    return {
      formula: '=MIN(A1:A50)',
      explanation: 'Finds the lowest numerical value in the specified range.',
      targetCellSuggestion: activeCell
    };
  }

  // 7. VLOOKUP / Search / Dhundo
  if (p.includes('vlookup') || p.includes('lookup') || p.includes('search') || p.includes('dhund')) {
    return {
      formula: '=VLOOKUP("ItemName", A2:D50, 2)',
      explanation: 'Searches for the item in column A and retrieves the corresponding value from column 2 (B).',
      targetCellSuggestion: activeCell
    };
  }

  // 8. General Data Insight or fallback
  return {
    formula: '',
    explanation: 'Copilot recognized your prompt: "' + prompt + '". Tip: Ask for SUM, AVERAGE, GST (18%), IF conditions, VLOOKUP, or Profit margin calculations in English or Hindi!',
    insight: 'Your active cell is ' + activeCell + '. You can type any formula starting with "=" or click "Insert Function" in the Ribbon toolbar.'
  };
}

