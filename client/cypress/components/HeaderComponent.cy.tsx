import HeaderComponent from "../../src/components/HeaderComponent";
import { mountWithProviders } from "../support/ mountWithProviders";

describe("<HeaderComponent />", () => {
  beforeEach(() => {
    mountWithProviders(<HeaderComponent />);
  });

  it("should render the title", () => {
    cy.get('[data-testid="ads-title"]')
      .should("contain.text", "MUI Ads")
      .should("have.css", "text-align")
      .and("match", /^(left|start)$/);
  });

  it("should render the button with white AddIcon", () => {
    cy.get('[data-testid="resusable-button"]').within(() => {
      cy.get('[data-testid="add-icon"]')
        .should("exist")
        .and("have.css", "color", "rgb(255, 255, 255)");
    });
  });

  it("should click the button and open modal", () => {
    cy.get('[data-testid="resusable-button"]')
      .invoke("css", "text-align")
      .should("eq", "center");

    cy.get('[data-testid="resusable-button"]').click();
    cy.get('[data-testid="modal-dialog"]').should("be.visible");
  });
});
