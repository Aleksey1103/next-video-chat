import { redirect } from 'next/navigation';
import { auth, authConfig } from '@/lib/auth';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect(authConfig.pages.signIn);
  }

  return children;
}
