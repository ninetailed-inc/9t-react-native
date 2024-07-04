import { useEffect } from "react";
import { usePathname, useGlobalSearchParams } from "expo-router";
import { useNinetailed } from "@ninetailed/experience.js-react";

export default function NinetailedPageTracker() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  const ninetailed = useNinetailed();

  useEffect(() => {
    ninetailed.page();
  }, [pathname, params, ninetailed]);

  return null;
}
