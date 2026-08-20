import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Investor from "@/lib/models/Investor";
import AdminUser from "@/lib/models/AdminUser";

export const authOptions = {
  providers: [
    /**
     * Google OAuth — for Super Admin login only.
     * Only pre-authorized Gmail accounts in the AdminUser collection
     * with role: SUPER_ADMIN and isActive: true will be allowed.
     * All other Google accounts are rejected.
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    /**
     * Credentials — for Regular Admin and Investor login.
     */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" }, // "admin" | "investor"
      },
      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string" ||
          !credentials.email ||
          !credentials.password
        ) {
          return null;
        }

        await dbConnect();

        const loginType = credentials.loginType ?? "investor";

        if (loginType === "admin") {
          // Look up Regular Admin in AdminUser collection
          const adminRecord = await AdminUser.findOne({
            email: credentials.email.toLowerCase(),
            role: "REGULAR_ADMIN",
            isActive: true,
            deletedAt: null,
          });

          if (!adminRecord || !adminRecord.password_hash) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            adminRecord.password_hash
          );

          if (!isValid) return null;

          // Update last login
          await AdminUser.findByIdAndUpdate(adminRecord._id, {
            lastLoginAt: new Date(),
          });

          return {
            id: adminRecord._id.toString(),
            email: adminRecord.email,
            name: adminRecord.name,
            role: adminRecord.role,
            adminId: adminRecord._id.toString(),
            permissions: adminRecord.permissions,
          };
        }

        // Investor / Client credentials login
        const investor = await Investor.findOne({
          login_email: credentials.email.toLowerCase(),
        });

        if (!investor || !investor.password_hash) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          investor.password_hash
        );

        if (!isValid) return null;

        return {
          id: investor._id.toString(),
          email: investor.login_email,
          role: "investor",
          name: investor.name,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }: any) {
      // Handle Google OAuth — only allow pre-authorized Super Admin emails
      if (account?.provider === "google") {
        await dbConnect();
        let adminRecord = await AdminUser.findOne({
          email: user.email?.toLowerCase(),
          role: "SUPER_ADMIN",
          isActive: true,
          deletedAt: null,
        });

        // Developer QoL: Auto-provision any Google login as Super Admin when running locally
        if (!adminRecord && process.env.NODE_ENV === "development") {
          adminRecord = await AdminUser.create({
            email: user.email?.toLowerCase(),
            name: user.name || "Dev Super Admin",
            role: "SUPER_ADMIN",
            isActive: true,
            permissions: ["*"],
          });
          console.log(`[DEV] Auto-provisioned Super Admin: ${user.email}`);
        }

        if (!adminRecord) {
          // Not a pre-authorized Super Admin — redirect to unauthorized page
          return "/admin/unauthorized";
        }

        // Store the googleId if not already set
        if (!adminRecord.googleId) {
          await AdminUser.findByIdAndUpdate(adminRecord._id, {
            googleId: user.id,
            lastLoginAt: new Date(),
          });
        } else {
          await AdminUser.findByIdAndUpdate(adminRecord._id, {
            lastLoginAt: new Date(),
          });
        }

        // Attach admin info to user object for JWT callback
        user.id = adminRecord._id.toString();
        user.adminId = adminRecord._id.toString();
        user.role = "SUPER_ADMIN";
        user.permissions = ["*"];

        return true;
      }

      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.adminId = user.adminId;
        token.permissions = user.permissions ?? [];
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.adminId = token.adminId;
        session.user.permissions = token.permissions ?? [];
      }
      return session;
    },
  },

  session: {
    strategy: "jwt" as const,
    maxAge: 8 * 60 * 60, // 8 hours
  },

  pages: {
    signIn: "/login",
    error: "/admin/unauthorized",
  },
};
