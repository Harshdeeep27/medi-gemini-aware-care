
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { FileUp, X } from 'lucide-react';

type FileUploadProps = {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
};

export const FileUpload = ({ 
  onFilesSelected, 
  maxFiles = 5, 
  acceptedFileTypes = "image/*,application/pdf"
}: FileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    const filesArray = Array.from(fileList);
    handleFiles(filesArray);
  };

  const handleFiles = (filesArray: File[]) => {
    if (selectedFiles.length + filesArray.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(prev => [...prev, ...filesArray]);
    simulateUpload();
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to analyze",
        variant: "destructive",
      });
      return;
    }
    
    onFilesSelected(selectedFiles);
  };

  return (
    <div className="w-full space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">
          Drag and drop files here or click to browse
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Upload medical documents for AI analysis (Max {maxFiles} files)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium">
            Files ({selectedFiles.length}/{maxFiles}):
          </div>
          
          {selectedFiles.map((file, index) => (
            <Card key={index} className="p-3 flex justify-between items-center">
              <div className="flex items-center space-x-2 overflow-hidden">
                <div className="w-10 h-10 flex items-center justify-center rounded bg-muted">
                  <span className="text-xs">{file.name.split('.').pop()?.toUpperCase()}</span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => { 
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
          
          {uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
          
          <Button 
            className="w-full" 
            onClick={handleSubmit} 
            disabled={uploadProgress < 100}
          >
            Analyze with AI
          </Button>
        </div>
      )}
    </div>
  );
};
