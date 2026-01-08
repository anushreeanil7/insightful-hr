import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface FeatureImpactChartProps {
  data: {
    feature: string;
    impact: number;
    direction: 'positive' | 'negative';
  }[];
}

export const FeatureImpactChart = ({ data }: FeatureImpactChartProps) => {
  if (data.length === 0) {
    return null;
  }

  const chartData = data.map(item => ({
    ...item,
    value: item.direction === 'negative' ? item.impact : -item.impact,
    displayValue: item.impact,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-semibold text-foreground">{data.feature}</p>
          <p className={`text-sm ${data.direction === 'negative' ? 'text-danger' : 'text-success'}`}>
            {data.direction === 'negative' ? 'Increases' : 'Decreases'} attrition risk by {data.displayValue}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-elevated p-6 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-primary/10">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Feature Impact Analysis</h3>
          <p className="text-sm text-muted-foreground">How each factor affects attrition risk</p>
        </div>
      </div>

      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              domain={[-50, 50]}
              tickFormatter={(value) => `${Math.abs(value)}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="feature" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }}
              width={95}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 4, 4]}
              barSize={24}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.direction === 'negative' ? 'hsl(var(--danger))' : 'hsl(var(--success))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger" />
          <span className="text-sm text-muted-foreground">Increases Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Decreases Risk</span>
        </div>
      </div>
    </div>
  );
};
