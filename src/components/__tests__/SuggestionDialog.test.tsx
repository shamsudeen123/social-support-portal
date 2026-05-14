import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import SuggestionDialog from '../AI/SuggestionDialog';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

const defaultProps = {
  open: true,
  loading: false,
  suggestion: '',
  error: '',
  errorMessage: '',
  provider: 'openai',
  onAccept: vi.fn(),
  onDiscard: vi.fn(),
  onRetry: vi.fn(),
};

describe('SuggestionDialog', () => {
  describe('loading state', () => {
    it('shows generating text when loading', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} loading={true} />);
      expect(screen.getByText('ai.generating')).toBeInTheDocument();
    });

    it('shows OpenAI loading message', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} loading={true} provider="openai" />);
      expect(screen.getByText('ai.loadingOpenAI')).toBeInTheDocument();
    });

    it('shows Groq loading message when provider is groq', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} loading={true} provider="groq" />);
      expect(screen.getByText('ai.loadingGroq')).toBeInTheDocument();
    });

    it('hides the close button while loading', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} loading={true} />);
      expect(screen.queryByLabelText('aria.close')).not.toBeInTheDocument();
    });
  });

  describe('success state', () => {
    it('shows suggestion text', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} suggestion="Generated text" />);
      expect(screen.getByText('Generated text')).toBeInTheDocument();
    });

    it('shows accept button when suggestion is available', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} suggestion="Some text" />);
      expect(screen.getByText('ai.accept')).toBeInTheDocument();
    });

    it('shows edit button when suggestion is available', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} suggestion="Some text" />);
      expect(screen.getByText('ai.edit')).toBeInTheDocument();
    });

    it('calls onAccept with suggestion when accept clicked', () => {
      const onAccept = vi.fn();
      renderWithProviders(<SuggestionDialog {...defaultProps} suggestion="My text" onAccept={onAccept} />);
      fireEvent.click(screen.getByText('ai.accept'));
      expect(onAccept).toHaveBeenCalledWith('My text');
    });

    it('shows edit mode when edit button is clicked', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} suggestion="Some text" />);
      fireEvent.click(screen.getByText('ai.edit'));
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('calls onAccept with edited text when in edit mode', () => {
      const onAccept = vi.fn();
      renderWithProviders(<SuggestionDialog {...defaultProps} suggestion="Original" onAccept={onAccept} />);
      fireEvent.click(screen.getByText('ai.edit'));
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Edited text' } });
      fireEvent.click(screen.getByText('ai.accept'));
      expect(onAccept).toHaveBeenCalledWith('Edited text');
    });

    it('shows OpenAI attribution chip', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} suggestion="text" provider="openai" />);
      expect(screen.getByText('ai.poweredBy')).toBeInTheDocument();
    });

    it('shows Groq attribution chip', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} suggestion="text" provider="groq" />);
      expect(screen.getByText('ai.poweredByGroq')).toBeInTheDocument();
    });
  });

  describe('error states', () => {
    it('shows error alert for NO_API_KEY', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} error="NO_API_KEY" />);
      expect(screen.getByText('ai.cannotGenerateTitle')).toBeInTheDocument();
      expect(screen.getByText('ai.errorNoKey')).toBeInTheDocument();
    });

    it('shows quota error title for QUOTA_EXCEEDED', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} error="QUOTA_EXCEEDED" />);
      expect(screen.getByText('ai.quotaErrorTitle')).toBeInTheDocument();
    });

    it('shows billing link for QUOTA_EXCEEDED', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} error="QUOTA_EXCEEDED" />);
      expect(screen.getByText(/ai.addBillingLink/)).toBeInTheDocument();
    });

    it('shows INVALID_KEY error message', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} error="INVALID_KEY" />);
      expect(screen.getByText('ai.errorInvalidKey')).toBeInTheDocument();
    });

    it('shows RATE_LIMIT error message', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} error="RATE_LIMIT" />);
      expect(screen.getByText('ai.errorRateLimit')).toBeInTheDocument();
    });

    it('shows TIMEOUT error message', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} error="TIMEOUT" />);
      expect(screen.getByText('ai.errorTimeout')).toBeInTheDocument();
    });

    it('shows API_ERROR message', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} error="API_ERROR" />);
      expect(screen.getByText('ai.errorGeneral')).toBeInTheDocument();
    });

    it('shows custom errorMessage for API_ERROR', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} error="API_ERROR" errorMessage="Custom error detail" />);
      expect(screen.getByText('Custom error detail')).toBeInTheDocument();
    });

    it('shows retry button for retryable errors', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} error="RATE_LIMIT" />);
      expect(screen.getByText('ai.retry')).toBeInTheDocument();
    });

    it('does not show retry button for NO_API_KEY', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} error="NO_API_KEY" />);
      expect(screen.queryByText('ai.retry')).not.toBeInTheDocument();
    });

    it('calls onRetry when retry button clicked', () => {
      const onRetry = vi.fn();
      renderWithProviders(<SuggestionDialog {...defaultProps} error="RATE_LIMIT" onRetry={onRetry} />);
      fireEvent.click(screen.getByText('ai.retry'));
      expect(onRetry).toHaveBeenCalled();
    });

    it('shows errorMessage block for non-API_ERROR errors with errorMessage', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} error="INVALID_KEY" errorMessage="Extra debug info" />);
      expect(screen.getByText('Extra debug info')).toBeInTheDocument();
    });
  });

  describe('discard behavior', () => {
    it('shows discard button when not loading', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} />);
      expect(screen.getByText('ai.discard')).toBeInTheDocument();
    });

    it('calls onDiscard when discard button clicked', () => {
      const onDiscard = vi.fn();
      renderWithProviders(<SuggestionDialog {...defaultProps} onDiscard={onDiscard} />);
      fireEvent.click(screen.getByText('ai.discard'));
      expect(onDiscard).toHaveBeenCalled();
    });

    it('calls onDiscard when close icon button is clicked', () => {
      const onDiscard = vi.fn();
      renderWithProviders(<SuggestionDialog {...defaultProps} onDiscard={onDiscard} />);
      const closeBtn = screen.getByLabelText('aria.close');
      fireEvent.click(closeBtn);
      expect(onDiscard).toHaveBeenCalled();
    });
  });

  describe('provider variants', () => {
    it('shows OpenAI provider chip', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} provider="openai" />);
      expect(screen.getByText('ai.providerOpenAI')).toBeInTheDocument();
    });

    it('shows Groq provider chip', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} provider="groq" />);
      expect(screen.getByText('ai.providerGroq')).toBeInTheDocument();
    });

    it('shows ai.suggestion as dialog title', () => {
      renderWithProviders(<SuggestionDialog {...defaultProps} />);
      expect(screen.getByText('ai.suggestion')).toBeInTheDocument();
    });
  });
});
