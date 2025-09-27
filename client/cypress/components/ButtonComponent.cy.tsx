import ButtonComponent from "../../src/components/ButtonComponent";

describe("<ButtonComponent /> reusable", () => {
  it("renders default button", () => {
    cy.mount(<ButtonComponent>Primary Action</ButtonComponent>);
    cy.get("button").should("contain.text", "Primary Action");
  });

  it("renders icon button", () => {
    cy.mount(
      <ButtonComponent variantType="icon" aria-label="icon-action">
        ...
      </ButtonComponent>
    );
    cy.get("button[aria-label='icon-action']").should("exist");
  });

  it("applies custom sx styles", () => {
    cy.mount(
      <ButtonComponent sx={{ backgroundColor: "rgb(0, 128, 0)" }}>
        Styled
      </ButtonComponent>
    );
    cy.get("button").should("have.css", "background-color", "rgb(0, 128, 0)");
  });

  it("handles disabled prop", () => {
    cy.mount(<ButtonComponent disabled>Disabled</ButtonComponent>);
    cy.get("button").should("be.disabled");
  });

  it("handles onClick", () => {
    const handleClick = cy.stub().as("onClick");
    cy.mount(<ButtonComponent onClick={handleClick}>Click</ButtonComponent>);
    cy.get("button").click();
    cy.get("@onClick").should("have.been.calledOnce");
  });
});
