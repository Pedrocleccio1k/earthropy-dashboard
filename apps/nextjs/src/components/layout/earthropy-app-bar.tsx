"use client";

import { Tooltip, UnstyledButton } from "@mantine/core";

import { clientApi } from "@homarr/api/client";
import { useSession } from "@homarr/auth/client";

/**
 * EARTHROPY suite apps, in launcher order, with the Figma "App Launcher" colors.
 * An app becomes clickable once an app with the same name (and a URL) exists in
 * Manage → Apps; until then it shows as "not installed yet".
 */
export const earthropySuiteApps = [
  { name: "A Drive", letter: "A", from: "#1b6bff", to: "#19d3c5" },
  { name: "Musik", letter: "M", from: "#ff3d81", to: "#ff8a4c" },
  { name: "Whatch", letter: "W", from: "#4f7cff", to: "#b14cff" },
  { name: "Knowlg", letter: "K", from: "#f2994a", to: "#f2c94c" },
  { name: "MediaZ", letter: "M", from: "#19d3c5", to: "#2ecc71" },
  { name: "Notz", letter: "N", from: "#ffd166", to: "#ff8a4c" },
  { name: "Contaktz", letter: "C", from: "#2ecc71", to: "#0f7a4a" },
  { name: "Sticky", letter: "S", from: "#ff8a4c", to: "#ff3d81" },
  { name: "Kalendar", letter: "K", from: "#b14cff", to: "#4f7cff" },
  { name: "struingz", letter: "S", from: "#8a8a8a", to: "#0b1b3f" },
  { name: "Pazzy", letter: "P", from: "#6b4cff", to: "#19d3c5" },
] as const;

const normalize = (name: string) => name.trim().toLowerCase();

export const EarthropyAppBar = () => {
  const { status } = useSession();
  const { data: apps = [] } = clientApi.app.selectable.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 60_000,
  });

  const hrefByName = new Map(
    apps.filter((app) => app.href).map((app) => [normalize(app.name), app.href as string]),
  );

  return (
    <nav className="earthropy-app-bar" aria-label="EARTHROPY apps">
      <div className="earthropy-app-bar-track">
        {earthropySuiteApps.map((app) => {
          const href = hrefByName.get(normalize(app.name));
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

          if (!href) {
            return (
              <Tooltip key={app.name} label="Not installed yet" withArrow>
                <span className="earthropy-app" data-installed="false" aria-disabled="true">
                  {icon}
                  {label}
                </span>
              </Tooltip>
            );
          }

          return (
            <UnstyledButton key={app.name} component="a" href={href} className="earthropy-app" data-installed="true">
              {icon}
              {label}
            </UnstyledButton>
          );
        })}
      </div>
    </nav>
  );
};
