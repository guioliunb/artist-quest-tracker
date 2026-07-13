import { useMemo, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { ProgressBar } from '@/components/ProgressBar';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FinanceEntryDialog } from './FinanceEntryDialog';
import { CsvImportButton } from './CsvImportButton';
import {
  FINANCE_CATEGORY_LABELS,
  FINANCE_CATEGORY_ORDER,
  FINANCE_ENTRY_TYPE_LABELS,
  FINANCE_STATUS_LABELS,
  FinanceCategory,
  FinanceEntryType,
  FinanceStatus,
} from '@/types';
import { formatCurrency, formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, BellRing, Plus, Wallet } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_TEXT_COLOR: Record<FinanceStatus, string> = {
  previsto: 'text-muted-foreground',
  pago: 'text-status-completed',
  recebido: 'text-status-completed',
  atrasado: 'text-status-delayed',
};

function FinanceStatusBadge({ status }: { status: FinanceStatus }) {
  return (
    <span className={cn('text-xs font-medium', STATUS_TEXT_COLOR[status])}>
      {FINANCE_STATUS_LABELS[status]}
    </span>
  );
}

function FinanceStatTile({ label, value, icon: Icon, accent }: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
      <div className={cn('w-9 h-9 rounded-md bg-accent flex items-center justify-center shrink-0', accent)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="font-display font-bold text-lg text-foreground tabular-nums leading-none truncate">{value}</div>
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export function FinanceTab({ projectId }: { projectId: string }) {
  const { financeEntries, budgetLines, addCalendarEvent } = useProject();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<FinanceEntryType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<FinanceCategory | 'all'>('all');

  const entries = useMemo(() => financeEntries.filter(e => e.projectId === projectId), [financeEntries, projectId]);
  const budgets = useMemo(() => budgetLines.filter(b => b.projectId === projectId), [budgetLines, projectId]);

  const totalPrevisto = entries.filter(e => e.status === 'previsto').reduce((sum, e) => sum + e.amount, 0);
  const totalRealizado = entries.filter(e => e.status === 'pago' || e.status === 'recebido').reduce((sum, e) => sum + e.amount, 0);
  const saldo = entries
    .filter(e => e.status === 'pago' || e.status === 'recebido')
    .reduce((sum, e) => sum + (e.type === 'receita' ? e.amount : -e.amount), 0);
  const emAtraso = entries.filter(e => e.status === 'atrasado');

  const pendingEntries = entries
    .filter(e => e.status === 'previsto' || e.status === 'atrasado')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const createReminder = (entryId: string, description: string, dueDate: string) => {
    addCalendarEvent({
      id: `ce-reminder-${Date.now()}`,
      projectId,
      type: 'lembrete',
      title: `Vencimento: ${description}`,
      date: dueDate,
      sourceFinanceEntryId: entryId,
    });
    toast.success('Lembrete criado na Agenda');
  };

  const filteredEntries = entries
    .filter(e => filterType === 'all' || e.type === filterType)
    .filter(e => filterCategory === 'all' || e.category === filterCategory)
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate));

  return (
    <div className="space-y-8">
      {/* KPI row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FinanceStatTile label="Previsto" value={formatCurrency(totalPrevisto)} icon={Wallet} accent="text-status-in-progress" />
        <FinanceStatTile label="Realizado" value={formatCurrency(totalRealizado)} icon={ArrowUpCircle} accent="text-status-completed" />
        <FinanceStatTile label="Saldo" value={formatCurrency(saldo)} icon={ArrowDownCircle} accent={saldo >= 0 ? 'text-status-completed' : 'text-status-delayed'} />
        <FinanceStatTile label="Em atraso" value={String(emAtraso.length)} icon={AlertTriangle} accent="text-status-delayed" />
      </section>

      {/* Orçado x Realizado */}
      <section className="bg-card rounded-lg border border-border p-5">
        <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
          Orçado x Realizado
        </h2>
        {budgets.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhum orçamento definido para este projeto.</p>
        ) : (
          <div className="space-y-4">
            {budgets.map(b => {
              const realized = entries
                .filter(e => e.category === b.category && e.type === 'despesa' && e.status === 'pago')
                .reduce((sum, e) => sum + e.amount, 0);
              const pct = b.plannedAmount > 0 ? Math.round((realized / b.plannedAmount) * 100) : 0;
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-foreground font-medium">{FINANCE_CATEGORY_LABELS[b.category]}</span>
                    <span className="text-muted-foreground">{formatCurrency(realized)} / {formatCurrency(b.plannedAmount)}</span>
                  </div>
                  <ProgressBar value={Math.min(pct, 100)} variant={pct > 100 ? 'delayed' : 'in-progress'} size="sm" />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Contas a pagar/receber */}
      <section className="bg-card rounded-lg border border-border p-5">
        <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
          Contas a Pagar e Receber
        </h2>
        {pendingEntries.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhuma conta pendente.</p>
        ) : (
          <div>
            {pendingEntries.map(e => (
              <div key={e.id} className="flex items-center gap-4 py-2.5 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-foreground truncate block">{e.description}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {FINANCE_CATEGORY_LABELS[e.category]} · Vencimento: {formatDate(e.dueDate)}
                  </span>
                </div>
                <FinanceStatusBadge status={e.status} />
                <span className={cn('text-sm font-medium tabular-nums w-24 text-right', e.type === 'receita' ? 'text-status-completed' : 'text-foreground')}>
                  {e.type === 'receita' ? '+' : '-'}{formatCurrency(e.amount)}
                </span>
                <button
                  onClick={() => createReminder(e.id, e.description, e.dueDate)}
                  title="Criar lembrete na Agenda"
                  className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                >
                  <BellRing className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lançamentos */}
      <section className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Lançamentos
          </h2>
          <div className="flex items-center gap-2">
            <CsvImportButton projectId={projectId} />
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Novo Lançamento
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          <button onClick={() => setFilterType('all')} className={cn('px-2.5 py-1 rounded text-xs font-medium transition-colors', filterType === 'all' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}>Todos</button>
          {Object.entries(FINANCE_ENTRY_TYPE_LABELS).map(([v, l]) => (
            <button key={v} onClick={() => setFilterType(v as FinanceEntryType)} className={cn('px-2.5 py-1 rounded text-xs font-medium transition-colors', filterType === v ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}>{l}</button>
          ))}
          <span className="text-muted-foreground/40 mx-1">·</span>
          <button onClick={() => setFilterCategory('all')} className={cn('px-2.5 py-1 rounded text-xs font-medium transition-colors', filterCategory === 'all' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}>Todas categorias</button>
          {FINANCE_CATEGORY_ORDER.map(c => (
            <button key={c} onClick={() => setFilterCategory(c)} className={cn('px-2.5 py-1 rounded text-xs font-medium transition-colors', filterCategory === c ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}>{FINANCE_CATEGORY_LABELS[c]}</button>
          ))}
        </div>

        {filteredEntries.length === 0 ? (
          <EmptyState
            illustration="milestones"
            title="Nenhum lançamento"
            description="Registre receitas e despesas manualmente ou importe uma planilha CSV."
            action={{ label: 'Novo Lançamento', onClick: () => setDialogOpen(true) }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="text-foreground">
                    {e.description}
                    {e.attachmentName && <span className="block text-[11px] text-muted-foreground">📎 {e.attachmentName}</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{FINANCE_CATEGORY_LABELS[e.category]}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(e.dueDate)}</TableCell>
                  <TableCell><FinanceStatusBadge status={e.status} /></TableCell>
                  <TableCell className={cn('text-right font-medium tabular-nums', e.type === 'receita' ? 'text-status-completed' : 'text-foreground')}>
                    {e.type === 'receita' ? '+' : '-'}{formatCurrency(e.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <FinanceEntryDialog open={dialogOpen} onOpenChange={setDialogOpen} projectId={projectId} />
    </div>
  );
}
