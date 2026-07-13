import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProject } from '@/contexts/ProjectContext';
import { PILLAR_LABELS, PILLAR_ORDER, PRIORITY_LABELS, PillarType, Priority } from '@/types';
import { Check } from 'lucide-react';

export function CreateMilestoneDialog({ open, onOpenChange, projectId, defaultTitle, defaultDeadline, sourceEventId, onCreated }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  defaultTitle: string;
  defaultDeadline?: string;
  sourceEventId?: string;
  onCreated?: () => void;
}) {
  const { addMilestones } = useProject();
  const [title, setTitle] = useState(defaultTitle);
  const [pillarType, setPillarType] = useState<PillarType>('administrativo');
  const [priority, setPriority] = useState<Priority>('media');
  const [deadline, setDeadline] = useState(defaultDeadline ?? '');

  useEffect(() => {
    if (open) {
      setTitle(defaultTitle);
      setDeadline(defaultDeadline ?? '');
    }
  }, [open, defaultTitle, defaultDeadline]);

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }
    addMilestones([{
      id: `m-event-${Date.now()}`,
      projectId,
      pillarType,
      title: title.trim(),
      description: 'Marco criado a partir de um evento da Agenda.',
      status: 'nao_iniciado',
      progress: 0,
      priority,
      deadline: deadline || undefined,
      order: 1,
      sourceEventId,
    }]);
    toast.success('Marco criado a partir do evento');
    onOpenChange(false);
    onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Criar Marco</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Título *</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-background border-border text-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Pilar</label>
              <Select value={pillarType} onValueChange={v => setPillarType(v as PillarType)}>
                <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {PILLAR_ORDER.map(p => <SelectItem key={p} value={p}>{PILLAR_LABELS[p]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Prioridade</label>
              <Select value={priority} onValueChange={v => setPriority(v as Priority)}>
                <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(PRIORITY_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Prazo</label>
            <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="bg-background border-border text-foreground" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Check className="w-4 h-4 mr-1" /> Criar Marco
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
