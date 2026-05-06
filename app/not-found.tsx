import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-black text-slate-200 dark:text-slate-800 leading-none">
        404
      </h1>
      <p className="text-2xl font-bold text-slate-900 dark:text-white -mt-8 relative z-10 bg-white dark:bg-slate-950 px-4">
        Lost in the digital woods?
      </p>
      <Link
        href="/"
        className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
      >
        Go back home
      </Link>
    </div>
  );
}