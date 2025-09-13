import { handlers } from '@/lib/auth';
// Referring to the auth.ts we just created
export const dynamic = 'force-static';
export const { GET, POST } = handlers;
