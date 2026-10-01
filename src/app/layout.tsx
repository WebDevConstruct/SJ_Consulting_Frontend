import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {ContextProvider} from "../../Context";
export const metadata: Metadata = {
  title: "SJ Consult — JAMB & UNILAG Guidance, Verified",
  description:
    "Verified JAMB guidelines, real past questions, and one-on-one guidance for aspirants and UNILAG undergraduates.",
};

const NO_FLASH_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("sj-consult-theme");
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var theme = stored || (prefersLight ? "light" : "dark");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
       
      </head>
      <body>
        <ContextProvider>
        <ThemeProvider>
          
          <Navbar />
          <main className="font-ui-sans-serif">{children}</main>
          <Footer />
        </ThemeProvider>
        </ContextProvider>
         <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </body>
    </html>
  );
}
