import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Story Memorabilia — Every Athlete Has a Story",
  description: "Buy authenticated sports memorabilia directly from vetted athletes. Story vets every athlete. Every item ships with a Story Certificate of Authenticity.",
  keywords: ["sports memorabilia", "athlete", "signed jersey", "certificate of authenticity", "game worn"],
  openGraph: {
    title: "Story Memorabilia",
    description: "Authenticated memorabilia. Straight from the athlete.",
    url: "https://storymemorabilia.com",
    siteName: "Story Memorabilia",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
