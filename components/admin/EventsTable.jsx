import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle }
from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EventsTable({ events, isLoading }) {
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

  return (
    <Card className="bg-white shadow-sm border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" style={{ color: 'var(--onyx-black)' }}>
          All Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-5 w-10 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div></TableCell>
                  </TableRow>
                ))
              ) : (
                events.slice(0, 10).map((event) => (
                  <TableRow key={event.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium" style={{ color: 'var(--onyx-black)' }}>
                          {event.couple_name_1} & {event.couple_name_2}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--stone-gray)' }}>
                          {event.owner_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm" style={{ color: 'var(--stone-gray)' }}>
                        {event.event_date ? format(new Date(event.event_date), "MMM d, yyyy") : 'Date TBD'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(event.status)} capitalize`}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.guest_count || 0} / {event.guest_limit}</TableCell>
                    <TableCell className="font-medium">
                      ${(event.total_charged || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={createPageUrl(`Gallery?event=${event.id}`)}>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}