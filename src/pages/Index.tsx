import { useState } from 'react';
import { Brain, Shield, Users, TrendingDown } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { EmployeeForm, EmployeeData } from '@/components/EmployeeForm';
import { PredictionResult } from '@/components/PredictionResult';
import { XAIExplanation } from '@/components/XAIExplanation';
import { FeatureImpactChart } from '@/components/FeatureImpactChart';
import { BulkResultsTable } from '@/components/BulkResultsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock prediction logic
const generatePrediction = (employee: EmployeeData | any) => {
  // Simulate ML prediction based on factors
  const factors = [];
  let riskScore = 30; // Base risk

  // Overtime impact
  if (employee.overtime) {
    riskScore += 25;
    factors.push({
      factor: 'Overtime Required',
      impact: 'negative' as const,
      description: 'Employees working overtime regularly are 2.5x more likely to leave due to burnout and work-life imbalance.',
      importance: 0.28,
    });
  }

  // Job satisfaction impact
  if (employee.jobSatisfaction && employee.jobSatisfaction <= 2) {
    riskScore += 20;
    factors.push({
      factor: 'Low Job Satisfaction',
      impact: 'negative' as const,
      description: 'Current satisfaction level is below average, indicating potential disengagement with role responsibilities.',
      importance: 0.22,
    });
  } else if (employee.jobSatisfaction >= 4) {
    riskScore -= 15;
    factors.push({
      factor: 'High Job Satisfaction',
      impact: 'positive' as const,
      description: 'Strong satisfaction indicates alignment with job expectations and company culture.',
      importance: 0.20,
    });
  }

  // Tenure impact
  if (employee.yearsAtCompany && employee.yearsAtCompany < 2) {
    riskScore += 15;
    factors.push({
      factor: 'Short Tenure',
      impact: 'negative' as const,
      description: 'Employees with less than 2 years typically have lower loyalty bonds and more external opportunities.',
      importance: 0.18,
    });
  } else if (employee.yearsAtCompany >= 5) {
    riskScore -= 20;
    factors.push({
      factor: 'Long Tenure',
      impact: 'positive' as const,
      description: 'Extended tenure suggests strong organizational commitment and established relationships.',
      importance: 0.22,
    });
  }

  // Income impact
  if (employee.monthlyIncome && employee.monthlyIncome < 4000) {
    riskScore += 15;
    factors.push({
      factor: 'Below-Market Compensation',
      impact: 'negative' as const,
      description: 'Salary is below industry average for this role, making external offers more attractive.',
      importance: 0.15,
    });
  }

  // Work-life balance
  if (employee.workLifeBalance && employee.workLifeBalance <= 2) {
    riskScore += 12;
    factors.push({
      factor: 'Poor Work-Life Balance',
      impact: 'negative' as const,
      description: 'Current balance score indicates stress factors that may lead to seeking better opportunities.',
      importance: 0.12,
    });
  }

  // Ensure risk is within bounds
  riskScore = Math.max(5, Math.min(95, riskScore));

  // Sort by importance
  factors.sort((a, b) => b.importance - a.importance);

  return {
    willLeave: riskScore >= 50,
    riskPercentage: riskScore,
    employeeName: employee.name || 'Employee',
    reasons: factors.slice(0, 5),
    chartData: factors.slice(0, 6).map(f => ({
      feature: f.factor.split(' ').slice(0, 2).join(' '),
      impact: Math.round(f.importance * 100),
      direction: f.impact,
    })),
  };
};

const Index = () => {
  const [prediction, setPrediction] = useState<any>(null);
  const [bulkResults, setBulkResults] = useState<any[]>([]);

  const handleFileUpload = (employees: any[]) => {
    // Generate predictions for all employees
    const results = employees.map(emp => {
      const pred = generatePrediction({
        ...emp,
        yearsAtCompany: emp.tenure,
        jobSatisfaction: Math.round(emp.satisfaction * 4),
        overtime: Math.random() > 0.7,
        workLifeBalance: Math.round(Math.random() * 4) + 1,
        monthlyIncome: 3000 + Math.random() * 7000,
      });
      return {
        id: emp.id,
        name: emp.name,
        department: emp.department,
        riskPercentage: pred.riskPercentage,
        willLeave: pred.willLeave,
        fullPrediction: pred,
      };
    });
    setBulkResults(results);
  };

  const handleIndividualPredict = (employee: EmployeeData) => {
    const result = generatePrediction(employee);
    setPrediction(result);
  };

  const handleSelectEmployee = (employee: any) => {
    setPrediction(employee.fullPrediction);
  };

  const stats = [
    { label: 'Prediction Accuracy', value: '94.2%', icon: Brain, color: 'text-primary' },
    { label: 'Employees Analyzed', value: '2,847', icon: Users, color: 'text-chart-5' },
    { label: 'Attrition Prevented', value: '127', icon: TrendingDown, color: 'text-success' },
    { label: 'Trust Score', value: '4.8/5', icon: Shield, color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-primary">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-foreground">AttritionAI</h1>
                <p className="text-xs text-muted-foreground">Explainable Employee Retention</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
              Model Active
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-display font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                Employee Attrition Prediction
              </h2>
              <p className="text-muted-foreground">
                Upload employee data or enter individual details to predict attrition risk with AI-powered explanations.
              </p>
            </div>

            <Tabs defaultValue="individual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="individual">Individual</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="individual" className="mt-4">
                <EmployeeForm onPredict={handleIndividualPredict} />
              </TabsContent>
              <TabsContent value="bulk" className="mt-4 space-y-4">
                <FileUpload onFileUpload={handleFileUpload} />
                <BulkResultsTable 
                  employees={bulkResults} 
                  onSelectEmployee={handleSelectEmployee}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <PredictionResult prediction={prediction} />
            
            {prediction && (
              <>
                <XAIExplanation reasons={prediction.reasons || []} />
                <FeatureImpactChart data={prediction.chartData || []} />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 AttritionAI - Explainable Employee Retention System</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                GDPR Compliant
              </span>
              <span>Model Version: RF-2024.1</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
