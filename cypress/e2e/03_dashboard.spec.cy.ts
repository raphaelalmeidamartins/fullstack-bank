import '@testing-library/cypress/add-commands';

/* Em andamento */

describe('Tela de dashboard', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(Cypress.config('baseUrl'));

    cy.findByPlaceholderText('Nome de usuário').type('raphaelmartins');
    cy.findByPlaceholderText('Senha').type('Bank_secret_123');
    cy.findByRole('button', { name: /enviar/i }).click();
  });

  it('Verifica se elementos estão na tela', () => {
    cy.findByRole('heading', {
      name: /olá @raphaelmartins/i,
    }).should('be.visible');
    cy.findByRole('button', {
      name: /sair/i,
    }).should('be.visible');
    cy.findByRole('button', {
      name: /atualizar/i,
    }).should('be.visible');
    cy.findByRole('heading', {
      name: /saldo disponível:/i,
    }).should('be.visible');
    cy.findByRole('heading', {
      name: /transferir/i,
    }).should('be.visible');
  });

  it('Verifica botão de sair', () => {
    cy.findByRole('button', {
      name: /sair/i,
    }).click();
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/`);
  });
});
