/// <reference types="cypress" />

import DeleteAdComponent from "../../src/components/DeleteAdComponent";
import { mountWithProviders } from "../support/ mountWithProviders";

describe("<DeleteAdComponent />", () => {
  const advertId = "123";

  const mountDeleteAd = () => {
    mountWithProviders(<DeleteAdComponent advertId={advertId} />);
  };

  it("renders the warning text", () => {
    mountDeleteAd();
    cy.contains(
      "Do you really want to delete this ad? This action is irreversible."
    ).should("be.visible");
  });

  it("renders Cancel and Delete buttons", () => {
    mountDeleteAd();
    cy.contains("Cancel").should("be.visible");
    cy.contains("Delete").should("be.visible");
  });

  it("closes modal when Cancel is clicked", () => {
    mountDeleteAd();
    cy.contains("Cancel").click();
    cy.get('[role="dialog"]').should("not.exist");
  });

  it("closes modal when Delete is clicked", () => {
    mountDeleteAd();
    cy.contains("Delete").click();
    cy.get('[role="dialog"]').should("not.exist");
  });
});
