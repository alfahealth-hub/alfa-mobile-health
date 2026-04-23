import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, FileText, ChevronRight, ClipboardList, Calendar, User, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PatientRecord, Patient } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RecordsListProps {
  records: PatientRecord[];
  patients: Patient[];
  onAdd: () => void;
  onViewPatient: (id: string) => void;
}

const RecordsList: React.FC<RecordsListProps> = ({ records, patients, onAdd, onViewPatient }) => {
  const [search, setSearch] = useState('');

  const filteredRecords = records.filter(r => 
    r.patientName.toLowerCase().includes(search.toLowerCase()) || 
    r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    r.patientUid?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.patientId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Clinical Archive</h2>
          <p className="text-muted-foreground">Manage patients and historical clinical data.</p>
        </div>
        <Button onClick={onAdd} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-2" /> New Entry
        </Button>
      </div>

      <Tabs defaultValue="patients" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
            <TabsTrigger value="patients" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <User className="w-4 h-4 mr-2" /> Patients
            </TabsTrigger>
            <TabsTrigger value="records" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4 mr-2" /> All Records
            </TabsTrigger>
          </TabsList>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by name, ID, or diagnosis..." 
              className="pl-10 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="patients" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <Card 
                  key={patient.id} 
                  className="group hover:border-cyan-200 transition-all cursor-pointer overflow-hidden"
                  onClick={() => onViewPatient(patient.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-700 font-black text-xl border border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                        {patient.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold truncate">{patient.name}</h3>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                           <Badge variant="secondary" className="w-fit bg-slate-100 text-[10px] uppercase font-bold tracking-wider">
                            {patient.patientId}
                          </Badge>
                          <p className="text-xs text-slate-500">{patient.contact || 'No contact info'}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-cyan-500 transition-colors shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed">
                <User className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900">No patients found</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-1">Try a different search term or register a new patient.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="records" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <Card 
                  key={record.id} 
                  className="group hover:border-cyan-200 transition-all cursor-pointer"
                  onClick={() => onViewPatient(record.patientId)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg">{record.patientName}</h3>
                            <Badge variant="secondary" className="bg-slate-100 text-[10px] uppercase">{record.date}</Badge>
                            <span className="text-[10px] font-bold text-cyan-600">{record.patientUid}</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Diagnosis:</span> {record.diagnosis}</p>
                            <p className="text-sm text-slate-600 line-clamp-1"><span className="font-medium text-slate-900">Treatment:</span> {record.treatment}</p>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-cyan-500 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900">No records found</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-1">Try adjusting your search or add a new clinical entry.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecordsList;