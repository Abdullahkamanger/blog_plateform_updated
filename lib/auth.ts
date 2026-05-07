import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { compare } from "bcryptjs";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid email or password";
}

class UserNotFoundError extends CredentialsSignin {
  code = "No user found with this email";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new InvalidLoginError();
        }

        await connectDB();

        // 1. Find user in the database via Mongoose
        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user) {
          throw new UserNotFoundError();
        }

        // 2. Compare the plain-text password with the database hash
        const isValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          throw new InvalidLoginError();
        }

        // 3. Return a clean user object with role and status
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          bio: user.bio ?? null,
          social_links: user.social_links ?? {},
        };
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })

  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        await connectDB();
        try {
          // Check if user exists by email
          let existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create a new user for GitHub login
            existingUser = await User.create({
              name: user.name || profile?.login || "GitHub User",
              email: user.email,
              password: "github-login-" + Math.random().toString(36).slice(-8), // Dummy password
              role: "READER",
              status: "APPROVED",
            });
          }
          
          // Update the user object with our DB ID
          user.id = existingUser._id.toString();
          user.role = existingUser.role;
          user.status = existingUser.status;
          user.bio = existingUser.bio ?? null;
          user.social_links = existingUser.social_links ?? {};
          return true;
        } catch (error) {
          console.error("Error during GitHub sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status; // Persist status in token
        token.bio = (user as any).bio ?? null;
        token.social_links = (user as any).social_links ?? {};
        token.name = user.name ?? token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string; // Expose status in session
        session.user.bio = (token.bio as string | null) ?? null;
        session.user.social_links = (token.social_links as Record<string, string | null>) ?? {};
        session.user.name = (token.name as string) || session.user.name;
      }
      return session;
    },
  },
});