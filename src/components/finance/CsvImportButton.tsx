import { useRef } from 'react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { FinanceCategory, FinanceEntry, FinanceEntryType, FinanceStatus, FINANCE_CATEGORY_ORDER } from '@/types';
import { Upload } from 'lucide-react';

const VALID_CATEGORIES = new Set<string>(FINANCE_CATEGORY_ORDER);
const VALID_TYPES = new Set<FinanceEntryType>(['receita', 'despesa']);
const VALID_STATUSES = new Set<FinanceStatus>(['previsto', 'pago', 'recebido', 'atrasado']);

function pick(row: Record<string, string>, keys: string[]): string | undefined {
  for (const key of keys) {
    const found = Object.keys(row).find(k => k.trim().toLowerCase() === key);
    if (found && row[found]?.trim()) return row[found].trim();
  }
  return undefined;
}

function parseRow(row: Record<string, string>, projectId: string, index: number): FinanceEntry | null {
  const description = pick(row, ['descricao', 'description', 'descrição']);
  const amountRaw = pick(row, ['valor', 'amount']);
  const dueDate = pick(row, ['vencimento', 'duedate', 'data']);
  if (!description || !amountRaw || !dueDate) return null;

  const amount = Number(amountRaw.replace(',', '.'));
  if (!amount || amount <= 0) return null;

  const typeRaw = pick(row, ['tipo', 'type'])?.toLowerCase();
  const type: FinanceEntryType = typeRaw && VALID_TYPES.has(typeRaw as FinanceEntryType) ? (typeRaw as FinanceEntryType) : 'despesa';

  const categoryRaw = pick(row, ['categoria', 'category'])?.toLowerCase();
  const category: FinanceCategory = categoryRaw && VALID_CATEGORIES.has(categoryRaw) ? (categoryRaw as FinanceCategory) : 'outros';

  const statusRaw = pick(row, ['status'])?.toLowerCase();
  const status: FinanceStatus = statusRaw && VALID_STATUSES.has(statusRaw as FinanceStatus) ? (statusRaw as FinanceStatus) : 'previsto';

  return {
    id: `fe-import-${Date.now()}-${index}`,
    projectId,
    type,
    category,
    description,
    amount,
    dueDate,
    status,
  };
}

export function CsvImportButton({ projectId }: { projectId: string }) {
  const { addFinanceEntries } = useProject();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const entries = results.data
          .map((row, index) => parseRow(row, projectId, index))
          .filter((entry): entry is FinanceEntry => entry !== null);

        if (entries.length === 0) {
          toast.error('Nenhum lançamento válido encontrado no arquivo. Colunas esperadas: descrição, valor, vencimento, tipo, categoria.');
          return;
        }
        addFinanceEntries(entries);
        toast.success(`${entries.length} lançamento${entries.length > 1 ? 's' : ''} importado${entries.length > 1 ? 's' : ''} da planilha`);
      },
      error: () => toast.error('Não foi possível ler o arquivo CSV'),
    });
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      <Button variant="outline" className="border-border" onClick={() => fileInputRef.current?.click()}>
        <Upload className="w-4 h-4 mr-1.5" /> Importar Planilha (CSV)
      </Button>
    </>
  );
}
