import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProject } from '@/contexts/ProjectContext';
import {
  FINANCE_CATEGORY_LABELS,
  FINANCE_CATEGORY_ORDER,
  FINANCE_ENTRY_TYPE_LABELS,
  FINANCE_STATUS_LABELS,
  FinanceCategory,
  FinanceEntry,
  FinanceEntryType,
  FinanceStatus,
} from '@/types';
import { Plus } from 'lucide-react';

const STATUS_OPTIONS_BY_TYPE: Record<FinanceEntryType, FinanceStatus[]> = {
  despesa: ['previsto', 'pago', 'atrasado'],
  receita: ['previsto', 'recebido', 'atrasado'],
};

export function FinanceEntryDialog({ open, onOpenChange, projectId, defaults }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  defaults?: Partial<FinanceEntry>;
}) {
  const { addFinanceEntry } = useProject();
  const [type, setType] = useState<FinanceEntryType>(defaults?.type ?? 'despesa');
  const [category, setCategory] = useState<FinanceCategory>(defaults?.category ?? 'producao');
  const [description, setDescription] = useState(defaults?.description ?? '');
  const [amount, setAmount] = useState(defaults?.amount ? String(defaults.amount) : '');
  const [dueDate, setDueDate] = useState(defaults?.dueDate ?? '');
  const [status, setStatus] = useState<FinanceStatus>(defaults?.status ?? 'previsto');
  const [attachmentName, setAttachmentName] = useState<string | undefined>(defaults?.attachmentName);
  const [notes, setNotes] = useState(defaults?.notes ?? '');

  const reset = () => {
    setType('despesa');
    setCategory('producao');
    setDescription('');
    setAmount('');
    setDueDate('');
    setStatus('previsto');
    setAttachmentName(undefined);
    setNotes('');
  };

  const handleCreate = () => {
    const parsedAmount = Number(amount);
    if (!description.trim() || !dueDate || !parsedAmount || parsedAmount <= 0) {
      toast.error('Descrição, valor e data de vencimento são obrigatórios');
      return;
    }
    addFinanceEntry({
      id: `fe-${Date.now()}`,
      projectId,
      type,
      category,
      description: description.trim(),
      amount: parsedAmount,
      dueDate,
      status,
      paidDate: (status === 'pago' || status === 'recebido') ? new Date().toISOString().split('T')[0] : undefined,
      attachmentName,
      notes: notes.trim() || undefined,
      sourceMilestoneId: defaults?.sourceMilestoneId,
    });
    toast.success('Lançamento adicionado');
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="bg-card border-border text-foreground max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Novo Lançamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Tipo</label>
            <Select value={type} onValueChange={v => {
              const nextType = v as FinanceEntryType;
              setType(nextType);
              setStatus(STATUS_OPTIONS_BY_TYPE[nextType][0]);
            }}>
              <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {Object.entries(FINANCE_ENTRY_TYPE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Descrição *</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} className="bg-background border-border text-foreground" placeholder="Ex: Estúdio de gravação" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Categoria</label>
              <Select value={category} onValueChange={v => setCategory(v as FinanceCategory)}>
                <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {FINANCE_CATEGORY_ORDER.map(c => <SelectItem key={c} value={c}>{FINANCE_CATEGORY_LABELS[c]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Valor (R$) *</label>
              <Input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="bg-background border-border text-foreground" placeholder="0,00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Vencimento *</label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-background border-border text-foreground" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Status</label>
              <Select value={status} onValueChange={v => setStatus(v as FinanceStatus)}>
                <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {STATUS_OPTIONS_BY_TYPE[type].map(s => <SelectItem key={s} value={s}>{FINANCE_STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Comprovante</label>
            <Input type="file" onChange={e => setAttachmentName(e.target.files?.[0]?.name)} className="bg-background border-border text-foreground" />
            {attachmentName && <p className="text-xs text-muted-foreground mt-1">{attachmentName}</p>}
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Notas</label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="bg-background border-border text-foreground" rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
