import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import CustomLayout from "@/layout-provider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Bambu Burguer",
  description: "Melhor hambúrguer da cidade!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-br">
        <body>
          <CustomLayout>{children}</CustomLayout>
          <Toaster position="top-center" reverseOrder={false} />
        </body>
      </html>
    </ClerkProvider>
  );
}
