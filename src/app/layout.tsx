"use client";

import Navbar from "@/components/navbar";
import { Providers } from "@/components/providers";
// import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "swiper/css";
import "swiper/css/pagination";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: "90px",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#000",
              color: "#FFF",
              maxWidth: "100%",
              textAlign: "center",
            },
          }}
        />
      </body>
      <Script src="./lib/checkout.js" />
    </html>
  );
}
