import React, { useState, useEffect, useCallback } from "react";
import { Event } from "@/api/entities";
import { Media } from "@/api/entities";
import { User } from "@/api/entities";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { subDays, isWithinInterval } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';


import AdminStats from "../components/admin/AdminStats";
import EventsTable from "../components/admin/EventsTable";
import ActivityFeed from "../components/admin/ActivityFeed";
import SalesReport from "../components/admin/SalesReport";
import EngagementReport from "../components/admin/EngagementReport";

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [media, setMedia] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalEvents: 0,
    totalGuests: 0,
    totalMedia: 0,
  });
  const [reportData, setReportData] = useState({ sales: [], engagement: [] });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const processReportData = useCallback((eventsData, mediaData) => {
    const today = new Date();
    const periods = {
      "24 Hours": { start: subDays(today, 1), end: today },
      "7 Days": { start: subDays(today, 7), end: today },
      "30 Days": { start: subDays(today, 30), end: today },
    };

    const sales = Object.keys(periods).map(periodKey => {
      const interval = periods[periodKey];
      const filteredEvents = eventsData.filter(e => e.is_paid && isWithinInterval(new Date(e.created_date), interval));
      return {
        name: periodKey,
        revenue: filteredEvents.reduce((acc, e) => acc + (e.total_charged || 0), 0),
      };
    });
    
    const engagement = Object.keys(periods).map(periodKey => {
        const interval = periods[periodKey];
        return {
            name: periodKey,
            photos: mediaData.filter(m => m.media_type === 'photo' && isWithinInterval(new Date(m.created_date), interval)).length,
            videos: mediaData.filter(m => m.media_type === 'video' && isWithinInterval(new Date(m.created_date), interval)).length,
        };
    });

    setReportData({ sales, engagement });
  }, []);

  const loadAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
        const user = await User.me();
        if (user.role !== 'admin') {
            navigate(createPageUrl('Dashboard'));
            return;
        }

      const [eventsData, mediaData] = await Promise.all([
        Event.list('-created_date', 500),
        Media.list('-created_date', 2000)
      ]);

      setEvents(eventsData);
      setMedia(mediaData);
      
      const totalRevenue = eventsData
        .filter(e => e.is_paid)
        .reduce((sum, e) => sum + (e.total_charged || 0), 0);
      
      const totalGuests = eventsData.reduce((sum, e) => sum + (e.guest_count || 0), 0);

      setStats({
        totalRevenue,
        totalEvents: eventsData.length,
        totalGuests: totalGuests,
        totalMedia: mediaData.length,
      });

      processReportData(eventsData, mediaData);

    } catch (error) {
      console.error('Error loading admin data:', error);
       if (error.message.includes('Unauthorized')) {
         navigate(createPageUrl('Dashboard'));
       }
    }
    setIsLoading(false);
  }, [processReportData, navigate]); 

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl mb-2 flex items-center gap-3" 
              style={{ color: 'var(--onyx-black)' }}>
            <BarChart3 className="w-8 h-8"/>
            Platform Analytics
          </h1>
          <p className="text-lg" style={{ color: 'var(--stone-gray)' }}>
            Monitor events, engagement, and platform health
          </p>
        </motion.div>

        <AdminStats stats={stats} isLoading={isLoading} />

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <SalesReport data={reportData.sales} isLoading={isLoading} />
          <EngagementReport data={reportData.engagement} isLoading={isLoading} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <EventsTable events={events} isLoading={isLoading} />
          </div>
          <div>
            <ActivityFeed events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}