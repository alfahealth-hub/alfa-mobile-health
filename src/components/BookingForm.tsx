import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, UserPlus, Users, Mail, MapPin } from 'lucide-react';
import { Appointment, Patient, AppointmentStatus } from '../types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface BookingFormProps {
  patients: Patient[];
  onSubmit: (data: Omit<Appointment, 'id'>, newPatient?: Omit<Patient, 'id'>) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ patients, onSubmit, onCancel }) => {
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    reason: '',
    status: 'scheduled' as AppointmentStatus,
  });

  const [newPatientData, setNewPatientData] = useState({
    name: '',
    age: '',
    contact: '',
    email: '',
    address: '',
    patientId: 'ALFA-' + Math.floor(1000 + Math.random() * 9000),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNewPatient) {
      if (!newPatientData.name || !formData.date || !formData.time) return;
      onSubmit(
        { 
          ...formData, 
          patientName: newPatientData.name, 
          patientId: '' 
        }, 
        newPatientData
      );
    } else {
      if (!formData.patientId || !formData.date || !formData.time) return;
      const patient = patients.find(p => p.id === formData.patientId);
      onSubmit({
        ...formData,
        patientName: patient?.name || 'Unknown Patient'
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Book Appointment</CardTitle>
          <CardDescription>Schedule a mobile care visit for a patient.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Patient Information</Label>
              <ToggleGroup 
                type="single" 
                value={isNewPatient ? 'new' : 'existing'}
                onValueChange={(val) => val && setIsNewPatient(val === 'new')}
                className="justify-start"
              >
                <ToggleGroupItem value="existing" className="gap-2">
                  <Users className="w-4 h-4" /> Existing Patient
                </ToggleGroupItem>
                <ToggleGroupItem value="new" className="gap-2">
                  <UserPlus className="w-4 h-4" /> New Patient
                </ToggleGroupItem>
              </ToggleGroup>

              {isNewPatient ? (
                <div className="grid gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="newName">Full Name</Label>
                      <Input 
                        id="newName"
                        placeholder="Patient Full Name"
                        value={newPatientData.name}
                        onChange={(e) => setNewPatientData({...newPatientData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newUid">Patient ID (Unique)</Label>
                      <Input 
                        id="newUid"
                        placeholder="ALFA-0000"
                        value={newPatientData.patientId}
                        onChange={(e) => setNewPatientData({...newPatientData, patientId: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="newAge">Age</Label>
                      <Input 
                        id="newAge"
                        placeholder="Years"
                        value={newPatientData.age}
                        onChange={(e) => setNewPatientData({...newPatientData, age: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newContact">Phone</Label>
                      <Input 
                        id="newContact"
                        placeholder="+234..."
                        value={newPatientData.contact}
                        onChange={(e) => setNewPatientData({...newPatientData, contact: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newEmail">Email (Optional)</Label>
                      <Input 
                        id="newEmail"
                        type="email"
                        placeholder="email@example.com"
                        value={newPatientData.email}
                        onChange={(e) => setNewPatientData({...newPatientData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newAddress">Address</Label>
                    <Input 
                      id="newAddress"
                      placeholder="Street, City, State"
                      value={newPatientData.address}
                      onChange={(e) => setNewPatientData({...newPatientData, address: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="patientSelect">Select Patient</Label>
                  <Select 
                    value={formData.patientId} 
                    onValueChange={(val) => setFormData({...formData, patientId: val})}
                  >
                    <SelectTrigger id="patientSelect" className="h-12">
                      <SelectValue placeholder="Choose a registered patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.patientId})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea 
                id="reason" 
                placeholder="Brief description of symptoms or routine care..." 
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                required
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-dashed flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Need Help Booking?</p>
                <p className="text-sm font-bold text-slate-900">Contact support at +234 912 790 4102</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">Confirm Booking</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default BookingForm;