import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Company, FormData, IAds } from "../types/types";
import {
  searchCompanies,
  submitAd,
  fetchAllAds,
  deleteAdvert,
  updateAdvert,
  toggleTopAdvert,
} from "../api/services";
import { toast } from "react-toastify";
import { resetForm, validateFile } from "../utils/fileUtils";

interface CompaniesContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  logo: File | null;
  setLogo: (file: File | null) => void;
  companyOptions: Company[];
  loadingCompanies: boolean;
  ads: IAds[];
  adsLoading: boolean;
  adsPageLoading: boolean;
  adsPage: number;
  adsLimit: number;
  adsTotal: number;
  setAdsPage: (page: number) => void;
  setAdsLimit: (limit: number) => void;
  fetchAds: (
    page?: number,
    limit?: number,
    isPageChange?: boolean
  ) => Promise<void>;
  handleChangePage: (newPage: number) => void;
  handleChangeRowsPerPage: (newRows: number) => void;
  handleCancel: () => void;
  handleDeleteAd: (advertId: string) => Promise<void>;
  handleUpdateAd: (advertId: string, newText: string) => Promise<void>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent, onSuccess?: () => void) => Promise<void>;
  handleToggleTopAd: (advertId: string) => Promise<void>;
}

const CompaniesContext = createContext<CompaniesContextType | undefined>(
  undefined
);

export function CompaniesProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    ico: "",
    address: "",
    adText: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [companyOptions, setCompanyOptions] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  const [ads, setAds] = useState<IAds[]>([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [adsPageLoading, setAdsPageLoading] = useState(false);
  const [adsPage, setAdsPage] = useState(0);
  const [adsLimit, setAdsLimit] = useState(10);
  const [adsTotal, setAdsTotal] = useState(0);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (!file) return;

      const error = validateFile(file, MAX_FILE_SIZE);
      if (error) {
        toast.error(error);
        return;
      }

      setLogo(file);
    },
    []
  );

  const handleCancel = useCallback(() => {
    resetForm(setFormData, setLogo);
  }, []);

  const fetchAds = useCallback(
    async (page = adsPage, limit = adsLimit, isPageChange = false) => {
      if (isPageChange) {
        setAdsPageLoading(true);
      } else {
        setAdsLoading(true);
      }

      try {
        const data = await fetchAllAds(page + 1, limit);
        setAds(data.ads || []);
        setAdsTotal(data.total || 0);
        setAdsPage((data.page ?? 1) - 1);
        setAdsLimit(data.limit || limit);
      } catch (err) {
        console.error("Error fetching ads:", err);
        setAds([]);
        setAdsTotal(0);
      } finally {
        if (isPageChange) {
          setAdsPageLoading(false);
        } else {
          setAdsLoading(false);
        }
      }
    },
    [adsLimit]
  );

  const handleChangePage = useCallback(
    (newPage: number) => {
      fetchAds(newPage, adsLimit, true);
    },
    [adsLimit, fetchAds]
  );

  const handleChangeRowsPerPage = useCallback(
    (newRows: number) => {
      fetchAds(0, newRows, true);
    },
    [fetchAds]
  );

  const handleDeleteAd = useCallback(
    async (advertId: string) => {
      try {
        await deleteAdvert(advertId);
        toast("The ad has been deleted");
        await fetchAds(adsPage, adsLimit);
      } catch (err) {
        console.error("Error deleting ad:", err);
        toast("Error while deleting the ad");
      }
    },
    [adsPage, adsLimit, fetchAds]
  );

  const handleUpdateAd = useCallback(
    async (advertId: string, newText: string) => {
      try {
        await updateAdvert(advertId, newText);
        toast("The ad has been successfully updated");
        await fetchAds(adsPage, adsLimit);
      } catch (err) {
        console.error("Error updating ad:", err);
        toast("Error while updating the ad");
      }
    },
    [adsPage, adsLimit, fetchAds]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent, onSuccess?: () => void) => {
      e.preventDefault();
      if (!formData.ico) {
        toast("ICO is required!");
        return;
      }
      try {
        const result = await submitAd(
          formData.ico,
          formData.adText,
          logo ?? undefined
        );
        toast(`Ad submitted successfully for ${result.company.name}`);
        await fetchAds(adsPage, adsLimit);
        if (onSuccess) onSuccess();
        handleCancel();
      } catch (err) {
        console.error("Error submitting ad:", err);
        toast("Error submitting the ad");
      }
    },
    [formData, logo, adsPage, adsLimit, fetchAds, handleCancel]
  );

  const handleToggleTopAd = useCallback(
    async (advertId: string) => {
      try {
        const result = await toggleTopAdvert(advertId);
        toast(result.message);

        await fetchAds(0, adsLimit, true);
      } catch (err) {
        console.error("Error toggling top ad:", err);
        toast("Error while toggling top ad");
      }
    },
    [adsLimit, fetchAds]
  );

  useEffect(() => {
    const fetchCompanies = async () => {
      if (formData.companyName.length >= 3 || formData.ico.length >= 3) {
        setLoadingCompanies(true);
        try {
          const data = await searchCompanies({
            query:
              formData.companyName.length >= 3
                ? formData.companyName
                : undefined,
            ico: formData.ico.length >= 3 ? formData.ico : undefined,
          });
          setCompanyOptions(data);
        } catch (err) {
          console.error("Error fetching companies:", err);
        } finally {
          setLoadingCompanies(false);
        }
      } else {
        setCompanyOptions([]);
      }
    };
    fetchCompanies();
  }, [formData.companyName, formData.ico]);

  useEffect(() => {
    if (companyOptions.length === 1 && formData.ico === companyOptions[0].ico) {
      const company = companyOptions[0];
      setFormData((prev) => ({
        ...prev,
        companyName: company.name,
        address: company.address || "",
      }));
    }
  }, [companyOptions, formData.ico]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return (
    <CompaniesContext.Provider
      value={{
        formData,
        logo,
        companyOptions,
        loadingCompanies,
        ads,
        adsLoading,
        adsPageLoading,
        adsPage,
        adsLimit,
        adsTotal,
        setAdsPage,
        setAdsLimit,
        setFormData,
        setLogo,
        handleChange,
        handleFileChange,
        handleSubmit,
        handleChangePage,
        handleChangeRowsPerPage,
        handleCancel,
        handleDeleteAd,
        handleUpdateAd,
        handleToggleTopAd,
        fetchAds,
      }}
    >
      {children}
    </CompaniesContext.Provider>
  );
}

export function useCompaniesContext(): CompaniesContextType {
  const context = useContext(CompaniesContext);
  if (!context) {
    throw new Error(
      "useCompaniesContext must be used within CompaniesProvider"
    );
  }
  return context;
}
