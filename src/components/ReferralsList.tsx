import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Search, ExternalLink, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PatientRecord } from '../types';

interface ReferralsListProps {
  records: PatientRecord[];
}

const ReferralsList: React.FC<ReferralsListProps> = ({ records }) => {
  const referredPatients = records.filter(r => r.referral);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Referral Management</h2>
          <p className="text-muted-foreground">Track patients referred to external specialists or facilities.</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
          <Phone className="w-4 h-4 text-cyan-400" />
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Referral Support</p>
            <p className="text-sm font-bold">+234 912 790 4102</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search referrals..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {referredPatients.length > 0 ? (
          referredPatients.map((record) => (
            <Card key={record.id} className="overflow-hidden">
              <div className="h-1 bg-amber-500" />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{record.patientName}</h3>
                    <p className="text-xs text-muted-foreground">Referred on {record.date}</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Pending Review</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <ArrowUpRight className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Facility/Specialist</p>
                      <p className="text-sm font-medium">{record.referral}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Condition</p>
                      <p className="text-sm font-medium">{record.diagnosis}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button className="flex-1 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
              <ArrowUpRight className="w-8 h-8 text-amber-300" />
            </div>
            <h3 className="font-semibold text-slate-900">No active referrals</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-1">When you add a referral to a clinical entry, it will appear here for tracking.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralsList;