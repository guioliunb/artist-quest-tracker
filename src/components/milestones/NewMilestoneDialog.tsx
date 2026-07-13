import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProject } from '@/contexts/ProjectContext';
import { PILLAR_LABELS, PILLAR_ORDER, PRIORITY_LABELS, PillarType, Priority } from '@/types';
import { Plus } from 'lucide-react';

export function NewMilestoneDialog({ open, onOpenChange, projectId }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}) {
  const { addMilestones } = useProject();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pillarType, setPillarType] = useState<PillarType>('administrativo');
  const [priority, setPriority] = useState<Priority>('media');
  const [deadline, setDeadline] = useState('');
  const [responsible, setResponsible] = useState('');

  const reset = () => {
    setTitle('');
    setDescription('');
    setPillarType('administrativo');
    setPriority('media');
    setDeadline('');
    setResponsible('');
  };

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }
    addMilestones([{
      id: `m-${Date.now()}`,
      projectId,
      pillarType,
      title: title.trim(),
      description: description.trim() || 'Marco cadastrado manualmente.',
      status: 'nao_iniciado',
      progress: 0,
      priority,
      deadline: deadline || undefined,
      responsible: responsible.trim() || undefined,
      order: 1,
    }]);
    toast.success('Marco criado');
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="bg-card border-border text-foreground max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Novo Marco</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Título *</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-background border-border text-foreground" placeholder="Ex: Definição do Público do Projeto" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Descrição</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} className="bg-background border-border text-foreground" rows={2} />
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Prazo</label>
              <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="bg-background border-border text-foreground" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Responsável</label>
              <Input value={responsible} onChange={e => setResponsible(e.target.value)} className="bg-background border-border text-foreground" placeholder="Ex: Consultor" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Criar Marco
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
