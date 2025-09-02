import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Wand2, X, Film, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { renderHighlightReel } from "@/api/functions";
import { Event } from "@/api/entities";

export default function HighlightReel({ event, featuredMedia, onRemoveFeature, onRenderComplete }) {
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState(null);

  const handleRender = async () => {
    if (featuredMedia.length < 3) {
      setError("Please select at least 3 featured clips to create a reel.");
      return;
    }
    
    setIsRendering(true);
    setError(null);
    
    try {
      await Event.update(event.id, { reel_status: 'rendering' });
      await renderHighlightReel({ 
          event_id: event.id,
          media_urls: featuredMedia.map(m => m.file_url)
      });
      // The backend will update the status to 'completed' or 'failed'.
      // The parent component will re-poll or receive a webhook to update the UI.
      onRenderComplete();
    } catch (err) {
      console.error("Failed to start render job:", err);
      setError("Something went wrong while starting the render. Please try again.");
      await Event.update(event.id, { reel_status: 'failed' });
      setIsRendering(false); // Allow user to retry
    }
  };
  
  if (event.reel_status === 'rendering') {
    return (
      <div className="text-center p-8 bg-white/80 rounded-lg shadow-md mb-8">
        <Loader2 className="w-12 h-12 mx-auto animate-spin mb-4" style={{color: 'var(--emerald-green)'}} />
        <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--onyx-black)'}}>Your highlight reel is rendering!</h3>
        <p className="mb-4" style={{color: 'var(--stone-gray)'}}>This may take a few minutes. The page will update automatically when it's ready.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 rounded-lg shadow-md mb-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--onyx-black)' }}>
            <Film className="w-6 h-6" style={{ color: 'var(--champagne-gold)' }} />
            AI Highlight Reel
          </h3>
          <p className="mt-1" style={{ color: 'var(--stone-gray)' }}>
            Select your favorite clips to generate a highlight reel.
          </p>
        </div>
        <Button 
          onClick={handleRender} 
          disabled={isRendering || featuredMedia.length < 3}
          className="keevio-bg-gold text-white hover:opacity-90"
          style={{ backgroundColor: 'var(--champagne-gold)' }}
        >
          {isRendering ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Rendering...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Reel ({featuredMedia.length})
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <p>{error}</p>
        </div>
      )}

      <AnimatePresence>
        {featuredMedia.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2"
          >
            {featuredMedia.map(media => (
              <motion.div
                key={media.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative"
              >
                <Badge className="pl-2 pr-7 py-1 text-sm bg-amber-100 text-amber-800 border-amber-200">
                  <Star className="w-3 h-3 mr-1.5 fill-current" />
                  {media.guest_name} - {media.media_type}
                </Badge>
                <button
                  onClick={() => onRemoveFeature(media)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}