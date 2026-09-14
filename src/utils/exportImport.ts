import { ExportDataPayload } from '../types';

export function downloadJsonFile(data: ExportDataPayload, filename = 'gamevault_backup.json'): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseBackupFile(file: File): Promise<ExportDataPayload> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Validation
        if (!parsed || typeof parsed !== 'object') {
          return reject(new Error('File content is not valid JSON.'));
        }

        if (!Array.isArray(parsed.games)) {
          return reject(new Error('Invalid backup file: "games" list is missing or invalid.'));
        }

        resolve(parsed as ExportDataPayload);
      } catch (err) {
        reject(new Error('Failed to parse JSON backup file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
