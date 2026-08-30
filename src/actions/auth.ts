'use server'

import { db } from '@/db';
import { settings } from '@/db/schema';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkPinStatus() {
  const allSettings = await db.select().from(settings).limit(1);
  return { hasPin: allSettings.length > 0 };
}

export async function createPin(pin: string) {
  const allSettings = await db.select().from(settings).limit(1);
  if (allSettings.length > 0) {
    return { error: 'PIN is already set' };
  }
  
  if (pin.length !== 6 || !/^\d+$/.test(pin)) {
    return { error: 'PIN must be exactly 6 digits' };
  }

  await db.insert(settings).values({ pin });
  
  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set('auth_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  redirect('/dashboard');
}

export async function verifyPin(pin: string) {
  const allSettings = await db.select().from(settings).limit(1);
  if (allSettings.length === 0) {
    return { error: 'PIN not found' };
  }
  
  if (allSettings[0].pin !== pin) {
    return { error: 'Incorrect PIN' };
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set('auth_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  redirect('/dashboard');
}

export async function updatePin(newPin: string) {
  if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
    return { error: 'PIN must be exactly 6 digits' };
  }
  await db.update(settings).set({ pin: newPin });
  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_session');
  redirect('/login');
}
