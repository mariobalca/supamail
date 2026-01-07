import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React from 'react';

// Simple mock for @radix-ui/react-slot if needed,
// but usually it works fine in jsdom if rendered simply.

describe('UI Components', () => {
  describe('Button', () => {
    it('renders correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeDefined();
    });

    it('applies variant classes', () => {
      render(<Button variant="danger">Delete</Button>);
      const button = screen.getByText('Delete');
      expect(button.className).toContain('bg-rose-50');
    });
  });

  describe('Badge', () => {
    it('renders with variant', () => {
      render(<Badge variant="success">Active</Badge>);
      const badge = screen.getByText('Active');
      expect(badge.className).toContain('bg-emerald-50');
    });
  });

  describe('Card', () => {
    it('renders children correctly', () => {
      render(
        <Card>
          <CardTitle>My Card</CardTitle>
        </Card>
      );
      expect(screen.getByText('My Card')).toBeDefined();
    });
  });

  describe('Input', () => {
    it('renders correctly', () => {
      render(<Input placeholder="Enter email" />);
      expect(screen.getByPlaceholderText('Enter email')).toBeDefined();
    });
  });
});
