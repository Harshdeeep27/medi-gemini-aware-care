
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { DiagnosisResult } from '@/components/DiagnosisResult';
import { useToast } from '@/components/ui/use-toast';

const mockGeminiDiagnosis = {
  condition: "Type 2 Diabetes",
  description: "Type 2 diabetes affects the way your body processes blood sugar. It develops when the body becomes resistant to insulin or when the pancreas doesn't produce enough insulin.",
  confidence: 0.87,
  precautions: [
    {
      title: "Monitor Blood Sugar",
      description: "Check your blood glucose levels regularly as recommended by your healthcare provider."
    },
    {
      title: "Balanced Diet",
      description: "Follow a diet plan that helps you maintain proper blood sugar levels. Focus on vegetables, fruits, whole grains, and lean proteins."
    },
    {
      title: "Regular Exercise",
      description: "Aim for at least 30 minutes of moderate physical activity most days of the week."
    },
    {
      title: "Medication Adherence",
      description: "Take prescribed medications according to your doctor's instructions and never skip doses."
    }
  ],
  recommendations: [
    "Schedule regular check-ups with your healthcare provider",
    "Consider consulting with a dietitian for personalized meal planning",
    "Keep a log of your blood sugar readings to track patterns",
    "Check your feet daily for cuts, blisters, or swelling"
  ]
};

const DiagnosisPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<typeof mockGeminiDiagnosis | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setIsAnalyzing(true);
    
    // Simulate API call to Gemini with a delay
    setTimeout(() => {
      // This is a mock implementation - in a real app, you would send the files to the Gemini API
      setDiagnosisResult(mockGeminiDiagnosis);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Your medical documents have been analyzed successfully.",
      });
    }, 3000);
  };

  const handleAddReminders = () => {
    navigate('/medications', { state: { addNew: true, condition: diagnosisResult?.condition } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">AI Diagnosis</h1>
          <p className="text-muted-foreground">
            Upload medical documents for Gemini AI to analyze and provide health insights
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
            <FileUpload onFilesSelected={handleFilesSelected} />
            
            <div className="mt-6 p-4 bg-accent/50 rounded-md">
              <h3 className="font-medium mb-2">About AI Diagnosis</h3>
              <p className="text-sm text-muted-foreground">
                Our system uses Google's Gemini AI to analyze your medical documents and provide 
                potential diagnoses based on symptoms and test results. Upload lab reports, 
                medical imaging reports, or detailed symptom descriptions for the best results.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Note:</strong> This AI analysis is not a substitute for professional medical advice. 
                Always consult with healthcare professionals for accurate diagnosis and treatment.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            {(isAnalyzing || diagnosisResult) ? (
              <DiagnosisResult
                isLoading={isAnalyzing}
                diagnosisData={diagnosisResult}
                onAddReminders={handleAddReminders}
              />
            ) : (
              <div className="border rounded-lg p-8 text-center">
                <div className="flex flex-col items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-12 w-12 text-muted-foreground/50 mb-2"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                  <h3 className="text-lg font-medium">No analysis yet</h3>
                </div>
                <p className="text-muted-foreground">
                  Upload your medical documents to receive an AI-powered diagnosis
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiagnosisPage;
