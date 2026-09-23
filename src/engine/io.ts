import * as XLSX from 'xlsx';
import { SheetData, Worksheet } from '../types/spreadsheet';
import { colIndexToLetter, coordsToCellId } from './helpers';

export function exportToXLSX(worksheet: Worksheet, fileName = 'VExcel_Document.xlsx') {
  const wb = XLSX.utils.book_new();
  const wsData: (string | number)[][] = [];

  for (let r = 0; r < worksheet.rowCount; r++) {
    const row: (string | number)[] = [];
    let hasData = false;
    for (let c = 0; c < worksheet.colCount; c++) {
      const cellId = coordsToCellId(c, r);
      const val = worksheet.data[cellId]?.value ?? '';
      row.push(val);
      if (val !== '') hasData = true;
    }
    if (hasData || r < 20) {
      wsData.push(row);
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, worksheet.name || 'Sheet1');
  XLSX.writeFile(wb, fileName);
}

export function exportToCSV(worksheet: Worksheet, fileName = 'VExcel_Document.csv') {
  const rows: string[] = [];
  for (let r = 0; r < worksheet.rowCount; r++) {
    const row: string[] = [];
    let hasData = false;
    for (let c = 0; c < worksheet.colCount; c++) {
      const cellId = coordsToCellId(c, r);
      let val = worksheet.data[cellId]?.value ?? '';
      if (val !== '') hasData = true;
      val = String(val).replace(/"/g, '""');
      if (val.includes(',') || val.includes('\n') || val.includes('"')) {
        val = "";
      }
      row.push(val);
    }
    if (hasData) {
      rows.push(row.join(','));
    }
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function importFileToWorksheet(file: File): Promise<Worksheet> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        const newSheetData: SheetData = {};
        const maxRows = Math.max(50, jsonData.length + 10);
        let maxCols = 26;

        jsonData.forEach((row, rIdx) => {
          if (row.length > maxCols) maxCols = row.length;
          row.forEach((cellVal: any, cIdx: number) => {
            if (cellVal !== undefined && cellVal !== null && cellVal !== '') {
              const cellId = coordsToCellId(cIdx, rIdx);
              newSheetData[cellId] = {
                raw: String(cellVal),
                value: cellVal
              };
            }
          });
        });

        resolve({
          id: 'imported_' + Date.now(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          rowCount: maxRows,
          colCount: Math.max(maxCols, 26),
          data: newSheetData
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
