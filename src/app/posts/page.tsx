import type { Metadata } from "next";
import Link from "next/link";

import { listPublicPosts } from "@/features/public-site/public-site.repository";
import { PageIntro, PublicNotice, PublicShell } from "@/features/public-site/public-shell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bài viết | CoffeeHub", description: "Ghi chép và bài viết đã được xuất bản trên CoffeeHub." };

export default async function PostsPage() {
  let posts: Awaited<ReturnType<typeof listPublicPosts>> | null = null;
  try { posts = await listPublicPosts(); } catch (error) { console.error("Unable to list public posts", error); }
  return <PublicShell><PageIntro eyebrow="Writing" title="Ghi lại điều đáng nhớ." description="Những ghi chép về quá trình xây dựng, bài học và các quyết định đã được chọn để chia sẻ." /><div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">{!posts ? <PublicNotice title="Chưa thể tải bài viết" body="CoffeeHub chưa kết nối được với CMS. Vui lòng thử lại sau." /> : posts.length === 0 ? <PublicNotice title="Chưa có bài viết công khai" body="Bài viết sẽ xuất hiện tại đây ngay khi quản trị viên chọn trạng thái Published." /> : <div className="divide-y divide-white/10 border-y border-white/10">{posts.map((post) => <Link key={post.id} href={`/posts/${post.slug}`} className="group block py-9"><div className="flex items-start justify-between gap-8"><div><p className="font-mono text-xs text-blue-300">{post.publishedAt ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(post.publishedAt) : "Published"}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight group-hover:text-cyan-200">{post.title}</h2><p className="mt-3 max-w-2xl leading-7 text-slate-400">{post.excerpt}</p></div><span className="mt-2 text-cyan-300">→</span></div></Link>)}</div>}</div></PublicShell>;
}
