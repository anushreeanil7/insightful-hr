import { Lightbulb, ArrowRight, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface XAIExplanationProps {
  reasons: {
    factor: string;
    impact: 'positive' | 'negative';
    description: string;
    importance: number;
  }[];
}

export const XAIExplanation = ({ reasons }: XAIExplanationProps) => {
  if (reasons.length === 0) {
    return null;
  }

  return (
    <div className="card-elevated p-6 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-primary/10">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-foreground">Why This Prediction?</h3>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>These are the top factors that influenced the AI's prediction, explained in plain language for easy understanding.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground">Top factors influencing this prediction</p>
        </div>
      </div>

      <div className="space-y-3">
        {reasons.map((reason, index) => (
          <div
            key={reason.factor}
            className={`
              p-4 rounded-xl border transition-all duration-200 hover:shadow-card
              ${reason.impact === 'negative' 
                ? 'border-danger/20 bg-danger-light/50' 
                : 'border-success/20 bg-success-light/50'
              }
            `}
            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
          >
            <div className="flex items-start gap-3">
              <div className={`
                flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${reason.impact === 'negative' ? 'bg-danger text-danger-foreground' : 'bg-success text-success-foreground'}
              `}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{reason.factor}</h4>
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full font-medium
                    ${reason.impact === 'negative' 
                      ? 'bg-danger/10 text-danger' 
                      : 'bg-success/10 text-success'
                    }
                  `}>
                    {reason.impact === 'negative' ? '↑ Risk' : '↓ Risk'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className={`
                  text-lg font-bold
                  ${reason.impact === 'negative' ? 'text-danger' : 'text-success'}
                `}>
                  {Math.round(reason.importance * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">impact</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-4 bg-muted/50 rounded-xl">
        <div className="flex items-start gap-2">
          <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Understanding these factors</span> helps HR teams take proactive steps to improve employee retention and address potential concerns before they escalate.
          </p>
        </div>
      </div>
    </div>
  );
};
