import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from "@/providers/ApolloProvider";
import { CharacterList } from "@/components/character/CharacterList";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rick and Morty Character List",
  description: "Explore characters from Rick and Morty universe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloProvider>
          <div className="h-screen w-screen bg-[var(--gray-100)] overflow-hidden">
            {/* Main Content Grid */}
            <main className="h-full grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-[1px] bg-gray-200">
              {/* Left Panel - Character List (Always visible) */}
              <section className="bg-white overflow-hidden flex flex-col min-h-0">
                <CharacterList />
              </section>

              {/* Right Panel - Dynamic Content (children) */}
              <section className="bg-white overflow-hidden flex flex-col min-h-0">
                {children}
              </section>
            </main>
          </div>
        </ApolloProvider>
      </body>
    </html>
  );
}
