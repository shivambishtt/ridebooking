import connectDB from "@/lib/connectDB";
import { User } from "@/models/UserModel";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  async authorize(credentials) {
    await connectDB();

    const user = await User.findOne({
      email: credentials?.email,
    });

    if (!user) throw new Error("No user found");

    const isValid = await bcrypt.compare(credentials!.password, user.password);

    if (!isValid) throw new Error("Invalid password");

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
      }
      token.name = user.id;
    },
  },
};

export default NextAuth(authOptions);
