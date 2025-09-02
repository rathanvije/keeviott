import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Camera, Video } from "lucide-react";

export default function EngagementReport({ data, isLoading }) {
  return (
    <Card className="bg-white shadow-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--onyx-black)' }}>
            <Camera className="w-5 h-5" style={{ color: 'var(--stone-gray)' }} />
            Media Uploads
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
        {isLoading ? (
            <div className="w-full h-full bg-gray-100 rounded animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#6E6E6E" fontSize={12} />
              <YAxis stroke="#6E6E6E" fontSize={12} />
              <Tooltip 
                contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #eee',
                    borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="photos" stroke="var(--emerald-green)" strokeWidth={2} name="Photos" />
              <Line type="monotone" dataKey="videos" stroke="var(--champagne-gold)" strokeWidth={2} name="Videos" />
            </LineChart>
          </ResponsiveContainer>
        )}
        </div>
      </CardContent>
    </Card>
  );
}