import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/lib/providers";
import { AuthProvider } from "@/lib/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Commerce Store",
  description: "Full Stack E-Commerce Application",
};

export default function RootLayout({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Header />

              <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-6">{auth}</div>
                {children}
              </main>

              <Footer />
            </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
