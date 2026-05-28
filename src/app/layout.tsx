import type { Metadata, Viewport } from "next";
import "./globals.css";
import TopNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Mono - 简单记账",
  description: "极简个人记账工具",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mono",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0E8" },
    { media: "(prefers-color-scheme: dark)", color: "#2C2416" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {/* SVG Filter Definitions for sketchy borders */}
        <svg
          width="0"
          height="0"
          style={{ position: "absolute", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <defs>
            <filter id="sketchy">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.015"
                numOctaves="3"
                seed="2"
                result="turbulence"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="1.2"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <filter id="sketchy-strong">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.02"
                numOctaves="4"
                seed="5"
                result="turbulence"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="2"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <filter id="pencil-texture">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.6"
                numOctaves="4"
                result="noise"
              />
              <feComposite
                in="SourceGraphic"
                in2="noise"
                operator="in"
              />
            </filter>
          </defs>
        </svg>

        <TopNav />
        <main className="pt-14 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
