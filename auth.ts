import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const result = await sql`
            SELECT id, name, email, password 
            FROM users 
            WHERE email = ${credentials.email as string}
          `;

          const user = result.rows[0];

          if (!user) {
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers (Google), create user in database if doesn't exist
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await sql`
            SELECT id FROM users WHERE email = ${user.email}
          `;

          if (existingUser.rows.length === 0) {
            // Create user without password for OAuth users
            await sql`
              INSERT INTO users (name, email, password)
              VALUES (${user.name || "User"}, ${user.email}, ${""})
            `;
          }
        } catch (error) {
          console.error("Error creating OAuth user:", error);
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
