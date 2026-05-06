import "./globals.css";
import AppShell from "./components/AppShell";

export const metadata = {
  title: "Ventaway - Vent, Connect, Heal",
  description:
    "Ventaway is your safe space for emotional wellness. Talk anonymously, connect with listeners, and feel better.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
