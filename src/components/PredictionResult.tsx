import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface PredictionResultProps {
  prediction: {
    willLeave: boolean;
    riskPercentage: number;
    employeeName: string;
  } | null;
}

export const PredictionResult = ({ prediction }: PredictionResultProps) => {
  if (!prediction) {
    return (
      <div className="card-elevated p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-muted">
            <Info className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">No Prediction Yet</h3>
            <p className="text-muted-foreground mt-1">
              Upload a CSV file or fill in employee details to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { willLeave, riskPercentage, employeeName } = prediction;
  const riskLevel = riskPercentage >= 70 ? 'high' : riskPercentage >= 40 ? 'medium' : 'low';

  const riskConfig = {
    high: {
      gradient: 'gradient-danger',
      bgLight: 'bg-danger-light',
      textColor: 'text-danger',
      icon: AlertTriangle,
      label: 'High Risk',
      trend: TrendingUp,
    },
    medium: {
      gradient: 'bg-warning',
      bgLight: 'bg-warning-light',
      textColor: 'text-warning',
      icon: AlertTriangle,
      label: 'Medium Risk',
      trend: TrendingUp,
    },
    low: {
      gradient: 'gradient-success',
      bgLight: 'bg-success-light',
      textColor: 'text-success',
      icon: CheckCircle,
      label: 'Low Risk',
      trend: TrendingDown,
    },
  };

  const config = riskConfig[riskLevel];
  const Icon = config.icon;
  const TrendIcon = config.trend;

  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      {/* Header */}
      <div className={`${config.gradient} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">Prediction Result</p>
              <h3 className="text-white font-display font-bold text-lg">{employeeName}</h3>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold`}>
            {config.label}
          </div>
        </div>
      </div>

      {/* Result Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Prediction Outcome</p>
            <p className={`font-display font-bold text-2xl ${config.textColor}`}>
              {willLeave ? 'Likely to Leave' : 'Likely to Stay'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm mb-1">Attrition Risk</p>
            <div className="flex items-center gap-2">
              <TrendIcon className={`w-5 h-5 ${config.textColor}`} />
              <span className={`font-display font-bold text-3xl ${config.textColor}`}>
                {riskPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Risk Meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low Risk</span>
            <span>High Risk</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${config.gradient} rounded-full transition-all duration-1000 ease-out`}
              style={{ 
                width: `${riskPercentage}%`,
                animation: 'progress-fill 1s ease-out forwards',
                '--progress-width': `${riskPercentage}%`
              } as React.CSSProperties}
            />
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-success">0%</span>
            <span className="text-warning">50%</span>
            <span className="text-danger">100%</span>
          </div>
        </div>

        {/* Action Recommendation */}
        <div className={`mt-6 p-4 rounded-xl ${config.bgLight}`}>
          <p className="text-sm font-medium text-foreground mb-1">
            {willLeave ? '⚠️ Recommended Action' : '✅ Status'}
          </p>
          <p className="text-sm text-muted-foreground">
            {willLeave
              ? 'Consider scheduling a one-on-one meeting to discuss career development and address any concerns.'
              : 'This employee shows strong retention indicators. Continue supporting their growth trajectory.'}
          </p>
        </div>
      </div>
    </div>
  );
};
