describe('Foo', () => {
	it('Initial app load', () => {
    cy.visit('/')
    cy.get('[data-testid=connect-wallet]').click()
	});
});
