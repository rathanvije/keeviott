import React, { useState, useEffect, useCallback } from "react";
import { Event } from "@/api/entities";
import { Media } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lock } from "lucide-react";
import { motion } from "framer-motion";

import GalleryHeader from "../components/gallery/GalleryHeader";
import MediaGrid from "../components/gallery/MediaGrid";
import MediaViewer from "../components/gallery/MediaViewer";
import RenewAccess from "../components/gallery/RenewAccess";
import HighlightReel from "../components/gallery/HighlightReel";
import ReelPlayer from "../components/gallery/ReelPlayer";

export default function GalleryPage() {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [accessExpired, setAccessExpired] = useState(false);

  const isOwnerOrAdmin = currentUser?.email === currentEvent?.owner_email || currentUser?.role === 'admin';

  const loadMediaItems = useCallback(async (eventId) => {
    try {
      const media = await Media.filter({ 
        event_id: eventId, 
        approved: true,
        is_deleted: false
      }, '-capture_timestamp');
      setMediaItems(media);
    } catch (error) {
      console.error('Error loading media:', error);
    }
  }, []);

  const loadGallery = useCallback(async (eventId) => {
    setIsLoading(true);
    try {
      const user = await User.me().catch(() => null);
      setCurrentUser(user);

      const events = await Event.filter({ id: eventId });
      if (events.length === 0) {
        setCurrentEvent(null);
        return;
      }
      
      const event = events[0];
      setCurrentEvent(event);
      const isEventOwnerOrAdmin = user?.email === event.owner_email || user?.role === 'admin';

      if (event.access_expiry_date && new Date() > new Date(event.access_expiry_date) && !isEventOwnerOrAdmin) {
        setAccessExpired(true);
        return;
      }
      
      const sessionAuthenticated = sessionStorage.getItem(`keevio-auth-${eventId}`);
      if (event.privacy_setting === 'password_protected' && event.gallery_password && !isEventOwnerOrAdmin && !sessionAuthenticated) {
        setPasswordRequired(true);
        return;
      }
      
      setIsAuthenticated(true);
      await loadMediaItems(eventId);

    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadMediaItems]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');
    
    if (eventId) {
      loadGallery(eventId);
    } else {
      setIsLoading(false);
      setCurrentEvent(null);
    }
  }, [loadGallery]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredMedia(mediaItems);
    } else {
      setFilteredMedia(mediaItems.filter(item => item.media_type === filter));
    }
  }, [mediaItems, filter]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (currentEvent && password === currentEvent.gallery_password) {
      sessionStorage.setItem(`keevio-auth-${currentEvent.id}`, 'true');
      setPasswordRequired(false);
      setIsAuthenticated(true);
      await loadMediaItems(currentEvent.id);
    } else {
      alert("Incorrect password.");
    }
  };

  const handleMediaDelete = async (mediaId) => {
    if (!isOwnerOrAdmin) return;
    try {
        await Media.update(mediaId, { is_deleted: true });
        setMediaItems(prev => prev.filter(item => item.id !== mediaId));
        if (selectedMedia?.id === mediaId) {
            setSelectedMedia(null);
        }
    } catch (error) {
        console.error("Failed to delete media:", error);
    }
  };
  
  const handleToggleFeature = async (media) => {
    if (!isOwnerOrAdmin) return;
    try {
      const updatedMedia = await Media.update(media.id, { featured: !media.featured });
      setMediaItems(prev => prev.map(item => item.id === media.id ? updatedMedia : item));
      if (selectedMedia?.id === media.id) {
        setSelectedMedia(updatedMedia);
      }
    } catch (error) {
      console.error("Failed to feature media:", error);
    }
  };

  const handleReelReEdit = async () => {
    if (!currentEvent || !isOwnerOrAdmin) return;
    try {
      await Event.update(currentEvent.id, { reel_status: 'pending' });
      setCurrentEvent(prev => ({...prev, reel_status: 'pending'}));
    } catch (error) {
      console.error("Failed to reset reel status:", error);
    }
  };

  const handleRenew = async () => {
    if (!currentEvent) return;
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 30);
    try {
        await Event.update(currentEvent.id, { 
            access_expiry_date: newExpiryDate.toISOString(),
            total_charged: (currentEvent.total_charged || 0) + 99.00
        });
        setAccessExpired(false);
        loadGallery(currentEvent.id); 
    } catch (error) {
        console.error("Failed to renew access:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 keevio-gold-gradient rounded-full flex items-center justify-center animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg" style={{ color: 'var(--stone-gray)' }}>Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12" style={{ color: 'var(--stone-gray)' }} />
          </div>
          <h3 className="text-2xl font-semibold mb-4" 
              style={{ color: 'var(--onyx-black)' }}>
            Gallery Not Found
          </h3>
          <p className="text-lg" style={{ color: 'var(--stone-gray)' }}>
            Please check the URL or contact the event owner.
          </p>
        </div>
      </div>
    );
  }

  if (accessExpired) {
      return <RenewAccess event={currentEvent} onRenew={handleRenew} />;
  }
  
  if (passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8" style={{ color: 'var(--stone-gray)' }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" 
                  style={{ color: 'var(--onyx-black)' }}>
                Protected Gallery
              </h2>
              <p className="mb-6" style={{ color: 'var(--stone-gray)' }}>
                Enter the password to view {currentEvent.couple_name_1} & {currentEvent.couple_name_2}'s wedding memories
              </p>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Gallery password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-200 focus:border-amber-400"
                  required
                />
                <Button
                  type="submit"
                  className="w-full keevio-bg-gold hover:opacity-90 text-white"
                  style={{ backgroundColor: 'var(--champagne-gold)' }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Enter Gallery
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
      return null; // Don't render anything if not authenticated (avoids flash of content)
  }

  const featuredItems = mediaItems.filter(item => item.featured);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <GalleryHeader 
          event={currentEvent} 
          mediaCount={mediaItems.length}
          filter={filter}
          onFilterChange={setFilter}
        />
        
        {isOwnerOrAdmin && (
            <>
                {currentEvent.reel_status === 'completed' && currentEvent.highlight_reel_url ? (
                <ReelPlayer event={currentEvent} onReEdit={handleReelReEdit} />
                ) : (
                <HighlightReel 
                    event={currentEvent} 
                    featuredMedia={featuredItems} 
                    onRemoveFeature={handleToggleFeature}
                    onRenderComplete={() => loadGallery(currentEvent.id)}
                />
                )}
            </>
        )}

        <MediaGrid 
          mediaItems={filteredMedia}
          onMediaClick={setSelectedMedia}
          isOwnerOrAdmin={isOwnerOrAdmin}
          onMediaDelete={handleMediaDelete}
          onToggleFeature={handleToggleFeature}
        />

        <MediaViewer
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          isOwnerOrAdmin={isOwnerOrAdmin}
          onDelete={handleMediaDelete}
          onToggleFeature={handleToggleFeature}
        />
      </div>
    </div>
  );
}