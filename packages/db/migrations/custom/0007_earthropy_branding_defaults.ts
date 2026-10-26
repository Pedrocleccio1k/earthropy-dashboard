import { defaultBrandingSettings } from "@homarr/server-settings";

import type { Database } from "../..";
import { getServerSettingByKeyAsync, updateServerSettingByKeyAsync } from "../../queries/server-setting";

// EARTHROPY: an old SQL migration stores Homarr's branding on fresh installs.
// Swap it for the EARTHROPY defaults, but only while it is still untouched.
export async function migrateEarthropyBrandingDefaultsAsync(db: Database) {
  const branding = await getServerSettingByKeyAsync(db, "branding");
  const isUntouchedHomarrBranding =
    branding.appName === "Homarr" &&
    branding.primaryColor.toLowerCase() === "#fa5252" &&
    branding.secondaryColor.toLowerCase() === "#fd7e14";

  if (!isUntouchedHomarrBranding) return;

  await updateServerSettingByKeyAsync(db, "branding", {
    ...branding,
    appName: defaultBrandingSettings.appName,
    primaryColor: defaultBrandingSettings.primaryColor,
    secondaryColor: defaultBrandingSettings.secondaryColor,
  });
}
