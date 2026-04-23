import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  ClipboardList, 
  ArrowUpRight, 
  Menu, 
  X,
  Stethoscope,
  Activity,
  Search,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Types
import { Appointment, PatientRecord, Patient, AppointmentStatus } from './types';

// Components
import Dashboard from './components/Dashboard';
import BookingForm from './components/BookingForm';
import RecordsList from './components/RecordsList';
import RecordForm from './components/RecordForm';
import ReferralsList from './components/ReferralsList';
import PatientFile from './components/PatientFile';

const ALFA_LOGO = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4476e5f0-caf4-45b6-b03c-984d49740cd7/alfa-health-logo-5679ff83-1776815174355.webp";

const DEFAULT_PATIENTS: Patient[] = [
  { id: 'p1', patientId: 'ALFA-1021', name: 'John Doe', age: '45', contact: '+234 800 000 0001', email: 'john.doe@email.com' },
  { id: 'p2', patientId: 'ALFA-2940', name: 'Jane Smith', age: '32', contact: '+234 800 000 0002', email: 'jane.smith@email.com' },
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  { id: '1', patientId: 'p1', patientName: 'John Doe', date: '2024-05-20', time: '10:00', status: 'scheduled', reason: 'Routine Checkup' },
  { id: '2', patientId: 'p2', patientName: 'Jane Smith', date: '2024-05-21', time: '14:30', status: 'scheduled', reason: 'Fever and Cough' },
];

