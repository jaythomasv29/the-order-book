"use server";

import z from "zod";
import { postSchema } from "./schema/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

// server functions /server actions, creating posts from the server side - runs on the server side
export async function createBlogAction(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);
    if (!parsed.success) {
      throw new Error("Failed to save post in server action");
    }
    const token = await getToken();
    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token },
    );
    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });
    if (!uploadResult.ok) {
      return {
        error: "Failed to upload image",
      };
    }
    const { storageId } = await uploadResult.json();
    await fetchMutation(
      api.posts.createPost,
      {
        body: parsed.data.body,
        title: parsed.data.title,
        imageStorageId: storageId,
      },
      { token },
    );
  } catch {
    return {
      error: "Failed to create post",
    };
  }
  // on demand revalidation
  revalidatePath("/blog");
  return redirect("/blog");
}
