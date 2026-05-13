import OpenAI from 'openai';

const SYSTEM_EN =
  'You are a compassionate assistant helping citizens write clear, honest descriptions for government financial assistance applications. Write professionally in plain English. Keep the response to 3-5 sentences only. Do not add any headings, bullet points, or extra formatting — plain paragraph text only.';

const SYSTEM_AR =
  'أنت مساعد متعاطف يساعد المواطنين في كتابة أوصاف واضحة وصادقة لطلبات المساعدة المالية الحكومية. اكتب باحترافية باللغة العربية الفصحى في حدود 3-5 جمل فقط. لا تضف عناوين أو نقاط أو تنسيقات إضافية — نص فقرة عادي فقط.';

// ── Prompt builder ─────────────────────────────────────────────────────────
const buildPrompt = (fieldName, data, language) => {
  const isAr = language === 'ar';

  const ctx = [
    data.employmentStatus && `Employment: ${data.employmentStatus}.`,
    data.monthlyIncome    && `Monthly income: AED ${data.monthlyIncome}.`,
    data.dependents       && `Dependents: ${data.dependents}.`,
    data.maritalStatus    && `Marital status: ${data.maritalStatus}.`,
    data.housingStatus    && `Housing: ${data.housingStatus}.`,
  ]
    .filter(Boolean)
    .join(' ');

  if (isAr) {
    const prompts = {
      financialSituation:
        `أحتاج إلى مساعدة في كتابة فقرة (من 3 إلى 5 جمل) تصف وضعي المالي الصعب الحالي لطلب مساعدة حكومية. ${ctx} اكتب بضمير المتكلم، مع التركيز على الصعوبات المالية والنفقات الشهرية والتحديات التي أواجهها.`,
      employmentCircumstances:
        `أحتاج إلى مساعدة في كتابة فقرة (من 3 إلى 5 جمل) تصف ظروفي الوظيفية لطلب مساعدة حكومية. ${ctx} اكتب بضمير المتكلم، مع تناول تاريخي المهني ووضعي الحالي وأي عقبات تواجه التوظيف.`,
      reasonForApplying:
        `أحتاج إلى مساعدة في كتابة فقرة (من 3 إلى 5 جمل) أشرح فيها سبب تقديمي طلب للحصول على مساعدة مالية حكومية. ${ctx} اكتب بضمير المتكلم بأسلوب صادق ومحدد ومهني يوضح سبب حاجتي لهذا الدعم في الوقت الحالي.`,
    };
    return prompts[fieldName] || null;
  }

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
export const generateAISuggestion = async (fieldName, formData, language = 'en') => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    const err = new Error('No API key'); err.code = 'NO_API_KEY'; throw err;
  }

  const userPrompt = buildPrompt(fieldName, formData, language);
  if (!userPrompt) throw new Error('Unknown field');

  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 500,
      messages: [
        { role: 'system', content: language === 'ar' ? SYSTEM_AR : SYSTEM_EN },
        { role: 'user',   content: userPrompt },
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
