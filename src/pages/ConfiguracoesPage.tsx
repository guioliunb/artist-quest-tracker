import { AppLayout } from '@/components/AppLayout';
import { useProject } from '@/contexts/ProjectContext';
import { CAREER_PHASE_LABELS, HYPOTHESIS_STATUS_LABELS, CareerPhase, HypothesisStatus } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Pencil } from 'lucide-react';
import { useState } from 'react';

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-4">
      <h2 className="font-display font-semibold text-sm text-foreground mb-4">{title}</h2>
      {children}
    </div>
  );
}

function EditableField({ label, value, onChange, type = 'text' }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'textarea';
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    onChange(draft);
    setEditing(false);
    toast.success(`${label} atualizado`);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="flex items-start justify-between py-3 border-b border-border last:border-0 gap-4 group cursor-pointer" onClick={() => { setDraft(value); setEditing(true); }}>
        <span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground text-right">{value || '—'}</span>
          <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-3 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground mb-2 block">{label}</span>
      {type === 'textarea' ? (
        <Textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          className="bg-background border-border text-foreground text-sm mb-2"
          rows={3}
          autoFocus
        />
      ) : (
        <Input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          className="bg-background border-border text-foreground text-sm mb-2"
          autoFocus
        />
      )}
      <div className="flex gap-2">
        <button onClick={save} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
          <Save className="w-3 h-3" /> Salvar
        </button>
        <button onClick={cancel} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0 gap-4">
      <span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
      <Select value={value} onValueChange={v => { onChange(v); toast.success(`${label} atualizado`); }}>
        <SelectTrigger className="w-[220px] bg-background border-border text-foreground text-sm h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {options.map(o => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-border last:border-0 gap-4">
      <span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}

export default function ConfiguracoesPage() {
  const { activeProject, activeArtist, updateProject, updateArtist } = useProject();

  const careerPhaseOptions = Object.entries(CAREER_PHASE_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const hypothesisOptions = Object.entries(HYPOTHESIS_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const quarterOptions = [1, 2, 3, 4].map(q => ({ value: String(q), label: `Q${q}` }));

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-3xl">
        <h1 className="font-display font-bold text-2xl text-foreground mb-8">Configurações</h1>

        <SettingSection title="Projeto">
          <EditableField label="Nome do Projeto" value={activeProject.name} onChange={v => updateProject({ name: v })} />
          <SelectField
            label="Trimestre Atual"
            value={String(activeProject.currentQuarter)}
            options={quarterOptions}
            onChange={v => updateProject({ currentQuarter: Number(v) })}
          />
          <EditableField label="Estágio" value={activeProject.stage} onChange={v => updateProject({ stage: v })} />
          <SelectField
            label="Fase da Carreira"
            value={activeProject.careerPhase}
            options={careerPhaseOptions}
            onChange={v => updateProject({ careerPhase: v as CareerPhase })}
          />
          <FieldRow label="Criado em" value={activeProject.createdAt} />
          <EditableField
            label="Grande Meta"
            value={activeProject.bigGoal || ''}
            onChange={v => updateProject({ bigGoal: v })}
            type="textarea"
          />
          <EditableField
            label="Objetivo do Trimestre"
            value={activeProject.quarterGoal || ''}
            onChange={v => updateProject({ quarterGoal: v })}
            type="textarea"
          />
        </SettingSection>

        <SettingSection title="Artista">
          <EditableField label="Nome" value={activeArtist.name} onChange={v => updateArtist({ name: v })} />
          <EditableField label="Gênero" value={activeArtist.genre || ''} onChange={v => updateArtist({ genre: v })} />
          {activeProject.positioning && (
            <>
              <EditableField
                label="Posicionamento"
                value={activeProject.positioning.valueProposition}
                onChange={v => updateProject({
                  positioning: { ...activeProject.positioning!, valueProposition: v }
                })}
                type="textarea"
              />
              <EditableField
                label="Território Cultural"
                value={activeProject.positioning.culturalTerritory}
                onChange={v => updateProject({
                  positioning: { ...activeProject.positioning!, culturalTerritory: v }
                })}
              />
            </>
          )}
          {activeProject.audience && (
            <>
              <EditableField
                label="Faixa Etária"
                value={activeProject.audience.ageRange}
                onChange={v => updateProject({
                  audience: { ...activeProject.audience!, ageRange: v }
                })}
              />
              <EditableField
                label="Cena Cultural"
                value={activeProject.audience.culturalScene}
                onChange={v => updateProject({
                  audience: { ...activeProject.audience!, culturalScene: v }
                })}
              />
            </>
          )}
        </SettingSection>

        <SettingSection title="Estratégia">
          {activeProject.dna && (
            <>
              <EditableField
                label="Conceito Artístico"
                value={activeProject.dna.artisticConcept}
                onChange={v => updateProject({ dna: { ...activeProject.dna!, artisticConcept: v } })}
                type="textarea"
              />
              <EditableField
                label="Narrativa"
                value={activeProject.dna.artisticNarrative}
                onChange={v => updateProject({ dna: { ...activeProject.dna!, artisticNarrative: v } })}
                type="textarea"
              />
              <EditableField
                label="Hipótese Artística"
                value={activeProject.dna.artisticHypothesis}
                onChange={v => updateProject({ dna: { ...activeProject.dna!, artisticHypothesis: v } })}
                type="textarea"
              />
              <SelectField
                label="Status da Hipótese"
                value={activeProject.dna.hypothesisStatus}
                options={hypothesisOptions}
                onChange={v => updateProject({ dna: { ...activeProject.dna!, hypothesisStatus: v as HypothesisStatus } })}
              />
            </>
          )}
        </SettingSection>

        <SettingSection title="Conta">
          <p className="text-xs text-muted-foreground">
            Funcionalidades de conta, autenticação e gerenciamento de usuários estarão disponíveis após a integração com backend.
          </p>
        </SettingSection>
      </div>
    </AppLayout>
  );
}
