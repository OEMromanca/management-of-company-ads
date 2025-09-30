/// <reference types="cypress" />

import ModalComponent from "../../src/components/ModalComponent";
import { mountWithProvidersOverrides } from "../support/mountWithProvidersOverrides";

describe("ModalComponent", () => {
  const mountModal = (
    open = true,
    overrides?: {
      onClose?: Cypress.Agent<sinon.SinonStub>;
      onCancel?: Cypress.Agent<sinon.SinonStub>;
      childButtonClick?: Cypress.Agent<sinon.SinonStub>;
    }
  ) => {
    const onClose = overrides?.onClose || cy.stub();
    const onCancel = overrides?.onCancel || cy.stub();
    const childButtonClick = overrides?.childButtonClick || cy.stub();

    mountWithProvidersOverrides(
      <ModalComponent
        open={open}
        title="Test Title"
        onClose={onClose}
        onCancel={onCancel}
      >
        <p data-testid="modal-children-text">Hello from children!</p>
        <button data-testid="modal-children-button" onClick={childButtonClick}>
          Click me
        </button>
        {open && (
          <button
            data-testid="modal-cancel-button"
            onClick={() => {
              onCancel();
              onClose();
            }}
          >
            Cancel
          </button>
        )}
      </ModalComponent>
    );

    return { onClose, onCancel, childButtonClick };
  };

  beforeEach(() => {
    mountModal();
  });

  it("renders the modal and children content", () => {
    cy.get('[data-testid="modal-dialog"]').should("be.visible");
    cy.get('[data-testid="modal-children-text"]').should(
      "contain.text",
      "Hello from children!"
    );
    cy.get('[data-testid="modal-children-button"]').should("be.visible");
  });

  it("calls child button click handler", () => {
    const { childButtonClick } = mountModal();
    cy.get('[data-testid="modal-children-button"]').click();
    cy.wrap(childButtonClick).should("have.been.calledOnce");
  });

  it("calls onClose and onCancel when clicking backdrop", () => {
    const { onClose, onCancel } = mountModal();
    cy.get(".MuiBackdrop-root").click({ force: true });
    cy.wrap(onClose).should("have.been.calledOnce");
    cy.wrap(onCancel).should("have.been.calledOnce");
  });

  it("calls onClose and onCancel when cancel button is clicked", () => {
    const { onClose, onCancel } = mountModal();
    cy.get('[data-testid="modal-cancel-button"]').click();
    cy.wrap(onClose).should("have.been.calledOnce");
    cy.wrap(onCancel).should("have.been.calledOnce");
  });

  it("does not render modal when open is false", () => {
    const { onClose, onCancel } = mountModal(false);
    cy.get('[data-testid="modal-dialog"]').should("not.exist");
    cy.wrap(onClose).should("not.have.been.called");
    cy.wrap(onCancel).should("not.have.been.called");
  });
});
