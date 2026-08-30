'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updatePin } from '@/actions/auth';
import { Loader2, KeyRound, Check, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

export default function SettingsPage() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (pin.length !== 6) {
      setError('PIN must be exactly 6 digits');
      setLoading(false);
      return;
    }

    const res = await updatePin(pin);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setPin('');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center min-h-[70vh]">
      <div className="w-full max-w-md mx-auto space-y-8 relative">
        <div className="absolute -top-12 right-0 md:hidden">
          <ThemeToggle />
        </div>
      
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative w-full flex justify-center items-center">
          <Link href="/dashboard" className="absolute left-0 p-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full transition-colors shrink-0 hidden md:flex">
            <ArrowLeft className="w-5 h-5 text-neutral-700 dark:text-white" />
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-2xl">
              <KeyRound className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Security</h1>
          </div>
          
          <div className="absolute right-0 hidden md:block">
            <ThemeToggle />
          </div>
        </div>
        <p className="text-neutral-500 dark:text-neutral-400">Manage your vault access and security preferences.</p>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xl dark:shadow-2xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-neutral-50 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <CardTitle className="text-xl text-neutral-900 dark:text-white flex items-center justify-center">
            Update Vault PIN
          </CardTitle>
          <CardDescription className="text-neutral-500 dark:text-neutral-400 text-center mt-2">
            Set a new 6-digit secure PIN for your cloud storage.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                className="text-center tracking-[1em] text-3xl h-16 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-colors rounded-2xl"
              />
              <div className="h-6 flex items-center justify-center">
                {error && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{error}</p>}
                {success && <p className="text-green-500 dark:text-green-400 text-sm flex items-center font-medium"><Check className="w-4 h-4 mr-1" /> PIN updated successfully!</p>}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/25"
              disabled={loading || pin.length !== 6}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Update Security PIN
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Mobile back button */}
      <div className="flex justify-center md:hidden pt-4">
         <Link href="/dashboard" className="flex items-center space-x-2 px-6 py-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full transition-colors shadow-sm">
            <ArrowLeft className="w-4 h-4 text-neutral-700 dark:text-white" />
            <span className="text-sm font-medium text-neutral-700 dark:text-white">Back to Vault</span>
          </Link>
      </div>
      </div>
    </div>
  );
}
