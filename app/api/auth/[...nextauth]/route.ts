import { handlers } from '@/lib/auth';
// Referring to the auth.ts we just created
const dynamic = 'force-dynamic';
const { GET, POST } = handlers;

export { dynamic, GET, POST };
