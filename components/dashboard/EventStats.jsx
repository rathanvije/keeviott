import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Camera, TrendingUp } from "lucide-react";

export default function EventStats({ stats, isLoading }) {
  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      color: "var(--champagne-gold)",
      bgColor: "bg-amber-50"
    },
    {
      title: "Guest Contributors",
      value: stats.totalGuests,
      icon: Users,
      color: "var(--emerald-green)",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Media Captured",
      value: stats.totalMedia,
      icon: Camera,
      color: "var(--stone-gray)",
      bgColor: "bg-gray-50"
    },
    {
      title: "Memories Created",
      value: "∞",
      icon: TrendingUp,
      color: "var(--champagne-gold)",
      bgColor: "bg-yellow-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: 'var(--stone-gray)' }}>
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: 'var(--onyx-black)' }}>
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  stat.value
                )}
              </div>
              <div className="flex items-center mt-2 text-sm" style={{ color: 'var(--emerald-green)' }}>
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Growing beautifully</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}