import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: "ADMIN" | "STAFF" | "OWNER";
  }

  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "STAFF" | "OWNER";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "STAFF" | "OWNER";
  }
}
