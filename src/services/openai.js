import OpenAI from 'openai';

// ── Prompt builder ─────────────────────────────────────────────────────────
const buildPrompt = (fieldName, data) => {
  const ctx = [
    data.employmentStatus && `Employment: ${data.employmentStatus}.`,
    data.monthlyIncome    && `Monthly income: $${data.monthlyIncome}.`,
    data.dependents       && `Dependents: ${data.dependents}.`,
    data.maritalStatus    && `Marital status: ${data.maritalStatus}.`,
    data.housingStatus    && `Housing: ${data.housingStatus}.`,
  ]
    .filter(Boolean)
    .join(' ');

  const prompts = {
    financialSituation:
      `I need help writing a paragraph (3-5 sentences) describing my current financial hardship for a government assistance application. ${ctx} Write in first person, focusing on financial difficulty, monthly expenses, and the challenges I face.`,

    employmentCircumstances:
      `I need help writing a paragraph (3-5 sentences) describing my employment circumstances for a government assistance application. ${ctx} Write in first person, covering my work history, current situation, and any barriers to employment.`,

    reasonForApplying:
      `I need help writing a paragraph (3-5 sentences) explaining why I am applying for government financial assistance. ${ctx} Write in first person, being honest, specific, and professional about why this support is needed right now.`,
  };

  return prompts[fieldName] || null;
};

// ── Main export ────────────────────────────────────────────────────────────
export const generateAISuggestion = async (fieldName, formData) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    const err = new Error('No API key'); err.code = 'NO_API_KEY'; throw err;
  }

  const userPrompt = buildPrompt(fieldName, formData);
  if (!userPrompt) throw new Error('Unknown field');

  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content:
            'You are a compassionate assistant helping citizens write clear, honest descriptions for government financial assistance applications. Write professionally in plain English. Keep the response to 3-5 sentences only.',
        },
        { role: 'user', content: userPrompt },
      ],
    });

    return response.choices[0]?.message?.content?.trim() ?? '';
  } catch (err) {
    if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
      const e = new Error('Timeout'); e.code = 'TIMEOUT'; throw e;
    }
    if (err?.status === 401) {
      const e = new Error('Invalid key'); e.code = 'INVALID_KEY'; throw e;
    }
    if (err?.status === 429) {
      const isQuota = err?.error?.code === 'insufficient_quota';
      const e = new Error(isQuota ? 'Quota exceeded' : 'Rate limit');
      e.code = isQuota ? 'QUOTA_EXCEEDED' : 'RATE_LIMIT';
      throw e;
    }

    const e = new Error(err.message || 'Request failed');
    e.code = 'API_ERROR';
    throw e;
  }
};
