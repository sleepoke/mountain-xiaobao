import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#052c55",
};

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host =
    incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol =
    incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", base).toString();

  return {
    metadataBase: base,
    title: "小宝深海泡泡战",
    description: "和小宝一起瞄准、反弹、连击，净化被小豹泡泡占领的珊瑚湾。",
    applicationName: "小宝深海泡泡战",
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "小宝泡泡战",
    },
    icons: {
      icon: "/icon-192.png",
      shortcut: "/icon-192.png",
      apple: "/icon-192.png",
    },
    openGraph: {
      type: "website",
      title: "小宝深海泡泡战",
      description: "企鹅小宝的竖屏海洋泡泡消除冒险",
      siteName: "小宝深海泡泡战",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "小宝深海泡泡战" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "小宝深海泡泡战",
      description: "瞄准、反弹、连击！和小宝一起挑战深海泡泡。",
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
