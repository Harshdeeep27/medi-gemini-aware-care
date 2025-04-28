
import { Clock, Bell, Timer, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Medication } from './MedicationForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type MedicationListProps = {
  medications: Medication[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const MedicationList = ({ medications, onEdit, onDelete }: MedicationListProps) => {
  if (medications.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <Timer className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No medications yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first medication to start receiving reminders
        </p>
      </div>
    );
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Once daily';
      case 'twice_daily': return 'Twice daily';
      case 'three_times_daily': return 'Three times daily';
      case 'weekly': return 'Once a week';
      case 'as_needed': return 'As needed';
      case 'other': return 'Custom schedule';
      default: return frequency;
    }
  };

  const formatTimeOfDay = (times: string[]) => {
    return times.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');
  };

  return (
    <div className="space-y-4">
      {medications.map(medication => (
        <Card key={medication.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{medication.name}</CardTitle>
                <CardDescription>{medication.dosage}</CardDescription>
              </div>
              {medication.condition && (
                <Badge variant="outline" className="bg-accent text-accent-foreground">
                  {medication.condition}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{getFrequencyText(medication.frequency)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatTimeOfDay(medication.timeOfDay)}</span>
              </div>
              {medication.notes && (
                <div className="flex items-start text-sm">
                  <File className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{medication.notes}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(medication.id)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(medication.id)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
