import { useState } from 'react';
import { User, Briefcase, Clock, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface EmployeeFormProps {
  onPredict: (employee: EmployeeData) => void;
}

export interface EmployeeData {
  name: string;
  age: number;
  department: string;
  jobRole: string;
  yearsAtCompany: number;
  monthlyIncome: number;
  jobSatisfaction: number;
  workLifeBalance: number;
  overtime: boolean;
  distanceFromHome: number;
  numCompaniesWorked: number;
}

export const EmployeeForm = ({ onPredict }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<EmployeeData>({
    name: '',
    age: 30,
    department: '',
    jobRole: '',
    yearsAtCompany: 2,
    monthlyIncome: 5000,
    jobSatisfaction: 3,
    workLifeBalance: 3,
    overtime: false,
    distanceFromHome: 10,
    numCompaniesWorked: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  const departments = ['Sales', 'Research & Development', 'Human Resources', 'Marketing', 'Finance', 'Engineering'];
  const jobRoles = ['Sales Executive', 'Research Scientist', 'HR Manager', 'Marketing Analyst', 'Software Engineer', 'Data Analyst'];

  return (
    <form onSubmit={handleSubmit} className="card-elevated p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Individual Assessment</h3>
          <p className="text-sm text-muted-foreground">Enter employee details for prediction</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Employee Name</Label>
          <Input
            id="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium">Age</Label>
          <Input
            id="age"
            type="number"
            min={18}
            max={65}
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Department</Label>
          <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Job Role</Label>
          <Select value={formData.jobRole} onValueChange={(value) => setFormData({ ...formData, jobRole: value })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {jobRoles.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Work Details */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Years at Company
          </Label>
          <Input
            type="number"
            min={0}
            max={40}
            value={formData.yearsAtCompany}
            onChange={(e) => setFormData({ ...formData, yearsAtCompany: parseInt(e.target.value) || 0 })}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            Monthly Income ($)
          </Label>
          <Input
            type="number"
            min={1000}
            max={50000}
            value={formData.monthlyIncome}
            onChange={(e) => setFormData({ ...formData, monthlyIncome: parseInt(e.target.value) || 1000 })}
            className="h-11"
          />
        </div>

        {/* Satisfaction Sliders */}
        <div className="space-y-4 md:col-span-2">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Job Satisfaction</Label>
                <span className="text-sm font-semibold text-primary">{formData.jobSatisfaction}/4</span>
              </div>
              <Slider
                value={[formData.jobSatisfaction]}
                onValueChange={(value) => setFormData({ ...formData, jobSatisfaction: value[0] })}
                min={1}
                max={4}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Work-Life Balance</Label>
                <span className="text-sm font-semibold text-primary">{formData.workLifeBalance}/4</span>
              </div>
              <Slider
                value={[formData.workLifeBalance]}
                onValueChange={(value) => setFormData({ ...formData, workLifeBalance: value[0] })}
                min={1}
                max={4}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Factors */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            Previous Companies
          </Label>
          <Input
            type="number"
            min={0}
            max={10}
            value={formData.numCompaniesWorked}
            onChange={(e) => setFormData({ ...formData, numCompaniesWorked: parseInt(e.target.value) || 0 })}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Requires Overtime?</Label>
          <Select 
            value={formData.overtime ? 'yes' : 'no'} 
            onValueChange={(value) => setFormData({ ...formData, overtime: value === 'yes' })}
          >
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 font-semibold gradient-primary hover:opacity-90 transition-opacity">
        <TrendingUp className="w-4 h-4 mr-2" />
        Generate Prediction
      </Button>
    </form>
  );
};
