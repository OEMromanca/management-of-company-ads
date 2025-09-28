/// <reference types="cypress" />

import ButtonComponent from "../../src/components/ButtonComponent";
import AddIcon from "@mui/icons-material/Add";
import { mountWithProviders } from "../support/ mountWithProviders";

describe("ButtonComponent", () => {
  const mountButton = (variantType: "button" | "icon" = "button") => {
    const onClick = cy.stub();

    mountWithProviders(
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

  it("should render a regular button with text", () => {
    mountButton("button");

    cy.get('[data-testid="resusable-button"]').should("be.visible");
    cy.get('[data-testid="resusable-button"]').should(
      "contain.text",
      "Click Me"
    );
  });

  it("should call onClick handler when regular button is clicked", () => {
    const { onClick } = mountButton("button");

    cy.get('[data-testid="resusable-button"]').click();
    cy.wrap(onClick).should("have.been.calledOnce");
  });

  it("should render an icon button with AddIcon", () => {
    mountButton("icon");

    cy.get('[data-testid="resusable-button"]').should("be.visible");
    cy.get('[data-testid="button-icon"]').should("exist");
  });

  it("should call onClick handler when icon button is clicked", () => {
    const { onClick } = mountButton("icon");

    cy.get('[data-testid="resusable-button"]').click();
    cy.wrap(onClick).should("have.been.calledOnce");
  });

  it("should have correct CSS for text buttons", () => {
    mountButton("button");

    cy.get('[data-testid="resusable-button"]').should(
      "have.css",
      "text-transform",
      "none"
    );
  });

  it("should not apply textTransform for icon buttons", () => {
    mountButton("icon");

    cy.get('[data-testid="resusable-button"]')
      .should("be.visible")
      .then(($btn) => {
        const textTransform = $btn.css("text-transform");
        expect(textTransform).to.equal("none");
      });
  });
});
