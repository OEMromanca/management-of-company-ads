describe("<HeaderComponent />", () => {
  const mountHeader = (withAdFormStub = true) => {
    return cy.then(async () => {
      const CompaniesCtx = await import("../../src/context/CompaniesContext");
      const ModalCtx = await import("../../src/context/ModalContext");

      const handleCancel = cy.stub().as("handleCancel");
      cy.stub(CompaniesCtx, "useCompaniesContext").returns({
        handleCancel,
      } as any);

      if (withAdFormStub) {
        const AdFormModule = await import(
          "../../src/components/AdFormComponent"
        );
        cy.stub(AdFormModule as any, "default").callsFake(() => (
          <div data-cy="ad-form-placeholder">Ad Form Placeholder</div>
        ));
      }

      const { default: HeaderComponent } = await import(
        "../../src/components/HeaderComponent"
      );

      cy.mount(
        <ModalCtx.ModalProvider>
          <HeaderComponent />
        </ModalCtx.ModalProvider>
      );
    });
  };

  it("renders the application title", () => {
    mountHeader();
    cy.contains("MUI Ads").should("be.visible");
  });

  it("renders the add icon with white color", () => {
    mountHeader();
    cy.get("svg").first().should("have.css", "color", "rgb(255, 255, 255)");
  });

  it("opens a modal with the expected title and actions when the icon button is clicked", () => {
    mountHeader();
    cy.get("button").first().click();
    cy.contains("Create New Ad").should("be.visible");
    cy.contains("Submit").should("be.visible");
    cy.contains("Cancel").should("be.visible");
  });

  it("renders AdForm content (stubbed) inside the modal", () => {
    mountHeader();
    cy.get("button").first().click();
    cy.get("[data-cy='ad-form-placeholder']").should("be.visible");
  });

  it("calls handleCancel (from CompaniesContext) when Cancel is clicked", () => {
    mountHeader();
    cy.get("button").first().click();
    cy.contains("Cancel").click();
    cy.get("@handleCancel").should("have.been.called");
  });

  it("supports keyboard activation (Enter) on the icon button to open the modal", () => {
    mountHeader();
    cy.get("button").first().focus().type("{enter}");
    cy.contains("Create New Ad").should("be.visible");
  });
});
