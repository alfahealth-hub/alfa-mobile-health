import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ClipboardList, 
  ArrowLeft, 
  Save, 
  Plus,
  FileText,
  ChevronRight,
  UserCheck,
  Thermometer,
  Activity,
  Heart,
  Droplet,
  FlaskConical,
  Users
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Patient, PatientRecord } from '../types';
import { toast } from 'sonner';

interface PatientFileProps {
  patient: Patient;
  records: PatientRecord[];
  onBack: () => void;
  onUpdatePatient: (patient: Patient) => void;
  onAddRecord: () => void;
}

const PatientFile: React.FC<PatientFileProps> = ({ 
  patient, 
  records, 
  onBack, 
  onUpdatePatient,
  onAddRecord
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient>(patient);

  const patientRecords = useMemo(() => {
    return records.filter(r => r.patientId === patient.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records, patient.id]);

  const handleSave = () => {
    onUpdatePatient(editedPatient);
    setIsEditing(false);
    toast.success('Patient details updated');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            {patient.name}
            <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100 border-cyan-200">{patient.patientId}</Badge>
          </h2>
          <p className="text-muted-foreground text-sm">Patient File & History</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Patient Details */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-600" /> Personal Info
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-cyan-600 font-bold h-7"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Patient ID #</Label>
                    <Input 
                      value={editedPatient.patientId} 
                      onChange={(e) => setEditedPatient({...editedPatient, patientId: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={editedPatient.name} 
                      onChange={(e) => setEditedPatient({...editedPatient, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Age</Label>
                    <Input 
                      value={editedPatient.age} 
                      onChange={(e) => setEditedPatient({...editedPatient, age: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Gender</Label>
                    <Select 
                      value={editedPatient.gender} 
                      onValueChange={(val) => setEditedPatient({...editedPatient, gender: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <Input 
                      value={editedPatient.contact} 
                      onChange={(e) => setEditedPatient({...editedPatient, contact: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input 
                      value={editedPatient.email} 
                      onChange={(e) => setEditedPatient({...editedPatient, email: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Address</Label>
                    <Textarea 
                      value={editedPatient.address} 
                      onChange={(e) => setEditedPatient({...editedPatient, address: e.target.value})}
                    />
                  </div>
                  <Button className="w-full bg-cyan-600 mt-2" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <UserCheck className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Status / ID</p>
                      <p className="text-sm font-semibold">{patient.patientId || 'Not Assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Age</p>
                      <p className="text-sm font-semibold">{patient.age || 'N/A'} years</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Users className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Gender</p>
                      <p className="text-sm font-semibold">{patient.gender || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Phone className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Phone</p>
                      <p className="text-sm font-semibold">{patient.contact || 'No phone'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Mail className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Email</p>
                      <p className="text-sm font-semibold">{patient.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Address</p>
                      <p className="text-sm font-semibold">{patient.address || 'No address provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Records Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-cyan-600" /> Clinical History
            </h3>
            <Button onClick={onAddRecord} size="sm" className="bg-cyan-600">
              <Plus className="w-4 h-4 mr-2" /> New Entry
            </Button>
          </div>

          {patientRecords.length > 0 ? (
            <div className="space-y-4">
              {patientRecords.map((record) => (
                <Card key={record.id} className="group hover:border-cyan-200 transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4 w-full">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold">{record.diagnosis}</p>
                            <p className="text-xs text-muted-foreground">{record.date} {record.gender ? `\u2022 ${record.gender}` : ''}</p>
                          </div>
                        </div>

                        {/* Vitals Display in Timeline */}
                        {(record.temperature || record.bloodPressure || record.pulse || record.bloodSugar) && (
                          <div className="flex flex-wrap gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            {record.temperature && (
                              <div className="flex items-center gap-1.5">
                                <Thermometer className="w-3 h-3 text-cyan-600" />
                                <span className="text-[11px] font-bold">{record.temperature}\u00b0</span>
                              </div>
                            )}
                            {record.bloodPressure && (
                              <div className="flex items-center gap-1.5">
                                <Activity className="w-3 h-3 text-rose-500" />
                                <span className="text-[11px] font-bold">{record.bloodPressure}</span>
                              </div>
                            )}
                            {record.pulse && (
                              <div className="flex items-center gap-1.5">
                                <Heart className="w-3 h-3 text-red-500" />
                                <span className="text-[11px] font-bold">{record.pulse} bpm</span>
                              </div>
                            )}
                            {record.bloodSugar && (
                              <div className="flex items-center gap-1.5">
                                <Droplet className="w-3 h-3 text-amber-600" />
                                <span className="text-[11px] font-bold">{record.bloodSugar} mg/dL</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Symptoms</p>
                              <p className="text-slate-600">{record.symptoms}</p>
                            </div>
                            {record.laboratoryTests && (
                              <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                                <p className="text-[10px] uppercase font-bold text-purple-700 mb-1 flex items-center gap-1.5">
                                  <FlaskConical className="w-3 h-3" /> Laboratory Tests
                                </p>
                                <p className="text-slate-700 text-xs italic">{record.laboratoryTests}</p>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Treatment</p>
                            <p className="text-slate-600">{record.treatment}</p>
                          </div>
                        </div>
                        {record.referral && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100">
                            Referred: {record.referral}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 py-12 flex flex-col items-center justify-center text-center">
              <ClipboardList className="w-12 h-12 text-slate-200 mb-4" />
              <p className="font-semibold text-slate-900">No clinical records yet</p>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1 mb-4">Start by creating the first clinical entry for this patient.</p>
              <Button variant="outline" onClick={onAddRecord}>Create Entry</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientFile;