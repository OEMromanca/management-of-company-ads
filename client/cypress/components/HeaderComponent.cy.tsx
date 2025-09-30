/// <reference types="cypress" />

import HeaderComponent from "../../src/components/HeaderComponent";
import { mountWithProvidersOverrides } from "../support/mountWithProvidersOverrides";

describe("<HeaderComponent />", () => {
  const mountHeader = (overrides?: {
    closeModal?: Cypress.Agent<sinon.SinonStub>;
    openModal?: Cypress.Agent<sinon.SinonStub>;
  }) => {
    const openModal = overrides?.openModal || cy.stub();
    const closeModal = overrides?.closeModal || cy.stub();

    mountWithProvidersOverrides(<HeaderComponent />, {
      modalOverrides: { openModal, closeModal },
    });

    return { openModal, closeModal };
  };

  it("renders the title correctly", () => {
    mountHeader();
    cy.get('[data-testid="ads-title"]')
      .should("contain.text", "MUI Ads")
      .should("have.css", "text-align")
      .and("match", /^(left|start)$/);
  });

  it("renders the Add button with white AddIcon", () => {
    mountHeader();
    cy.get('[data-testid="resusable-button"]').within(() => {
      cy.get('[data-testid="add-icon"]')
        .should("exist")
        .and("have.css", "color", "rgb(255, 255, 255)");
    });
  });

  it("opens the modal when Add button is clicked", () => {
    const { openModal } = mountHeader();
    cy.get('[data-testid="resusable-button"]').click();
    cy.wrap(openModal).should("have.been.calledOnce");
  });
});
