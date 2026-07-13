import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProject, useBasePath } from '@/contexts/ProjectContext';
import {
  Artist,
  CAREER_PHASE_LABELS,
  CareerPhase,
  HypothesisStatus,
  PROJECT_TYPE_LABELS,
  PROJECT_TYPE_ORDER,
  Project,
  ProjectAudience,
  ProjectDNA,
  ProjectPositioning,
  ProjectType,
} from '@/types';
import { generateMilestonesFromTemplate } from '@/data/projectTemplates';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

const STEPS = ['Identidade Básica', 'DNA Artístico', 'Posicionamento', 'Público-Alvo', 'Objetivos'];

interface WizardState {
  name: string;
  genre: string;
  bio: string;
  whatsapp: string;
  projectType: ProjectType;
  dna: ProjectDNA;
  positioning: ProjectPositioning;
  audience: ProjectAudience;
  bigGoal: string;
  quarterGoal: string;
  careerPhase: CareerPhase;
}

function emptyState(): WizardState {
  return {
    name: '',
    genre: '',
    bio: '',
    whatsapp: '',
    projectType: 'single',
    dna: {
      artisticConcept: '',
      artisticNarrative: '',
      culturalUniverse: '',
      references: [],
      artisticHypothesis: '',
      hypothesisStatus: 'nao_testada',
    },
    positioning: { mainGenre: '', subGenre: '', culturalTerritory: '', valueProposition: '' },
    audience: { ageRange: '', culturalScene: '', predominantAesthetic: '', behavior: '', mainPlatforms: [] },
    bigGoal: '',
    quarterGoal: '',
    careerPhase: 'definicao_mda',
  };
}

function stateFromExisting(project: Project, artist: Artist): WizardState {
  return {
    name: artist.name,
    genre: artist.genre || '',
    bio: artist.bio || '',
    whatsapp: artist.whatsapp || '',
    projectType: project.projectType,
    dna: project.dna ?? emptyState().dna,
    positioning: project.positioning ?? emptyState().positioning,
    audience: project.audience ?? emptyState().audience,
    bigGoal: project.bigGoal || '',
    quarterGoal: project.quarterGoal || '',
    careerPhase: project.careerPhase,
  };
}

function Field({ label, value, onChange, textarea, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1 block">{label}</label>
      {textarea ? (
        <Textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="bg-background border-border text-foreground" />
      ) : (
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="bg-background border-border text-foreground" />
      )}
    </div>
  );
}

function ListField({ label, value, onChange, placeholder }: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1 block">{label} <span className="text-xs">(separado por vírgula)</span></label>
      <Input
        value={value.join(', ')}
        onChange={e => onChange(e.target.value.split(',').map(v => v.trim()).filter(Boolean))}
        placeholder={placeholder}
        className="bg-background border-border text-foreground"
      />
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">{label}</span>
      <span className="text-sm text-foreground text-right">{value || '—'}</span>
    </div>
  );
}

