import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Copy, ExternalLink, Heart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

// A simple but effective QR code component using an external API
const QRCodeComponent = ({ url, size = 256 }) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=F8F7F4&color=0D0D0D&qzone=1`;
    return <img src={qrUrl} alt="QR Code" width={size} height={size} />;
};

export default function QRDisplay({ event }) {
  const [copied, setCopied] = useState(false);
  
  const guestUrl = `${window.location.origin}${createPageUrl(`Capture?event=${event.id}&guest=new`)}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(guestUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl mb-2" 
                     style={{ color: 'var(--onyx-black)' }}>
            {event.couple_name_1} & {event.couple_name_2}
          </CardTitle>
          <p className="text-lg" style={{ color: 'var(--stone-gray)' }}>
            {event.event_name}
          </p>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="w-64 h-64 mx-auto p-4 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
             <QRCodeComponent url={guestUrl} size={240} />
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2 text-left" style={{ color: 'var(--onyx-black)' }}>
                Guest Access Link:
              </p>
              <p className="text-xs font-mono bg-white p-2 rounded border break-all" 
                 style={{ color: 'var(--stone-gray)' }}>
                {guestUrl}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              
              <Button
                onClick={() => window.open(guestUrl, '_blank')}
                className="keevio-bg-gold hover:opacity-90 text-white"
                style={{ backgroundColor: 'var(--champagne-gold)' }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Test Guest Link
              </Button>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <h4 className="font-semibold mb-2" style={{ color: 'var(--onyx-black)' }}>
              Instructions for Guests:
            </h4>
            <div className="text-left max-w-md mx-auto space-y-2 text-sm" 
                 style={{ color: 'var(--stone-gray)' }}>
              <p>1. Open the link or scan the QR code with a phone camera.</p>
              <p>2. Enter your name and give consent to share.</p>
              <p>3. Capture 10-second videos or upload photos from your library.</p>
              <p>4. Your memories are automatically added to the wedding highlights!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}