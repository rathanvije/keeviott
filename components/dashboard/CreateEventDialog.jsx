import React, { useState, useMemo } from 'react';
import { Event } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Heart, Calendar, MapPin, Users, Palette, Type, CreditCard, ArrowLeft, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const calculatePrice = (guestCount) => {
    const count = Math.max(50, guestCount || 0);
    let pricePerGuest;
    if (count <= 50) {
        pricePerGuest = 1.50;
    } else if (count <= 200) {
        pricePerGuest = 1.25;
    } else {
        pricePerGuest = 1.00;
    }
    return {
        total: count * pricePerGuest,
        perGuest: pricePerGuest,
        count: count
    };
};

export default function CreateEventDialog({ open, onClose, onEventCreated, user }) {
  const [step, setStep] = useState(1);
  const [guestLimit, setGuestLimit] = useState(50);
  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    location: '',
    couple_name_1: '',
    couple_name_2: '',
    brand_color: '#C8A951',
    monogram: '',
    consent_text: 'By uploading content, you grant the couple rights to use your media in wedding highlights and share with family and friends.',
    privacy_setting: 'password_protected',
    gallery_password: ''
  });
  
  const [isCreating, setIsCreating] = useState(false);

  const pricing = useMemo(() => calculatePrice(guestLimit), [guestLimit]);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        console.error("User not found");
        return;
    }
    setIsCreating(true);

    try {
      const qrCode = `keevio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      await Event.create({
        ...formData,
        owner_email: user.email,
        guest_limit: guestLimit,
        qr_code: qrCode,
        status: 'planning',
        is_paid: true,
        access_expiry_date: expiryDate.toISOString(),
        total_charged: pricing.total
      });
      
      onEventCreated();
      handleClose();
      // Reset form state for next time
      setFormData({
        event_name: '',
        event_date: '',
        location: '',
        couple_name_1: '',
        couple_name_2: '',
        brand_color: '#C8A951',
        monogram: '',
        consent_text: 'By uploading content, you grant the couple rights to use your media in wedding highlights and share with family and friends.',
        privacy_setting: 'password_protected',
        gallery_password: ''
      });
      setGuestLimit(50);
    } catch (error) {
      console.error('Error creating event:', error);
    }
    
    setIsCreating(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader className="p-6">
              <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color: 'var(--onyx-black)' }}>
                <CreditCard className="w-6 h-6" style={{ color: 'var(--champagne-gold)' }} />
                Guest Plan & Pricing (1/3)
              </DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="guest_limit" className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: 'var(--stone-gray)' }} /> Number of Guests
                </Label>
                <Input id="guest_limit" type="number" value={guestLimit} onChange={(e) => setGuestLimit(parseInt(e.target.value, 10))} min="1" className="border-gray-200 focus:border-amber-400" />
                <p className="text-sm" style={{ color: 'var(--stone-gray)' }}>Min. 50 guests. Adjust to estimate your cost.</p>
              </div>
              <div className="p-6 bg-amber-50 rounded-lg text-center border border-amber-200">
                <p className="text-sm font-medium" style={{ color: 'var(--stone-gray)' }}>Total Cost</p>
                <p className="text-4xl font-bold" style={{ color: 'var(--champagne-gold)' }}>${pricing.total.toFixed(2)}</p>
                <p className="text-sm" style={{ color: 'var(--stone-gray)' }}>({pricing.count} guests at ${pricing.perGuest.toFixed(2)}/guest)</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2" style={{ color: 'var(--onyx-black)' }}>What's Included:</h4>
                <ul className="text-sm space-y-1" style={{ color: 'var(--stone-gray)' }}>
                  <li>• 30 days of guest access & gallery hosting</li>
                  <li>• Unlimited photo & video uploads</li>
                  <li>• AI-powered content organization & highlight reel</li>
                  <li>• Beautiful shareable gallery & QR code portal</li>
                  <li>• Download all memories</li>
                </ul>
              </div>
            </div>
            <DialogFooter className="p-6 bg-gray-50 rounded-b-lg">
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="button" onClick={nextStep} className="keevio-bg-gold hover:opacity-90 text-white" style={{ backgroundColor: 'var(--champagne-gold)' }}>Proceed to Payment</Button>
            </DialogFooter>
          </>
        );
      case 2:
        return (
          <>
            <DialogHeader className="p-6">
              <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color: 'var(--onyx-black)' }}>
                <ShieldCheck className="w-6 h-6 text-emerald-500" /> Confirm Payment (2/3)
              </DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6 space-y-6 text-center">
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 mb-2">Final Charge:</p>
                <p className="text-5xl font-bold text-green-600 mb-2">${pricing.total.toFixed(2)}</p>
                <p className="text-sm text-green-700">For {pricing.count} guests at ${pricing.perGuest.toFixed(2)} each</p>
              </div>
              <p className="text-xs" style={{ color: 'var(--stone-gray)' }}>This is a simulation. No real payment will be processed.</p>
            </div>
            <DialogFooter className="flex justify-between p-6 bg-gray-50 rounded-b-lg">
              <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
              <Button type="button" onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700 text-white">Confirm Payment & Continue</Button>
            </DialogFooter>
          </>
        );
      case 3:
        return (
          <form onSubmit={handleSubmit}>
            <DialogHeader className="p-6">
              <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color: 'var(--onyx-black)' }}>
                <Heart className="w-6 h-6" style={{ color: 'var(--champagne-gold)' }} /> Event Details (3/3)
              </DialogTitle>
              <DialogDescription>Fill in the details for your special day.</DialogDescription>
            </DialogHeader>
            <div className="px-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="couple_name_1">First Partner's Name</Label>
                  <Input id="couple_name_1" value={formData.couple_name_1} onChange={(e) => handleChange('couple_name_1', e.target.value)} placeholder="e.g., Sarah" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="couple_name_2">Second Partner's Name</Label>
                  <Input id="couple_name_2" value={formData.couple_name_2} onChange={(e) => handleChange('couple_name_2', e.target.value)} placeholder="e.g., Michael" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_name">Event Name</Label>
                <Input id="event_name" value={formData.event_name} onChange={(e) => handleChange('event_name', e.target.value)} placeholder="e.g., Sarah & Michael's Wedding" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Wedding Date</Label>
                  <Input id="event_date" type="date" value={formData.event_date} onChange={(e) => handleChange('event_date', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Venue Location</Label>
                  <Input id="location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="e.g., The Grand Ballroom, NYC" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="monogram">Monogram/Initials</Label>
                    <Input id="monogram" value={formData.monogram} onChange={(e) => handleChange('monogram', e.target.value)} placeholder="e.g., S&M" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="brand_color">Theme Color</Label>
                    <div className="flex gap-2">
                        <Input id="brand_color" type="color" value={formData.brand_color} onChange={(e) => handleChange('brand_color', e.target.value)} className="w-16 h-10 p-1"/>
                        <Input value={formData.brand_color} onChange={(e) => handleChange('brand_color', e.target.value)} placeholder="#C8A951" />
                    </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gallery_password">Gallery Password (optional)</Label>
                <Input id="gallery_password" value={formData.gallery_password} onChange={(e) => handleChange('gallery_password', e.target.value)} placeholder="Leave empty for public access" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consent_text">Guest Consent Text</Label>
                <Textarea id="consent_text" value={formData.consent_text} onChange={(e) => handleChange('consent_text', e.target.value)} className="h-20" />
              </div>
            </div>
            <DialogFooter className="flex justify-between p-6 bg-gray-50 rounded-b-lg">
              <Button type="button" variant="outline" onClick={prevStep} disabled={isCreating}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
              <Button type="submit" disabled={isCreating} className="keevio-bg-gold hover:opacity-90 text-white px-8" style={{ backgroundColor: 'var(--champagne-gold)' }}>
                {isCreating ? 'Creating Event...' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-white p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}