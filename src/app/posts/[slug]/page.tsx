import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicPost } from "@/features/public-site/public-site.repository";
import { PublicShell } from "@/features/public-site/public-shell";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPublicPost(slug);
    return post
      ? { title: `${post.title} | CoffeeHub`, description: post.excerpt }
      : { title: "Bài viết | CoffeeHub" };
  } catch {
    return { title: "Bài viết | CoffeeHub" };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  let post: Awaited<ReturnType<typeof getPublicPost>> | undefined;
  try {
    post = await getPublicPost(slug);
  } catch (error) {
    console.error("Unable to load public post", error);
  }
  if (post === null) notFound();
  if (!post)
    return (
      <PublicShell>
        <div className="mx-auto max-w-3xl px-5 py-28 sm:px-8">
          <h1 className="text-4xl font-semibold">Chưa thể tải bài viết</h1>
          <p className="mt-4 text-slate-400">
            Kết nối CMS hiện chưa sẵn sàng. Vui lòng thử lại sau.
          </p>
        </div>
      </PublicShell>
    );
  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <Link href="/posts" className="text-sm text-cyan-300">
          ← Tất cả bài viết
        </Link>
        <p className="mt-12 font-mono text-xs uppercase tracking-[.2em] text-blue-300">
          {post.publishedAt
            ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(
                post.publishedAt,
              )
            : "Published"}
        </p>
        <h1 className="mt-5 text-5xl font-semibold tracking-[-.05em] text-balance sm:text-7xl">
          {post.title}
        </h1>
        <p className="mt-7 text-xl leading-9 text-slate-400">{post.excerpt}</p>
        <div className="mt-14 whitespace-pre-line border-t border-white/10 pt-12 text-base leading-8 text-slate-300">
          {post.body}
        </div>
      </article>
    </PublicShell>
  );
}
