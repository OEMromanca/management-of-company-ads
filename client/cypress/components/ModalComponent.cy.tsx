/// <reference types="cypress" />

import ModalComponent from "../../src/components/ModalComponent";
import { mountWithProviders } from "../support/ mountWithProviders";

describe("ModalComponent", () => {
  const mountModal = (open = true) => {
    const onClose = cy.stub();
    const onCancel = cy.stub();
    const childButtonClick = cy.stub();

    mountWithProviders(
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

  it("should render the modal and children content", () => {
    mountModal();
    cy.get('[data-testid="modal-dialog"]').should("be.visible");
    cy.get('[data-testid="modal-children-text"]').should(
      "contain.text",
      "Hello from children!"
    );
    cy.get('[data-testid="modal-children-button"]').should("be.visible");
  });

  it("should call child button click handler", () => {
    const { childButtonClick } = mountModal();
    cy.get('[data-testid="modal-children-button"]').click();
    cy.wrap(childButtonClick).should("have.been.calledOnce");
  });

  it("should close the modal when clicking outside (backdrop)", () => {
    const { onClose, onCancel } = mountModal();
    cy.get(".MuiBackdrop-root").click({ force: true });
    cy.wrap(onClose).should("have.been.calledOnce");
    cy.wrap(onCancel).should("have.been.calledOnce");
  });

  it("should call onClose and onCancel when cancel button is clicked", () => {
    const { onClose, onCancel } = mountModal();
    cy.get('[data-testid="modal-cancel-button"]').click();
    cy.wrap(onClose).should("have.been.calledOnce");
    cy.wrap(onCancel).should("have.been.calledOnce");
  });

  it("should not render the modal when open is false", () => {
    const { onClose, onCancel } = mountModal(false);
    cy.get('[data-testid="modal-dialog"]').should("not.exist");
    cy.wrap(onClose).should("not.have.been.called");
    cy.wrap(onCancel).should("not.have.been.called");
  });
});
