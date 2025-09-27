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
        Styled...
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

  it("forwards the type prop to the underlying button", () => {
    cy.mount(<ButtonComponent type="submit">Submit</ButtonComponent>);
    cy.get("button").should("have.attr", "type", "submit");
  });

  it("merges and allows sx to override defaults (textTransform, padding)", () => {
    cy.mount(
      <ButtonComponent sx={{ textTransform: "uppercase", paddingTop: "12px" }}>
        Styled Overrides
      </ButtonComponent>
    );
    cy.get("button")
      .should("have.css", "text-transform", "uppercase")
      .and("have.css", "padding-top", "12px");
  });

  it("renders React element children correctly", () => {
    cy.mount(
      <ButtonComponent>
        <span data-cy="inner-child">Inner Child</span>
      </ButtonComponent>
    );
    cy.get("[data-cy='inner-child']").should("contain.text", "Inner Child");
  });

  it("suppresses outline on focus via default styles", () => {
    cy.mount(<ButtonComponent>Focus Test</ButtonComponent>);
    cy.get("button").focus().should("have.css", "outline-style", "none");
  });

  it("triggers onClick when activated via Enter key", () => {
    const handleClick = cy.stub().as("onKeyClick");
    cy.mount(
      <ButtonComponent onClick={handleClick}>Key Activate</ButtonComponent>
    );
    cy.get("button").focus().type("{enter}");
    cy.get("@onKeyClick").should("have.been.calledOnce");
  });
});
