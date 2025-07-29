// lib/actions.ts
'use server'

import { cookies } from 'next/headers'

export async function setUserCookie() {
  const cookieStore = await cookies();
  cookieStore.set('user', 'Nadeem');
}
