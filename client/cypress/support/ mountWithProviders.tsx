import { mount, MountReturn } from "cypress/react";
import { ReactNode } from "react";
import { CompaniesProvider } from "../../src/context/CompaniesContext";
import { ModalProvider } from "../../src/context/ModalContext";

export const mountWithProviders = (
  component: ReactNode
): Cypress.Chainable<MountReturn> => {
  return mount(
    <CompaniesProvider>
      <ModalProvider>{component}</ModalProvider>
    </CompaniesProvider>
  );
};
