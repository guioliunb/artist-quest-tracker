import { AppLayout } from '@/components/AppLayout';
import { ProgressBar } from '@/components/ProgressBar';
import { mockQuarterlyReview, mockProject } from '@/data/mockData';
import { PILLAR_LABELS } from '@/types';
import { formatQuarter } from '@/lib/helpers';
import { TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';

function ReviewSection({ icon: Icon, title, content, iconColor }: {
  icon: React.ElementType;
  title: string;
  content: string;
  iconColor: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <h3 className="font-display font-semibold text-sm text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
    </div>
  );
}

function StrategicQuestion({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="py-3 border-b border-border last:border-0">
      <span className="text-xs font-medium text-foreground">{question}</span>
      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{answer}</p>
    </div>
  );
}

export default function AvaliacaoPage() {
  const review = mockQuarterlyReview;

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-5xl">
        <div className="mb-10">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Avaliação Trimestral</h1>
          <p className="text-sm text-muted-foreground">
            {formatQuarter(review.quarter, review.year)} — {mockProject.name}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Resumo do Trimestre
          </h2>
          <p className="text-sm text-foreground leading-relaxed">{review.summary}</p>
        </div>

        {/* Grid sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <ReviewSection
            icon={TrendingUp}
            title="O que Evoluiu"
            content={review.evolved}
            iconColor="text-status-completed"
          />
          <ReviewSection
            icon={AlertTriangle}
            title="O que Travou"
            content={review.blocked}
            iconColor="text-status-delayed"
          />
          <ReviewSection
            icon={CheckCircle2}
            title="O que foi Validado"
            content={review.validated}
            iconColor="text-status-in-progress"
          />
          <ReviewSection
            icon={ArrowRight}
            title="Próximos Passos"
            content={review.nextSteps}
            iconColor="text-foreground"
          />
        </div>

        {/* Strategic Questions */}
        {review.strategicQuestions && (
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-status-in-progress" />
              <h2 className="font-display font-semibold text-sm text-foreground">
                Perguntas Estratégicas
              </h2>
            </div>
            <StrategicQuestion question="O projeto evoluiu artisticamente?" answer={review.strategicQuestions.artisticEvolution} />
            <StrategicQuestion question="O público começou a responder?" answer={review.strategicQuestions.audienceResponse} />
            <StrategicQuestion question="Existe demanda real?" answer={review.strategicQuestions.realDemand} />
            <StrategicQuestion question="Onde está o gargalo?" answer={review.strategicQuestions.bottleneck} />
            <StrategicQuestion question="A hipótese artística está sendo validada?" answer={review.strategicQuestions.hypothesisValidation} />
          </div>
        )}

        {/* New Goal */}
        <div className="bg-card rounded-lg border border-primary/20 p-6 mb-8">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-primary mb-3">
            Nova Meta do Trimestre
          </h2>
          <p className="text-sm text-foreground leading-relaxed">{review.newGoal}</p>
        </div>

        {/* Pillar Comparison */}
        <section>
          <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Revisão por Pilar
          </h2>
          <div className="space-y-4">
            {review.pillarReviews.map((pr) => (
              <div key={pr.pillarType} className="bg-card rounded-lg border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-sm text-foreground">
                    {PILLAR_LABELS[pr.pillarType]}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Anterior: {pr.previousProgress}%</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-foreground font-medium">{pr.progress}%</span>
                  </div>
                </div>
                <ProgressBar
                  value={pr.progress}
                  variant={pr.progress >= 60 ? 'completed' : 'in-progress'}
                  showLabel
                  size="lg"
                  className="mb-3"
                />
                <p className="text-xs text-muted-foreground">{pr.summary}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
