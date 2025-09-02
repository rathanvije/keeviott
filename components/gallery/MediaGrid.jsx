import React from 'react';
import { Play, Heart, User, Trash2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function MediaGrid({ mediaItems, onMediaClick, isOwnerOrAdmin, onMediaDelete, onToggleFeature }) {
  if (mediaItems.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10" style={{ color: 'var(--stone-gray)' }} />
        </div>
        <h3 className="text-2xl font-semibold mb-4" 
            style={{ color: 'var(--onyx-black)' }}>
          No memories yet
        </h3>
        <p className="text-lg" style={{ color: 'var(--stone-gray)' }}>
          Be the first to share a moment! The gallery will fill up as guests contribute.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <AnimatePresence>
        {mediaItems.map((media, index) => (
          <motion.div
            key={media.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
          >
            <div 
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => onMediaClick(media)}
            >
              <div className="relative w-full h-full">
                <img 
                  src={media.thumbnail_url || (media.media_type === 'photo' ? media.file_url : '')}
                  alt={`Media by ${media.guest_name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"></div>

                {media.media_type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-70 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 ml-1" style={{ color: 'var(--champagne-gold)' }} />
                        </div>
                    </div>
                )}
                
                {media.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {Math.round(media.duration)}s
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 text-white text-xs">
                  <User className="w-3 h-3" />
                  <span>{media.guest_name}</span>
                </div>
              </div>
              
              {media.featured && (
                <div className="absolute top-2 right-2 w-7 h-7 keevio-gold-gradient rounded-full flex items-center justify-center shadow">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              )}
            </div>
            
            {isOwnerOrAdmin && (
              <>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/80 hover:bg-red-600 z-10"
                  onClick={(e) => {
                      e.stopPropagation();
                      onMediaDelete(media.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`absolute bottom-2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity z-10 
                    ${media.featured 
                      ? 'bg-amber-400 hover:bg-amber-500 text-white border-amber-500' 
                      : 'bg-white/80 hover:bg-white'
                    }`
                  }
                  onClick={(e) => {
                      e.stopPropagation();
                      onToggleFeature(media);
                  }}
                >
                  <Star className={`w-4 h-4 ${media.featured ? 'fill-current' : ''}`} />
                </Button>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}