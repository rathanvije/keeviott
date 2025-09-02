import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share, Edit } from "lucide-react";
import { motion } from "framer-motion";

export default function ReelPlayer({ event, onReEdit }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    const shareUrl = event.highlight_reel_url;
    if (navigator.share) {
      navigator.share({
        title: `Highlight Reel for ${event.couple_name_1} & ${event.couple_name_2}`,
        text: 'Check out this highlight reel!',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 rounded-lg shadow-lg mb-8 overflow-hidden"
    >
      <div className="aspect-video">
        <video
          src={event.highlight_reel_url}
          controls
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold" style={{ color: 'var(--onyx-black)' }}>
              Your Highlight Reel is Ready!
            </h3>
            <p style={{ color: 'var(--stone-gray)' }}>
              Share this magical video with your friends and family.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onReEdit}
            >
              <Edit className="w-4 h-4 mr-2" /> Re-Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
            >
              <Share className="w-4 h-4 mr-2" /> {isCopied ? 'Copied!' : 'Share'}
            </Button>
            <a href={event.highlight_reel_url} download={`Keevio-Reel-${event.id}.mp4`}>
              <Button
                className="keevio-bg-gold text-white hover:opacity-90"
                style={{ backgroundColor: 'var(--champagne-gold)' }}
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}