import { earthropyWordmarkPath, homarrLogoPath } from "~/components/layout/logo/constants";

// EARTHROPY login brand area (Figma "Login / Dark"): wordmark top-left,
// Earth logo, tagline and the version footer.
export const EarthropyLoginHero = ({ appName }: { appName: string }) => (
  <>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="earthropy-auth-wordmark" src={earthropyWordmarkPath} alt={appName} />
    <div className="earthropy-auth-visual">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="earthropy-auth-globe" src={homarrLogoPath} alt="" aria-hidden />
      <p className="earthropy-auth-tagline">
        <span>Your data</span>
        <span>Your control</span>
        <span>Your look</span>
      </p>
    </div>
    <p className="earthropy-auth-footer">{appName} · v0.1 · local server</p>
  </>
);
