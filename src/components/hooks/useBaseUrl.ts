import { useEffect, useState } from "react";
import { domainDev, domainProd } from "../../config";

export const useBaseUrl = () => {
  const [url, setUrl] = useState(`https://${domainProd}`);
  useEffect(() => {
    async function getCookies() {
      chrome.management.getSelf(async (self) => {
        const isDev = self.installType === "development";
        setUrl(isDev ? `https://${domainDev}` : `https://${domainProd}`);
      });
    }

    getCookies();
  }, []);

  return url;
};
