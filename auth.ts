import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Implement your own logic here to find the user
        // For now, this is a placeholder
        if (credentials?.email && credentials?.password) {
          // Replace with actual database lookup
          return {
            id: "1",
            email: credentials.email as string,
            name: "User",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
});
