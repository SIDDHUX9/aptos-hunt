import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove
      walletAddress: v.optional(v.string()), // User's wallet address

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // Custom fields for the app
      patBalance: v.optional(v.number()),
      aptBalance: v.optional(v.number()),
    }).index("email", ["email"]).index("by_walletAddress", ["walletAddress"]), // index for the email. do not remove or modify

    bounties: defineTable({
      contentUrl: v.string(),
      creatorId: v.id("users"),
      deadline: v.number(),
      status: v.union(v.literal("pending"), v.literal("verified_real"), v.literal("verified_ai")),
      realPool: v.number(),
      aiPool: v.number(),
      isResolved: v.boolean(),
      isReal: v.optional(v.boolean()),
      // New fields for Veritas AI analysis
      confidence: v.optional(v.number()),
      analysisLog: v.optional(v.array(v.string())),
    }).index("by_status", ["status"]),

    bets: defineTable({
      bountyId: v.id("bounties"),
      userId: v.id("users"),
      amount: v.number(),
      isReal: v.boolean(), // true = Real, false = AI
      txnHash: v.optional(v.string()), // Transaction hash for verification
    }).index("by_bounty", ["bountyId"]).index("by_user", ["userId"]),

    claims: defineTable({
      userId: v.id("users"),
      bountyId: v.id("bounties"),
      amount: v.number(),
      token: v.union(v.literal("APT"), v.literal("PAT")),
      status: v.union(v.literal("pending"), v.literal("claimed")),
      signature: v.optional(v.string()), // Mock signature for the smart contract
    }).index("by_user_status", ["userId", "status"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;