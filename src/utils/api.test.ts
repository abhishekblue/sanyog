import Constants from 'expo-constants';

import { sendChatMessage } from './api';
import { IChatRequest } from './api.types';
import { mockBasicInfo, mockPriorityProfile } from './test.fixtures';

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      geminiApiKey: '',
    },
  },
}));

function setApiKey(key: string): void {
  (
    Constants as unknown as {
      expoConfig: { extra: { geminiApiKey: string } };
    }
  ).expoConfig.extra.geminiApiKey = key;
}

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
});

const baseRequest: IChatRequest = {
  messages: [{ id: '1', role: 'user', content: 'Hello', timestamp: 1000 }],
  context: {
    basicInfo: mockBasicInfo,
    priorityProfile: mockPriorityProfile,
    language: 'en',
  },
};

function geminiOkResponse(text: string): {
  ok: true;
  json: () => Promise<{
    candidates: {
      content: { parts: { text: string }[]; role: string };
    }[];
  }>;
} {
  return {
    ok: true,
    json: async () => ({
      candidates: [{ content: { parts: [{ text }], role: 'model' } }],
    }),
  };
}

describe('sendChatMessage', () => {
  it('returns error when API key is not configured', async () => {
    setApiKey('');

    const result = await sendChatMessage(baseRequest);
    expect(result.error).toContain('API key not configured');
    expect(result.message).toBe('');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('calls Gemini API with correct URL and headers', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Hello!'));

    await sendChatMessage(baseRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('generativelanguage.googleapis.com/v1beta/models/'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('includes API key in URL', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Hello!'));

    await sendChatMessage(baseRequest);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('key=test-api-key');
  });

  it('sends correct request body structure', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Response'));

    await sendChatMessage(baseRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.systemInstruction.parts[0].text).toContain('Samvaad');
    expect(body.contents).toEqual([{ role: 'user', parts: [{ text: 'Hello' }] }]);
  });

  it('returns message on successful response', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Here is my advice...'));

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('Here is my advice...');
    expect(result.error).toBeUndefined();
  });

  it('returns error on non-ok response', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        error: { message: 'Invalid API key' },
      }),
    });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
    expect(result.error).toBe('Invalid API key');
  });

  it('returns generic error when error response has no message', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const result = await sendChatMessage(baseRequest);
    expect(result.error).toBe('API error: 500');
  });

  it('returns error when response contains error field', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        error: { message: 'Rate limited', code: 429 },
      }),
    });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
    expect(result.error).toBe('Rate limited');
  });

  it('returns error on network failure', async () => {
    setApiKey('test-api-key');

    mockFetch.mockRejectedValue(new Error('Network request failed'));

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
    expect(result.error).toBe('Network request failed');
  });

  it('returns error on unknown thrown value', async () => {
    setApiKey('test-api-key');

    mockFetch.mockRejectedValue('something weird');

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
    expect(result.error).toBe('Unknown error occurred');
  });

  it('returns empty message when no candidates', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [] }),
    });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
  });

  it('returns empty message when candidates undefined', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
  });

  it('includes English language instruction for en context', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Response'));

    await sendChatMessage(baseRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.systemInstruction.parts[0].text).toContain('Respond in English');
  });

  it('includes Hindi language instruction for hi context', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Response'));

    const hindiRequest = {
      ...baseRequest,
      context: {
        ...baseRequest.context,
        language: 'hi' as const,
      },
    };
    await sendChatMessage(hindiRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.systemInstruction.parts[0].text).toContain('Respond in Hindi');
  });

  it('includes user profile in system prompt', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Response'));

    await sendChatMessage(baseRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const systemText = body.systemInstruction.parts[0].text;
    expect(systemText).toContain('female');
    expect(systemText).toContain('26-28');
    expect(systemText).toContain('Yes');
  });

  it('includes priority profile in system prompt', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Response'));

    await sendChatMessage(baseRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const systemText = body.systemInstruction.parts[0].text;
    expect(systemText).toContain('HIGH');
    expect(systemText).toContain('MEDIUM');
    expect(systemText).toContain('FLEXIBLE');
  });

  it('handles null basicInfo in context', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Response'));

    const nullInfoRequest = {
      ...baseRequest,
      context: { ...baseRequest.context, basicInfo: null },
    };
    await sendChatMessage(nullInfoRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.systemInstruction.parts[0].text).not.toContain('Gender:');
  });

  it('handles null priorityProfile in context', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Response'));

    const nullProfileRequest = {
      ...baseRequest,
      context: { ...baseRequest.context, priorityProfile: null },
    };
    await sendChatMessage(nullProfileRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.systemInstruction.parts[0].text).not.toContain('Priority Profile');
  });

  it('handles empty messages array', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Response'));

    const emptyMsgRequest: IChatRequest = {
      ...baseRequest,
      messages: [],
    };

    await sendChatMessage(emptyMsgRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.contents).toEqual([]);
  });

  it('shows No for isFirstMeeting false', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Response'));

    const notFirstRequest: IChatRequest = {
      ...baseRequest,
      context: {
        ...baseRequest.context,
        basicInfo: {
          ...mockBasicInfo,
          gender: 'male',
          ageRange: '33-35',
          isFirstMeeting: false,
          timeline: 'withinMonth',
        },
      },
    };

    await sendChatMessage(notFirstRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const systemText = body.systemInstruction.parts[0].text;
    expect(systemText).toContain('No');
    expect(systemText).toContain('male');
    expect(systemText).toContain('33-35');
  });

  it('maps assistant role to model for Gemini', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Response'));

    const multiMsgRequest: IChatRequest = {
      ...baseRequest,
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'Hello',
          timestamp: 1000,
        },
        {
          id: '2',
          role: 'assistant',
          content: 'Hi!',
          timestamp: 1001,
        },
        {
          id: '3',
          role: 'user',
          content: 'Help me prepare',
          timestamp: 1002,
        },
      ],
    };

    await sendChatMessage(multiMsgRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.contents).toEqual([
      { role: 'user', parts: [{ text: 'Hello' }] },
      { role: 'model', parts: [{ text: 'Hi!' }] },
      { role: 'user', parts: [{ text: 'Help me prepare' }] },
    ]);
  });

  it('strips id and timestamp from messages sent to API', async () => {
    setApiKey('test-api-key');
    mockFetch.mockResolvedValue(geminiOkResponse('Response'));

    await sendChatMessage(baseRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    body.contents.forEach((msg: Record<string, unknown>) => {
      expect(msg.id).toBeUndefined();
      expect(msg.timestamp).toBeUndefined();
      expect(msg.role).toBeDefined();
      expect(msg.parts).toBeDefined();
    });
  });
});
