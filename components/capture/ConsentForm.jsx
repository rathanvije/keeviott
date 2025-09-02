import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, User, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsentForm({ event, onConsent }) {
  const [guestName, setGuestName] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName || !consentGiven) return;
    
    setIsSubmitting(true);
    onConsent({
      guest_name: guestName
    });
    // The parent component will handle the actual creation and state change
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 keevio-gold-gradient rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl mb-2" 
                     style={{ color: 'var(--onyx-black)' }}>
            Welcome to
          </CardTitle>
          <h2 className="text-xl font-semibold" 
              style={{ color: 'var(--champagne-gold)' }}>
            {event.couple_name_1} & {event.couple_name_2}'s Wedding
          </h2>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="guest_name" className="flex items-center gap-2">
                <User className="w-4 h-4" style={{ color: 'var(--stone-gray)' }} />
                Your Name
              </Label>
              <Input
                id="guest_name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter your name or nickname"
                required
                className="border-gray-200 focus:border-amber-400"
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2" 
                  style={{ color: 'var(--onyx-black)' }}>
                <Shield className="w-4 h-4" style={{ color: 'var(--emerald-green)' }} />
                Consent & Privacy
              </h4>
              <p className="text-sm mb-4" style={{ color: 'var(--stone-gray)' }}>
                {event.consent_text}
              </p>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={consentGiven}
                  onCheckedChange={setConsentGiven}
                  className="mt-1"
                  aria-label="I agree to the consent terms"
                />
                <label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer" 
                       style={{ color: 'var(--onyx-black)' }}>
                  I understand and agree to the above terms. I'm excited to contribute to 
                  {' '}{event.couple_name_1} & {event.couple_name_2}'s wedding memories!
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!guestName || !consentGiven || isSubmitting}
              className="w-full keevio-bg-gold hover:opacity-90 text-white py-3 text-lg"
              style={{ backgroundColor: 'var(--champagne-gold)' }}
            >
              {isSubmitting ? 'Getting Started...' : 'Start Capturing Memories'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}