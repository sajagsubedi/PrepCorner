import DashboardSideBar from "@/components/dashboard/DashboardSidebar";
import AdminDashboardGuard from "@/components/wrappers/AdminDashboardGuard";
import { NavLink } from "@/types/UiTypes";
import { BookOpen, ClipboardCheck, FileText, Home, Search } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navlinks: NavLink[] = [
    {
      text: "Dashboard",
      href: "/dashboard",
      icon: <Home />,
    },
    {
      text: "Browse Course",
      href: "/dashboard/browse-course",
      icon: <Search />,
    },
    {
      text: "My Courses",
      href: "/dashboard/my-courses",
      icon: <BookOpen />,
    },
    {
      text: "My Tests",
      href: "/dashboard/my-tests",
      icon: <ClipboardCheck />,
    },
    {
      text: "Course Requests",
      href: "/dashboard/course-requests",
      icon: <FileText />,
    },
  ];

  return (
    <AdminDashboardGuard>
      <DashboardSideBar navlinks={navlinks} />
      <main className="lg:pl-56 sm:pl-14 bg-gray-50">{children}</main>
    </AdminDashboardGuard>
  );
}
