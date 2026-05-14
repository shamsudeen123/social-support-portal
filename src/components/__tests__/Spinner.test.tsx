import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import Spinner from '../common/Spinner';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

describe('Spinner', () => {
  it('renders a progressbar with the correct aria-label', () => {
    renderWithProviders(<Spinner />);
    expect(screen.getByRole('progressbar', { name: 'aria.loading' })).toBeInTheDocument();
  });

  it('renders 12 spinner segments', () => {
    const { container } = renderWithProviders(<Spinner />);
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar?.children.length).toBe(12);
  });

  it('accepts a custom size prop', () => {
    const { container } = renderWithProviders(<Spinner size={60} />);
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toBeInTheDocument();
  });

  it('renders with default size when no size prop is given', () => {
    const { container } = renderWithProviders(<Spinner />);
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toBeInTheDocument();
  });
});
