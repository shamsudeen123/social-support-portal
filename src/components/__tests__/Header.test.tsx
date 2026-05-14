import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import Header from '../common/Header';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: mockChangeLanguage },
  }),
}));

describe('Header', () => {
  it('renders the app title', () => {
    renderWithProviders(<Header />, {
      preloadedState: { ui: { themeMode: 'light', language: 'en', saveIndicator: false } },
    });
    expect(screen.getByText('appTitle')).toBeInTheDocument();
  });

  it('renders the language toggle button', () => {
    renderWithProviders(<Header />, {
      preloadedState: { ui: { themeMode: 'light', language: 'en', saveIndicator: false } },
    });
    expect(screen.getByText('AR')).toBeInTheDocument();
  });

  it('shows EN when language is ar', () => {
    renderWithProviders(<Header />, {
      preloadedState: { ui: { themeMode: 'dark', language: 'ar', saveIndicator: false } },
    });
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('dispatches setLanguage to ar when EN is clicked', () => {
    const { store } = renderWithProviders(<Header />, {
      preloadedState: { ui: { themeMode: 'light', language: 'en', saveIndicator: false } },
    });
    const langButton = screen.getByRole('button', { name: /toggleLanguage/i });
    fireEvent.click(langButton);
    expect(store.getState().ui.language).toBe('ar');
  });

  it('dispatches toggleTheme when theme button is clicked', () => {
    const { store } = renderWithProviders(<Header />, {
      preloadedState: { ui: { themeMode: 'light', language: 'en', saveIndicator: false } },
    });
    const themeButton = screen.getByRole('button', { name: /toggleTheme/i });
    fireEvent.click(themeButton);
    expect(store.getState().ui.themeMode).toBe('dark');
  });

  it('calls i18n.changeLanguage when language is toggled', () => {
    renderWithProviders(<Header />, {
      preloadedState: { ui: { themeMode: 'light', language: 'en', saveIndicator: false } },
    });
    const langButton = screen.getByRole('button', { name: /toggleLanguage/i });
    fireEvent.click(langButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
  });
});
