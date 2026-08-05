import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#050914] px-5 text-center text-slate-50">
      <div>
        <p className="font-mono text-sm text-cyan-300">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Nội dung không tồn tại.
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-7 text-slate-400">
          Trang có thể chưa được xuất bản, đã bị ẩn hoặc đường dẫn không còn
          chính xác.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-blue-500 px-6 py-3 font-medium"
        >
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
