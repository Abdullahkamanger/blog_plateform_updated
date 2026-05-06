import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the built-in Session object to include the user's role.
   */
  interface Session {
    user: {
      id: string;
      role: string;
      status?: string;
      bio?: string | null;
      social_links?: {
        twitter?: string | null;
        github?: string | null;
        linkedin?: string | null;
        website?: string | null;
      };
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in User model to include the role.
   */
  interface User {
    id: string;
    role: string;
    status?: string;
    bio?: string | null;
    social_links?: {
      twitter?: string | null;
      github?: string | null;
      linkedin?: string | null;
      website?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the JWT payload to store the role internally.
   */
  interface JWT {
    id: string;
    role: string;
    status?: string;
    bio?: string | null;
    social_links?: {
      twitter?: string | null;
      github?: string | null;
      linkedin?: string | null;
      website?: string | null;
    };
  }
}