import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import ProgressStepper from '../FormWizard/ProgressStepper';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (opts) return Object.entries(opts).reduce((s, [k, v]) => s.replace(`{{${k}}}`, String(v)), key);
      return key;
    },
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

describe('ProgressStepper', () => {
  it('renders step labels', () => {
    renderWithProviders(<ProgressStepper currentStep={0} />);
    expect(screen.getByText('steps.personalInfo')).toBeInTheDocument();
  });

  it('renders step 1 of 3 when on first step', () => {
    renderWithProviders(<ProgressStepper currentStep={0} />);
    // step badge shows currentStep + 1
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });

  it('renders progress text for step 2', () => {
    renderWithProviders(<ProgressStepper currentStep={1} />);
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
  });

  it('renders progress text for step 3', () => {
    renderWithProviders(<ProgressStepper currentStep={2} />);
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
  });

  it('shows 0% progress bar on step 0', () => {
    renderWithProviders(<ProgressStepper currentStep={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('shows a percentage chip', () => {
    renderWithProviders(<ProgressStepper currentStep={1} />);
    expect(screen.getByText(/\d+%/)).toBeInTheDocument();
  });

  it('shows all three step labels', () => {
    renderWithProviders(<ProgressStepper currentStep={0} />);
    expect(screen.getByText('steps.personalInfo')).toBeInTheDocument();
    expect(screen.getByText('steps.familyFinancial')).toBeInTheDocument();
    expect(screen.getByText('steps.situationDesc')).toBeInTheDocument();
  });
});
