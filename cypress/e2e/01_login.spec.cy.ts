import '@testing-library/cypress/add-commands';

describe('Tela de login', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(Cypress.config('baseUrl'));
  });

  it('Verifica se todos os elementos estão visíveis na tela', () => {
    cy.findByRole('img', { name: /ng\.cash/i }).should('exist');
    cy.findByText('Login').should('exist');
    cy.findByPlaceholderText('Nome de usuário').should('exist');
    cy.findByPlaceholderText('Senha').should('exist');
    cy.findByRole('button', { name: /enviar/i }).should('exist');
    cy.findByRole('button', { name: /criar conta/i }).should('exist');
    cy.findByText(
      /full stack project desenvolvido por com next\.js e node\.js/i
    ).should('exist');
    cy.findByText(/o nome de usuário ou a senha estão incorretos/i).should(
      'not.exist'
    );
  });

  it('Verifica se a mensagem de erro aparece quando tentamos fazer login', () => {
    cy.findByPlaceholderText('Nome de usuário').type('beyonceknowles');
    cy.findByPlaceholderText('Senha').type('Qualquer_senha_123');
    cy.findByRole('button', { name: /enviar/i }).click();
    cy.findByText(/o nome de usuário ou a senha estão incorretos/i).should(
      'exist'
    );
  });

  it('Verifica se redireciona para a dashboard após fazer login com credenciais válidas', () => {
    cy.findByPlaceholderText('Nome de usuário').type('raphaelmartins');
    cy.findByPlaceholderText('Senha').type('Bank_secret_123');
    cy.findByRole('button', { name: /enviar/i }).click();
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/dashboard`);
  });

  it('Verifica se o botão de criar conta redireciona para a tela de cadastro', () => {
    cy.findByRole('button', { name: /criar conta/i }).click();
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/register`);
  });
});
