import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../../components/Card';

/**
 * Unit Tests for Card Component
 * Tests component rendering, props, and interactions
 */
describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render card with children', () => {
      render(
        <Card>
          <p>Card Content</p>
        </Card>
      );
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should render card with title', () => {
      render(
        <Card title="Test Title">
          <p>Card Content</p>
        </Card>
      );
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render card without title', () => {
      render(
        <Card>
          <p>Card Content</p>
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card.querySelector('h3')).not.toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('should render card with footer', () => {
      render(
        <Card footer={<button>Footer Button</button>}>
          <p>Card Content</p>
        </Card>
      );
      expect(screen.getByText('Footer Button')).toBeInTheDocument();
    });

    it('should render card without footer', () => {
      render(
        <Card>
          <p>Card Content</p>
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card.querySelector('.bg-gray-50')).not.toBeInTheDocument();
    });
  });

  describe('Click Handler', () => {
    it('should call onClick when card is clicked', () => {
      const handleClick = jest.fn();
      render(
        <Card onClick={handleClick}>
          <p>Card Content</p>
        </Card>
      );
      const card = screen.getByTestId('card');
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick if not provided', () => {
      render(
        <Card>
          <p>Card Content</p>
        </Card>
      );
      const card = screen.getByTestId('card');
      fireEvent.click(card);
      // Should not throw error
      expect(card).toBeInTheDocument();
    });

    it('should apply hover classes when onClick is provided', () => {
      const handleClick = jest.fn();
      render(
        <Card onClick={handleClick}>
          <p>Card Content</p>
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card.className).toContain('cursor-pointer');
    });
  });

  describe('Custom Classes', () => {
    it('should apply custom className', () => {
      render(
        <Card className="custom-card-class">
          <p>Card Content</p>
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card.className).toContain('custom-card-class');
    });
  });
});

