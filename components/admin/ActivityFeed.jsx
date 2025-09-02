import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, PlusCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

export default function ActivityFeed({ events }) {
  const sortedEvents = events ? [...events].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)) : [];
  
  return (
    <Card className="bg-white shadow-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--onyx-black)' }}>
            <Bell className="w-5 h-5" style={{ color: 'var(--stone-gray)' }} />
            Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.slice(0, 5).map(event => (
            <div key={event.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <PlusCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--onyx-black)' }}>
                        New Event: {event.couple_name_1} & {event.couple_name_2}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--stone-gray)' }}>
                        {formatDistanceToNow(new Date(event.created_date), { addSuffix: true })}
                    </p>
                </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}