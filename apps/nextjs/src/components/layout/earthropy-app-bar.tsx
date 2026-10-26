"use client";

import { useEffect, useState } from "react";
import { Tooltip, UnstyledButton } from "@mantine/core";

import { clientApi } from "@homarr/api/client";
import { useSession } from "@homarr/auth/client";

interface SuiteApp {
  id: string;
  name: string;
  description?: string;
  letter: string;
  from: string;
  to: string;
  url: string | null;
}

/**
 * EARTHROPY suite apps, in launcher order, with the Figma "App Launcher" colors.
 * Used when the central list (/earthropy/apps.json, served by the EARTHROPY doorman)
 * can't be read, for example when the dashboard runs on its own.
 */
export const earthropySuiteApps: SuiteApp[] = [
  { id: "drive", name: "A Drive", letter: "A", from: "#1b6bff", to: "#19d3c5", url: null },
  { id: "musik", name: "Musik", letter: "M", from: "#ff3d81", to: "#ff8a4c", url: null },
  { id: "whatch", name: "Whatch", letter: "W", from: "#4f7cff", to: "#b14cff", url: null },
  { id: "knowlg", name: "Knowlg", letter: "K", from: "#f2994a", to: "#f2c94c", url: null },
  { id: "mediaz", name: "MediaZ", letter: "M", from: "#19d3c5", to: "#2ecc71", url: null },
  { id: "notz", name: "Notz", letter: "N", from: "#ffd166", to: "#ff8a4c", url: null },
  { id: "contaktz", name: "Contaktz", letter: "C", from: "#2ecc71", to: "#0f7a4a", url: null },
  { id: "sticky", name: "Sticky", letter: "S", from: "#ff8a4c", to: "#ff3d81", url: null },
  { id: "kalendar", name: "Kalendar", letter: "K", from: "#b14cff", to: "#4f7cff", url: null },
  { id: "struingz", name: "struingz", letter: "S", from: "#8a8a8a", to: "#0b1b3f", url: null },
  { id: "pazzy", name: "Pazzy", letter: "P", from: "#6b4cff", to: "#19d3c5", url: null },
];

const REGISTRY_URL = "/earthropy/apps.json";

const normalize = (name: string) => name.trim().toLowerCase();

/** Reads the central EARTHROPY list of apps; null while loading or when it is not available. */
const useEarthropyRegistry = () => {
  const [apps, setApps] = useState<SuiteApp[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(REGISTRY_URL, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { apps?: SuiteApp[] };
        if (!cancelled && Array.isArray(data.apps)) setApps(data.apps);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return apps;
};

export const EarthropyAppBar = () => {
  const { status } = useSession();
  const registry = useEarthropyRegistry();
  const { data: homarrApps = [] } = clientApi.app.selectable.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 60_000,
  });

  // Apps added by hand in Manage → Apps still work: same name = same app
  const hrefByName = new Map(
    homarrApps.filter((app) => app.href).map((app) => [normalize(app.name), app.href as string]),
  );

  // The dashboard is where you already are, so it is not listed here
  const apps = (registry ?? earthropySuiteApps)
    .filter((app) => app.id !== "dashboard")
    .map((app) => ({ ...app, url: app.url ?? hrefByName.get(normalize(app.name)) ?? null }));

  return (
    <nav className="earthropy-app-bar" aria-label="EARTHROPY apps">
      <div className="earthropy-app-bar-track">
        {apps.map((app) => {
          const icon = (
            <span
              className="earthropy-app-icon"
              style={{
                background: `linear-gradient(90deg, ${app.from}, ${app.to})`,
                boxShadow: `0 8px 18px color-mix(in srgb, ${app.from} 35%, transparent)`,
              }}
              aria-hidden
            >
              {app.letter}
            </span>
          );
          const label = <span className="earthropy-app-name">{app.name}</span>;

          if (!app.url) {
            return (
              <Tooltip key={app.id} label="Not installed yet" withArrow>
                <span className="earthropy-app" data-installed="false" aria-disabled="true">
                  {icon}
                  {label}
                </span>
              </Tooltip>
            );
          }

          return (
            <UnstyledButton
              key={app.id}
              component="a"
              href={app.url}
              className="earthropy-app"
              data-installed="true"
              title={app.description}
            >
              {icon}
              {label}
            </UnstyledButton>
          );
        })}
      </div>
    </nav>
  );
};
