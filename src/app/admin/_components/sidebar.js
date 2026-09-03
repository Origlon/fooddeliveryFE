"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ShoppingCart, Utensils } from "lucide-react";

const menuItems = [
  {
    label: "Food menu",
    href: "/admin/dishes",
    icon: LayoutGrid,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-51.25 border-r bg-white px-5 py-8">
      <Link href="/admin/dishes" className="mb-12 flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-full bg-red-500 text-white">
          <Utensils className="size-5" />
        </div>

        <div>
          <h1 className="text-lg font-semibold leading-5 text-zinc-950">
            NomNom
          </h1>

          <p className="text-xs text-zinc-500">Swift delivery</p>
        </div>
      </Link>

      <nav className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-10 items-center gap-3 rounded-full px-5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
