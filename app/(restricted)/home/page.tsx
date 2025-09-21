import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { auth, authConfig, signOut } from '@/lib/auth';
import VideoChat from '@/components/video-chat/video-chat';

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-svh grid grid-rows-[auto_1fr]">
      <div className="flex h-full flex-col items-center justify-center p-6 md:p-10">
        <div className="flex flex-col gap-6 items-center">
          <div>Добро пожаловать!</div>
          <div className="flex items-center gap-2">
            <Image className="rounded-full" src={session?.user?.image} width={32} height={32} alt="avatar" />
            <span>{session?.user?.name}</span>
          </div>
          <div>
            <Button
              onClick={async () => {
                'use server';

                await signOut({ redirectTo: authConfig.pages.signIn });
              }}
            >
              Выйти
            </Button>
          </div>
        </div>
      </div>
      <VideoChat/>
    </main>
  );
}
