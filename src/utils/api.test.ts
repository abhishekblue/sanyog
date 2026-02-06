import Constants from 'expo-constants';

import { sendChatMessage } from './api';
import { IChatRequest } from './api.types';
import { mockBasicInfo, mockPriorityProfile } from './test.fixtures';

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      claudeApiKey: '',
    },
  },
}));

function setApiKey(key: string): void {
  (
    Constants as unknown as { expoConfig: { extra: { claudeApiKey: string } } }
  ).expoConfig.extra.claudeApiKey = key;
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

describe('sendChatMessage', () => {
  it('returns error when API key is not configured', async () => {
    setApiKey('');

    const result = await sendChatMessage(baseRequest);
    expect(result.error).toContain('API key not configured');
    expect(result.message).toBe('');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('calls Claude API with correct headers when key is set', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Hello! How can I help?' }],
      }),
    });

    await sendChatMessage(baseRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test-api-key',
          'anthropic-version': '2023-06-01',
        },
      })
    );
  });

  it('sends correct request body structure', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Response' }],
      }),
    });

    await sendChatMessage(baseRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.model).toBe('claude-3-haiku-20240307');
    expect(body.max_tokens).toBe(1024);
    expect(body.system).toContain('Samvaad');
    expect(body.messages).toEqual([{ role: 'user', content: 'Hello' }]);
  });

  it('returns message on successful response', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Here is my advice...' }],
      }),
    });

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
        content: [],
        error: { message: 'Rate limited' },
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

  it('returns empty message when no text content in response', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'image', source: {} }],
      }),
    });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
  });

  it('includes English language instruction for en context', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Response' }],
      }),
    });

    await sendChatMessage(baseRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.system).toContain('Respond in English');
  });

  it('includes Hindi language instruction for hi context', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Response' }],
      }),
    });

    const hindiRequest = {
      ...baseRequest,
      context: { ...baseRequest.context, language: 'hi' as const },
    };
    await sendChatMessage(hindiRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.system).toContain('Respond in Hindi');
  });

  it('includes user profile in system prompt', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Response' }],
      }),
    });

    await sendChatMessage(baseRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.system).toContain('female');
    expect(body.system).toContain('26-28');
    expect(body.system).toContain('Yes'); // isFirstMeeting
  });

  it('includes priority profile in system prompt', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Response' }],
      }),
    });

    await sendChatMessage(baseRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.system).toContain('HIGH');
    expect(body.system).toContain('MEDIUM');
    expect(body.system).toContain('FLEXIBLE');
  });

  it('handles null basicInfo in context', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Response' }],
      }),
    });

    const nullInfoRequest = {
      ...baseRequest,
      context: { ...baseRequest.context, basicInfo: null },
    };
    await sendChatMessage(nullInfoRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.system).not.toContain('Gender:');
  });

  it('handles null priorityProfile in context', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Response' }],
      }),
    });

    const nullProfileRequest = {
      ...baseRequest,
      context: { ...baseRequest.context, priorityProfile: null },
    };
    await sendChatMessage(nullProfileRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.system).not.toContain('Priority Profile');
  });

  it('handles empty messages array', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Response' }],
      }),
    });

    const emptyMsgRequest: IChatRequest = {
      ...baseRequest,
      messages: [],
    };

    await sendChatMessage(emptyMsgRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.messages).toEqual([]);
  });

  it('shows No for isFirstMeeting false', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Response' }],
      }),
    });

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
    expect(body.system).toContain('No');
    expect(body.system).toContain('male');
    expect(body.system).toContain('33-35');
  });

  it('picks first text content from multiple content blocks', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [
          { type: 'text', text: 'First response' },
          { type: 'text', text: 'Second response' },
        ],
      }),
    });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('First response');
  });

  it('skips non-text content blocks', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [
          { type: 'tool_use', id: 'abc' },
          { type: 'text', text: 'After tool use' },
        ],
      }),
    });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('After tool use');
  });

  it('handles empty content array', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [],
      }),
    });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
  });

  it('strips id and timestamp from messages sent to API', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Response' }],
      }),
    });

    await sendChatMessage(baseRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    body.messages.forEach((msg: Record<string, unknown>) => {
      expect(msg.id).toBeUndefined();
      expect(msg.timestamp).toBeUndefined();
      expect(msg.role).toBeDefined();
      expect(msg.content).toBeDefined();
    });
  });

  it('formats multiple messages correctly', async () => {
    setApiKey('test-api-key');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Response' }],
      }),
    });

    const multiMsgRequest: IChatRequest = {
      ...baseRequest,
      messages: [
        { id: '1', role: 'user', content: 'Hello', timestamp: 1000 },
        { id: '2', role: 'assistant', content: 'Hi!', timestamp: 1001 },
        { id: '3', role: 'user', content: 'Help me prepare', timestamp: 1002 },
      ],
    };

    await sendChatMessage(multiMsgRequest);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.messages).toEqual([
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi!' },
      { role: 'user', content: 'Help me prepare' },
    ]);
  });
});
