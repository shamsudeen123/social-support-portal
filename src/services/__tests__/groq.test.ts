import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreate = vi.fn();

vi.mock('openai', () => {
  class OpenAI {
    chat = { completions: { create: mockCreate } };
    constructor() {}
  }
  return { default: OpenAI };
});

vi.stubEnv('VITE_GROQ_API_KEY', 'test-groq-key');

import { translateToArabic, generateGroqSuggestion } from '../groq';

const makeResponse = (content: string) => ({
  choices: [{ message: { content } }],
});

describe('groq service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_GROQ_API_KEY', 'test-groq-key');
  });

  describe('translateToArabic', () => {
    it('returns original text when text is empty', async () => {
      const result = await translateToArabic('');
      expect(result).toBe('');
    });

    it('returns original text when text is whitespace', async () => {
      const result = await translateToArabic('   ');
      expect(result).toBe('   ');
    });

    it('returns translated text on success', async () => {
      mockCreate.mockResolvedValueOnce(makeResponse('مرحبا'));
      const result = await translateToArabic('Hello');
      expect(result).toBe('مرحبا');
    });

    it('returns original text when API call fails', async () => {
      mockCreate.mockRejectedValueOnce(new Error('network error'));
      const result = await translateToArabic('Hello');
      expect(result).toBe('Hello');
    });
  });

  describe('generateGroqSuggestion', () => {
    const baseFormData = {
      employmentStatus: 'unemployed',
      monthlyIncome: '2000',
      dependents: 2,
      maritalStatus: 'married',
      housingStatus: 'rented',
    };

    it('throws NO_API_KEY when key is missing', async () => {
      vi.stubEnv('VITE_GROQ_API_KEY', '');
      await expect(generateGroqSuggestion('financialSituation', baseFormData)).rejects.toMatchObject({ code: 'NO_API_KEY' });
    });

    it('generates a suggestion for financialSituation in English', async () => {
      mockCreate.mockResolvedValueOnce(makeResponse('I am struggling financially'));
      const result = await generateGroqSuggestion('financialSituation', baseFormData, 'en');
      expect(result).toBe('I am struggling financially');
    });

    it('generates a suggestion for employmentCircumstances in English', async () => {
      mockCreate.mockResolvedValueOnce(makeResponse('I lost my job recently'));
      const result = await generateGroqSuggestion('employmentCircumstances', baseFormData, 'en');
      expect(result).toBe('I lost my job recently');
    });

    it('generates a suggestion for reasonForApplying in English', async () => {
      mockCreate.mockResolvedValueOnce(makeResponse('I need assistance to pay bills'));
      const result = await generateGroqSuggestion('reasonForApplying', baseFormData, 'en');
      expect(result).toBe('I need assistance to pay bills');
    });

    it('generates a suggestion in Arabic', async () => {
      mockCreate.mockResolvedValueOnce(makeResponse('أحتاج مساعدة'));
      const result = await generateGroqSuggestion('financialSituation', baseFormData, 'ar');
      expect(result).toBe('أحتاج مساعدة');
    });

    it('throws for unknown field name', async () => {
      await expect(generateGroqSuggestion('unknownField', baseFormData)).rejects.toThrow('Unknown field');
    });

    it('throws TIMEOUT on timeout error', async () => {
      const err = Object.assign(new Error('timeout'), { code: 'ECONNABORTED' });
      mockCreate.mockRejectedValueOnce(err);
      await expect(generateGroqSuggestion('financialSituation', baseFormData)).rejects.toMatchObject({ code: 'TIMEOUT' });
    });

    it('throws INVALID_KEY on 401 error', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockCreate.mockRejectedValueOnce(err);
      await expect(generateGroqSuggestion('financialSituation', baseFormData)).rejects.toMatchObject({ code: 'INVALID_KEY' });
    });

    it('throws RATE_LIMIT on 429 error', async () => {
      const err = Object.assign(new Error('Too many requests'), { status: 429 });
      mockCreate.mockRejectedValueOnce(err);
      await expect(generateGroqSuggestion('financialSituation', baseFormData)).rejects.toMatchObject({ code: 'RATE_LIMIT' });
    });

    it('throws API_ERROR on generic error', async () => {
      mockCreate.mockRejectedValueOnce(new Error('Something went wrong'));
      await expect(generateGroqSuggestion('financialSituation', baseFormData)).rejects.toMatchObject({ code: 'API_ERROR' });
    });

    it('builds context string from form data', async () => {
      mockCreate.mockResolvedValueOnce(makeResponse('نص عربي'));
      await generateGroqSuggestion('reasonForApplying', baseFormData, 'ar');
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages[1].content).toContain('unemployed');
    });
  });
});
