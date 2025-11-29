import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    const claims = await ctx.db
      .query("claims")
      .withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "pending"))
      .collect();

    // Enrich with bounty info
    const enrichedClaims = await Promise.all(claims.map(async (claim) => {
      const bounty = await ctx.db.get(claim.bountyId);
      return { ...claim, bountyContent: bounty?.contentUrl };
    }));

    return enrichedClaims;
  },
});

export const markClaimed = mutation({
  args: { claimId: v.id("claims"), transactionHash: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const claim = await ctx.db.get(args.claimId);
    if (!claim || claim.userId !== userId) throw new Error("Invalid claim");

    await ctx.db.patch(args.claimId, {
      status: "claimed",
    });
    
    // In a real app, we would verify the transaction hash on-chain here
    // For now, we update the user's virtual balance as well to keep UI in sync
    const user = await ctx.db.get(userId);
    if (user) {
      if (claim.token === "APT") {
        await ctx.db.patch(userId, { aptBalance: (user.aptBalance || 0) + claim.amount });
      } else {
        await ctx.db.patch(userId, { patBalance: (user.patBalance || 0) + claim.amount });
      }
    }
  },
});
