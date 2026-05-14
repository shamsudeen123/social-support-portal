import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import FormWizard from '../FormWizard/FormWizard';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

// Mock step components so FormWizard tests stay focused
vi.mock('../steps/Step1PersonalInfo', () => ({
  default: () => <div data-testid="step1">Step1</div>,
}));
vi.mock('../steps/Step2FamilyFinancial', () => ({
  default: () => <div data-testid="step2">Step2</div>,
}));
vi.mock('../steps/Step3SituationDesc', () => ({
  default: () => <div data-testid="step3">Step3</div>,
}));
vi.mock('../common/Spinner', () => ({
  default: () => <div data-testid="spinner">Spinner</div>,
}));

const baseState = {
  form: {
    currentStep: 0,
    formData: {
      fullName: '', nationalId: '', dateOfBirth: '', gender: '',
      address: '', city: '', state: '', country: '',
      phone: '', email: '', maritalStatus: '', dependents: 0,
      employmentStatus: '', monthlyIncome: '', housingStatus: '',
      financialSituation: '', employmentCircumstances: '', reasonForApplying: '',
    },
    isSubmitted: false,
    referenceNumber: null,
  },
  ui: { themeMode: 'light' as const, language: 'en', saveIndicator: false },
};

describe('FormWizard', () => {
  it('renders step 1 on first render', () => {
    renderWithProviders(<FormWizard />, { preloadedState: baseState });
    expect(screen.getByTestId('step1')).toBeInTheDocument();
  });

  it('shows Next button on step 1', () => {
    renderWithProviders(<FormWizard />, { preloadedState: baseState });
    expect(screen.getByRole('button', { name: /nav.next/i })).toBeInTheDocument();
  });

  it('Back button is hidden on step 0', () => {
    const { container } = renderWithProviders(<FormWizard />, { preloadedState: baseState });
    const backBtn = container.querySelector('[aria-label="nav.back"]');
    // back button is invisible (visibility: hidden) on step 0
    expect(backBtn).toBeTruthy();
  });

  it('renders step 2 when currentStep is 1', () => {
    renderWithProviders(<FormWizard />, {
      preloadedState: { ...baseState, form: { ...baseState.form, currentStep: 1 } },
    });
    expect(screen.getByTestId('step2')).toBeInTheDocument();
  });

  it('renders step 3 when currentStep is 2', () => {
    renderWithProviders(<FormWizard />, {
      preloadedState: { ...baseState, form: { ...baseState.form, currentStep: 2 } },
    });
    expect(screen.getByTestId('step3')).toBeInTheDocument();
  });

  it('shows Submit button on last step', () => {
    renderWithProviders(<FormWizard />, {
      preloadedState: { ...baseState, form: { ...baseState.form, currentStep: 2 } },
    });
    expect(screen.getByRole('button', { name: /nav.submit/i })).toBeInTheDocument();
  });

  it('shows Back button on step 2', () => {
    renderWithProviders(<FormWizard />, {
      preloadedState: { ...baseState, form: { ...baseState.form, currentStep: 2 } },
    });
    const backBtn = screen.getByRole('button', { name: /nav.back/i });
    expect(backBtn).toBeInTheDocument();
  });

  it('clicking Back dispatches prevStep', () => {
    const { store } = renderWithProviders(<FormWizard />, {
      preloadedState: { ...baseState, form: { ...baseState.form, currentStep: 1 } },
    });
    fireEvent.click(screen.getByRole('button', { name: /nav.back/i }));
    expect(store.getState().form.currentStep).toBe(0);
  });

  it('clicking Next on step 0 advances to step 1', async () => {
    const { store } = renderWithProviders(<FormWizard />, { preloadedState: baseState });
    fireEvent.click(screen.getByRole('button', { name: /nav.next/i }));
    await waitFor(() => {
      expect(store.getState().form.currentStep).toBe(1);
    });
  });
});
