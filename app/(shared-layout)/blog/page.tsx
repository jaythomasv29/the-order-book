import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-static";
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
export const revalidate = 30;
// false | 0 | number (in seconds)

export default function BlogPage() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pg-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts, and trends
        </p>
      </div>
      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadBlogList />
      </Suspense>
    </div>
  );
}

async function LoadBlogList() {
  const data = await fetchQuery(api.posts.getPosts);
  return (
    <div className="grid gap-6 mx:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <Card className="pt-0" key={post._id}>
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              className="rounded-t-lg object-cover"
              alt="racing_img"
              src={
                post.imageUrl ??
                "https://plus.unsplash.com/premium_photo-1684197414542-a7b3ef29f604?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              fill
            />
          </div>
          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-gray-300">
                {post.title}
              </h1>
            </Link>
            <p className="text-muted-foreground line-clamp-1">{post.body}</p>
          </CardContent>
          <CardFooter>
            <Link
              className={buttonVariants({
                className: "w-full",
              })}
              href={`/blog/${post._id}`}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grids-cols3">
      {[...Array(6)].map((_, i) => (
        <div className="flex flex-col space-y-3" key={i}>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
