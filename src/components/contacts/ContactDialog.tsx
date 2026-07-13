import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProject } from '@/contexts/ProjectContext';
import { CONTACT_CATEGORY_LABELS, CONTACT_CATEGORY_ORDER, ContactCategory } from '@/types';
import { Plus } from 'lucide-react';

export function ContactDialog({ open, onOpenChange, projectId }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}) {
  const { addIndustryContact } = useProject();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ContactCategory>('produtor');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => {
    setName('');
    setCategory('produtor');
    setCompany('');
    setRole('');
    setWhatsapp('');
    setEmail('');
    setNotes('');
  };

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (!whatsapp.trim() && !email.trim()) {
      toast.error('Informe pelo menos um WhatsApp ou e-mail para contato');
      return;
    }
    addIndustryContact({
      id: `ic-${Date.now()}`,
      projectId,
      name: name.trim(),
      category,
      company: company.trim() || undefined,
      role: role.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    toast.success('Contato adicionado');
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="bg-card border-border text-foreground max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Novo Contato</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Nome *</label>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-background border-border text-foreground" placeholder="Ex: Marina Costa" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Categoria</label>
              <Select value={category} onValueChange={v => setCategory(v as ContactCategory)}>
                <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {CONTACT_CATEGORY_ORDER.map(c => <SelectItem key={c} value={c}>{CONTACT_CATEGORY_LABELS[c]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Empresa</label>
              <Input value={company} onChange={e => setCompany(e.target.value)} className="bg-background border-border text-foreground" placeholder="Ex: Estúdio Voz Digital" />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Função</label>
            <Input value={role} onChange={e => setRole(e.target.value)} className="bg-background border-border text-foreground" placeholder="Ex: Produtora musical" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">WhatsApp</label>
              <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="bg-background border-border text-foreground" placeholder="+55 11 91234-5678" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">E-mail</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-background border-border text-foreground" placeholder="nome@empresa.com" />
            </div>
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
