import { AppLayout } from '@/components/AppLayout';
import { mockProject, mockArtist } from '@/data/mockData';
import { CAREER_PHASE_LABELS, HYPOTHESIS_STATUS_LABELS } from '@/types';

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-4">
      <h2 className="font-display font-semibold text-sm text-foreground mb-4">{title}</h2>
      {children}
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

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <p className="text-sm text-foreground mt-1 leading-relaxed">{value}</p>
    </div>
  );
}

export default function ConfiguracoesPage() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-3xl">
        <h1 className="font-display font-bold text-2xl text-foreground mb-8">Configurações</h1>

        <SettingSection title="Projeto">
          <FieldRow label="Nome do Projeto" value={mockProject.name} />
          <FieldRow label="Trimestre Atual" value={`Q${mockProject.currentQuarter} ${mockProject.currentYear}`} />
          <FieldRow label="Estágio" value={mockProject.stage} />
          <FieldRow label="Fase da Carreira" value={CAREER_PHASE_LABELS[mockProject.careerPhase]} />
          <FieldRow label="Criado em" value={mockProject.createdAt} />
          {mockProject.bigGoal && <TextBlock label="Grande Meta" value={mockProject.bigGoal} />}
          {mockProject.quarterGoal && <TextBlock label="Objetivo do Trimestre" value={mockProject.quarterGoal} />}
        </SettingSection>

        <SettingSection title="Artista">
          <FieldRow label="Nome" value={mockArtist.name} />
          <FieldRow label="Gênero" value={mockArtist.genre || '—'} />
          {mockProject.positioning && (
            <>
              <FieldRow label="Posicionamento" value={mockProject.positioning.valueProposition} />
              <FieldRow label="Território Cultural" value={mockProject.positioning.culturalTerritory} />
            </>
          )}
          {mockProject.audience && (
            <FieldRow label="Público Principal" value={`${mockProject.audience.ageRange} — ${mockProject.audience.culturalScene}`} />
          )}
        </SettingSection>

        <SettingSection title="Estratégia">
          {mockProject.dna && (
            <>
              <TextBlock label="Conceito Artístico" value={mockProject.dna.artisticConcept} />
              <TextBlock label="Narrativa" value={mockProject.dna.artisticNarrative} />
              <TextBlock label="Hipótese Artística" value={mockProject.dna.artisticHypothesis} />
              <FieldRow label="Status da Hipótese" value={HYPOTHESIS_STATUS_LABELS[mockProject.dna.hypothesisStatus]} />
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
