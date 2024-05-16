import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
 
  interface Session {
    token,
    data: {
      token:any
      
 }

 user: {
  data:any
 }
  & DefaultSession["user"]
  }
}
