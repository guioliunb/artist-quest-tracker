import { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { ContactDialog } from './ContactDialog';
import { CONTACT_CATEGORY_LABELS, CONTACT_CATEGORY_ORDER, ContactCategory } from '@/types';
import { buildWhatsAppLink, formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Mail, MessageCircle, Plus, Search, Trash2 } from 'lucide-react';

const CATEGORY_BORDER_COLOR: Record<ContactCategory, string> = {
  produtor: 'border-l-blue-500/60',
  booker: 'border-l-orange-500/60',
  imprensa: 'border-l-purple-500/60',
  marca: 'border-l-emerald-500/60',
  outro: 'border-l-muted-foreground/50',
};

const CATEGORY_BADGE_COLOR: Record<ContactCategory, string> = {
  produtor: 'bg-blue-500/10 text-blue-500',
  booker: 'bg-orange-500/10 text-orange-500',
  imprensa: 'bg-purple-500/10 text-purple-500',
  marca: 'bg-emerald-500/10 text-emerald-500',
  outro: 'bg-accent text-muted-foreground',
};

export function ContactsTab({ projectId }: { projectId: string }) {
  const { industryContacts, deleteIndustryContact } = useProject();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<ContactCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const contacts = industryContacts
    .filter(c => c.projectId === projectId)
    .filter(c => filterCategory === 'all' || c.category === filterCategory)
    .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.company?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar contatos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Novo Contato
        </Button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => setFilterCategory('all')}
          className={cn('px-2.5 py-1 rounded text-xs font-medium transition-colors', filterCategory === 'all' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}
        >
          Todos
        </button>
        {CONTACT_CATEGORY_ORDER.map(c => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={cn('px-2.5 py-1 rounded text-xs font-medium transition-colors', filterCategory === c ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            {CONTACT_CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {contacts.length === 0 ? (
        <div className="bg-card rounded-lg border border-border">
          <EmptyState
            illustration="projetos"
            title="Nenhum contato por aqui"
            description="Cadastre produtores, bookers, imprensa e marcas relevantes para este projeto e fale com eles direto pelo WhatsApp ou e-mail."
            action={{ label: 'Novo Contato', onClick: () => setDialogOpen(true) }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={cn('bg-card rounded-lg border border-border border-l-[3px] p-4 flex items-center gap-4', CATEGORY_BORDER_COLOR[contact.category])}
            >
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0 font-display font-bold text-sm text-foreground">
                {contact.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-sm font-medium text-foreground truncate">{contact.name}</span>
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0', CATEGORY_BADGE_COLOR[contact.category])}>
                    {CONTACT_CATEGORY_LABELS[contact.category]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {[contact.role, contact.company].filter(Boolean).join(' · ') || '—'}
                </p>
                {contact.lastContactDate && (
                  <span className="text-[11px] text-muted-foreground">Último contato: {formatDate(contact.lastContactDate)}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {contact.whatsapp && (
                  <a
                    href={buildWhatsAppLink(contact.whatsapp, `Olá ${contact.name}, tudo bem?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Conversar no WhatsApp"
                    className="w-8 h-8 rounded-md flex items-center justify-center text-status-completed hover:bg-status-completed/10 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    title="Enviar e-mail"
                    className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => deleteIndustryContact(contact.id)}
                  title="Remover contato"
                  className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-status-delayed hover:bg-status-delayed/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} projectId={projectId} />
    </div>
  );
}
