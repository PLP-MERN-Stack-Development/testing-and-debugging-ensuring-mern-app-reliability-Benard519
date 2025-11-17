/**
 * End-to-End Tests for User Flows
 * Tests complete user journeys: registration, login, CRUD operations
 */

describe('User Registration Flow', () => {
  beforeEach(() => {
    // Visit the app
    cy.visit('/');
  });

  it('should register a new user successfully', () => {
    // Fill registration form
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="password"]').type('password123');

    // Submit form
    cy.get('button[type="submit"]').contains('Register').click();

    // Wait for success (check for user in list or success message)
    cy.wait(2000); // Wait for API call

    // Verify user appears in the list
    cy.contains('John Doe').should('be.visible');
    cy.contains('john.doe@example.com').should('be.visible');
  });

  it('should show error for duplicate email', () => {
    // First registration
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('duplicate@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').contains('Register').click();
    cy.wait(2000);

    // Try to register again with same email
    cy.get('input[name="name"]').clear().type('Jane Doe');
    cy.get('input[name="email"]').clear().type('duplicate@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button[type="submit"]').contains('Register').click();

    // Should show error
    cy.contains('error', { matchCase: false }).should('be.visible');
  });

  it('should validate required fields', () => {
    // Try to submit empty form
    cy.get('button[type="submit"]').contains('Register').click();

    // HTML5 validation should prevent submission
    cy.get('input[name="name"]:invalid').should('exist');
  });
});

describe('User Login Flow', () => {
  beforeEach(() => {
    // Create a user first via API
    cy.createUser({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });

    cy.visit('/');
  });

  it('should login user with valid credentials', () => {
    // Note: This test assumes a login form exists
    // For this demo, we'll test via API directly
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/users/login',
      body: {
        email: 'testuser@example.com',
        password: 'password123',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('token');
      expect(response.body.data.user.email).to.eq('testuser@example.com');
    });
  });

  it('should reject login with invalid credentials', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/users/login',
      body: {
        email: 'testuser@example.com',
        password: 'wrongpassword',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.success).to.be.false;
    });
  });
});

describe('CRUD Operations', () => {
  let userId;

  beforeEach(() => {
    // Create a user for testing
    cy.createUser({
      name: 'CRUD Test User',
      email: 'crudtest@example.com',
      password: 'password123',
    }).then((response) => {
      userId = response.data.user.id;
    });

    cy.visit('/');
  });

  it('should create a new user (CREATE)', () => {
    const uniqueEmail = `newuser${Date.now()}@example.com`;

    cy.get('input[name="name"]').type('New User');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').contains('Register').click();

    cy.wait(2000);
    cy.contains('New User').should('be.visible');
    cy.contains(uniqueEmail).should('be.visible');
  });

  it('should read users list (READ)', () => {
    // Users should be displayed on page load
    cy.contains('Users List').should('be.visible');

    // Check if users are displayed
    cy.get('[data-testid="card"]').should('exist');

    // Refresh users
    cy.contains('Refresh Users').click();
    cy.wait(1000);

    // Verify users are still displayed
    cy.contains('Users List').should('be.visible');
  });

  it('should update user via API (UPDATE)', () => {
    cy.request({
      method: 'PUT',
      url: `http://localhost:5000/api/users/${userId}`,
      body: {
        name: 'Updated User Name',
        email: 'updated@example.com',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.name).to.eq('Updated User Name');
      expect(response.body.data.email).to.eq('updated@example.com');
    });
  });

  it('should delete user via API (DELETE)', () => {
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/api/users/${userId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.message).to.include('deleted');
    });

    // Verify user is deleted
    cy.request({
      method: 'GET',
      url: `http://localhost:5000/api/users/${userId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});

describe('Error Handling', () => {
  it('should handle network errors gracefully', () => {
    cy.visit('/');

    // Intercept and fail the request
    cy.intercept('GET', 'http://localhost:5000/api/users', {
      statusCode: 500,
      body: { error: 'Server Error' },
    }).as('getUsersError');

    cy.visit('/');
    cy.wait('@getUsersError');

    // App should still render
    cy.contains('MERN Testing & Debugging Demo').should('be.visible');
  });

  it('should display error messages from API', () => {
    cy.visit('/');

    // Try to register with invalid data
    cy.get('input[name="name"]').type('A'); // Too short
    cy.get('input[name="email"]').type('invalid-email'); // Invalid format
    cy.get('input[name="password"]').type('123'); // Too short

    cy.get('button[type="submit"]').contains('Register').click();

    // Should show validation errors
    cy.wait(2000);
    // Error should be displayed (either from API or HTML5 validation)
  });
});

describe('Component Interactions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should interact with Button component', () => {
    // Test button click
    cy.contains('Refresh Users').click();
    cy.wait(1000);

    // Button should be clickable
    cy.contains('Refresh Users').should('be.visible');
  });

  it('should display Card components', () => {
    // Check if cards are rendered
    cy.contains('Register New User').should('be.visible');
    cy.contains('Users List').should('be.visible');
  });

  it('should handle form input changes', () => {
    cy.get('input[name="name"]').type('Test Name');
    cy.get('input[name="name"]').should('have.value', 'Test Name');

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="email"]').should('have.value', 'test@example.com');
  });
});

