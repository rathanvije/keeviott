import React, { useState, useEffect } from "react";
import { Event } from "@/api/entities";
import { Guest } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Camera, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import QRDisplay from "../components/capture/QRDisplay";
import GuestUpload from "../components/capture/GuestUpload";
import ConsentForm from "../components/capture/ConsentForm";

export default function CapturePage() {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [guestMode, setGuestMode] = useState(false);
  const [currentGuest, setCurrentGuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventIdFromUrl = urlParams.get('event');
    const guestIdFromUrl = urlParams.get('guest');

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      if (!eventIdFromUrl) {
        setError("No event specified. Please use the link provided by the event host.");
        setIsLoading(false);
        return;
      }

      try {
        const events = await Event.filter({ id: eventIdFromUrl });
        if (events.length === 0) {
          setError("Event not found. Please check the event link.");
          setIsLoading(false);
          return;
        }

        const event = events[0];
        setCurrentEvent(event);

        if (guestIdFromUrl) {
          setGuestMode(true);
          // If a guest ID is stored in localStorage for this event, use it.
          const storedGuestId = localStorage.getItem(`keevio-guest-${eventIdFromUrl}`);
          if (storedGuestId) {
             const guests = await Guest.filter({ id: storedGuestId, event_id: eventIdFromUrl });
             if (guests.length > 0) {
               setCurrentGuest(guests[0]);
             } else {
               localStorage.removeItem(`keevio-guest-${eventIdFromUrl}`); // Clean up invalid ID
             }
          }
        }
      } catch (err) {
        console.error('Error loading capture page:', err);
        setError("Could not load the event due to a technical issue. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleGuestRegistration = async (guestData) => {
    setError(null);

    if (!currentEvent) {
      setError("Cannot register guest: Event information is missing.");
      return;
    }

    try {
      const guest = await Guest.create({
        event_id: currentEvent.id,
        ...guestData,
        consent_given: true,
      });
      setCurrentGuest(guest);
      localStorage.setItem(`keevio-guest-${currentEvent.id}`, guest.id);

      await Event.update(currentEvent.id, {
        guest_count: (currentEvent.guest_count || 0) + 1
      });

    } catch (err) {
      console.error('Error registering guest:', err);
      setError("Failed to register. Please ensure all details are correct and try again.");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 keevio-gold-gradient rounded-full flex items-center justify-center animate-pulse">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg" style={{ color: 'var(--stone-gray)' }}>Loading capture portal...</p>
          </div>
        </div>
      );
    }

    if (error && !currentEvent) {
       return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Camera className="w-12 h-12" style={{ color: 'var(--stone-gray)' }} />
          </div>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--onyx-black)' }}>
            Error Loading Event
          </h3>
          <p className="text-lg" style={{ color: 'var(--stone-gray)' }}>
            {error}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </motion.div>
      );
    }
    
    if (!currentEvent) {
        return null; // Should be covered by error state, but as a fallback.
    }

    if (!guestMode) {
      return <QRDisplay event={currentEvent} />;
    }

    if (!currentGuest) {
      return <ConsentForm event={currentEvent} onConsent={handleGuestRegistration} />;
    }

    return <GuestUpload event={currentEvent} guest={currentGuest} />;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold" 
              style={{ color: 'var(--onyx-black)' }}>
            Capture Portal
          </h1>
          <p className="text-lg" style={{ color: 'var(--stone-gray)' }}>
            Share moments that matter
          </p>
          {error && currentEvent && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-2"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}