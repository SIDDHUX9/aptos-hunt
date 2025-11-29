import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const bounties = await ctx.db.query("bounties").order("desc").take(50);
    return bounties;
  },
});

export const get = query({
  args: { id: v.id("bounties") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    contentUrl: v.string(),
    marketId: v.optional(v.number()),
    creationTxnHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const bountyId = await ctx.db.insert("bounties", {
      contentUrl: args.contentUrl,
      creatorId: userId,
      deadline: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      status: "pending",
      realPool: 0,
      aiPool: 0,
      isResolved: false,
      marketId: args.marketId,
      creationTxnHash: args.creationTxnHash,
    });

    // Reward user with PAT (simulated)
    const user = await ctx.db.get(userId);
    if (user) {
      await ctx.db.patch(userId, {
        patBalance: (user.patBalance || 0) + 10,
      });
    }

    return bountyId;
  },
});

export const placeBet = mutation({
  args: {
    bountyId: v.id("bounties"),
    amount: v.number(),
    isReal: v.boolean(),
    txnHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const bounty = await ctx.db.get(args.bountyId);
    if (!bounty) throw new Error("Bounty not found");
    if (bounty.isResolved) throw new Error("Bounty already resolved");

    // Record bet
    await ctx.db.insert("bets", {
      bountyId: args.bountyId,
      userId,
      amount: args.amount,
      isReal: args.isReal,
      txnHash: args.txnHash,
    });

    // Update pool
    if (args.isReal) {
      await ctx.db.patch(args.bountyId, { realPool: bounty.realPool + args.amount });
    } else {
      await ctx.db.patch(args.bountyId, { aiPool: bounty.aiPool + args.amount });
    }
    
    // Note: We no longer deduct from simulated aptBalance since this is now a real on-chain transaction
    // But we can still track it if we want, or just rely on the real chain state.
    // For this hybrid app, we'll keep the simulated balance sync for display purposes if needed, 
    // but the source of truth for the bet payment is now the blockchain.
  },
});

export const resolve = mutation({
  args: {
    bountyId: v.id("bounties"),
    isReal: v.boolean(),
    confidence: v.optional(v.number()),
    analysisLog: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // In a real app, this would be restricted to an admin or oracle
    const bounty = await ctx.db.get(args.bountyId);
    if (!bounty) throw new Error("Bounty not found");
    if (bounty.isResolved) throw new Error("Bounty already resolved");

    await ctx.db.patch(args.bountyId, {
      isResolved: true,
      isReal: args.isReal,
      status: args.isReal ? "verified_real" : "verified_ai",
      confidence: args.confidence,
      analysisLog: args.analysisLog,
    });

    // Calculate Rewards
    const winningSide = args.isReal;
    const totalPool = bounty.realPool + bounty.aiPool;
    const winningPool = winningSide ? bounty.realPool : bounty.aiPool;

    // 1. Fetch all bets for this bounty
    const bets = await ctx.db
      .query("bets")
      .withIndex("by_bounty", (q) => q.eq("bountyId", args.bountyId))
      .collect();

    // 2. Distribute rewards to winners
    for (const bet of bets) {
      if (bet.isReal === winningSide) {
        // Winner gets their bet back + share of the losing pool
        // Share = (UserBet / WinningPool) * LosingPool
        // Total Payout = UserBet + Share
        // Simplified: (UserBet / WinningPool) * TotalPool
        
        let payout = 0;
        if (winningPool > 0) {
            payout = (bet.amount / winningPool) * totalPool;
        } else {
            payout = bet.amount; // Should not happen if pool > 0
        }

        // Create a Claim record for the user
        // This represents the "off-chain list" entry that the user can claim
        await ctx.db.insert("claims", {
          userId: bet.userId,
          bountyId: args.bountyId,
          amount: payout,
          token: "APT",
          status: "pending",
          signature: `mock_sig_${Date.now()}_${bet.userId}`, // Mock signature
        });
      }
    }
    
    // 3. Reward the creator with PAT tokens (if not already rewarded enough)
    await ctx.db.insert("claims", {
        userId: bounty.creatorId,
        bountyId: args.bountyId,
        amount: 50, // Bonus PAT for successful resolution
        token: "PAT",
        status: "pending",
        signature: `mock_sig_pat_${Date.now()}`,
    });
  },
});