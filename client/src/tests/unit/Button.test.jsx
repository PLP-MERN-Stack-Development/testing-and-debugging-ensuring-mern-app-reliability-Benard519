import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../../components/Button';

/**
 * Unit Tests for Button Component
 * Tests component rendering, props, and user interactions
 */
describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click Me</Button>);
      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click Me');
    });

    it('should render button with default props', () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('type', 'button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Variants', () => {
    it('should apply primary variant classes', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByTestId('button');
      expect(button.className).toContain('bg-blue-600');
    });

    it('should apply secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByTestId('button');
      expect(button.className).toContain('bg-gray-600');
    });

    it('should apply danger variant classes', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByTestId('button');
      expect(button.className).toContain('bg-red-600');
    });
  });

  describe('Sizes', () => {
    it('should apply small size classes', () => {
      render(<Button size="small">Small</Button>);
      const button = screen.getByTestId('button');
      expect(button.className).toContain('px-3');
      expect(button.className).toContain('py-1.5');
    });

    it('should apply medium size classes', () => {
      render(<Button size="medium">Medium</Button>);
      const button = screen.getByTestId('button');
      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-2');
    });

    it('should apply large size classes', () => {
      render(<Button size="large">Large</Button>);
      const button = screen.getByTestId('button');
      expect(button.className).toContain('px-6');
      expect(button.className).toContain('py-3');
    });
  });

  describe('Disabled State', () => {
    it('should disable button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByTestId('button');
      expect(button).toBeDisabled();
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      const button = screen.getByTestId('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show loading text when loading prop is true', () => {
      render(<Button loading>Button</Button>);
      const button = screen.getByTestId('button');
      expect(button).toHaveTextContent('Loading...');
      expect(button).toBeDisabled();
    });

    it('should not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<Button loading onClick={handleClick}>Button</Button>);
      const button = screen.getByTestId('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Click Handler', () => {
    it('should call onClick when button is clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByTestId('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should pass event to onClick handler', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByTestId('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('Button Types', () => {
    it('should render submit button', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should render reset button', () => {
      render(<Button type="reset">Reset</Button>);
      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('Custom Classes', () => {
    it('should apply custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByTestId('button');
      expect(button.className).toContain('custom-class');
    });
  });
});

