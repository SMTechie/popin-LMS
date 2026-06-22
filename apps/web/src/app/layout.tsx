import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "../../styles.css";

export const metadata: Metadata = {
  title: "POPIN LMS",
  description: "School operations workspace powered by React, Next.js and Neon."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
