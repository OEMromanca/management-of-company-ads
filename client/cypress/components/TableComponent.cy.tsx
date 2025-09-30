/// <reference types="cypress" />

import TableComponent from "../../src/components/TableComponent";
import { mountWithProvidersOverrides } from "../support/mountWithProvidersOverrides";

describe("TableComponent", () => {
  const columns = [
    { key: "name", label: "Name", width: "150px" },
    { key: "age", label: "Age", width: "50px" },
    { key: "email", label: "Email", width: "200px" },
  ];

  const data = [
    { _id: "1", name: "Alice", age: 25, email: "alice@example.com" },
    { _id: "2", name: "Bob", age: 30, email: "bob@example.com" },
    { _id: "3", name: "Charlie", age: 22, email: "charlie@example.com" },
  ];

  const mountTable = (
    customData = data,
    customPage = 0,
    customRowsPerPage = 10,
    customTotal = data.length,
    overrides?: {
      onChangePage?: Cypress.Agent<sinon.SinonStub>;
      onChangeRowsPerPage?: Cypress.Agent<sinon.SinonStub>;
    }
  ) => {
    const onChangePage = overrides?.onChangePage || cy.stub();
    const onChangeRowsPerPage = overrides?.onChangeRowsPerPage || cy.stub();

    mountWithProvidersOverrides(
      <TableComponent
        data={customData}
        columns={columns}
        page={customPage}
        rowsPerPage={customRowsPerPage}
        total={customTotal}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    );

    return { onChangePage, onChangeRowsPerPage };
  };

  it("should render table headers correctly", () => {
    mountTable();

    columns.forEach((col) => {
      cy.get("th").contains(col.label).should("exist");
    });
  });

  it("should render all rows and cells correctly", () => {
    mountTable();

    cy.get("tbody tr").should("have.length", data.length);

    data.forEach((row, rowIndex) => {
      cy.get("tbody tr")
        .eq(rowIndex)
        .within(() => {
          cy.get("td").eq(0).should("contain.text", row.name);
          cy.get("td").eq(1).should("contain.text", String(row.age));
          cy.get("td").eq(2).should("contain.text", row.email);
        });
    });
  });

  it("should call onChangePage when next page button is clicked", () => {
    const { onChangePage } = mountTable([], 0, 10, 50);

    cy.get('button[aria-label="Go to next page"]').click();
    cy.wrap(onChangePage).should("have.been.calledOnceWith", 1);
  });

  it("should call onChangeRowsPerPage when rows per page is changed", () => {
    const { onChangeRowsPerPage } = mountTable([], 0, 25, 50);

    cy.get(".MuiTablePagination-select").first().click();
    cy.get("li[role='option']")
      .contains("10")
      .should("be.visible")
      .click({ force: true });

    cy.wrap(onChangeRowsPerPage).should("have.been.calledOnceWith", 10);
  });

  it("should render correctly with empty data", () => {
    mountTable([], 0, 10, 0);

    cy.get("tbody tr").should("have.length", 0);
    columns.forEach((col) => {
      cy.get("th").contains(col.label).should("exist");
    });
  });
});
