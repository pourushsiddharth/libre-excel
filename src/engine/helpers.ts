import { CellCoords } from '../types/spreadsheet';

export function colIndexToLetter(col: number): string {
  let temp = col;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

export function letterToColIndex(letters: string): number {
  let col = 0;
  const upper = letters.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    col = col * 26 + (upper.charCodeAt(i) - 64);
  }
  return col - 1;
}

export function cellIdToCoords(cellId: string): CellCoords | null {
  const match = cellId.toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;
  const col = letterToColIndex(match[1]);
  const row = parseInt(match[2], 10) - 1;
  return { col, row };
}

export function coordsToCellId(col: number, row: number): string {
  return `${colIndexToLetter(col)}${row + 1}`;
}

export function parseRange(rangeStr: string): { start: CellCoords; end: CellCoords } | null {
  const parts = rangeStr.toUpperCase().split(':');
  if (parts.length === 1) {
    const coords = cellIdToCoords(parts[0]);
    if (!coords) return null;
    return { start: coords, end: coords };
  }
  if (parts.length === 2) {
    const c1 = cellIdToCoords(parts[0]);
    const c2 = cellIdToCoords(parts[1]);
    if (!c1 || !c2) return null;
    return {
      start: { col: Math.min(c1.col, c2.col), row: Math.min(c1.row, c2.row) },
      end: { col: Math.max(c1.col, c2.col), row: Math.max(c1.row, c2.row) }
    };
  }
  return null;
}

export function isColorDark(color?: string): boolean {
  if (!color) return false;
  let c = color.trim().toLowerCase();
  if (c === 'transparent') return false;

  // Handle hex #rgb or #rrggbb
  if (c.startsWith('#')) {
    let hex = c.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      // Relative luminance formula
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      return luminance < 140;
    }
  }

  // Handle rgb / rgba
  const rgbMatch = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 140;
  }

  // Named dark colors
  const darkNames = ['black', 'navy', 'darkblue', 'indigo', 'maroon', 'purple', 'darkgreen', 'darkred', 'darkgray', 'darkgrey', 'midnightblue'];
  return darkNames.includes(c);
}

// Security signature generator for signed share tokens
export function generateShareSignature(docId: string, mode: string): string {
  const secret = 'libre_excel_sig_salt_987654';
  const str = `${docId}_${mode}_${secret}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export function verifyShareSignature(docId: string, mode: string, token: string): boolean {
  return generateShareSignature(docId, mode) === token;
}
