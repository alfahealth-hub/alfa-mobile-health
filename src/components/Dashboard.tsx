import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CalendarDays, 
  ClipboardList, 
  ArrowUpRight, 
  Clock, 
  Plus, 
  Stethoscope,
  Activity,
  Phone,
  CheckCircle2,
  Timer,
  Calendar
} from 'lucide-react';
import { Appointment, PatientRecord, AppointmentStatus } from '../types';
import { 
  DropdownMenu as Dropdown, 
  DropdownMenuContent as Content, 
  DropdownMenuItem as Item, 
  DropdownMenuTrigger as Trigger 
} from '@/components/ui/dropdown-menu';

interface DashboardProps {
  appointments: Appointment[];
  records: PatientRecord[];
  onTabChange: (tab: string) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appointments, records, onTabChange, onUpdateStatus }) => {
  const HERO_IMAGE = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4476e5f0-caf4-45b6-b03c-984d49740cd7/hero-healthcare-tech-84163a36-1776815175365.webp";
  
  const stats = [
    { label: 'Total Appointments', value: appointments.length, icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Clinical Logs', value: records.length, icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Referrals', value: records.filter(r => r.referral).length, icon: ArrowUpRight, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const activeAppointments = appointments.filter(a => a.status !== 'done' && a.status !== 'cancelled');

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">Scheduled</Badge>;
      case 'in progress':
        return <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">In Progress</Badge>;
      case 'done':
        return <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">Done</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-slate-200 text-slate-500 bg-slate-50">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 min-h-[300px] flex items-center">
        <img 
          src={HERO_IMAGE} 
          alt="Healthcare Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
        <div className="relative z-10 px-6 md:px-12 max-w-2xl">
          <Badge className="bg-cyan-500 hover:bg-cyan-500 mb-4 px-4 py-1 uppercase text-[10px] tracking-widest text-white">Clinical Workspace</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Deliver better care, anywhere.</h2>
          <p className="text-slate-200 text-lg mb-8 leading-relaxed opacity-90">Manage mobile health services, track patient history, and handle referrals in one place.</p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => onTabChange('book')} className="bg-white text-slate-900 hover:bg-white/90 rounded-xl h-12 px-6 font-bold shadow-xl border-none">
              <Plus className="w-4 h-4 mr-2" /> Book Appointment
            </Button>
            <Button onClick={() => onTabChange('new-record')} variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl h-12 px-6 font-bold backdrop-blur-sm">
              <Stethoscope className="w-4 h-4 mr-2" /> Log Visit
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6 flex items-center gap-5">
              <div className={`${stat.bg} p-4 rounded-2xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Appointments */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-6">
            <div>
              <CardTitle className="text-xl">Active Visits</CardTitle>
              <CardDescription>Scheduled and ongoing care</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onTabChange('book')} className="text-cyan-600 font-bold">View All</Button>
          </CardHeader>
          <CardContent className="p-0 px-2 pb-2">
            {activeAppointments.length > 0 ? (
              <div className="space-y-1">
                {activeAppointments.slice(0, 5).map((appt) => (
                  <div key={appt.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all rounded-xl group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center font-bold text-cyan-700 border border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        {appt.patientName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900">{appt.patientName}</p>
                          {getStatusBadge(appt.status)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {appt.time} \u2022 {appt.reason}
                        </div>
                      </div>
                    </div>
                    <Dropdown>
                      <Trigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 font-bold text-xs gap-1">
                          Update Status
                        </Button>
                      </Trigger>
                      <Content align="end">
                        <Item onClick={() => onUpdateStatus(appt.id, 'scheduled')} className="gap-2 cursor-pointer">
                          <Calendar className="w-4 h-4 text-blue-600" /> Scheduled
                        </Item>
                        <Item onClick={() => onUpdateStatus(appt.id, 'in progress')} className="gap-2 cursor-pointer">
                          <Timer className="w-4 h-4 text-amber-600" /> In Progress
                        </Item>
                        <Item onClick={() => onUpdateStatus(appt.id, 'done')} className="gap-2 cursor-pointer">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Done
                        </Item>
                      </Content>
                    </Dropdown>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground">No active appointments.</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Records */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-6">
            <div>
              <CardTitle className="text-xl">Clinical Activity</CardTitle>
              <CardDescription>Latest patient reports</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onTabChange('records')} className="text-cyan-600 font-bold">Archives</Button>
          </CardHeader>
          <CardContent className="p-0 px-2 pb-2">
            {records.length > 0 ? (
              <div className="space-y-1">
                {records.slice(0, 5).map((record) => (
                  <div key={record.id} className="p-4 hover:bg-slate-50 transition-all rounded-xl cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-slate-900">{record.patientName}</p>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{record.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-1 italic">Diagnosis: {record.diagnosis}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] py-0 h-5 border-emerald-200 text-emerald-700 bg-emerald-50 px-2 uppercase font-bold">
                        Report Filed
                      </Badge>
                      {record.referral && (
                        <Badge variant="outline" className="text-[10px] py-0 h-5 border-amber-200 text-amber-700 bg-amber-50 px-2 uppercase font-bold">
                          Referred
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground">No clinical logs found.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Hub Section */}
      <Card className="border-none bg-slate-900 text-white shadow-xl rounded-3xl overflow-hidden relative group">
        <Activity className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 group-hover:text-white/10 transition-colors" />
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-xl">Emergency Hub</CardTitle>
              <CardDescription className="text-slate-400">Rapid coordination and support line</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/80">Emergency Contact Number</label>
              <div className="relative group/input">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                <Input 
                  placeholder="+234 912 790 4102" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 pl-12 rounded-xl border-dashed hover:border-white/30 transition-all"
                  defaultValue="+234 912 790 4102"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-cyan-900/40 border-none transition-all active:scale-[0.98]">
                Connect to Support
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 h-12 w-12 rounded-xl p-0 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;