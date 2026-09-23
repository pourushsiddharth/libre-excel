import { SheetData } from '../types/spreadsheet';
import { cellIdToCoords, coordsToCellId, parseRange } from './helpers';

// Helper to extract values from range or single cell
function getValuesFromRef(ref: string, data: SheetData): any[] {
  const cleanRef = ref.trim().toUpperCase();
  if (cleanRef.includes(':')) {
    const range = parseRange(cleanRef);
    if (!range) return [];
    const values: any[] = [];
    for (let r = range.start.row; r <= range.end.row; r++) {
      for (let c = range.start.col; c <= range.end.col; c++) {
        const id = coordsToCellId(c, r);
        const cell = data[id];
        if (cell && cell.value !== undefined && cell.value !== null && cell.value !== '') {
          values.push(cell.value);
        }
      }
    }
    return values;
  } else {
    const cell = data[cleanRef];
    return cell && cell.value !== undefined ? [cell.value] : [];
  }
}

function parseNumberList(args: string[], data: SheetData): number[] {
  const numbers: number[] = [];
  for (const arg of args) {
    const trimmed = arg.trim();
    if (/^[A-Z]+[0-9]+(:[A-Z]+[0-9]+)?$/i.test(trimmed)) {
      const vals = getValuesFromRef(trimmed, data);
      for (const v of vals) {
        const n = parseFloat(v);
        if (!isNaN(n)) numbers.push(n);
      }
    } else {
      const n = parseFloat(trimmed);
      if (!isNaN(n)) numbers.push(n);
    }
  }
  return numbers;
}

