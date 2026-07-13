import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArtistEPK } from './ArtistEPK';
import { Artist, DemandMetrics, Project, SocialMetricsSnapshot } from '@/types';
import { slugify } from '@/lib/helpers';
import { FileImage, FileText } from 'lucide-react';

export function EPKExportDialog({ open, onOpenChange, artist, project, demandMetrics, socialSnapshot, managerName }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artist: Artist;
  project: Project;
  demandMetrics: DemandMetrics[];
  socialSnapshot: SocialMetricsSnapshot;
  managerName: string;
}) {
  const epkRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const generatedAt = new Date();
  const fileBaseName = `apresentacao-${slugify(artist.name)}`;

  const captureCanvas = async () => {
    if (!epkRef.current) return null;
    return html2canvas(epkRef.current, { backgroundColor: '#FAF7F0', scale: 2, useCORS: true });
  };

  const handleDownloadPng = async () => {
    setExporting(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `${fileBaseName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Apresentação exportada em PNG');
    } catch {
      toast.error('Não foi possível gerar a imagem da apresentação');
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    setExporting(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`${fileBaseName}.pdf`);
      toast.success('Apresentação exportada em PDF');
    } catch {
      toast.error('Não foi possível gerar o PDF da apresentação');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Exportar Apresentação</DialogTitle>
        </DialogHeader>

        <div className="border border-border rounded-md bg-muted/30 max-h-[55vh] overflow-auto flex justify-center py-6">
          <ArtistEPK
            ref={epkRef}
            artist={artist}
            project={project}
            demandMetrics={demandMetrics}
            socialSnapshot={socialSnapshot}
            managerName={managerName}
            generatedAt={generatedAt}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleDownloadPng} disabled={exporting} className="border-border">
            <FileImage className="w-4 h-4 mr-1.5" /> Baixar imagem (PNG)
          </Button>
          <Button onClick={handleDownloadPdf} disabled={exporting} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <FileText className="w-4 h-4 mr-1.5" /> Baixar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
