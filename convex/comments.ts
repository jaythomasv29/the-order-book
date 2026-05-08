// import { mutation, query } from "./_generated/server";

// import { authComponent } from "./betterAuth/auth";

// // Create a new post with the given text
// export const createPost = mutation({
//   args: {
//     title: v.string(),
//     body: v.string(),
//     imageStorageId: v.id("_storage"),
//   },
//   handler: async (ctx, args) => {
//     const user = await authComponent.safeGetAuthUser(ctx);
//     if (!user) {
//       throw new ConvexError("Not Authenticated");
//     }
//     const blogArticle = await ctx.db.insert("posts", {
//       title: args.title,
//       body: args.body,
//       authorId: user._id,
//       imageStorageId: args.imageStorageId,
//     });
//     return blogArticle;
//   },
// });

// export const getPosts = query({
//   args: {},
//   handler: async (ctx) => {
//     const posts = await ctx.db.query("posts").order("desc").collect();
//     return await Promise.all(
//       posts.map(async (post) => {
//         const resolvedImageUrl =
//           post.imageStorageId !== undefined
//             ? await ctx.storage.getUrl(post.imageStorageId)
//             : null;
//         return { ...post, imageUrl: resolvedImageUrl };
//       }),
//     );
//   },
// });
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./betterAuth/auth";
export const getCommentsByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .order("desc")
      .collect();
    return data;
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Not Authenticated");
    }
    return await ctx.db.insert("comments", {
      authorId: user._id,
      authorName: user.name,
      postId: args.postId,
      body: args.body,
    });
  },
});
