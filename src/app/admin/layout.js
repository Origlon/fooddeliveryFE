import { UserRound } from "lucide-react";

import AdminSidebar from "./_components/sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <AdminSidebar />

      <div className="ml-51.25 min-h-screen">
        <header className="flex h-20 items-center justify-end px-8">
          <div className="flex size-10 items-center justify-center rounded-full bg-zinc-950 text-white">
            <UserRound className="size-5" />
          </div>
        </header>

        <main className="px-8 pb-10">{children}</main>
      </div>
    </div>
  );
}
