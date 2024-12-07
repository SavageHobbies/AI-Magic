describe('Barcode Scanner', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow manual barcode input', () => {
    const testBarcode = '194346264162';
    cy.get('input[placeholder="Scan barcode"]').type(testBarcode);
    cy.get('button').contains('Lookup').click();
    cy.get('div').contains('Loading...').should('be.visible');
  });

  it('should handle barcode scan simulation', () => {
    const testBarcode = '194346264162';
    cy.get('input[placeholder="Scan barcode"]')
      .type(testBarcode)
      .type('{enter}');
    cy.get('div').contains('Loading...').should('be.visible');
  });

  it('should show error message for invalid barcode', () => {
    const invalidBarcode = '000000000000';
    cy.get('input[placeholder="Scan barcode"]')
      .type(invalidBarcode)
      .type('{enter}');
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Error looking up product');
    });
  });
});