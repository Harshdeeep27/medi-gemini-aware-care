
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  notes: string;
  condition?: string;
};

type MedicationFormProps = {
  onSave: (medication: Medication) => void;
  onCancel: () => void;
  initialData?: Partial<Medication>;
};

export const MedicationForm = ({ onSave, onCancel, initialData = {} }: MedicationFormProps) => {
  const [name, setName] = useState(initialData.name || '');
  const [dosage, setDosage] = useState(initialData.dosage || '');
  const [frequency, setFrequency] = useState(initialData.frequency || 'daily');
  const [timeOfDay, setTimeOfDay] = useState<string[]>(initialData.timeOfDay || ['morning']);
  const [notes, setNotes] = useState(initialData.notes || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Medication name is required';
    if (!dosage.trim()) newErrors.dosage = 'Dosage is required';
    if (!frequency) newErrors.frequency = 'Frequency is required';
    if (timeOfDay.length === 0) newErrors.timeOfDay = 'Time of day is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newMedication: Medication = {
      id: initialData.id || Date.now().toString(),
      name,
      dosage,
      frequency,
      timeOfDay,
      notes,
      condition: initialData.condition,
    };
    
    onSave(newMedication);
    toast({
      title: `Medication ${initialData.id ? 'updated' : 'added'}`,
      description: `${name} has been ${initialData.id ? 'updated' : 'added'} successfully.`,
    });
  };

  const handleTimeOfDayChange = (time: string) => {
    setTimeOfDay(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time];
      }
    });
  };

  const timeOptions = [
    { value: 'morning', label: 'Morning' },
    { value: 'noon', label: 'Noon' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
    { value: 'bedtime', label: 'Bedtime' },
  ];

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialData.id ? 'Edit' : 'Add'} Medication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={errors.name ? 'text-destructive' : ''}>
              Medication Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter medication name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage" className={errors.dosage ? 'text-destructive' : ''}>
              Dosage
            </Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={e => setDosage(e.target.value)}
              placeholder="e.g., 10mg, 1 tablet"
              className={errors.dosage ? 'border-destructive' : ''}
            />
            {errors.dosage && (
              <p className="text-xs text-destructive">{errors.dosage}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency" className={errors.frequency ? 'text-destructive' : ''}>
              Frequency
            </Label>
            <Select
              value={frequency}
              onValueChange={setFrequency}
            >
              <SelectTrigger id="frequency" className={errors.frequency ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="twice_daily">Twice Daily</SelectItem>
                <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="as_needed">As Needed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.frequency && (
              <p className="text-xs text-destructive">{errors.frequency}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className={errors.timeOfDay ? 'text-destructive' : ''}>
              Time of Day
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {timeOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={timeOfDay.includes(option.value) ? "default" : "outline"}
                  className={`justify-start ${timeOfDay.includes(option.value) ? 'bg-primary' : ''}`}
                  onClick={() => handleTimeOfDayChange(option.value)}
                >
                  <div className="flex items-center">
                    <span>{option.label}</span>
                  </div>
                </Button>
              ))}
            </div>
            {errors.timeOfDay && (
              <p className="text-xs text-destructive">{errors.timeOfDay}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData.id ? 'Update' : 'Add'} Medication
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
