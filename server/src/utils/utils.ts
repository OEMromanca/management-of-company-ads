import { IAdvert } from "../types/types";

export const validateQueryOrIco = (query?: string, ico?: string) => {
  const queryStr = query?.trim() ?? "";
  const icoStr = ico?.trim() ?? "";

  if (!queryStr && !icoStr) {
    throw new Error("Please provide query or ico parameter");
  }

  if (icoStr && (icoStr.length < 3 || !/^\d+$/.test(icoStr))) {
    throw new Error("ICO must contain at least 3 digits");
  }

  if (queryStr && queryStr.length < 3) {
    throw new Error("Company name must contain at least 3 characters");
  }

  return { queryStr, icoStr };
};

export const formatLogoToBase64 = (advert: IAdvert) => {
  if (advert.logo && advert.logoMimeType) {
    return `data:${advert.logoMimeType};base64,${advert.logo.toString(
      "base64"
    )}`;
  }
  return undefined;
};

export const sortAds = (ads: IAdvert[]) => {
  return ads.sort((a, b) => {
    if (a.isTop === b.isTop)
      return b.createdAt.getTime() - a.createdAt.getTime();
    return a.isTop ? -1 : 1;
  });
};
