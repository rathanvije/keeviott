import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign } from "lucide-react";

export default function SalesReport({ data, isLoading }) {
  return (
    <Card className="bg-white shadow-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--onyx-black)' }}>
            <DollarSign className="w-5 h-5" style={{ color: 'var(--emerald-green)' }} />
            Revenue Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
        {isLoading ? (
            <div className="w-full h-full bg-gray-100 rounded animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#6E6E6E" fontSize={12} />
              <YAxis 
                stroke="#6E6E6E" 
                fontSize={12} 
                tickFormatter={(value) => `$${value}`} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(200, 169, 81, 0.1)' }}
                contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #eee',
                    borderRadius: '0.5rem'
                }}
              />
              <Bar dataKey="revenue" fill="var(--champagne-gold)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        </div>
      </CardContent>
    </Card>
  );
}