
import Footer from "@/components/global/footer";
import Navbar from "@/components/navbar";
import { Static_THEME } from "@/const/theme";
import { getCachedThemeData } from "@/services/page/theme-service";
import React from "react";

export default async function DefaultLayout({ children }: { children: React.ReactNode }) {
  const doc = await getCachedThemeData();
  const themeData = await JSON.parse(JSON.stringify(doc || {}));
  const theme = themeData?.theme || Static_THEME;
  const logos = themeData?.logos || { logo: "", wordmark: "Flyttetipset" };

  return (
    <div
      className=""
      style={{
        '--color-primary': theme.primary || Static_THEME.primary,
        '--color-primarylight': theme.primarylight || Static_THEME.primarylight,
        '--color-secondary': theme.secondary || Static_THEME.secondary,
        '--color-dark': theme.dark || Static_THEME.dark,
        '--color-accent': theme.accent || Static_THEME.accent,
        '--color-background': theme.background || Static_THEME.background,
        '--color-cardbg': theme.cardbg || Static_THEME.cardbg,
        '--color-navbarbg': theme.navbarbg || Static_THEME.navbarbg,
        '--color-footerbg': theme.footerbg || Static_THEME.footerbg,
        '--color-formsteps': theme.formsteps || Static_THEME.formsteps,
      } as React.CSSProperties}
    >
      <Navbar logo={logos?.logo} logoText={logos?.wordmark} />
      {children}
      <Footer logoText={logos?.wordmark} />
    </div>
  );
}
