import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "../../styles.css";

export const metadata: Metadata = {
  title: "School Operations Workspace",
  description: "School operations workspace for admissions, store, inventory and communication."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
