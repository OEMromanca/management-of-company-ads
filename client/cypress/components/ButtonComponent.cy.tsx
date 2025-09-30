/// <reference types="cypress" />

import ButtonComponent from "../../src/components/ButtonComponent";
import AddIcon from "@mui/icons-material/Add";
import { mountWithProvidersOverrides } from "../support/mountWithProvidersOverrides";

describe("ButtonComponent", () => {
  const mountButton = (
    variantType: "button" | "icon" = "button",
    overrides?: { onClick?: Cypress.Agent<sinon.SinonStub> }
  ) => {
    const onClick = overrides?.onClick || cy.stub();

    mountWithProvidersOverrides(
      <ButtonComponent variantType={variantType} onClick={onClick}>
        {variantType === "icon" ? (
          <AddIcon data-testid="button-icon" />
        ) : (
          "Click Me"
        )}
      </ButtonComponent>
    );

    return { onClick };
  };

  beforeEach(() => {
    mountButton("button");
  });

  it("renders a regular button with text", () => {
    cy.get('[data-testid="resusable-button"]').should("be.visible");
    cy.get('[data-testid="resusable-button"]').should(
      "contain.text",
      "Click Me"
    );
  });

  it("calls onClick handler when regular button is clicked", () => {
    const { onClick } = mountButton("button");
    cy.get('[data-testid="resusable-button"]').click();
    cy.wrap(onClick).should("have.been.calledOnce");
  });

  it("renders an icon button with AddIcon", () => {
    mountButton("icon");
    cy.get('[data-testid="resusable-button"]').should("be.visible");
    cy.get('[data-testid="button-icon"]').should("exist");
  });

  it("calls onClick handler when icon button is clicked", () => {
    const { onClick } = mountButton("icon");
    cy.get('[data-testid="resusable-button"]').click();
    cy.wrap(onClick).should("have.been.calledOnce");
  });

  it("has correct CSS for text buttons", () => {
    mountButton("button");
    cy.get('[data-testid="resusable-button"]').should(
      "have.css",
      "text-transform",
      "none"
    );
  });

  it("does not apply textTransform for icon buttons", () => {
    mountButton("icon");
    cy.get('[data-testid="resusable-button"]')
      .should("be.visible")
      .then(($btn) => {
        const textTransform = $btn.css("text-transform");
        expect(textTransform).to.equal("none");
      });
  });
});
