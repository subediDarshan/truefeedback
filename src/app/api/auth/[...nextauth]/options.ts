import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",

      credentials: {
        identifier: { label: "Username/Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials):Promise<User | null> {
        if (!credentials) {
          throw new Error("Missing credentials");
        }
        try {
          await dbConnect();

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email/username");
          }
          // if (!user.isVerified) {
          //   throw new Error("Firstly verify your email before login");
          // } RESEND_DISABLED

          const isPasswordCorrect = await bcryptjs.compare(
            credentials.password,
            user.password.toString()
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return {
            id: String(user._id),
            _id: String(user._id),
            isVerified: Boolean(user.isVerified),
            isAcceptingMessages: Boolean(user.isAcceptingMessages),
            username: String(user.username)
          };
        } catch (error: unknown) {
          if(error instanceof Error)
            throw new Error(error.message);
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
