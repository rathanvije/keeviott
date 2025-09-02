import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calendar, MapPin, Share, Download } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function GalleryHeader({ event, mediaCount, filter, onFilterChange }) {
  const handleShare = () => {
      if (navigator.share) {
          navigator.share({
              title: `${event.couple_name_1} & ${event.couple_name_2}'s Wedding Gallery`,
              text: 'Check out the wedding gallery!',
              url: window.location.href,
          });
      } else {
          navigator.clipboard.writeText(window.location.href);
          alert('Gallery link copied to clipboard!');
      }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="w-20 h-20 mx-auto mb-6 keevio-gold-gradient rounded-full flex items-center justify-center shadow-lg">
        <Heart className="w-10 h-10 text-white" />
      </div>
      
      <h1 className="text-4xl md:text-5xl mb-2" 
          style={{ color: 'var(--onyx-black)' }}>
        {event.couple_name_1} & {event.couple_name_2}
      </h1>
      
      <h2 className="text-xl mb-4" 
         style={{ color: 'var(--champagne-gold)' }}>
        {event.event_name}
      </h2>
      
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-6 text-sm" 
           style={{ color: 'var(--stone-gray)' }}>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{event.event_date ? format(new Date(event.event_date), "MMMM d, yyyy") : 'Date TBD'}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        )}
        <Badge variant="outline" className="border-amber-300 text-amber-700">
          {mediaCount} memories captured
        </Badge>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <Tabs value={filter} onValueChange={onFilterChange}>
          <TabsList className="bg-white border">
            <TabsTrigger value="all">All Media</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="photo">Photos</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="hover:bg-amber-50 hover:border-amber-300"
          >
            <Share className="w-4 h-4 mr-2" />
            Share Gallery
          </Button>
          <Button 
            size="sm"
            className="keevio-bg-gold hover:opacity-90 text-white"
            style={{ backgroundColor: 'var(--champagne-gold)' }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>
    </motion.div>
  );
}