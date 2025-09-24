import NextAuth, { NextAuthConfig, NextAuthResult } from 'next-auth';
import Google from 'next-auth/providers/google';

const authConfig: NextAuthConfig = {
  providers: [Google],
  pages: { signIn: '/', error: '/' },
  callbacks: {
    authorized: async ({ auth }) => !!auth,
  },
};

const nextAuth = NextAuth(authConfig);

const { handlers, signIn, signOut } = nextAuth;
const auth: NextAuthResult['auth'] = nextAuth.auth;

export { auth, authConfig, handlers, signIn, signOut };
