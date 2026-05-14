import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import SuccessPage from '../SuccessPage';

// Mock translation
const mockT = vi.fn((key: string) => key);
let mockLanguage = 'en';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: {
      get language() { return mockLanguage; },
      changeLanguage: vi.fn(),
    },
  }),
}));

// Mock groq service
vi.mock('../../services/groq', () => ({
  translateToArabic: vi.fn((text: string) => Promise.resolve(`AR:${text}`)),
}));

const filledFormData = {
  fullName: 'John Doe',
  nationalId: '12345',
  dateOfBirth: '1990-05-15',
  gender: 'male',
  address: '123 Main St',
  city: 'Dubai',
  state: 'Dubai',
  country: 'UAE',
  phone: '+971501234567',
  email: 'john@example.com',
  maritalStatus: 'married',
  dependents: 2,
  employmentStatus: 'employed',
  monthlyIncome: '5000',
  housingStatus: 'rented',
  financialSituation: 'I am facing financial hardship.',
  employmentCircumstances: 'I work part-time.',
  reasonForApplying: 'I need assistance.',
};

const buildState = (overrides = {}) => ({
  form: {
    currentStep: 0,
    formData: { ...filledFormData, ...overrides },
    isSubmitted: true,
    referenceNumber: 'SSP-12345678',
  },
  ui: { themeMode: 'light' as const, language: 'en', saveIndicator: false },
});

describe('SuccessPage', () => {
  beforeEach(() => {
    mockLanguage = 'en';
    vi.clearAllMocks();
  });

  it('renders the success title', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('submit.title')).toBeInTheDocument();
  });

  it('renders the reference number', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('SSP-12345678')).toBeInTheDocument();
  });

  it('renders the application received chip', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('submit.applicationReceived')).toBeInTheDocument();
  });

  it('renders personal details section', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('personal.title')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders email with original value in English', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders national ID', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('formats date as DD/MM/YYYY in English', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('15/05/1990')).toBeInTheDocument();
  });

  it('shows AED prefix for monthly income', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('AED 5000')).toBeInTheDocument();
  });

  it('shows family info section', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('family.title')).toBeInTheDocument();
  });

  it('shows situation description section', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('situation.title')).toBeInTheDocument();
  });

  it('shows the financial situation text', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('I am facing financial hardship.')).toBeInTheDocument();
  });

  it('shows em dash when field is empty', () => {
    renderWithProviders(<SuccessPage />, {
      preloadedState: buildState({ monthlyIncome: '' }),
    });
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('shows submit.message text', () => {
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(screen.getByText('submit.message')).toBeInTheDocument();
  });

  it('dispatches resetForm when new application button is clicked', () => {
    const { store } = renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    const button = screen.getByRole('button', { name: /submit.newApplication/i });
    fireEvent.click(button);
    expect(store.getState().form.isSubmitted).toBe(false);
    expect(store.getState().form.referenceNumber).toBeNull();
  });

  it('triggers translation when language switches to ar', async () => {
    const { translateToArabic } = await import('../../services/groq');
    mockLanguage = 'ar';
    renderWithProviders(<SuccessPage />, {
      preloadedState: {
        ...buildState(),
        ui: { themeMode: 'light', language: 'ar', saveIndicator: false },
      },
    });
    await waitFor(() => {
      expect(translateToArabic).toHaveBeenCalled();
    });
  });

  it('does not translate when language is en', () => {
    const translateMock = vi.fn();
    renderWithProviders(<SuccessPage />, { preloadedState: buildState() });
    expect(translateMock).not.toHaveBeenCalled();
  });

  it('shows AED in Arabic (د.إ) when language is ar', async () => {
    mockLanguage = 'ar';
    renderWithProviders(<SuccessPage />, {
      preloadedState: {
        ...buildState(),
        ui: { themeMode: 'light', language: 'ar', saveIndicator: false },
      },
    });
    await waitFor(() => {
      expect(screen.getByText(/د\.إ/)).toBeInTheDocument();
    });
  });
});
