import { AppLayout } from '@/components/AppLayout';
import { useProject } from '@/contexts/ProjectContext';
import { CAREER_PHASE_LABELS, CareerPhase, HypothesisStatus, Project, Artist } from '@/types';
import { ProgressBar } from '@/components/ProgressBar';
import { Plus, FolderOpen, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function NewProjectDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addProject } = useProject();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    projectName: '',
    artistName: '',
    genre: '',
    stage: 'Diagnóstico',
    careerPhase: 'definicao_mda' as CareerPhase,
    currentQuarter: 1,
    currentYear: new Date().getFullYear(),
    bigGoal: '',
    quarterGoal: '',
  });

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleCreate = () => {
    if (!form.projectName.trim() || !form.artistName.trim()) {
      toast.error('Nome do projeto e do artista são obrigatórios');
      return;
    }
    const id = `p-${Date.now()}`;
    const artistId = `a-${Date.now()}`;
    const project: Project = {
      id,
      artistId,
      name: form.projectName,
      currentQuarter: form.currentQuarter,
      currentYear: form.currentYear,
      stage: form.stage,
      overallProgress: 0,
      createdAt: new Date().toISOString().split('T')[0],
      careerPhase: form.careerPhase,
      bigGoal: form.bigGoal || undefined,
      quarterGoal: form.quarterGoal || undefined,
      dna: {
        artisticConcept: '',
        artisticNarrative: '',
        culturalUniverse: '',
        references: [],
        artisticHypothesis: '',
        hypothesisStatus: 'nao_testada' as HypothesisStatus,
      },
      positioning: {
        mainGenre: form.genre,
        subGenre: '',
        culturalTerritory: '',
        valueProposition: '',
      },
      audience: {
        ageRange: '',
        culturalScene: '',
        predominantAesthetic: '',
        behavior: '',
        mainPlatforms: [],
      },
    };
    const artist: Artist = {
      id: artistId,
      name: form.artistName,
      genre: form.genre || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addProject(project, artist);
    toast.success('Projeto criado com sucesso!');
    onOpenChange(false);
    setStep(1);
    setForm({ projectName: '', artistName: '', genre: '', stage: 'Diagnóstico', careerPhase: 'diagnostico', currentQuarter: 1, currentYear: new Date().getFullYear(), bigGoal: '', quarterGoal: '' });
    navigate('/configuracoes');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Novo Projeto</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Nome do Projeto *</label>
              <Input value={form.projectName} onChange={e => set('projectName', e.target.value)} placeholder="Ex: Projeto RAY EL VOX — Era 1" className="bg-background border-border text-foreground" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Nome do Artista *</label>
              <Input value={form.artistName} onChange={e => set('artistName', e.target.value)} placeholder="Ex: RAY EL VOX" className="bg-background border-border text-foreground" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Gênero Musical</label>
              <Input value={form.genre} onChange={e => set('genre', e.target.value)} placeholder="Ex: Pop Alternativo / Eletrônico" className="bg-background border-border text-foreground" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Estágio</label>
              <Input value={form.stage} onChange={e => set('stage', e.target.value)} placeholder="Ex: Definição de Conceito" className="bg-background border-border text-foreground" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Trimestre</label>
                <Select value={String(form.currentQuarter)} onValueChange={v => set('currentQuarter', Number(v))}>
                  <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {[1, 2, 3, 4].map(q => <SelectItem key={q} value={String(q)}>Q{q}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Fase da Carreira</label>
                <Select value={form.careerPhase} onValueChange={v => set('careerPhase', v)}>
                  <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {Object.entries(CAREER_PHASE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Grande Meta</label>
              <Textarea value={form.bigGoal} onChange={e => set('bigGoal', e.target.value)} placeholder="Objetivo macro da carreira" className="bg-background border-border text-foreground" rows={2} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Objetivo do Trimestre</label>
              <Textarea value={form.quarterGoal} onChange={e => set('quarterGoal', e.target.value)} placeholder="O que atingir neste trimestre" className="bg-background border-border text-foreground" rows={2} />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)} className="border-border text-muted-foreground">
              Voltar
            </Button>
          )}
          {step === 1 ? (
            <Button onClick={() => setStep(2)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Próximo
            </Button>
          ) : (
            <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-1" /> Criar Projeto
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjetosPage() {
  const { projects, activeProjectId, setActiveProjectId } = useProject();
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setActiveProjectId(id);
    toast.success('Projeto ativo atualizado');
    navigate('/dashboard');
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground">Projetos</h1>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Novo Projeto
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum projeto encontrado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map(({ project, artist }) => {
              const isActive = project.id === activeProjectId;
              return (
                <div
                  key={project.id}
                  className={`bg-card rounded-lg border p-5 transition-colors cursor-pointer group ${
                    isActive ? 'border-primary/50' : 'border-border hover:border-border/80'
                  }`}
                  onClick={() => handleSelect(project.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-sm text-foreground truncate">{project.name}</h3>
                        {isActive && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                            Ativo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{artist.name} · {artist.genre || 'Gênero não definido'}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {project.overallProgress >= 100 ? (
                        <span className="flex items-center gap-1 text-status-green"><CheckCircle2 className="w-3.5 h-3.5" /> Finalizado</span>
                      ) : (
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Em andamento</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1">
                      <ProgressBar value={project.overallProgress} size="sm" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground w-10 text-right">{project.overallProgress}%</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Q{project.currentQuarter} {project.currentYear}</span>
                    <span>·</span>
                    <span>{project.stage}</span>
                    <span>·</span>
                    <span>{CAREER_PHASE_LABELS[project.careerPhase]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NewProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </AppLayout>
  );
}
