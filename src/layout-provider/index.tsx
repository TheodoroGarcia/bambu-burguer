"use client";

import { usePathname } from "next/navigation";
import PrivateLayout from "./private-layout";
import PublicLayout from "./public-layout";

export default function CustomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPrivate =
    pathname.startsWith("/user") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/seller");

  if (isPrivate) {
    return <PrivateLayout>{children}</PrivateLayout>;
  } else {
    return <PublicLayout>{children}</PublicLayout>;
  }
}
