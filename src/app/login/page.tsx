'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { checkPinStatus, createPin, verifyPin } from '@/actions/auth';
import { Loader2, Lock } from 'lucide-react';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkPinStatus().then((res) => {
      setHasPin(res.hasPin);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (pin.length !== 6) {
      setError('PIN must be exactly 6 digits');
      setLoading(false);
      return;
    }

    if (hasPin) {
      const res = await verifyPin(pin);
      if (res?.error) setError(res.error);
    } else {
      const res = await createPin(pin);
      if (res?.error) setError(res.error);
    }
    setLoading(false);
  };

  if (loading && hasPin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />

      <Card className="w-full max-w-md bg-neutral-900/50 border-neutral-800 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto bg-neutral-800/50 w-12 h-12 rounded-full flex items-center justify-center border border-neutral-700/50 shadow-inner">
            <Lock className="w-6 h-6 text-neutral-300" />
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight">
            {hasPin ? 'Welcome Back' : 'Set Up Your Vault'}
          </CardTitle>
          <CardDescription className="text-neutral-400">
            {hasPin 
              ? 'Enter your 6-digit PIN to access your files' 
              : 'Create a 6-digit PIN to secure your personal cloud'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="• • • • • •"
                className="text-center text-3xl tracking-[1em] py-8 bg-neutral-950/50 border-neutral-800 text-white placeholder:text-neutral-700 focus-visible:ring-1 focus-visible:ring-neutral-600 focus-visible:border-neutral-500 transition-all rounded-xl"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm text-center font-medium mt-2">{error}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-white text-black hover:bg-neutral-200 transition-colors rounded-xl"
              disabled={loading || pin.length !== 6}
            >
              {loading ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                hasPin ? 'Unlock Vault' : 'Secure Vault'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
