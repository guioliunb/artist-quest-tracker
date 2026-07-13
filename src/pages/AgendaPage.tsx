import { useMemo, useState } from 'react';
import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfWeek,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppLayout } from '@/components/AppLayout';
import { EmptyState } from '@/components/EmptyState';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProject } from '@/contexts/ProjectContext';
import { EventDetailDialog } from '@/components/agenda/EventDetailDialog';
import { CalendarEvent, CalendarEventType, CALENDAR_EVENT_TYPE_LABELS, Milestone } from '@/types';
import { cn } from '@/lib/utils';
import { LayoutList, CalendarDays, Rows3, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

type ViewMode = 'mes' | 'semana' | 'lista';

const MANUAL_EVENT_TYPES: CalendarEventType[] = ['show', 'lancamento', 'reuniao', 'avaliacao_trimestral'];

const TYPE_DOT: Record<CalendarEventType, string> = {
  show: 'bg-status-in-progress',
  lancamento: 'bg-primary',
  prazo_marco: 'bg-status-delayed',
  reuniao: 'bg-muted-foreground',
  avaliacao_trimestral: 'bg-status-completed',
  lembrete: 'bg-status-in-progress',
};

function deriveMilestoneEvents(milestones: Milestone[]): CalendarEvent[] {
  return milestones
    .filter(m => m.deadline)
    .map(m => ({
      id: `milestone-${m.id}`,
      projectId: m.projectId,
      type: 'prazo_marco' as const,
      title: m.title,
      date: m.deadline as string,
      sourceMilestoneId: m.id,
    }));
}

function EventCard({ event, onDelete, onClick }: { event: CalendarEvent; onDelete?: () => void; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn('flex items-center gap-3 py-2.5 border-b border-border last:border-0', onClick && 'cursor-pointer hover:bg-accent/30 -mx-2 px-2 rounded-md transition-colors')}
    >
      <span className={cn('w-2 h-2 rounded-full shrink-0', TYPE_DOT[event.type])} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">{event.title}</span>
          <span className="text-[11px] text-muted-foreground shrink-0">{CALENDAR_EVENT_TYPE_LABELS[event.type]}</span>
        </div>
        {event.notes && <p className="text-xs text-muted-foreground mt-0.5">{event.notes}</p>}
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{format(new Date(event.date), 'dd MMM yyyy', { locale: ptBR })}</span>
      {onDelete && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-muted-foreground hover:text-status-delayed transition-colors shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function NewEventDialog({ open, onOpenChange, projectId }: { open: boolean; onOpenChange: (o: boolean) => void; projectId: string }) {
  const { addCalendarEvent } = useProject();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CalendarEventType>('show');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => {
    setTitle('');
    setType('show');
    setDate('');
    setNotes('');
  };

  const handleCreate = () => {
    if (!title.trim() || !date) {
      toast.error('Título e data são obrigatórios');
      return;
    }
    addCalendarEvent({ id: `ce-${Date.now()}`, projectId, type, title, date, notes: notes || undefined });
    toast.success('Evento adicionado à agenda');
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="bg-card border-border text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Novo Evento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Título *</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-background border-border text-foreground" placeholder="Ex: Show na Casa X" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Tipo</label>
            <Select value={type} onValueChange={v => setType(v as CalendarEventType)}>
              <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {MANUAL_EVENT_TYPES.map(t => <SelectItem key={t} value={t}>{CALENDAR_EVENT_TYPE_LABELS[t]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Data *</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-background border-border text-foreground" />
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

export default function AgendaPage() {
  const { activeProject, calendarEvents, deleteCalendarEvent, milestones } = useProject();
  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [filterType, setFilterType] = useState<CalendarEventType | 'all'>('all');
  const [showMilestoneDeadlines, setShowMilestoneDeadlines] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [weekAnchor, setWeekAnchor] = useState(new Date());

  const projectMilestones = milestones.filter(m => m.projectId === activeProject.id);
  const projectManualEvents = calendarEvents.filter(e => e.projectId === activeProject.id);

  const allEvents = useMemo(() => {
    const events = [...projectManualEvents];
    if (showMilestoneDeadlines) events.push(...deriveMilestoneEvents(projectMilestones));
    return events;
  }, [projectManualEvents, projectMilestones, showMilestoneDeadlines]);

  const filteredEvents = useMemo(
    () => allEvents.filter(e => filterType === 'all' || e.type === filterType).sort((a, b) => a.date.localeCompare(b.date)),
    [allEvents, filterType],
  );

  const eventDates = filteredEvents.map(e => new Date(e.date));
  const eventsForSelectedDay = selectedDay ? filteredEvents.filter(e => isSameDay(new Date(e.date), selectedDay)) : [];
  const eventsInVisibleMonth = filteredEvents.filter(e => isSameMonth(new Date(e.date), visibleMonth));

  const weekStart = startOfWeek(weekAnchor, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekAnchor, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-5xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-foreground">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Agenda</h1>
            <p className="text-sm text-muted-foreground mt-1">{activeProject.name}</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Novo Evento
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-1">
            {([
              ['lista', LayoutList],
              ['semana', Rows3],
              ['mes', CalendarDays],
            ] as [ViewMode, typeof LayoutList][]).map(([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn('p-2 rounded-md transition-colors', viewMode === mode ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch checked={showMilestoneDeadlines} onCheckedChange={setShowMilestoneDeadlines} id="toggle-deadlines" />
              <label htmlFor="toggle-deadlines" className="text-xs text-muted-foreground">Mostrar prazos de marcos na Agenda</label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-6 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={cn('px-2.5 py-1 rounded text-xs font-medium transition-colors', filterType === 'all' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            Todos
          </button>
          {(Object.keys(CALENDAR_EVENT_TYPE_LABELS) as CalendarEventType[]).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={cn('px-2.5 py-1 rounded text-xs font-medium transition-colors', filterType === t ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              {CALENDAR_EVENT_TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {viewMode === 'lista' && (
          <div className={cn('bg-card rounded-lg border border-border', filteredEvents.length > 0 && 'p-5')}>
            {filteredEvents.length === 0 ? (
              <EmptyState
                illustration="agenda"
                title="Agenda vazia"
                description="Marque um show, lançamento ou reunião, ou ative os prazos de marcos para vê-los aqui."
                action={{ label: 'Novo Evento', onClick: () => setDialogOpen(true) }}
              />
            ) : (
              filteredEvents.map(e => (
                <EventCard
                  key={e.id}
                  event={e}
                  onDelete={e.sourceMilestoneId ? undefined : () => deleteCalendarEvent(e.id)}
                  onClick={() => setDetailEvent(e)}
                />
              ))
            )}
          </div>
        )}

        {viewMode === 'mes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border border-border p-3">
              <Calendar
                mode="single"
                month={visibleMonth}
                onMonthChange={setVisibleMonth}
                selected={selectedDay}
                onSelect={setSelectedDay}
                locale={ptBR}
                modifiers={{ hasEvent: eventDates }}
                modifiersClassNames={{ hasEvent: 'font-bold underline decoration-2 decoration-primary underline-offset-4' }}
              />
            </div>
            <div className="bg-card rounded-lg border border-border p-5">
              <h3 className="font-display font-semibold text-sm text-foreground mb-3">
                {selectedDay ? format(selectedDay, "dd 'de' MMMM", { locale: ptBR }) : format(visibleMonth, 'MMMM yyyy', { locale: ptBR })}
              </h3>
              {(selectedDay ? eventsForSelectedDay : eventsInVisibleMonth).length === 0 ? (
                <p className="text-xs text-muted-foreground py-4">Sem eventos neste período.</p>
              ) : (
                (selectedDay ? eventsForSelectedDay : eventsInVisibleMonth).map(e => (
                  <EventCard key={e.id} event={e} onDelete={e.sourceMilestoneId ? undefined : () => deleteCalendarEvent(e.id)} onClick={() => setDetailEvent(e)} />
                ))
              )}
            </div>
          </div>
        )}

        {viewMode === 'semana' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setWeekAnchor(addWeeks(weekAnchor, -1))} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-foreground">
                {format(weekStart, 'dd MMM', { locale: ptBR })} — {format(weekEnd, 'dd MMM yyyy', { locale: ptBR })}
              </span>
              <button onClick={() => setWeekAnchor(addWeeks(weekAnchor, 1))} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
              {weekDays.map(day => {
                const dayEvents = filteredEvents.filter(e => isSameDay(new Date(e.date), day));
                return (
                  <div key={day.toISOString()} className="bg-card rounded-lg border border-border p-3 min-h-[120px]">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {format(day, 'EEE dd', { locale: ptBR })}
                    </span>
                    <div className="mt-2 space-y-2">
                      {dayEvents.map(e => (
                        <div
                          key={e.id}
                          onClick={() => setDetailEvent(e)}
                          className="text-xs bg-accent/60 rounded px-2 py-1.5 cursor-pointer hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', TYPE_DOT[e.type])} />
                            <span className="text-foreground truncate">{e.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <NewEventDialog open={dialogOpen} onOpenChange={setDialogOpen} projectId={activeProject.id} />
      <EventDetailDialog open={detailEvent !== null} onOpenChange={(o) => !o && setDetailEvent(null)} event={detailEvent} />
    </AppLayout>
  );
}
