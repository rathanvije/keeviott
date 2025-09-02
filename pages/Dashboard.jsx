import React, { useState, useEffect } from "react";
import { Event } from "@/api/entities";
import { Media } from "@/api/entities";
import { Guest } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import EventCard from "../components/dashboard/EventCard";
import CreateEventDialog from "../components/dashboard/CreateEventDialog";
import EventStats from "../components/dashboard/EventStats";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalMedia: 0, totalGuests: 0 });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      let eventsData;
      if (user.role === 'admin') {
        eventsData = await Event.list('-created_date', 100);
      } else {
        eventsData = await Event.filter({ owner_email: user.email }, '-created_date', 50);
      }
      
      setEvents(eventsData);
      
      let totalMedia = 0;
      let totalGuests = 0;

      if (user.role === 'admin') {
         totalMedia = (await Media.list()).length;
         totalGuests = (await Guest.list()).length;
      } else {
        // More efficient: use the counts already on the event objects
        totalMedia = eventsData.reduce((sum, event) => sum + (event.media_count || 0), 0);
        totalGuests = eventsData.reduce((sum, event) => sum + (event.guest_count || 0), 0);
      }
      
      setStats({
        totalEvents: eventsData.length,
        totalMedia,
        totalGuests
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEventCreated = () => {
    setShowCreateDialog(false);
    loadData();
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl" style={{ color: 'var(--onyx-black)' }}>
              Your Wedding Events
            </h1>
            <p className="text-lg" style={{ color: 'var(--stone-gray)' }}>
              Create, manage, and share your most precious moments
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="keevio-bg-gold hover:opacity-90 text-white shadow-lg px-6 py-3 text-base"
            style={{ backgroundColor: 'var(--champagne-gold)' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Event
          </Button>
        </motion.div>

        <EventStats stats={stats} isLoading={isLoading} />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-semibold mb-6" 
              style={{ color: 'var(--onyx-black)' }}>
            Recent Events
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-white shadow-sm animate-pulse">
                  <CardHeader className="pb-4">
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-100 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 keevio-gold-gradient rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4" 
                  style={{ color: 'var(--onyx-black)' }}>
                Ready to capture your first event?
              </h3>
              <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: 'var(--stone-gray)' }}>
                Create your wedding event and start collecting beautiful memories from your guests
              </p>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                size="lg"
                className="keevio-bg-gold hover:opacity-90 text-white shadow-lg px-8 py-4"
                style={{ backgroundColor: 'var(--champagne-gold)' }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Event
              </Button>
            </motion.div>
          )}
        </motion.div>

        <CreateEventDialog 
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onEventCreated={handleEventCreated}
          user={currentUser}
        />
      </div>
    </div>
  );
}