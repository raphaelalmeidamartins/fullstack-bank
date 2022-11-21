import '@testing-library/cypress/add-commands';

describe('Tela de cadastro', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}/register`);
  });

  it('Verifica se todos os elementos estão visíveis na tela', () => {
    cy.findByRole('img', { name: /ng\.cash/i }).should('exist');
    cy.findByText('Criar conta').should('exist');
    cy.findByPlaceholderText('Nome de usuário').should('exist');
    cy.findByPlaceholderText('Senha').should('exist');
    cy.findByRole('button', { name: /enviar/i }).should('exist');
    cy.findByText(
      /full stack project desenvolvido por com next\.js e node\.js/i
    ).should('exist');
    cy.findByText(
      /a senha precisa ter pelo menos 8 caracteres, um número e uma letra maiúscula\./i
    ).should('not.exist');
  });

  it('Verifica se a mensagem de erro aparece quando tentamos fazer um cadastro com uma senha que não atende os critérios de segurança', () => {
    cy.findByPlaceholderText('Nome de usuário').type(
      `mileycyrus${Date.now().toFixed().slice(0, 8)}`
    );
    cy.findByPlaceholderText('Senha').type('qualquer_senha_123');
    cy.findByRole('button', { name: /enviar/i }).click();
    cy.findByText(
      /a senha precisa ter pelo menos 8 caracteres, um número e uma letra maiúscula\./i
    ).should('exist');
  });

  it('Verifica que aparece um modal indicando que o usuário foi criado com sucesso e ao clicar, somos redirecionados para a tela de login', () => {
    cy.findByPlaceholderText('Nome de usuário').type(
      `mileycyrus${Date.now().toFixed().slice(0, 8)}1`
    );
    cy.findByPlaceholderText('Senha').type('Qualquer_senha_123');
    cy.findByRole('button', { name: /enviar/i }).click();
    cy.findByText(/usuário criado com sucesso!/i).should('exist');
    cy.findByRole('button', {
      name: /entrar/i,
    }).should('exist');
    cy.findByRole('button', {
      name: /entrar/i,
    }).click();
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/`);
  });
});
