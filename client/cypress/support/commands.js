// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to register a new user
 * @example cy.registerUser('John Doe', 'john@example.com', 'password123')
 */
Cypress.Commands.add('registerUser', (name, email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/users/register',
    body: {
      name,
      email,
      password,
    },
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body;
  });
});

/**
 * Custom command to login a user
 * @example cy.loginUser('john@example.com', 'password123')
 */
Cypress.Commands.add('loginUser', (email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/users/login',
    body: {
      email,
      password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    if (response.body.data.token) {
      window.localStorage.setItem('token', response.body.data.token);
    }
    return response.body;
  });
});

/**
 * Custom command to create a user via API
 * @example cy.createUser({ name: 'John', email: 'john@example.com', password: 'pass123' })
 */
Cypress.Commands.add('createUser', (userData) => {
  return cy.registerUser(userData.name, userData.email, userData.password);
});

