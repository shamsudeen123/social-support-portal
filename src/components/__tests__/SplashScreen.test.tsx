import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import SplashScreen from '../common/SplashScreen';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders the app title', () => {
    renderWithProviders(<SplashScreen onDone={vi.fn()} />);
    expect(screen.getByText('appTitle')).toBeInTheDocument();
  });

  it('renders the app subtitle', () => {
    renderWithProviders(<SplashScreen onDone={vi.fn()} />);
    expect(screen.getByText('appSubtitle')).toBeInTheDocument();
  });

  it('renders the powered-by text', () => {
    renderWithProviders(<SplashScreen onDone={vi.fn()} />);
    expect(screen.getByText('splash.poweredBy')).toBeInTheDocument();
  });

  it('calls onDone after the timeout', async () => {
    const onDone = vi.fn();
    renderWithProviders(<SplashScreen onDone={onDone} />);
    await act(async () => {
      vi.advanceTimersByTime(2400);
    });
    vi.useRealTimers();
  });
});
