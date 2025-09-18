import axios, { AxiosResponse } from "axios";
import { CompanyModel } from "../models/companyModel";
import { ApiResponse } from "../types/types";

export const fetchAndSaveCompanies = async () => {
  const cities: string[] = ["Košice", "Prešov", "Bardejov"];

  await cities.reduce<Promise<void>>(async (prevPromise, city) => {
    await prevPromise;

    try {
      const response: AxiosResponse<ApiResponse> = await axios.get(
        "https://api.statistics.sk/rpo/v1/search",
        {
          params: {
            addressMunicipality: city,
            establishmentAfter: "2016-01-01",
            establishmentBefore: "2016-12-31",
          },
          headers: { Accept: "application/json" },
        }
      );

      const results = response.data.results;
      if (!results || results.length === 0) {
        console.log(`⚠️ No business entities for city: ${city}`);
        return;
      }

      const companiesToInsert = results.map((entity) => ({
        name: entity.fullNames?.[0]?.value ?? "Unknown name",
        ico: entity.identifiers?.[0]?.value ?? "Unknown ICO",
        address: entity.addresses?.[0]
          ? `${entity.addresses[0].street ?? ""} ${
              entity.addresses[0].regNumber ?? ""
            }, ${entity.addresses[0].municipality?.value ?? ""}`.trim()
          : "Unknown address",
      }));

      await CompanyModel.bulkWrite(
        companiesToInsert.map((company) => ({
          updateOne: {
            filter: { ico: company.ico },
            update: { $setOnInsert: company },
            upsert: true,
          },
        }))
      );

      console.log(
        `✅ Processed business entities for city: ${city}, count: ${companiesToInsert.length}`
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          `❌ Fetch error for city ${city}:`,
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error(`❌ Unexpected error for city ${city}:`, err.message);
      } else {
        console.error(`❌ Unknown error for city ${city}`);
      }
    }
  }, Promise.resolve());
};
