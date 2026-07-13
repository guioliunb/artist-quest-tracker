import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { ArtistProfileWizard } from '@/components/ArtistProfileWizard';

export default function CadastroArtisticoPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') === 'edit' ? 'edit' : 'create';

  return (
    <AppLayout>
      <div className="p-6 lg:p-10">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground">
            {mode === 'create' ? 'Novo Cliente — Definição Artística' : 'Editar Perfil Artístico'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === 'create'
              ? 'Cadastre a identidade, DNA artístico, posicionamento, público e objetivos do novo cliente.'
              : 'Atualize a definição artística do cliente ativo.'}
          </p>
        </div>
        <ArtistProfileWizard mode={mode} />
      </div>
    </AppLayout>
  );
}
