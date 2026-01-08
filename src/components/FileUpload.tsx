import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAX_ROWS = 50; // Limit to first 50 rows for lightweight analysis

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rowCount, setRowCount] = useState<{ total: number; processed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    const dataRows = lines.slice(1, MAX_ROWS + 1); // Limit to first 50 rows
    
    setRowCount({ total: lines.length - 1, processed: dataRows.length });
    
    return dataRows.map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
      const employee: any = { id: `EMP${String(index + 1).padStart(3, '0')}` };
      
      headers.forEach((header, i) => {
        const value = values[i] || '';
        // Map common CSV column names to our expected format
        if (header.includes('name') || header === 'employeename') {
          employee.name = value || `Employee ${index + 1}`;
        } else if (header.includes('department') || header === 'dept') {
          employee.department = value || 'General';
        } else if (header.includes('age')) {
          employee.age = parseInt(value) || 30;
        } else if (header.includes('year') && header.includes('company') || header === 'yearsatcompany' || header === 'tenure') {
          employee.yearsAtCompany = parseInt(value) || 1;
        } else if (header.includes('satisfaction') || header === 'jobsatisfaction') {
          employee.jobSatisfaction = parseInt(value) || 3;
        } else if (header.includes('income') || header === 'monthlyincome') {
          employee.monthlyIncome = parseInt(value) || 5000;
        } else if (header.includes('overtime') || header === 'overtime') {
          employee.overtime = value.toLowerCase() === 'yes' || value === '1' || value.toLowerCase() === 'true';
        } else if (header.includes('worklife') || header === 'worklifebalance') {
          employee.workLifeBalance = parseInt(value) || 3;
        } else if (header.includes('distance') || header === 'distancefromhome') {
          employee.distanceFromHome = parseInt(value) || 10;
        } else if (header.includes('numcompanies') || header === 'numcompaniesworked') {
          employee.numCompaniesWorked = parseInt(value) || 1;
        } else if (header.includes('jobrole') || header === 'role') {
          employee.jobRole = value || 'Associate';
        }
      });
      
      // Set defaults for missing fields
      employee.name = employee.name || `Employee ${index + 1}`;
      employee.department = employee.department || 'General';
      employee.age = employee.age || 30;
      employee.yearsAtCompany = employee.yearsAtCompany || 1;
      employee.jobSatisfaction = employee.jobSatisfaction || 3;
      employee.monthlyIncome = employee.monthlyIncome || 5000;
      employee.overtime = employee.overtime || false;
      employee.workLifeBalance = employee.workLifeBalance || 3;
      employee.distanceFromHome = employee.distanceFromHome || 10;
      employee.numCompaniesWorked = employee.numCompaniesWorked || 1;
      employee.jobRole = employee.jobRole || 'Associate';
      
      return employee;
    });
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    setUploadedFile(file);
    setError(null);
    setRowCount(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const employees = parseCSV(text);
        
        if (employees.length === 0) {
          setError('No valid employee data found in CSV');
          setIsProcessing(false);
          return;
        }
        
        onFileUpload(employees);
        setIsProcessing(false);
      } catch (err) {
        setError('Failed to parse CSV file. Please check the format.');
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.csv')) {
      processFile(files[0]);
    }
  }, [onFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setRowCount(null);
    setError(null);
    onFileUpload([]);
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Bulk Upload</h3>
          <p className="text-sm text-muted-foreground">Upload employee data via CSV</p>
        </div>
      </div>

      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }
          `}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-primary/20' : 'bg-muted'}`}>
              <Upload className={`w-6 h-6 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isDragging ? 'Drop your file here' : 'Drag & drop your CSV file'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse files
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-success-light rounded-xl">
          <div className="flex items-center gap-3">
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-success border-t-transparent rounded-full animate-spin" />
            ) : error ? (
              <AlertCircle className="w-5 h-5 text-danger" />
            ) : (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
            <div>
              <p className="font-medium text-foreground">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {isProcessing ? 'Parsing CSV data...' : 
                 error ? error :
                 rowCount ? `Analyzing ${rowCount.processed} of ${rowCount.total} employees (limited to first ${MAX_ROWS} for fast analysis)` :
                 'Ready for analysis'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFile}
            className="hover:bg-success/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
