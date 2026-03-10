import { AppLayout } from '@/components/AppLayout';
import { mockProject, mockArtist } from '@/data/mockData';
import { Settings, User, Music2 } from 'lucide-react';

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
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
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
          <FieldRow label="Criado em" value={mockProject.createdAt} />
        </SettingSection>

        <SettingSection title="Artista">
          <FieldRow label="Nome" value={mockArtist.name} />
          <FieldRow label="Gênero" value={mockArtist.genre || '—'} />
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
