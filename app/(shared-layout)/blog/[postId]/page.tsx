import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PostIdRouteProps {
  params: Promise<{ postId: Id<"posts"> }>;
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostById, { postId: postId });

  if (!post) {
    return (
      <div>
        <h1 className="text-6xl font-extrabold py-20">No post found</h1>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
        href="/blog"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          className="object-cover hover:scale-105 transition-transform duration-500"
          src={
            post.imageUrl ??
            "https://plus.unsplash.com/premium_photo-1677093906033-dc2beb53ace3?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          fill
          alt={post.title}
        />
      </div>
      <div className="space-y-4 flex flex-col">
        {/* Post Title */}
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Posted on: {new Date(post._creationTime).toLocaleDateString("en-US")}
        </p>
      </div>
      <Separator className="my-8" />
      {/* Post Body */}
      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.body}
      </p>
      <Separator className="my-8" />
      <CommentSection />
    </div>
  );
}
