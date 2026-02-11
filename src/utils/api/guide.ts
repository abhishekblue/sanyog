import { assessmentQuestions } from '../../data/assessmentQuestions';
import { IGeminiRequestBody } from '../api.types';
import { IAssessmentAnswers, IBasicInfo, IPriorityProfile } from '../storage.types';

import { callGemini } from './gemini';

export async function generateGuideSummary(
  basicInfo: IBasicInfo | null,
  priorityProfile: IPriorityProfile,
  language: 'en' | 'hi',
  answers: IAssessmentAnswers
): Promise<string | null> {
  const langKey = language === 'hi' ? 'text_hi' : 'text_en';

  const answerLines = assessmentQuestions
    .filter((q) => answers[q.id])
    .map((q) => {
      const chosen = q.options.find((o) => o.id === answers[q.id]);
      return `- ${q[language === 'hi' ? 'question_hi' : 'question_en']}: ${chosen?.[langKey] || answers[q.id]}`;
    })
    .join('\n');

  const langInstruction =
    language === 'hi'
      ? 'Respond in Hindi (Devanagari script). You may use common English words that are widely understood.'
      : 'Respond in English.';

  const userContext = basicInfo
    ? `The user is a ${basicInfo.gender}, age ${basicInfo.ageRange}, ${basicInfo.isFirstMeeting ? 'first time' : 'experienced'} with arranged marriage meetings, timeline: ${basicInfo.timeline}.`
    : '';

  const prompt = `You are a conversation coach for arranged marriage meetings in India.

${langInstruction}

${userContext}

Priority profile:
- Family & Relationships: ${priorityProfile.family.toUpperCase()} priority
- Career & Ambition: ${priorityProfile.career.toUpperCase()} priority
- Financial Values: ${priorityProfile.finances.toUpperCase()} priority
- Lifestyle & Daily Life: ${priorityProfile.lifestyle.toUpperCase()} priority
- Values & Communication: ${priorityProfile.values.toUpperCase()} priority

Their specific assessment responses:
${answerLines}

Write a warm, personalized 2-3 sentence summary (max 60 words) that reflects what this specific person values based on their actual answers above. Address the user directly with "you". Reference their specific choices (e.g. living preferences, communication style, financial outlook) — don't just say "family is important to you". Do NOT use bullet points or lists — write flowing sentences. Keep it concise.`;

  const requestBody: IGeminiRequestBody = {
    contents: [{ role: 'user', parts: [{ text: 'Generate my guide summary.' }] }],
    systemInstruction: { parts: [{ text: prompt }] },
  };

  try {
    const data = await callGemini(requestBody);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}
