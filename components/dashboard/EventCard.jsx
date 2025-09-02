import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Camera,
  QrCode,
  Heart
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EventCard({ event }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl group-hover:text-amber-700 transition-colors"
                       style={{ color: 'var(--onyx-black)' }}>
              {event.couple_name_1} & {event.couple_name_2}
            </h3>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--stone-gray)' }}>
              {event.event_name}
            </p>
          </div>
          <Badge className={`${getStatusColor(event.status)} capitalize`}>
            {getStatusText(event.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4" style={{ color: 'var(--stone-gray)' }} />
            <span className="text-sm" style={{ color: 'var(--stone-gray)' }}>
              {event.event_date ? format(new Date(event.event_date), "MMMM d, yyyy") : 'Date TBD'}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" style={{ color: 'var(--stone-gray)' }} />
              <span className="text-sm" style={{ color: 'var(--stone-gray)' }}>
                {event.location}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm pt-2">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" style={{ color: 'var(--stone-gray)' }} />
              <span style={{ color: 'var(--stone-gray)' }}>
                {event.guest_count || 0} guests
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Camera className="w-4 h-4" style={{ color: 'var(--stone-gray)' }} />
              <span style={{ color: 'var(--stone-gray)' }}>
                {event.media_count || 0} captures
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          <Link
            to={createPageUrl(`Capture?event=${event.id}`)}
            className="flex-1 min-w-[120px]"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full hover:bg-amber-50 hover:border-amber-300 transition-colors"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Portal
            </Button>
          </Link>

          <Link
            to={createPageUrl(`Gallery?event=${event.id}`)}
            className="flex-1 min-w-[120px]"
          >
            <Button
              size="sm"
              className="w-full keevio-bg-gold hover:opacity-90 text-white"
              style={{ backgroundColor: 'var(--champagne-gold)' }}
            >
              <Heart className="w-4 h-4 mr-2" />
              View Gallery
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}