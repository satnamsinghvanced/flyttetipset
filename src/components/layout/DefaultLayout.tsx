
import Footer from "@/components/global/footer";
import Navbar from "@/components/navbar";
import { Static_THEME } from "@/const/theme";
import { getCachedThemeData } from "@/services/page/theme-service";
import React from "react";

export default async function DefaultLayout({ children }: { children: React.ReactNode }) {
  const doc = await getCachedThemeData();
  const themeData = await JSON.parse(JSON.stringify(doc));
  const theme = themeData.theme || Static_THEME;
  const logos = themeData.logos;

  return (
    <div
      className=""
      style={{
        '--color-primary': theme.primary,
        '--color-primarylight': theme.primarylight,
        '--color-secondary': theme.secondary,
        '--color-dark': theme.dark,
        '--color-accent': theme.accent,
        '--color-background': theme.background,
        '--color-cardbg': theme.cardbg,
        '--color-navbarbg': theme.navbarbg,
        '--color-footerbg': theme.footerbg,
        '--color-formsteps': theme.formsteps,
      } as React.CSSProperties}
    >
      <Navbar logo={logos.logo} logoText={logos.wordmark} />
      {children}
      <Footer logoText={logos.wordmark} />
    </div>
  );
}
