import type { Company, IAds } from "../types/types";
import { get, put, del, patch } from "./baseApi";

export async function searchCompanies(params: {
  query?: string;
  ico?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.append("query", params.query);
  if (params.ico) searchParams.append("ico", params.ico);

  return get<Company[]>(`/companies/search?${searchParams.toString()}`);
}

export async function submitAd(
  ico: string,
  adText: string,
  logoFile?: File
): Promise<{ message: string; company: Company }> {
  const formData = new FormData();
  formData.append("adText", adText);
  if (logoFile) formData.append("logo", logoFile);

  return put<{ message: string; company: Company }, FormData>(
    `/companies/${ico}/advert`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function fetchAllAds(page = 1, limit = 10) {
  return get<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    ads: IAds[];
  }>(`/companies/ads?page=${page}&limit=${limit}`);
}

export async function deleteAdvert(advertId: string) {
  return del<{ message: string }>(`/companies/ads/${advertId}`);
}

export async function updateAdvert(
  advertId: string,
  adText: string
): Promise<{ message: string; advert: IAds }> {
  return put<{ message: string; advert: IAds }, { adText: string }>(
    `/companies/ads/${advertId}`,
    { adText },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function toggleTopAdvert(advertId: string) {
  return patch<{ message: string; advert: IAds }, undefined>(
    `/companies/ads/top/${advertId}`
  );
}
