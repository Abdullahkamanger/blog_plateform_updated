import { auth } from "@/lib/auth";

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome to the main dashboard.</p>
      
      <div className="p-4 mt-6 bg-gray-600 rounded">
        <p><strong>Logged in as:</strong> {session?.user?.email}</p>
        <p><strong>Role assigned:</strong> {session?.user?.role}</p>
      </div>
    </div>
  );
}