export function evaluateFormula(formula: string, data: SheetData): any {
  if (!formula.startsWith('=')) {
    return formula;
  }

  const rawExpr = formula.substring(1).trim();
  if (!rawExpr) return '';

  try {
    // 1. Check for Functions: NAME(...)
    const funcMatch = rawExpr.match(/^([A-Z_]+)\s*\((.*)\)$/is);
    if (funcMatch) {
      const funcName = funcMatch[1].toUpperCase();
      const innerArgs = funcMatch[2];
      
      // Split args by comma respecting quotes/brackets (simple parser)
      const args: string[] = [];
      let current = '';
      let depth = 0;
      let inQuotes = false;
      for (let i = 0; i < innerArgs.length; i++) {
        const char = innerArgs[i];
        if (char === '"') inQuotes = !inQuotes;
        if (!inQuotes) {
          if (char === '(') depth++;
          else if (char === ')') depth--;
          else if (char === ',' && depth === 0) {
            args.push(current.trim());
            current = '';
            continue;
          }
        }
        current += char;
      }
      if (current.trim()) args.push(current.trim());

      switch (funcName) {
        case 'SUM': {
          const nums = parseNumberList(args, data);
          return nums.reduce((acc, curr) => acc + curr, 0);
        }
        case 'AVERAGE': {
          const nums = parseNumberList(args, data);
          if (nums.length === 0) return 0;
          return (nums.reduce((acc, curr) => acc + curr, 0) / nums.length).toFixed(2);
        }
        case 'COUNT': {
          const nums = parseNumberList(args, data);
          return nums.length;
        }
        case 'COUNTA': {
          let count = 0;
          for (const arg of args) {
            const vals = getValuesFromRef(arg, data);
            count += vals.length;
          }
          return count;
        }
        case 'MIN': {
          const nums = parseNumberList(args, data);
          return nums.length > 0 ? Math.min(...nums) : 0;
        }
        case 'MAX': {
          const nums = parseNumberList(args, data);
          return nums.length > 0 ? Math.max(...nums) : 0;
        }
        case 'PRODUCT': {
          const nums = parseNumberList(args, data);
          return nums.length > 0 ? nums.reduce((a, b) => a * b, 1) : 0;
        }
        case 'ROUND': {
          const n = evaluateFormula('=' + args[0], data);
          const decimals = args[1] ? parseInt(args[1], 10) : 0;
          return Number(Math.round(Number(n + 'e' + decimals)) + 'e-' + decimals);
        }
        case 'ABS': {
          const n = parseFloat(evaluateFormula('=' + args[0], data));
          return isNaN(n) ? 0 : Math.abs(n);
        }
        case 'SQRT': {
          const n = parseFloat(evaluateFormula('=' + args[0], data));
          return isNaN(n) || n < 0 ? '#NUM!' : Math.sqrt(n);
        }
        case 'POWER': {
          const base = parseFloat(evaluateFormula('=' + args[0], data));
          const exp = parseFloat(evaluateFormula('=' + args[1], data));
          return Math.pow(base, exp);
        }
        case 'IF': {
          // IF(condition, value_if_true, value_if_false)
          if (args.length < 2) return '#N/A';
          const cond = evaluateFormula('=' + args[0], data);
          const isTrue = cond === true || (typeof cond === 'number' && cond !== 0) || cond === 'true';
          if (isTrue) {
            return evaluateFormula('=' + args[1], data);
          } else {
            return args[2] !== undefined ? evaluateFormula('=' + args[2], data) : false;
          }
        }
        case 'CONCAT':
        case 'CONCATENATE': {
          let res = '';
          for (const a of args) {
            const val = evaluateFormula('=' + a, data);
            res += (val !== undefined && val !== null ? String(val) : '');
          }
          return res;
        }
        case 'UPPER': {
          const val = evaluateFormula('=' + args[0], data);
          return String(val || '').toUpperCase();
        }
        case 'LOWER': {
          const val = evaluateFormula('=' + args[0], data);
          return String(val || '').toLowerCase();
        }
        case 'TRIM': {
          const val = evaluateFormula('=' + args[0], data);
          return String(val || '').trim();
        }
        case 'LEN': {
          const val = evaluateFormula('=' + args[0], data);
          return String(val || '').length;
        }
        case 'NOW': {
          return new Date().toLocaleString();
        }
        case 'TODAY': {
          return new Date().toLocaleDateString();
        }
        case 'VLOOKUP': {
          // VLOOKUP(lookup_value, table_array, col_index, [exact_match])
          if (args.length < 3) return '#N/A';
          const lookupVal = String(evaluateFormula('=' + args[0], data)).trim().toLowerCase();
          const tableRange = parseRange(args[1]);
          const targetColIdx = parseInt(args[2], 10) - 1;
          if (!tableRange || isNaN(targetColIdx)) return '#REF!';

          for (let r = tableRange.start.row; r <= tableRange.end.row; r++) {
            const firstCellId = coordsToCellId(tableRange.start.col, r);
            const firstCellVal = String(data[firstCellId]?.value ?? '').trim().toLowerCase();
            if (firstCellVal === lookupVal) {
              const resCellId = coordsToCellId(tableRange.start.col + targetColIdx, r);
              return data[resCellId]?.value ?? '';
            }
          }
          return '#N/A';
        }
        default:
          break;
      }
    }

    // 2. Arithmetic expressions: e.g. A1 + B2 * 10
    // Replace cell references with their numeric/string values
    let expr = rawExpr;
    // Replace cell names like A1, BC12 with evaluated values
    expr = expr.replace(/\b([A-Z]+[0-9]+)\b/gi, (match) => {
      const cellId = match.toUpperCase();
      const val = data[cellId]?.value;
      if (val === undefined || val === null || val === '') return '0';
      if (typeof val === 'number') return String(val);
      const parsed = parseFloat(val);
      return isNaN(parsed) ? "" : String(parsed);
    });

    // Check for logical comparisons: =, !=, <, >, <=, >=
    if (expr.includes('==') || expr.includes('!=') || expr.includes('<=') || expr.includes('>=') || expr.includes('<') || expr.includes('>')) {
      // Safe comparison
      // eslint-disable-next-line no-new-func
      return Function('"use strict"; return (' + expr + ')')();
    }

    // Safe mathematical evaluation
    // Only allow digits, arithmetic operators, parens, spaces
    if (/^[\d\.\s\+\-\*\/\%\(\)\^]+$/.test(expr)) {
      const sanitized = expr.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + sanitized + ')')();
      return typeof result === 'number' && !isNaN(result) ? Number(result.toFixed(4)) : result;
    }

    return expr;
  } catch (err) {
    return '#ERROR!';
  }
}
