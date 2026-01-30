import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
            const isApiRegisterRoute = nextUrl.pathname.startsWith("/api/register");
            const isPublicRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
            const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

            if (isApiAuthRoute || isApiRegisterRoute) {
                return true;
            }

            if (isAuthRoute) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/", nextUrl));
                }
                return true;
            }

            if (!isLoggedIn && !isPublicRoute) {
                return false; // Redirect to login
            }

            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token }) {
            return token;
        },
    },
    providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
