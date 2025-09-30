import { mount, MountReturn } from "cypress/react";
import { ReactNode } from "react";
import {
  CompaniesContext,
  CompaniesContextType,
} from "../../src/context/CompaniesContext";
import { ModalContext } from "../../src/context/ModalContext";

const defaultCompaniesContext: CompaniesContextType = {
  formData: { companyName: "", ico: "", address: "", adText: "" },
  logo: null,
  companyOptions: [],
  loadingCompanies: false,
  ads: [],
  adsLoading: false,
  adsPageLoading: false,
  adsPage: 0,
  adsLimit: 10,
  adsTotal: 0,
  setAdsPage: () => {},
  setAdsLimit: () => {},
  setFormData: () => {},
  setLogo: () => {},
  handleChange: () => {},
  handleFileChange: () => {},
  handleSubmit: async () => {},
  handleChangePage: () => {},
  handleChangeRowsPerPage: () => {},
  handleCancel: () => {},
  handleDeleteAd: async () => Promise.resolve(),
  handleUpdateAd: async () => Promise.resolve(),
  handleToggleTopAd: async () => Promise.resolve(),
  fetchAds: async () => Promise.resolve(),
};

const defaultModal = {
  openModal: () => {},
  closeModal: () => {},
  isOpen: true,
};

export const mountWithProvidersOverrides = (
  component: ReactNode,
  {
    companiesOverrides = {},
    modalOverrides = {},
  }: {
    companiesOverrides?: Partial<CompaniesContextType>;
    modalOverrides?: Partial<typeof defaultModal>;
  } = {}
): Cypress.Chainable<MountReturn> => {
  const companiesValue = { ...defaultCompaniesContext, ...companiesOverrides };
  const modalValue = { ...defaultModal, ...modalOverrides };

  return mount(
    <CompaniesContext.Provider value={companiesValue}>
      <ModalContext.Provider value={modalValue}>
        {component}
      </ModalContext.Provider>
    </CompaniesContext.Provider>
  );
};
