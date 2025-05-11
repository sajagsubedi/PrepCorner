import DashboardSideBar from "@/components/dashboard/DashboardSidebar";
import AdminDashboardGuard from "@/components/wrappers/AdminDashboardGuard";
import { NavLink } from "@/types/UiTypes";
import { Home, ShoppingBag, UserIcon } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navlinks: NavLink[] = [
    {
      text: "Dashboard",
      href: "/admin/dashboard",
      icon: <Home />,
    },
    {
      text: "Courses",
      href: "/admin/dashboard/courses",
      icon: <ShoppingBag />,
    },
    {
      text: "Users",
      href: "/admin/dashboard/users",
      icon: <UserIcon />,
    },
  ];

  return (
    <AdminDashboardGuard>
      <DashboardSideBar navlinks={navlinks} />
      <main className="lg:pl-56 sm:pl-14 bg-gray-50">{children}</main>
    </AdminDashboardGuard>
  );
}
