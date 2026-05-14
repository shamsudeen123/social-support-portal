import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import formReducer from '../../slices/formSlice';
import uiReducer from '../../slices/uiSlice';
import Step1PersonalInfo from '../steps/Step1PersonalInfo';
import Step2FamilyFinancial from '../steps/Step2FamilyFinancial';
import Step3SituationDesc from '../steps/Step3SituationDesc';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

// Mock the AI suggestion service
vi.mock('../../services/groq', () => ({
  generateGroqSuggestion: vi.fn(),
}));
vi.mock('../../services/openai', () => ({
  generateAISuggestion: vi.fn(),
}));

const defaultFormData = {
  fullName: '',
  nationalId: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: '',
  phone: '',
  email: '',
  maritalStatus: '',
  dependents: 0,
  employmentStatus: '',
  monthlyIncome: '',
  housingStatus: '',
  financialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: '',
};

function StepWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: defaultFormData });
  const store = configureStore({
    reducer: { form: formReducer, ui: uiReducer },
  });
  const theme = createTheme();
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <FormProvider {...methods}>
            {children}
          </FormProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

describe('Step1PersonalInfo', () => {
  it('renders without crashing', () => {
    render(<Step1PersonalInfo />, { wrapper: StepWrapper });
  });

  it('renders the full name field', () => {
    render(<Step1PersonalInfo />, { wrapper: StepWrapper });
    expect(screen.getByLabelText(/personal.fullName/i)).toBeInTheDocument();
  });

  it('renders the national ID field', () => {
    render(<Step1PersonalInfo />, { wrapper: StepWrapper });
    expect(screen.getByLabelText(/personal.nationalId/i)).toBeInTheDocument();
  });

  it('renders gender select', () => {
    render(<Step1PersonalInfo />, { wrapper: StepWrapper });
    expect(screen.getByLabelText(/personal.gender/i)).toBeInTheDocument();
  });

  it('renders phone field', () => {
    render(<Step1PersonalInfo />, { wrapper: StepWrapper });
    expect(screen.getByLabelText(/personal.phone/i)).toBeInTheDocument();
  });

  it('renders email field', () => {
    render(<Step1PersonalInfo />, { wrapper: StepWrapper });
    expect(screen.getByLabelText(/personal.email/i)).toBeInTheDocument();
  });
});

describe('Step2FamilyFinancial', () => {
  it('renders without crashing', () => {
    render(<Step2FamilyFinancial />, { wrapper: StepWrapper });
  });

  it('renders marital status field', () => {
    render(<Step2FamilyFinancial />, { wrapper: StepWrapper });
    expect(screen.getByLabelText(/family.maritalStatus/i)).toBeInTheDocument();
  });

  it('renders dependents field', () => {
    render(<Step2FamilyFinancial />, { wrapper: StepWrapper });
    expect(screen.getByLabelText(/family.dependents/i)).toBeInTheDocument();
  });

  it('renders monthly income field', () => {
    render(<Step2FamilyFinancial />, { wrapper: StepWrapper });
    expect(screen.getByLabelText(/family.monthlyIncome/i)).toBeInTheDocument();
  });

  it('renders housing status field', () => {
    render(<Step2FamilyFinancial />, { wrapper: StepWrapper });
    expect(screen.getByLabelText(/family.housingStatus/i)).toBeInTheDocument();
  });
});

describe('Step3SituationDesc', () => {
  it('renders without crashing', () => {
    render(<Step3SituationDesc />, { wrapper: StepWrapper });
  });

  it('renders financial situation textarea by name', () => {
    const { container } = render(<Step3SituationDesc />, { wrapper: StepWrapper });
    expect(container.querySelector('textarea[name="financialSituation"]')).toBeInTheDocument();
  });

  it('renders employment circumstances textarea by name', () => {
    const { container } = render(<Step3SituationDesc />, { wrapper: StepWrapper });
    expect(container.querySelector('textarea[name="employmentCircumstances"]')).toBeInTheDocument();
  });

  it('renders reason for applying textarea by name', () => {
    const { container } = render(<Step3SituationDesc />, { wrapper: StepWrapper });
    expect(container.querySelector('textarea[name="reasonForApplying"]')).toBeInTheDocument();
  });

  it('renders AI help buttons', () => {
    render(<Step3SituationDesc />, { wrapper: StepWrapper });
    expect(screen.getAllByText('situation.helpMeWrite').length).toBeGreaterThan(0);
  });

  it('opens AI dialog when OpenAI button is clicked', async () => {
    const { generateAISuggestion } = await import('../../services/openai');
    (generateAISuggestion as ReturnType<typeof vi.fn>).mockResolvedValueOnce('AI generated text');
    render(<Step3SituationDesc />, { wrapper: StepWrapper });
    const aiButtons = screen.getAllByLabelText(/helpMeWriteOpenAI/);
    fireEvent.click(aiButtons[0]);
    await waitFor(() => {
      expect(screen.getByText('ai.suggestion')).toBeInTheDocument();
    });
  });

  it('opens AI dialog when Groq button is clicked', async () => {
    const { generateGroqSuggestion } = await import('../../services/groq');
    (generateGroqSuggestion as ReturnType<typeof vi.fn>).mockResolvedValueOnce('Groq text');
    render(<Step3SituationDesc />, { wrapper: StepWrapper });
    const groqButtons = screen.getAllByLabelText(/helpMeWriteGroq/);
    fireEvent.click(groqButtons[0]);
    await waitFor(() => {
      expect(screen.getByText('ai.suggestion')).toBeInTheDocument();
    });
  });

  it('closes dialog on discard', async () => {
    const { generateAISuggestion } = await import('../../services/openai');
    (generateAISuggestion as ReturnType<typeof vi.fn>).mockResolvedValueOnce('Some text');
    render(<Step3SituationDesc />, { wrapper: StepWrapper });
    const aiButtons = screen.getAllByLabelText(/helpMeWriteOpenAI/);
    fireEvent.click(aiButtons[0]);
    await waitFor(() => screen.getByText('ai.discard'));
    fireEvent.click(screen.getByText('ai.discard'));
    await waitFor(() => {
      expect(screen.queryByText('ai.suggestion')).not.toBeInTheDocument();
    });
  });
});
