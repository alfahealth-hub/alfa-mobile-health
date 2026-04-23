import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PatientRecord, Appointment, Patient } from '../types';
import { ClipboardList, Save, X, Calendar, User, Phone, Mail, Activity, Thermometer, Heart, Droplet, FlaskConical, Beaker } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface RecordFormProps {
  patients: Patient[];
  appointments: Appointment[];
  onSubmit: (data: Omit<PatientRecord, 'id'>, patientUpdate?: Partial<Patient>) => void;
  onCancel: () => void;
  preselectedPatientId?: string;
}

const RecordForm: React.FC<RecordFormProps> = ({ 
  patients, 
  appointments, 
  onSubmit, 
  onCancel,
  preselectedPatientId 
}) => {
  // If preselected, find the patient
  const prePatient = preselectedPatientId ? patients.find(p => p.id === preselectedPatientId) : null;

  const [formData, setFormData] = useState({
    patientName: prePatient?.name || '',
    patientId: preselectedPatientId || '',
    patientUid: prePatient?.patientId || '',
    appointmentId: '',
    history: '',
    symptoms: '',
    signs: '',
    diagnosis: '',
    treatment: '',
    referral: '',
    gender: prePatient?.gender || '',
    laboratoryTests: '',
    temperature: '',
    bloodPressure: '',
    bloodSugar: '',
    pulse: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [patientDetails, setPatientDetails] = useState({
    email: prePatient?.email || '',
    contact: prePatient?.contact || '',
    age: prePatient?.age || ''
  });

  // Filter relevant appointments (scheduled or in progress)
  const activeAppointments = appointments.filter(a => a.status !== 'done' && a.status !== 'cancelled');

  const handleAppointmentSelect = (apptId: string) => {
    if (apptId === 'none') {
      setFormData({...formData, appointmentId: '', patientId: '', patientName: '', patientUid: ''});
      return;
    }
    const appt = appointments.find(a => a.id === apptId);
    if (appt) {
      const patient = patients.find(p => p.id === appt.patientId);
      setFormData({
        ...formData,
        appointmentId: apptId,
        patientId: appt.patientId || '',
        patientName: appt.patientName,
        patientUid: patient?.patientId || '',
        gender: patient?.gender || formData.gender,
        symptoms: appt.reason || formData.symptoms
      });
      if (patient) {
        setPatientDetails({
          email: patient.email || '',
          contact: patient.contact || '',
          age: patient.age || ''
        });
      }
    }
  };

  const handlePatientSelect = (pId: string) => {
    const patient = patients.find(p => p.id === pId);
    if (patient) {
      setFormData({
        ...formData,
        patientId: pId,
        patientName: patient.name,
        patientUid: patient.patientId,
        gender: patient.gender || formData.gender
      });
      setPatientDetails({
        email: patient.email || '',
        contact: patient.contact || '',
        age: patient.age || ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.diagnosis) return;
    
    // Pass clinical record AND patient updates
    onSubmit(formData, {
      id: formData.patientId,
      email: patientDetails.email,
      contact: patientDetails.contact,
      age: patientDetails.age,
      gender: formData.gender,
      patientId: formData.patientUid
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <ClipboardList className="w-5 h-5 text-cyan-700" />
            </div>
            <div>
              <CardTitle>New Clinical Entry</CardTitle>
              <CardDescription>Record patient history, evaluation, and plan.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            {/* Quick Actions / Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="apptSelect" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  Link to Appointment (Optional)
                </Label>
                <Select 
                  value={formData.appointmentId} 
                  onValueChange={handleAppointmentSelect}
                >
                  <SelectTrigger id="apptSelect" className="bg-cyan-50/30 border-cyan-100">
                    <SelectValue placeholder="Select an active appointment..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No appointment</SelectItem>
                    {activeAppointments.map(appt => (
                      <SelectItem key={appt.id} value={appt.id}>
                        {appt.date} {appt.time} - {appt.patientName} ({appt.reason})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!preselectedPatientId && (
                <div className="grid gap-2">
                  <Label htmlFor="patientSelect" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-600" />
                    Existing Patient
                  </Label>
                  <Select 
                    value={formData.patientId} 
                    onValueChange={handlePatientSelect}
                  >
                    <SelectTrigger id="patientSelect" className="bg-cyan-50/30 border-cyan-100">
                      <SelectValue placeholder="Choose from registered patients..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} ({p.patientId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Patient Identity Section */}
            <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Patient Identification</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="patientUid">Patient ID #</Label>
                  <Input 
                    id="patientUid" 
                    placeholder="e.g. ALFA-001" 
                    value={formData.patientUid}
                    onChange={(e) => setFormData({...formData, patientUid: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input 
                    id="patientName" 
                    placeholder="Enter full name" 
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    placeholder="Years" 
                    value={patientDetails.age}
                    onChange={(e) => setPatientDetails({...patientDetails, age: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(val) => setFormData({...formData, gender: val})}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact" className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-slate-400" /> Phone
                  </Label>
                  <Input 
                    id="contact" 
                    placeholder="+234..." 
                    value={patientDetails.contact}
                    onChange={(e) => setPatientDetails({...patientDetails, contact: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-slate-400" /> Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="patient@example.com" 
                    value={patientDetails.email}
                    onChange={(e) => setPatientDetails({...patientDetails, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Vital Signs Section */}
            <div className="p-4 border border-cyan-100 bg-cyan-50/20 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                <p className="text-[10px] font-bold text-cyan-800 uppercase tracking-widest">Vital Signs</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="temperature" className="flex items-center gap-1.5">
                    <Thermometer className="w-3 h-3 text-slate-400" /> Temp (°C/F)
                  </Label>
                  <Input 
                    id="temperature" 
                    placeholder="e.g. 36.5" 
                    value={formData.temperature}
                    onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bloodPressure" className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-slate-400" /> BP (mmHg)
                  </Label>
                  <Input 
                    id="bloodPressure" 
                    placeholder="e.g. 120/80" 
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pulse" className="flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-slate-400" /> Pulse (bpm)
                  </Label>
                  <Input 
                    id="pulse" 
                    placeholder="e.g. 72" 
                    value={formData.pulse}
                    onChange={(e) => setFormData({...formData, pulse: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bloodSugar" className="flex items-center gap-1.5">
                    <Droplet className="w-3 h-3 text-slate-400" /> BS (mg/dL)
                  </Label>
                  <Input 
                    id="bloodSugar" 
                    placeholder="e.g. 95" 
                    value={formData.bloodSugar}
                    onChange={(e) => setFormData({...formData, bloodSugar: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Subjective & Objective */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-cyan-800 font-bold uppercase text-[10px] tracking-widest">Patient History (Subjective)</Label>
                  <Textarea 
                    placeholder="Past medical history, social history, etc." 
                    className="min-h-[100px]"
                    value={formData.history}
                    onChange={(e) => setFormData({...formData, history: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-cyan-800 font-bold uppercase text-[10px] tracking-widest">Symptoms (Chief Complaint)</Label>
                  <Textarea 
                    placeholder="What the patient is reporting..." 
                    className="min-h-[100px]"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-cyan-800 font-bold uppercase text-[10px] tracking-widest">Clinical Signs (Objective)</Label>
                  <Textarea 
                    placeholder="Physical exam findings... (Vitals recorded above)" 
                    className="min-h-[100px]"
                    value={formData.signs}
                    onChange={(e) => setFormData({...formData, signs: e.target.value})}
                  />
                </div>
              </div>

              {/* Right Column: Assessment & Plan */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-emerald-800 font-bold uppercase text-[10px] tracking-widest">Diagnosis (Assessment)</Label>
                  <Input 
                    placeholder="Clinical diagnosis..." 
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-purple-800 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <FlaskConical className="w-3 h-3" /> Laboratory Tests
                  </Label>
                  <Textarea 
                    placeholder="PCV, HIV, Ultrasound, etc." 
                    className="min-h-[100px]"
                    value={formData.laboratoryTests}
                    onChange={(e) => setFormData({...formData, laboratoryTests: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-emerald-800 font-bold uppercase text-[10px] tracking-widest">Treatment Plan (Plan)</Label>
                  <Textarea 
                    placeholder="Medications, advice, follow-up..." 
                    className="min-h-[100px]"
                    value={formData.treatment}
                    onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-amber-800 font-bold uppercase text-[10px] tracking-widest">Referral (Optional)</Label>
                  <Input 
                    placeholder="Refer to specialist or facility..." 
                    value={formData.referral}
                    onChange={(e) => setFormData({...formData, referral: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-slate-50/50 p-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-600">
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 shadow-md shadow-cyan-200">
              <Save className="w-4 h-4 mr-2" /> Save Patient Record
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RecordForm;