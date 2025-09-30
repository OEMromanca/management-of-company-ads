/// <reference types="cypress" />

import { TableRowComponent } from "../../src/components/TableRowComponent";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { mountWithProvidersOverrides } from "../support/mountWithProvidersOverrides";

describe("<TableRowComponent />", () => {
  const data = [
    {
      _id: "1",
      logo: "logo1.jpg",
      name: "Company 1",
      address: "Address 1",
      ico: "ICO1",
      top: true,
    },
    {
      _id: "2",
      logo: "",
      name: "Company 2",
      address: "Address 2",
      ico: "ICO2",
      top: false,
    },
  ];

  const mountRow = (
    rows = data,
    overrides?: {
      toggleTop?: Cypress.Agent<sinon.SinonStub>;
      edit?: Cypress.Agent<sinon.SinonStub>;
      deleteStub?: Cypress.Agent<sinon.SinonStub>;
    }
  ) => {
    const toggleTop = overrides?.toggleTop || cy.stub();
    const edit = overrides?.edit || cy.stub();
    const deleteStub = overrides?.deleteStub || cy.stub();

    const columns = [
      {
        key: "logo",
        label: "Logo",
        width: "50px",
        render: (row: (typeof data)[0]) =>
          row.logo ? (
            <img src={row.logo} alt="logo" data-testid="logo-img" />
          ) : (
            <span data-testid="no-logo">,</span>
          ),
      },
      { key: "name", label: "Name", width: "150px" },
      { key: "address", label: "Address", width: "200px" },
      { key: "ico", label: "ICO", width: "100px" },
      {
        key: "top",
        label: "Top",
        width: "50px",
        render: (row: (typeof data)[0]) => (
          <button data-testid="toggle-top" onClick={() => toggleTop(row)}>
            {row.top ? "★" : "☆"}
          </button>
        ),
      },
      {
        key: "edit",
        label: "Edit",
        width: "50px",
        render: () => (
          <button data-testid="edit-btn" onClick={edit}>
            <EditIcon data-testid="edit-icon" />
          </button>
        ),
      },
      {
        key: "delete",
        label: "Delete",
        width: "50px",
        render: () => (
          <button data-testid="delete-btn" onClick={deleteStub}>
            <DeleteIcon data-testid="delete-icon" />
          </button>
        ),
      },
    ];

    mountWithProvidersOverrides(
      <table>
        <tbody>
          {rows.map((row, i) => (
            <TableRowComponent key={i} row={row} mainColumns={columns} />
          ))}
        </tbody>
      </table>
    );

    return { toggleTop, edit, deleteStub };
  };

  beforeEach(() => {
    mountRow();
  });

  it("renders logo image or fallback comma", () => {
    cy.get('[data-testid="logo-img"]')
      .first()
      .should("have.attr", "src", "logo1.jpg");
    cy.get('[data-testid="no-logo"]').should("contain.text", ",");
  });

  it("renders name, address and ICO cells correctly", () => {
    cy.get("tbody tr")
      .first()
      .within(() => {
        cy.get("td").eq(1).should("contain.text", "Company 1");
        cy.get("td").eq(2).should("contain.text", "Address 1");
        cy.get("td").eq(3).should("contain.text", "ICO1");
      });
  });

  it("calls toggleTop on click", () => {
    const { toggleTop } = mountRow();
    cy.get('[data-testid="toggle-top"]').first().click();
    cy.wrap(toggleTop).should("have.been.calledOnceWith", data[0]);
  });

  it("calls edit and delete buttons correctly", () => {
    const { edit, deleteStub } = mountRow();
    cy.get('[data-testid="edit-btn"]').first().click();
    cy.get('[data-testid="delete-btn"]').first().click();
    cy.wrap(edit).should("have.been.calledOnce");
    cy.wrap(deleteStub).should("have.been.calledOnce");
  });
});
