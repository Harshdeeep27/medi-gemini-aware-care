
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { MedicationForm, Medication } from '@/components/MedicationForm';
import { MedicationList } from '@/components/MedicationList';
import { Timer } from 'lucide-react';

const MedicationReminders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  
  // Get any passed condition from route state
  const addNew = location.state?.addNew;
  const condition = location.state?.condition;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Load medications from localStorage
    const savedMedications = localStorage.getItem('medications');
    if (savedMedications) {
      setMedications(JSON.parse(savedMedications));
    }

    // If navigated from diagnosis page with addNew flag, open the form
    if (addNew) {
      setIsAdding(true);
    }
  }, [isAuthenticated, navigate, addNew]);

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  const handleAddMedication = () => {
    setEditingMedication(null);
    setIsAdding(true);
  };

  const handleEditMedication = (id: string) => {
    const medication = medications.find(med => med.id === id);
    if (medication) {
      setEditingMedication(medication);
      setIsAdding(true);
    }
  };

  const handleDeleteMedication = (id: string) => {
    const medicationToDelete = medications.find(med => med.id === id);
    
    if (medicationToDelete) {
      setMedications(medications.filter(med => med.id !== id));
      toast({
        title: "Medication removed",
        description: `${medicationToDelete.name} has been removed from your list.`,
      });
    }
  };

  const handleSaveMedication = (medication: Medication) => {
    if (editingMedication) {
      // Update existing medication
      setMedications(medications.map(med => 
        med.id === medication.id ? medication : med
      ));
    } else {
      // Add new medication
      setMedications([...medications, medication]);
      
      // Schedule push notification (simplified implementation)
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            // This is simulated - in a real app, we'd use a proper service worker
            setTimeout(() => {
              new Notification(`Time for your medication`, {
                body: `Remember to take ${medication.name} - ${medication.dosage}`,
                icon: '/favicon.ico'
              });
            }, 10000); // Show test notification after 10 seconds in this demo
            
            toast({
              title: "Notifications enabled",
              description: "You'll receive reminders for this medication",
            });
          }
        });
      }
    }
    
    setIsAdding(false);
    setEditingMedication(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingMedication(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Medication Reminders</h1>
              <p className="text-muted-foreground">
                Manage your medications and get timely reminders
              </p>
            </div>
            {!isAdding && (
              <Button onClick={handleAddMedication} className="md:self-start">
                Add Medication
              </Button>
            )}
          </div>
        </div>

        {isAdding ? (
          <MedicationForm 
            onSave={handleSaveMedication} 
            onCancel={handleCancel}
            initialData={editingMedication || { condition }}
          />
        ) : (
          <>
            <MedicationList 
              medications={medications}
              onEdit={handleEditMedication}
              onDelete={handleDeleteMedication}
            />
            
            {medications.length > 0 && (
              <div className="mt-8 p-4 bg-accent/50 rounded-md flex items-start gap-3">
                <Timer className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium mb-1">About Medication Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    Reminders will be sent as push notifications at the specified times. 
                    Make sure to allow notifications from this app in your browser or device settings.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MedicationReminders;
