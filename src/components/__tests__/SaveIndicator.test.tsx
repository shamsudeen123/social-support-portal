import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import SaveIndicator from '../common/SaveIndicator';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

describe('SaveIndicator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('is hidden when saveIndicator is false', () => {
    const { container } = renderWithProviders(<SaveIndicator />, {
      preloadedState: { ui: { themeMode: 'light', language: 'en', saveIndicator: false } },
    });
    const indicator = container.querySelector('[aria-live="polite"]');
    expect(indicator).toBeInTheDocument();
  });

  it('shows the save text when saveIndicator is true', () => {
    renderWithProviders(<SaveIndicator />, {
      preloadedState: { ui: { themeMode: 'light', language: 'en', saveIndicator: true } },
    });
    expect(screen.getByText('nav.saveProgress')).toBeInTheDocument();
  });

  it('dispatches hideSaveIndicator after 2 seconds', async () => {
    const { store } = renderWithProviders(<SaveIndicator />, {
      preloadedState: { ui: { themeMode: 'light', language: 'en', saveIndicator: true } },
    });

    expect(store.getState().ui.saveIndicator).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(store.getState().ui.saveIndicator).toBe(false);

    vi.useRealTimers();
  });
});
