import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadFile } from "@/api/integrations";
import { processVideo } from "@/api/functions";
import { Media } from "@/api/entities";
import { Event } from "@/api/entities";
import { Video, Image, Check, Loader2, Heart, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UploadItem = React.memo(({ upload, onRemove }) => {
    const getStatusText = (status, error) => {
        switch(status) {
            case 'uploading': return 'Uploading...';
            case 'processing': return 'AI Processing...';
            case 'completed': return 'Complete!';
            case 'error': return error || 'Upload Failed';
            default: return '';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
        >
            {upload.type === 'video' ? (
                <Video className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--champagne-gold)' }} />
            ) : (
                <Image className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--emerald-green)' }} />
            )}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--onyx-black)' }}>
                    {upload.name}
                </p>
                <div className="flex items-center gap-2">
                    <Progress value={upload.progress} className="h-1 mt-1 flex-1" />
                    <span className="text-xs w-28 text-right" style={{color: 'var(--stone-gray)'}}>{getStatusText(upload.status, upload.error)}</span>
                </div>
            </div>
             {upload.status === 'completed' ? (
                <Check className="w-5 h-5 text-green-500" />
            ) : upload.status === 'processing' ? (
                <Sparkles className="w-5 h-5 animate-pulse text-blue-500" />
            ) : upload.status === 'uploading' ? (
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--champagne-gold)' }} />
            ) : upload.status === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
            ) : null}
        </motion.div>
    );
});

export default function GuestUpload({ event, guest }) {
  const [uploads, setUploads] = useState([]);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleFileSelect = useCallback(async (files, mediaType) => {
    if (!files || files.length === 0) return;
    
    const newUploads = Array.from(files).map(file => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      type: mediaType,
      status: 'uploading',
      progress: 0,
      file,
    }));
    
    setUploads(prev => [...newUploads, ...prev]);

    for (const upload of newUploads) {
      const { id, file, type } = upload;
      
      const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setUploads(prev => prev.map(up => up.id === id ? { ...up, status: 'error', error: `File too large` } : up));
        continue;
      }

      try {
        setUploads(prev => prev.map(up => up.id === id ? { ...up, progress: 15 } : up));
        const { file_url } = await UploadFile({ file });
        
        setUploads(prev => prev.map(up => up.id === id ? { ...up, status: 'processing', progress: 50 } : up));

        const mediaRecord = await Media.create({
          event_id: event.id,
          guest_name: guest.guest_name,
          media_type: type,
          file_url,
          capture_timestamp: new Date().toISOString()
        });

        // Use the worker for both video and photo analysis
        await processVideo({
            file_url,
            media_id: mediaRecord.id,
            job_type: 'analyze'
        });

        await Event.update(event.id, {
          media_count: (event.media_count || 0) + 1,
        });

        setUploads(prev => prev.map(up => 
          up.id === id 
            ? { ...up, status: 'completed', progress: 100 }
            : up
        ));
        
      } catch (error) {
        console.error('Upload error:', error);
        setUploads(prev => prev.map(up => 
          up.id === id
            ? { ...up, status: 'error', error: `Upload failed` }
            : up
        ));
      }
    }
  }, [event, guest]);

  const isUploading = uploads.some(u => u.status === 'uploading' || u.status === 'processing');
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold mb-2 font-playfair" style={{ color: 'var(--onyx-black)' }}>
          Hello, {guest.guest_name}! 
        </h2>
        <p className="text-lg" style={{ color: 'var(--stone-gray)' }}>
          Help create beautiful memories for {event.couple_name_1} & {event.couple_name_2}
        </p>
      </motion.div>

      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-center font-playfair font-bold" style={{ color: 'var(--onyx-black)' }}>
            Capture & Share
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-amber-300 transition-colors">
              <input ref={videoInputRef} type="file" accept="video/*" multiple onChange={(e) => handleFileSelect(e.target.files, 'video')} className="hidden" disabled={isUploading} />
              <Video className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--champagne-gold)' }} />
              <h3 className="font-semibold mb-2 font-playfair" style={{ color: 'var(--onyx-black)' }}>Record Video</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--stone-gray)' }}>10-second clips work best (max 100MB)</p>
              <Button onClick={() => videoInputRef.current?.click()} disabled={isUploading} className="w-full keevio-bg-gold hover:opacity-90 text-white" style={{ backgroundColor: 'var(--champagne-gold)' }}>
                <Video className="w-4 h-4 mr-2" /> Choose Video
              </Button>
            </div>

            <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-amber-300 transition-colors">
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => handleFileSelect(e.target.files, 'photo')} className="hidden" disabled={isUploading} />
              <Image className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--emerald-green)' }} />
              <h3 className="font-semibold mb-2 font-playfair" style={{ color: 'var(--onyx-black)' }}>Share Photos</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--stone-gray)' }}>Capture special moments (max 10MB)</p>
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="outline" className="w-full hover:bg-emerald-50 hover:border-emerald-300">
                <Image className="w-4 h-4 mr-2" /> Choose Photos
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
                {uploads.map((upload) => (
                    <UploadItem key={upload.id} upload={upload} />
                ))}
            </AnimatePresence>
          </div>

          {uploads.some(u => u.status === 'completed') && !isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <Heart className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-green-800 font-medium">
                Thank you! Your memories have been captured. Feel free to upload more!
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}