import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from '../../App';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

/**
 * Integration Tests for App Component
 * Tests component interactions and API integration
 */
describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock axios instance
    const mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
  });

  it('should render app with registration form', () => {
    mockedAxios.create().get.mockResolvedValue({
      data: { success: true, data: [] },
    });

    render(<App />);
    expect(screen.getByText('MERN Testing & Debugging Demo')).toBeInTheDocument();
    expect(screen.getByText('Register New User')).toBeInTheDocument();
  });

  it('should fetch and display users on mount', async () => {
    const mockUsers = [
      { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
      { _id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'user' },
    ];

    mockedAxios.create().get.mockResolvedValue({
      data: { success: true, data: mockUsers },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  it('should handle form submission', async () => {
    mockedAxios.create().get.mockResolvedValue({
      data: { success: true, data: [] },
    });

    mockedAxios.create().post.mockResolvedValue({
      data: {
        success: true,
        data: {
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'mock-token',
        },
      },
    });

    render(<App />);

    // Fill form
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    const submitButton = screen.getByText('Register');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.create().post).toHaveBeenCalledWith(
        '/users/register',
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
      );
    });
  });

  it('should display error message on API failure', async () => {
    mockedAxios.create().get.mockRejectedValue({
      response: { data: { error: 'Failed to fetch users' } },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch users')).toBeInTheDocument();
    });
  });

  it('should refresh users list when refresh button is clicked', async () => {
    const mockUsers = [
      { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
    ];

    mockedAxios.create().get
      .mockResolvedValueOnce({ data: { success: true, data: [] } })
      .mockResolvedValueOnce({ data: { success: true, data: mockUsers } });

    render(<App />);

    const refreshButton = screen.getByText('Refresh Users');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});

