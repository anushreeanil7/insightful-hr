import { Users, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Employee {
  id: string;
  name: string;
  department: string;
  riskPercentage: number;
  willLeave: boolean;
}

interface BulkResultsTableProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
}

export const BulkResultsTable = ({ employees, onSelectEmployee }: BulkResultsTableProps) => {
  if (employees.length === 0) {
    return null;
  }

  const getRiskBadgeClass = (risk: number) => {
    if (risk >= 70) return 'risk-badge-high';
    if (risk >= 40) return 'risk-badge-medium';
    return 'risk-badge-low';
  };

  const highRiskCount = employees.filter(e => e.riskPercentage >= 70).length;
  const mediumRiskCount = employees.filter(e => e.riskPercentage >= 40 && e.riskPercentage < 70).length;

  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Bulk Analysis Results</h3>
              <p className="text-sm text-muted-foreground">{employees.length} employees analyzed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {highRiskCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-danger-light">
                <AlertTriangle className="w-4 h-4 text-danger" />
                <span className="text-sm font-medium text-danger">{highRiskCount} High Risk</span>
              </div>
            )}
            {mediumRiskCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning-light">
                <span className="text-sm font-medium text-warning">{mediumRiskCount} Medium</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Employee</TableHead>
            <TableHead className="font-semibold">Department</TableHead>
            <TableHead className="font-semibold">Risk Level</TableHead>
            <TableHead className="font-semibold">Prediction</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow 
              key={employee.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSelectEmployee(employee)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{employee.department}</TableCell>
              <TableCell>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRiskBadgeClass(employee.riskPercentage)}`}>
                  {employee.riskPercentage}%
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {employee.willLeave ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-danger" />
                      <span className="text-danger font-medium">Will Leave</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-success font-medium">Will Stay</span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
