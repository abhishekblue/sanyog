import Constants from 'expo-constants';

import {
  IChatRequest,
  IChatResponse,
  IClaudeMessage,
  IClaudeRequestBody,
  IClaudeResponse,
  ICoachContext,
} from './api.types';
import { IChatMessage } from './storage.types';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-haiku-20240307';
const MAX_TOKENS = 1024;

function getApiKey(): string {
  return Constants.expoConfig?.extra?.claudeApiKey || '';
}

function buildSystemPrompt(context: ICoachContext): string {
  const { basicInfo, priorityProfile, language } = context;

  const languageInstruction =
    language === 'hi'
      ? 'Respond in Hindi (Devanagari script). You may use common English words that are widely understood.'
      : 'Respond in English.';

  const userContext = basicInfo
    ? `
User Profile:
- Gender: ${basicInfo.gender}
- Age range: ${basicInfo.ageRange}
- First arranged marriage meeting: ${basicInfo.isFirstMeeting ? 'Yes' : 'No'}
- Meeting timeline: ${basicInfo.timeline}
`
    : '';

  const priorityContext = priorityProfile
    ? `
Priority Profile (what matters most to them):
- Family & Relationships: ${priorityProfile.family.toUpperCase()} priority
- Career & Ambition: ${priorityProfile.career.toUpperCase()} priority
- Financial Values: ${priorityProfile.finances.toUpperCase()} priority
- Lifestyle & Daily Life: ${priorityProfile.lifestyle.toUpperCase()} priority
- Values & Communication: ${priorityProfile.values.toUpperCase()} priority
`
    : '';

  return `You are an AI Conversation Coach for Samvaad, an app that helps people prepare for arranged marriage meetings in India.

${languageInstruction}

${userContext}
${priorityContext}

Your role:
1. Help users prepare thoughtful questions to ask during their meeting
2. Provide culturally sensitive guidance on navigating conversations
3. Help them evaluate conversations after meetings
4. Identify potential red flags or compatibility concerns
5. Suggest ways to discuss sensitive topics (finances, family expectations, career goals) respectfully

Guidelines:
- Be warm, supportive, and non-judgmental
- Respect Indian cultural values while encouraging healthy boundaries
- Acknowledge that arranged marriages can be positive when both parties communicate openly
- Focus on the user's stated priorities when giving advice
- Be practical and specific in your suggestions
- Keep responses concise but helpful (2-4 paragraphs max)

Do NOT:
- Make assumptions about the other person
- Encourage dishonesty or manipulation
- Be dismissive of family involvement
- Push Western relationship norms inappropriately`;
}

function formatMessagesForClaude(messages: IChatMessage[]): IClaudeMessage[] {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

export async function sendChatMessage(request: IChatRequest): Promise<IChatResponse> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      message: '',
      error: 'API key not configured. Please add CLAUDE_API_KEY to your environment.',
    };
  }

  const systemPrompt = buildSystemPrompt(request.context);
  const messages = formatMessagesForClaude(request.messages);

  const requestBody: IClaudeRequestBody = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages,
  };

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        message: '',
        error: errorData.error?.message || `API error: ${response.status}`,
      };
    }

    const data: IClaudeResponse = await response.json();

    if (data.error) {
      return {
        message: '',
        error: data.error.message,
      };
    }

    const textContent = data.content.find((c) => c.type === 'text');
    return {
      message: textContent?.text || '',
    };
  } catch (error) {
    return {
      message: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
