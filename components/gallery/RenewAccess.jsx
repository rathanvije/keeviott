import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck } from "lucide-react";

export default function RenewAccess({ event, onRenew }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="bg-white shadow-lg border-0 max-w-md w-full">
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-yellow-50 rounded-full flex items-center justify-center">
                        <Clock className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{color: 'var(--onyx-black)'}}>
                        Gallery Access Expired
                    </h2>
                    <p className="mb-6" style={{color: 'var(--stone-gray)'}}>
                        Your 30-day access to {event.couple_name_1} & {event.couple_name_2}'s gallery has ended.
                    </p>
                    <div className="p-4 bg-green-50 rounded-lg mb-6 border border-green-200">
                        <p className="font-semibold text-green-800">Renew for another 30 days</p>
                        <p className="text-4xl font-bold text-green-600">$99.00</p>
                    </div>
                    <Button
                        onClick={onRenew}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Renew Access Now
                    </Button>
                    <p className="text-xs text-gray-400 mt-4">
                        This is a simulation. No real payment will be processed.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}