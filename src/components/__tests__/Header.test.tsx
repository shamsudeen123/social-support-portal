import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../test/renderWithProviders';
import Header from '../common/Header';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: mockChangeLanguage },
  }),
}));

const renderHeader = (preloadedState = { ui: { themeMode: 'light' as const, language: 'en' as const, saveIndicator: false } }) =>
  renderWithProviders(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
    { preloadedState },
  );

describe('Header', () => {
  it('renders the app title', () => {
    renderHeader();
    expect(screen.getByText('appTitle')).toBeInTheDocument();
  });

  it('renders the language toggle button', () => {
    renderHeader();
    expect(screen.getByText('AR')).toBeInTheDocument();
  });

  it('shows EN when language is ar', () => {
    renderHeader({
      ui: { themeMode: 'dark', language: 'ar', saveIndicator: false },
    });
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('dispatches setLanguage to ar when EN is clicked', () => {
    const { store } = renderHeader();
    const langButton = screen.getByRole('button', { name: /toggleLanguage/i });
    fireEvent.click(langButton);
    expect(store.getState().ui.language).toBe('ar');
  });

  it('dispatches toggleTheme when theme button is clicked', () => {
    const { store } = renderHeader();
    const themeButton = screen.getByRole('button', { name: /toggleTheme/i });
    fireEvent.click(themeButton);
    expect(store.getState().ui.themeMode).toBe('dark');
  });

  it('calls i18n.changeLanguage when language is toggled', () => {
    renderHeader();
    const langButton = screen.getByRole('button', { name: /toggleLanguage/i });
    fireEvent.click(langButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
  });
});
