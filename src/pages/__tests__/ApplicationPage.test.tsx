import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import ApplicationPage from '../ApplicationPage';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

// Mock child components to keep tests focused on ApplicationPage routing logic
vi.mock('../../components/FormWizard/FormWizard', () => ({
  default: () => <div data-testid="form-wizard">FormWizard</div>,
}));

vi.mock('./SuccessPage', async () => ({
  default: () => <div data-testid="success-page">SuccessPage</div>,
}));

vi.mock('../SuccessPage', () => ({
  default: () => <div data-testid="success-page">SuccessPage</div>,
}));

describe('ApplicationPage', () => {
  it('renders FormWizard when not submitted', () => {
    renderWithProviders(<ApplicationPage />, {
      preloadedState: {
        form: { currentStep: 0, formData: {} as never, isSubmitted: false, referenceNumber: null },
        ui: { themeMode: 'light', language: 'en', saveIndicator: false },
      },
    });
    expect(screen.getByTestId('form-wizard')).toBeInTheDocument();
  });

  it('renders SuccessPage when submitted', () => {
    renderWithProviders(<ApplicationPage />, {
      preloadedState: {
        form: { currentStep: 0, formData: {} as never, isSubmitted: true, referenceNumber: 'SSP-12345678' },
        ui: { themeMode: 'light', language: 'en', saveIndicator: false },
      },
    });
    expect(screen.getByTestId('success-page')).toBeInTheDocument();
  });

  it('has a main landmark element', () => {
    renderWithProviders(<ApplicationPage />, {
      preloadedState: {
        form: { currentStep: 0, formData: {} as never, isSubmitted: false, referenceNumber: null },
        ui: { themeMode: 'light', language: 'en', saveIndicator: false },
      },
    });
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