export function ArtistProfileWizard({ mode }: { mode: 'create' | 'edit' }) {
  const { activeProject, activeArtist, addProject, updateProject, updateArtist } = useProject();
  const basePath = useBasePath();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardState>(
    mode === 'edit' ? stateFromExisting(activeProject, activeArtist) : emptyState(),
  );

  const set = <K extends keyof WizardState>(key: K, value: WizardState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const canAdvance = () => {
    if (step === 0) return form.name.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (!canAdvance()) {
      toast.error('Preencha o nome do artista para continuar');
      return;
    }
    setStep(s => Math.min(STEPS.length - 1, s + 1));
  };

  const handleConfirm = () => {
    if (mode === 'create') {
      const id = `p-${Date.now()}`;
      const artistId = `a-${Date.now()}`;
      const project: Project = {
        id,
        artistId,
        name: `Projeto ${form.name} — Era 1`,
        currentQuarter: 1,
        currentYear: new Date().getFullYear(),
        stage: 'Diagnóstico',
        overallProgress: 0,
        createdAt: new Date().toISOString().split('T')[0],
        careerPhase: form.careerPhase,
        projectType: form.projectType,
        bigGoal: form.bigGoal || undefined,
        quarterGoal: form.quarterGoal || undefined,
        dna: form.dna,
        positioning: { ...form.positioning, mainGenre: form.positioning.mainGenre || form.genre },
        audience: form.audience,
      };
      const artist: Artist = {
        id: artistId,
        name: form.name,
        genre: form.genre || undefined,
        bio: form.bio || undefined,
        whatsapp: form.whatsapp || undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      const templateMilestones = generateMilestonesFromTemplate(form.projectType, id);
      addProject(project, artist, templateMilestones);
      toast.success(`Cliente cadastrado com sucesso! ${templateMilestones.length} marcos gerados a partir do template de ${PROJECT_TYPE_LABELS[form.projectType]}.`);
    } else {
      updateArtist({ name: form.name, genre: form.genre || undefined, bio: form.bio || undefined, whatsapp: form.whatsapp || undefined });
      updateProject({
        dna: form.dna,
        positioning: form.positioning,
        audience: form.audience,
        bigGoal: form.bigGoal || undefined,
        quarterGoal: form.quarterGoal || undefined,
        careerPhase: form.careerPhase,
        projectType: form.projectType,
      });
      toast.success('Perfil artístico atualizado!');
    }
    navigate(`${basePath}/dashboard`);
  };

  return (
    <div className="max-w-2xl">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
            <div className={cn('h-1.5 w-full rounded-full transition-colors', i < step ? 'bg-status-completed' : i === step ? 'bg-status-in-progress' : 'bg-muted')} />
            <span className={cn('text-[10px] text-center', i === step ? 'text-foreground font-medium' : 'text-muted-foreground')}>{label}</span>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-base text-foreground mb-2">Identidade Básica</h2>
            <Field label="Nome do Artista *" value={form.name} onChange={v => set('name', v)} placeholder="Ex: RAY EL VOX" />
            <Field label="Gênero Musical" value={form.genre} onChange={v => set('genre', v)} placeholder="Ex: Pop Alternativo / Eletrônico" />
            <Field label="WhatsApp" value={form.whatsapp} onChange={v => set('whatsapp', v)} placeholder="Ex: +55 11 91234-5678" />
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Tipo de Projeto</label>
              <Select value={form.projectType} onValueChange={v => set('projectType', v as ProjectType)}>
                <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {PROJECT_TYPE_ORDER.map(t => <SelectItem key={t} value={t}>{PROJECT_TYPE_LABELS[t]}</SelectItem>)}
                </SelectContent>
              </Select>
              {mode === 'create' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Define o modelo de marcos pré-configurados criado automaticamente para este projeto.
                </p>
              )}
            </div>
            <Field label="Bio" value={form.bio} onChange={v => set('bio', v)} textarea placeholder="Breve biografia do artista" />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-base text-foreground mb-2">DNA Artístico</h2>
            <Field label="Conceito Artístico" value={form.dna.artisticConcept} onChange={v => set('dna', { ...form.dna, artisticConcept: v })} textarea />
            <Field label="Narrativa Artística" value={form.dna.artisticNarrative} onChange={v => set('dna', { ...form.dna, artisticNarrative: v })} textarea />
            <Field label="Universo Cultural" value={form.dna.culturalUniverse} onChange={v => set('dna', { ...form.dna, culturalUniverse: v })} textarea />
            <ListField label="Referências" value={form.dna.references} onChange={v => set('dna', { ...form.dna, references: v })} placeholder="Ex: James Blake, Arca" />
            <Field label="Hipótese Artística" value={form.dna.artisticHypothesis} onChange={v => set('dna', { ...form.dna, artisticHypothesis: v })} textarea />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-base text-foreground mb-2">Posicionamento</h2>
            <Field label="Gênero Principal" value={form.positioning.mainGenre} onChange={v => set('positioning', { ...form.positioning, mainGenre: v })} />
            <Field label="Subgênero" value={form.positioning.subGenre} onChange={v => set('positioning', { ...form.positioning, subGenre: v })} />
            <Field label="Território Cultural" value={form.positioning.culturalTerritory} onChange={v => set('positioning', { ...form.positioning, culturalTerritory: v })} />
            <Field label="Proposta de Valor" value={form.positioning.valueProposition} onChange={v => set('positioning', { ...form.positioning, valueProposition: v })} textarea />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-base text-foreground mb-2">Público-Alvo</h2>
            <Field label="Faixa Etária" value={form.audience.ageRange} onChange={v => set('audience', { ...form.audience, ageRange: v })} />
            <Field label="Cena Cultural" value={form.audience.culturalScene} onChange={v => set('audience', { ...form.audience, culturalScene: v })} />
            <Field label="Estética Predominante" value={form.audience.predominantAesthetic} onChange={v => set('audience', { ...form.audience, predominantAesthetic: v })} />
            <Field label="Comportamento" value={form.audience.behavior} onChange={v => set('audience', { ...form.audience, behavior: v })} textarea />
            <ListField label="Plataformas Principais" value={form.audience.mainPlatforms} onChange={v => set('audience', { ...form.audience, mainPlatforms: v })} placeholder="Ex: Spotify, Instagram" />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-base text-foreground mb-2">Objetivos</h2>
            <Field label="Grande Meta" value={form.bigGoal} onChange={v => set('bigGoal', v)} textarea placeholder="Objetivo macro da carreira" />
            <Field label="Objetivo do Trimestre" value={form.quarterGoal} onChange={v => set('quarterGoal', v)} textarea placeholder="O que atingir neste trimestre" />
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Fase da Carreira</label>
              <Select value={form.careerPhase} onValueChange={v => set('careerPhase', v as CareerPhase)}>
                <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(CAREER_PHASE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {step === STEPS.length - 1 && (
        <div className="bg-card rounded-lg border border-primary/20 p-6 mb-6">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-primary mb-3">Revisão Final</h2>
          <ReviewRow label="Artista" value={form.name} />
          <ReviewRow label="Gênero" value={form.genre} />
          <ReviewRow label="Conceito Artístico" value={form.dna.artisticConcept} />
          <ReviewRow label="Posicionamento" value={form.positioning.valueProposition} />
          <ReviewRow label="Público" value={form.audience.ageRange} />
          <ReviewRow label="Grande Meta" value={form.bigGoal} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => (step === 0 ? navigate(-1) : setStep(s => s - 1))}
          className="border-border text-muted-foreground"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Próxima Etapa <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleConfirm} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Check className="w-4 h-4 mr-1" /> {mode === 'create' ? 'Criar Cliente' : 'Salvar Alterações'}
          </Button>
        )}
      </div>
    </div>
  );
}
