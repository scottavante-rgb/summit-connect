import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Summit Connect",
  description: "Every Transformation Starts Here.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors theme="dark" />
      </body>
    </html>
  );
}