const DEFAULT_RECORDS: PatientRecord[] = [
  { 
    id: 'r1', 
    patientId: 'p1', 
    patientUid: 'ALFA-1021',
    patientName: 'John Doe', 
    history: 'No significant past medical history. Non-smoker.',
    symptoms: 'Persistent cough for 3 days',
    signs: 'Temperature 101F, clear lung sounds',
    diagnosis: 'Common Cold',
    treatment: 'Rest, fluids, paracetamol 500mg as needed.',
    referral: '',
    date: '2024-05-15'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  
  // State with Persistence
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem('alfa_health_patients');
      return saved ? JSON.parse(saved) : DEFAULT_PATIENTS;
    } catch (error) {
      console.error('Error loading patients:', error);
      return DEFAULT_PATIENTS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('alfa_health_appointments');
      return saved ? JSON.parse(saved) : DEFAULT_APPOINTMENTS;
    } catch (error) {
      console.error('Error loading appointments:', error);
      return DEFAULT_APPOINTMENTS;
    }
  });

  const [records, setRecords] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem('alfa_health_records');
      return saved ? JSON.parse(saved) : DEFAULT_RECORDS;
    } catch (error) {
      console.error('Error loading records:', error);
      return DEFAULT_RECORDS;
    }
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('alfa_health_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('alfa_health_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('alfa_health_records', JSON.stringify(records));
  }, [records]);

  const handleAddAppointment = (appointment: Omit<Appointment, 'id'>, newPatient?: Omit<Patient, 'id'>) => {
    let patientId = appointment.patientId;

    // If it's a new patient, create them first
    if (newPatient) {
      const newP = { ...newPatient, id: 'p-' + Math.random().toString(36).substr(2, 9) };
      setPatients(prev => [...prev, newP]);
      patientId = newP.id;
    }

    const newAppt = { 
      ...appointment, 
      patientId, 
      id: 'a-' + Math.random().toString(36).substr(2, 9) 
    } as Appointment;
    
    setAppointments([newAppt, ...appointments]);
    toast.success('Appointment booked successfully!');
    setActiveTab('dashboard');
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.info(`Appointment marked as ${status}`);
  };

  const handleAddRecord = (record: Omit<PatientRecord, 'id'>, patientUpdate?: Partial<Patient>) => {
    const newRecord = { ...record, id: 'r-' + Math.random().toString(36).substr(2, 9) } as PatientRecord;
    setRecords([newRecord, ...records]);

    // Update patient details if provided (contacts, ID, etc.)
    if (patientUpdate && patientUpdate.id) {
       setPatients(prev => prev.map(p => p.id === patientUpdate.id ? { ...p, ...patientUpdate } : p));
    } else if (!record.patientId && record.patientName) {
      // This is a new patient created during record entry
      const newPId = 'p-' + Math.random().toString(36).substr(2, 9);
      const newPatient: Patient = {
        id: newPId,
        patientId: record.patientUid || 'ALFA-' + Math.floor(1000 + Math.random() * 9000),
        name: record.patientName,
        age: (patientUpdate as any)?.age || '',
        contact: (patientUpdate as any)?.contact || '',
        email: (patientUpdate as any)?.email || '',
      };
      setPatients(prev => [...prev, newPatient]);
      // Link the record to the new patient
      newRecord.patientId = newPId;
    }

    // If this record is linked to an appointment, mark appointment as done
    if (record.appointmentId) {
      handleUpdateAppointmentStatus(record.appointmentId, 'done');
    }

    toast.success('Patient record saved!');
    setActiveTab('records');
    setActivePatientId(null);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    // Also update patient name in records/appointments for consistency
    setRecords(prev => prev.map(r => r.patientId === updatedPatient.id ? { ...r, patientName: updatedPatient.name, patientUid: updatedPatient.patientId } : r));
    setAppointments(prev => prev.map(a => a.patientId === updatedPatient.id ? { ...a, patientName: updatedPatient.name } : a));
  };

  const handleViewPatient = (id: string) => {
    setActivePatientId(id);
    setActiveTab('patient-file');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'book', label: 'Book Appointment', icon: CalendarDays },
    { id: 'records', label: 'Patient Management', icon: ClipboardList },
    { id: 'new-record', label: 'Clinical Entry', icon: Stethoscope },
    { id: 'referrals', label: 'Referrals', icon: ArrowUpRight },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Toaster position="top-right" expand={false} richColors />
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={ALFA_LOGO} alt="Alfa Health" className="w-8 h-8 rounded-full object-cover shadow-sm" />
          <span className="font-bold text-cyan-700">Alfa Health</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 hidden md:flex items-center gap-3">
            <img src={ALFA_LOGO} alt="Alfa Health" className="w-10 h-10 rounded-full object-cover shadow-md" />
            <div>
              <h1 className="font-bold text-cyan-800 leading-none">Alfa Health</h1>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">Mobile Care</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setActivePatientId(null);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${activeTab === item.id 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-100' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="bg-slate-900 text-white p-4 rounded-2xl relative overflow-hidden">
              <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Emergency Hub</p>
              <p className="text-lg font-bold mb-3">+234 912 790 4102</p>
              <Button size="sm" variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Desktop Bar */}
        <div className="hidden md:flex bg-white border-b h-16 items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search records..." className="pl-10 bg-slate-50 border-none h-10 focus-visible:ring-cyan-500" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold">Faruq T. A.</p>
                <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest">Primary Care</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold border border-cyan-200">
                FA
              </div>
            </div>
          </div>
        </div>

        {/* Content Render */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (activePatientId || '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard 
                  appointments={appointments} 
                  records={records} 
                  onTabChange={setActiveTab} 
                  onUpdateStatus={handleUpdateAppointmentStatus}
                />
              )}
              {activeTab === 'book' && (
                <BookingForm 
                  patients={patients}
                  onSubmit={handleAddAppointment} 
                  onCancel={() => setActiveTab('dashboard')} 
                />
              )}
              {activeTab === 'records' && (
                <RecordsList 
                  records={records} 
                  patients={patients} 
                  onAdd={() => setActiveTab('new-record')} 
                  onViewPatient={handleViewPatient}
                />
              )}
              {activeTab === 'new-record' && (
                <RecordForm 
                  patients={patients}
                  appointments={appointments}
                  onSubmit={handleAddRecord} 
                  onCancel={() => setActiveTab('records')} 
                  preselectedPatientId={activePatientId || undefined}
                />
              )}
              {activeTab === 'patient-file' && activePatientId && (
                <PatientFile 
                  patient={patients.find(p => p.id === activePatientId)!} 
                  records={records}
                  onBack={() => setActiveTab('records')}
                  onUpdatePatient={handleUpdatePatient}
                  onAddRecord={() => setActiveTab('new-record')}
                />
              )}
              {activeTab === 'referrals' && (
                <ReferralsList records={records} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;