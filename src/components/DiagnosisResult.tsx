
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type PrecautionType = {
  title: string;
  description: string;
};

type DiagnosisResultProps = {
  isLoading: boolean;
  diagnosisData?: {
    condition: string;
    description: string;
    confidence: number;
    precautions: PrecautionType[];
    recommendations: string[];
  };
  onAddReminders: () => void;
};

export const DiagnosisResult = ({ isLoading, diagnosisData, onAddReminders }: DiagnosisResultProps) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>Analyzing with Gemini AI</div>
            <Badge variant="outline" className="animate-pulse">Processing</Badge>
          </CardTitle>
          <CardDescription>Please wait while we analyze your medical documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-6 bg-muted/50 rounded animate-pulse"></div>
          <div className="h-24 bg-muted/50 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-1/3 bg-muted/50 rounded animate-pulse"></div>
            <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
            <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!diagnosisData) return null;

  // Format confidence as a percentage
  const confidencePercent = Math.round(diagnosisData.confidence * 100);
  
  // Determine confidence level for visual indication
  const getConfidenceLevel = () => {
    if (confidencePercent >= 80) return { color: 'text-green-500', label: 'High' };
    if (confidencePercent >= 50) return { color: 'text-amber-500', label: 'Medium' };
    return { color: 'text-red-500', label: 'Low' };
  };
  
  const confidenceLevel = getConfidenceLevel();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-xl">{diagnosisData.condition}</CardTitle>
            <CardDescription>AI-powered diagnosis results</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span>Confidence:</span>
            <Badge variant={confidencePercent >= 70 ? "default" : "outline"}>
              <span className={confidenceLevel.color}>{confidencePercent}%</span> {confidenceLevel.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-muted-foreground">{diagnosisData.description}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Precautions</h3>
          <div className="space-y-4">
            {diagnosisData.precautions.map((precaution, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="font-medium">{precaution.title}</div>
                <p className="text-sm text-muted-foreground">{precaution.description}</p>
              </div>
            ))}
          </div>
        </div>

        {diagnosisData.recommendations.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Recommendations</h3>
            <ul className="list-disc list-inside space-y-1">
              {diagnosisData.recommendations.map((recommendation, index) => (
                <li key={index} className="text-muted-foreground">{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.print()}>Save Report</Button>
        <Button onClick={onAddReminders}>Set Medication Reminders</Button>
      </CardFooter>
    </Card>
  );
};
