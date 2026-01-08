import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    setIsProcessing(true);
    setUploadedFile(file);
    
    // Simulate processing and generate mock data
    setTimeout(() => {
      const mockEmployees = [
        { id: 'EMP001', name: 'Sarah Johnson', department: 'Sales', tenure: 3, satisfaction: 0.4 },
        { id: 'EMP002', name: 'Michael Chen', department: 'Engineering', tenure: 5, satisfaction: 0.8 },
        { id: 'EMP003', name: 'Emily Davis', department: 'HR', tenure: 2, satisfaction: 0.6 },
        { id: 'EMP004', name: 'James Wilson', department: 'Marketing', tenure: 1, satisfaction: 0.3 },
        { id: 'EMP005', name: 'Lisa Anderson', department: 'Finance', tenure: 7, satisfaction: 0.9 },
      ];
      onFileUpload(mockEmployees);
      setIsProcessing(false);
    }, 1500);
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
            ) : (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
            <div>
              <p className="font-medium text-foreground">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {isProcessing ? 'Processing...' : 'Ready for analysis'}
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
