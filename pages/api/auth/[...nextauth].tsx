import NextAuth, {Session, User} from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "./lib/mongodb"
import GitHubProvider from "next-auth/providers/github";
import setCookie from "../../../src/helpers/setCookie";
import backendAxios from "../../../src/helpers/getAxios";


const adapter = clientPromise === null?undefined :MongoDBAdapter(clientPromise)
interface SessionProps {
  user: User,
  session:Session,
  token: any
}
export default NextAuth({
 // Configure one or more authentication providers
 adapter: adapter,
 providers: [
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
   }),
   FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? ""
  }),
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ""
  })
   // ...add more providers here
 ],
 pages: {
  signIn: '/',
  signOut: '/auth/signout',
  error: '/auth/error', // Error code passed in query string as ?error=
  verifyRequest: '/auth/verify-request', // (used for check email message)
  newUser: '/rooms' // New users will be directed here on first sign in (leave the property out if not of interest)
},
session: {
  strategy: "jwt",
  
},
secret: process.env.JWT_SECRET,
jwt: {
  // The maximum age of the NextAuth.js issued JWT in seconds.
  // Defaults to `session.maxAge`.
  maxAge: 60 * 60 * 24 * 30,
  secret: process.env.JWT_SECRET,
  // You can define your own encode/decode functions for signing and encryption
},
callbacks: {
  async jwt(params) { 
    const {account, token} = params
    if (account !== undefined) {
      console.log(account)
      token.accessToken = account.id_token;
    }
    return token;
  },
  async session(params) {
    const {session, token} = params
    if (session !== undefined) {
      session.id = token?.sub
      session.accessToken = token?.accessToken

    }
    return Promise.resolve(session)
  },
  async signIn({ user, account, profile, email, credentials }) {
    return true
  }

}
})