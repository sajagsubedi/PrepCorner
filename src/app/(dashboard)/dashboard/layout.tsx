import DashboardSideBar from "@/components/dashboard/DashboardSidebar";
import AuthGuard from "@/components/wrappers/AuthGuard";
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
    <AuthGuard>
      <DashboardSideBar navlinks={navlinks} />
      <main className="lg:pl-56 sm:pl-14">{children}</main>
    </AuthGuard>
  );
}
