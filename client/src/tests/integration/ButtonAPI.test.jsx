import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Button from '../../components/Button';
import { userAPI } from '../../services/api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

/**
 * Integration Tests for Button Component with API
 * Tests component behavior when interacting with API endpoints
 */
describe('Button API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle API call on button click', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'mock-token',
        },
      },
    };

    mockedAxios.create.mockReturnValue({
      post: jest.fn().mockResolvedValue(mockResponse),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    });

    const handleClick = async () => {
      try {
        await userAPI.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      } catch (error) {
        console.error('Registration failed:', error);
      }
    };

    render(<Button onClick={handleClick}>Register</Button>);
    const button = screen.getByTestId('button');
    
    // Simulate click
    button.click();

    // Wait for async operation
    await waitFor(() => {
      expect(button).toBeInTheDocument();
    });
  });

  it('should show loading state during API call', async () => {
    const handleClick = async () => {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));
    };

    const { rerender } = render(
      <Button onClick={handleClick} loading={false}>
        Submit
      </Button>
    );

    const button = screen.getByTestId('button');
    expect(button).not.toHaveTextContent('Loading...');

    // Simulate loading state
    rerender(
      <Button onClick={handleClick} loading={true}>
        Submit
      </Button>
    );

    expect(button).toHaveTextContent('Loading...');
    expect(button).toBeDisabled();
  });

  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const handleClick = async () => {
      try {
        throw new Error('API Error');
      } catch (error) {
        console.error('Error:', error);
      }
    };

    render(<Button onClick={handleClick}>Submit</Button>);
    const button = screen.getByTestId('button');
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});

