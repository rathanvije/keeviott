import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Download, Star, User, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MediaViewer({ media, onClose, isOwnerOrAdmin, onDelete, onToggleFeature }) {
  if (!media) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = media.file_url;
    link.download = `${media.guest_name}-${media.media_type}-${media.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={!!media} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-white p-0 border-0">
        <div className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="aspect-video bg-gray-900 flex items-center justify-center rounded-t-lg overflow-hidden">
            {media.media_type === 'video' ? (
              <video 
                src={media.file_url}
                controls
                poster={media.thumbnail_url}
                className="w-full h-full object-contain"
                autoPlay
              />
            ) : (
              <img 
                src={media.file_url}
                alt={`Photo by ${media.guest_name}`}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-4 h-4" style={{ color: 'var(--stone-gray)' }} />
                  <span className="font-medium" style={{ color: 'var(--onyx-black)' }}>
                    {media.guest_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--stone-gray)' }}>
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(media.capture_timestamp), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {isOwnerOrAdmin && (
                  <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will hide the media from the gallery. This action cannot be undone from this view.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(media.id)}>
                          Yes, Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button 
                    size="sm"
                    onClick={() => onToggleFeature(media)}
                    className={`
                      keevio-bg-gold hover:opacity-90 text-white
                      ${media.featured ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-400'}
                    `}
                    style={{ backgroundColor: media.featured ? 'var(--emerald-green)' : 'var(--champagne-gold)' }}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    {media.featured ? 'Featured' : 'Add to Reel'}
                  </Button>
                  </>
                )}
                 <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {media.ai_tags && media.ai_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {media.ai_tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {media.ai_description && (
                <p className="text-sm italic mb-4" style={{color: 'var(--stone-gray)'}}>&ldquo;{media.ai_description}&rdquo;</p>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--stone-gray)' }}>
                Quality Score:
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                <div 
                  className="h-2 rounded-full keevio-gold-gradient" 
                  style={{ width: `${media.ai_score || 50}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--champagne-gold)' }}>
                {media.ai_score || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}