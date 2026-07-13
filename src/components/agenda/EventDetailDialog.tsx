import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { mockUser } from '@/data/mockData';
import { CreateMilestoneDialog } from './CreateMilestoneDialog';
import { CalendarEvent, CALENDAR_EVENT_TYPE_LABELS } from '@/types';
import { Plus, X, Paperclip, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">{children}</h3>;
}

export function EventDetailDialog({ open, onOpenChange, event }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
}) {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, eventComments, addEventComment } = useProject();
  const [participantInput, setParticipantInput] = useState('');
  const [checklistInput, setChecklistInput] = useState('');
  const [nextActionInput, setNextActionInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [decisionsDraft, setDecisionsDraft] = useState<string | null>(null);
  const [milestoneDraftIndex, setMilestoneDraftIndex] = useState<number | null>(null);

  if (!event) return null;

  const live = calendarEvents.find(e => e.id === event.id) ?? event;
  const isPersisted = calendarEvents.some(e => e.id === event.id);

  const upsert = (patch: Partial<CalendarEvent>) => {
    if (isPersisted) {
      updateCalendarEvent(event.id, patch);
    } else {
      addCalendarEvent({ ...live, ...patch });
    }
  };

  const comments = eventComments.filter(c => c.eventId === event.id);

  const addParticipant = () => {
    if (!participantInput.trim()) return;
    upsert({ participants: [...(live.participants ?? []), participantInput.trim()] });
    setParticipantInput('');
  };

  const removeParticipant = (name: string) => {
    upsert({ participants: (live.participants ?? []).filter(p => p !== name) });
  };

  const addChecklistItem = () => {
    if (!checklistInput.trim()) return;
    upsert({ checklist: [...(live.checklist ?? []), { id: `chk-${Date.now()}`, label: checklistInput.trim(), completed: false }] });
    setChecklistInput('');
  };

  const toggleChecklistItem = (id: string) => {
    upsert({ checklist: (live.checklist ?? []).map(i => (i.id === id ? { ...i, completed: !i.completed } : i)) });
  };

  const addAttachment = (name?: string) => {
    if (!name) return;
    upsert({ attachmentNames: [...(live.attachmentNames ?? []), name] });
  };

  const removeAttachment = (name: string) => {
    upsert({ attachmentNames: (live.attachmentNames ?? []).filter(a => a !== name) });
  };

  const addNextAction = () => {
    if (!nextActionInput.trim()) return;
    upsert({ nextActions: [...(live.nextActions ?? []), nextActionInput.trim()] });
    setNextActionInput('');
  };

  const removeNextAction = (index: number) => {
    upsert({ nextActions: (live.nextActions ?? []).filter((_, i) => i !== index) });
  };

  const saveDecisions = () => {
    if (decisionsDraft === null) return;
    upsert({ decisions: decisionsDraft || undefined });
    setDecisionsDraft(null);
  };

  const addComment = () => {
    if (!commentInput.trim()) return;
    addEventComment({ id: `ec-${Date.now()}`, eventId: event.id, userName: mockUser.name, content: commentInput.trim(), createdAt: new Date().toISOString() });
    setCommentInput('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
            <span>{CALENDAR_EVENT_TYPE_LABELS[live.type]}</span>
            <span>·</span>
            <span>{format(new Date(live.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
          <DialogTitle className="font-display text-lg">{live.title}</DialogTitle>
          {live.notes && <p className="text-sm text-muted-foreground mt-1">{live.notes}</p>}
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Participantes */}
          <div>
            <SectionLabel>Participantes</SectionLabel>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(live.participants ?? []).map(p => (
                <span key={p} className="text-xs bg-accent px-2 py-1 rounded-full text-foreground flex items-center gap-1.5">
                  {p}
                  <button onClick={() => removeParticipant(p)} className="text-muted-foreground hover:text-status-delayed">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(live.participants ?? []).length === 0 && <span className="text-xs text-muted-foreground">Nenhum participante adicionado.</span>}
            </div>
            <div className="flex gap-2">
              <Input value={participantInput} onChange={e => setParticipantInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addParticipant()} placeholder="Nome do participante" className="bg-background border-border text-foreground h-8 text-sm" />
              <Button size="sm" variant="outline" className="border-border shrink-0" onClick={addParticipant}><Plus className="w-3.5 h-3.5" /></Button>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <SectionLabel>Checklist</SectionLabel>
            <div className="space-y-1.5 mb-2">
              {(live.checklist ?? []).map(item => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={item.completed} onCheckedChange={() => toggleChecklistItem(item.id)} />
                  <span className={cn('text-sm', item.completed ? 'text-muted-foreground line-through' : 'text-foreground')}>{item.label}</span>
                </label>
              ))}
              {(live.checklist ?? []).length === 0 && <span className="text-xs text-muted-foreground">Sem itens de checklist.</span>}
            </div>
            <div className="flex gap-2">
              <Input value={checklistInput} onChange={e => setChecklistInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addChecklistItem()} placeholder="Novo item" className="bg-background border-border text-foreground h-8 text-sm" />
              <Button size="sm" variant="outline" className="border-border shrink-0" onClick={addChecklistItem}><Plus className="w-3.5 h-3.5" /></Button>
            </div>
          </div>

          {/* Anexos */}
          <div>
            <SectionLabel>Anexos</SectionLabel>
            <div className="space-y-1 mb-2">
              {(live.attachmentNames ?? []).map(name => (
                <div key={name} className="flex items-center gap-2 text-sm text-foreground">
                  <Paperclip className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate flex-1">{name}</span>
                  <button onClick={() => removeAttachment(name)} className="text-muted-foreground hover:text-status-delayed shrink-0"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
              {(live.attachmentNames ?? []).length === 0 && <span className="text-xs text-muted-foreground">Nenhum arquivo anexado.</span>}
            </div>
            <Input type="file" onChange={e => addAttachment(e.target.files?.[0]?.name)} className="bg-background border-border text-foreground h-9 text-xs" />
          </div>

          {/* Decisões */}
          <div>
            <SectionLabel>Decisões Tomadas</SectionLabel>
            <Textarea
              value={decisionsDraft ?? live.decisions ?? ''}
              onChange={e => setDecisionsDraft(e.target.value)}
              onBlur={saveDecisions}
              placeholder="Registre as decisões tomadas neste evento"
              rows={2}
              className="bg-background border-border text-foreground"
            />
          </div>

          {/* Próximas Ações */}
          <div>
            <SectionLabel>Próximas Ações</SectionLabel>
            <div className="space-y-1.5 mb-2">
              {(live.nextActions ?? []).map((action, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="flex-1">{action}</span>
                  <button onClick={() => setMilestoneDraftIndex(i)} title="Criar marco a partir desta ação" className="text-muted-foreground hover:text-primary shrink-0"><Target className="w-3.5 h-3.5" /></button>
                  <button onClick={() => removeNextAction(i)} className="text-muted-foreground hover:text-status-delayed shrink-0"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
              {(live.nextActions ?? []).length === 0 && <span className="text-xs text-muted-foreground">Nenhuma próxima ação registrada.</span>}
            </div>
            <div className="flex gap-2">
              <Input value={nextActionInput} onChange={e => setNextActionInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNextAction()} placeholder="Nova ação" className="bg-background border-border text-foreground h-8 text-sm" />
              <Button size="sm" variant="outline" className="border-border shrink-0" onClick={addNextAction}><Plus className="w-3.5 h-3.5" /></Button>
            </div>
          </div>

          {/* Comentários */}
          <div>
            <SectionLabel>Comentários</SectionLabel>
            <div className="space-y-2 mb-2">
              {comments.map(c => (
                <div key={c.id} className="text-sm bg-accent/40 rounded-md px-3 py-2">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-medium text-foreground text-xs">{c.userName}</span>
                    <span className="text-[10px] text-muted-foreground">{format(new Date(c.createdAt), 'dd MMM, HH:mm', { locale: ptBR })}</span>
                  </div>
                  <p className="text-foreground">{c.content}</p>
                </div>
              ))}
              {comments.length === 0 && <span className="text-xs text-muted-foreground">Nenhum comentário ainda.</span>}
            </div>
            <div className="flex gap-2">
              <Textarea value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="Escreva um comentário" rows={2} className="bg-background border-border text-foreground text-sm" />
              <Button size="sm" variant="outline" className="border-border shrink-0 self-end" onClick={addComment}><Plus className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {milestoneDraftIndex !== null && (
        <CreateMilestoneDialog
          open={milestoneDraftIndex !== null}
          onOpenChange={(o) => !o && setMilestoneDraftIndex(null)}
          projectId={live.projectId}
          defaultTitle={live.nextActions?.[milestoneDraftIndex] ?? ''}
          defaultDeadline={live.date}
          sourceEventId={live.id}
          onCreated={() => {
            if (milestoneDraftIndex !== null) removeNextAction(milestoneDraftIndex);
            setMilestoneDraftIndex(null);
          }}
        />
      )}
    </Dialog>
  );
}
