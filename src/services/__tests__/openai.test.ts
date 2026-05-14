import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreate = vi.fn();

vi.mock('openai', () => {
  class OpenAI {
    chat = { completions: { create: mockCreate } };
    constructor() {}
  }
  return { default: OpenAI };
});

vi.stubEnv('VITE_OPENAI_API_KEY', 'test-openai-key');

import { generateAISuggestion } from '../openai';

const makeResponse = (content: string) => ({
  choices: [{ message: { content } }],
});

describe('openai service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-openai-key');
  });

  const baseFormData = {
    employmentStatus: 'employed',
    monthlyIncome: '5000',
    dependents: 1,
    maritalStatus: 'single',
    housingStatus: 'owned',
  };

  it('throws NO_API_KEY when key is missing', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', '');
    await expect(generateAISuggestion('financialSituation', baseFormData)).rejects.toMatchObject({ code: 'NO_API_KEY' });
  });

  it('generates a suggestion for financialSituation', async () => {
    mockCreate.mockResolvedValueOnce(makeResponse('My financial situation is difficult'));
    const result = await generateAISuggestion('financialSituation', baseFormData, 'en');
    expect(result).toBe('My financial situation is difficult');
  });

  it('generates a suggestion for employmentCircumstances', async () => {
    mockCreate.mockResolvedValueOnce(makeResponse('I have been employed for 5 years'));
    const result = await generateAISuggestion('employmentCircumstances', baseFormData, 'en');
    expect(result).toBe('I have been employed for 5 years');
  });

  it('generates a suggestion for reasonForApplying', async () => {
    mockCreate.mockResolvedValueOnce(makeResponse('I need help with expenses'));
    const result = await generateAISuggestion('reasonForApplying', baseFormData, 'en');
    expect(result).toBe('I need help with expenses');
  });

  it('generates a suggestion in Arabic', async () => {
    mockCreate.mockResolvedValueOnce(makeResponse('وضعي المالي صعب'));
    const result = await generateAISuggestion('financialSituation', baseFormData, 'ar');
    expect(result).toBe('وضعي المالي صعب');
  });

  it('throws for unknown field', async () => {
    await expect(generateAISuggestion('unknownField', baseFormData)).rejects.toThrow('Unknown field');
  });

  it('throws TIMEOUT on connection abort', async () => {
    const err = Object.assign(new Error('timeout'), { code: 'ECONNABORTED' });
    mockCreate.mockRejectedValueOnce(err);
    await expect(generateAISuggestion('financialSituation', baseFormData)).rejects.toMatchObject({ code: 'TIMEOUT' });
  });

  it('throws INVALID_KEY on 401', async () => {
    const err = Object.assign(new Error('Unauthorized'), { status: 401 });
    mockCreate.mockRejectedValueOnce(err);
    await expect(generateAISuggestion('financialSituation', baseFormData)).rejects.toMatchObject({ code: 'INVALID_KEY' });
  });

  it('throws QUOTA_EXCEEDED on 429 with quota code', async () => {
    const err = Object.assign(new Error('Quota'), { status: 429, error: { code: 'insufficient_quota' } });
    mockCreate.mockRejectedValueOnce(err);
    await expect(generateAISuggestion('financialSituation', baseFormData)).rejects.toMatchObject({ code: 'QUOTA_EXCEEDED' });
  });

  it('throws RATE_LIMIT on 429 without quota code', async () => {
    const err = Object.assign(new Error('Rate limited'), { status: 429, error: { code: 'rate_limit' } });
    mockCreate.mockRejectedValueOnce(err);
    await expect(generateAISuggestion('financialSituation', baseFormData)).rejects.toMatchObject({ code: 'RATE_LIMIT' });
  });

  it('throws API_ERROR on generic failure', async () => {
    mockCreate.mockRejectedValueOnce(new Error('server error'));
    await expect(generateAISuggestion('financialSituation', baseFormData)).rejects.toMatchObject({ code: 'API_ERROR' });
  });
});
