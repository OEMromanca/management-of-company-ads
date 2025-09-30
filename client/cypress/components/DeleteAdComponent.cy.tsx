/// <reference types="cypress" />

import DeleteAdComponent from "../../src/components/DeleteAdComponent";
import { mountWithProvidersOverrides } from "../support/mountWithProvidersOverrides";

describe("<DeleteAdComponent />", () => {
  const advertId = "123";

  const mountDeleteAd = (overrides?: {
    handleDeleteAd?: Cypress.Agent<sinon.SinonStub>;
    closeModal?: Cypress.Agent<sinon.SinonStub>;
  }) => {
    const handleDeleteAd = overrides?.handleDeleteAd || cy.stub().resolves();
    const closeModal = overrides?.closeModal || cy.stub();

    mountWithProvidersOverrides(<DeleteAdComponent advertId={advertId} />, {
      companiesOverrides: { handleDeleteAd },
      modalOverrides: { closeModal },
    });

    return { handleDeleteAd, closeModal };
  };

  beforeEach(() => {
    mountDeleteAd();
  });

  it("renders the warning text", () => {
    cy.contains(
      "Do you really want to delete this ad? This action is irreversible."
    ).should("be.visible");
  });

  it("renders Cancel and Delete buttons", () => {
    cy.contains("Cancel").should("be.visible");
    cy.contains("Delete").should("be.visible");
  });

  it("calls closeModal when Cancel is clicked", () => {
    const { closeModal } = mountDeleteAd();
    cy.contains("Cancel").click();
    cy.wrap(closeModal).should("have.been.calledOnce");
  });

  it("calls handleDeleteAd and closeModal when Delete is clicked", () => {
    const { handleDeleteAd, closeModal } = mountDeleteAd();
    cy.contains("Delete").click();
    cy.wrap(handleDeleteAd).should("have.been.calledOnceWith", advertId);
    cy.wrap(closeModal).should("have.been.calledOnce");
  });
});
