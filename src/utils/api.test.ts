import { sendChatMessage } from './api';
import { IChatRequest } from './api.types';
import { mockBasicInfo, mockPriorityProfile } from './test.fixtures';

const mockCallable = jest.fn();

jest.mock('@react-native-firebase/functions', () => () => ({
  httpsCallable: () => mockCallable,
}));

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
  it('returns message on successful response', async () => {
    mockCallable.mockResolvedValue({ data: { message: 'Here is my advice...' } });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('Here is my advice...');
    expect(result.error).toBeUndefined();
  });

  it('passes contents and systemInstruction to callable', async () => {
    mockCallable.mockResolvedValue({ data: { message: 'Response' } });

    await sendChatMessage(baseRequest);

    expect(mockCallable).toHaveBeenCalledWith(
      expect.objectContaining({
        contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
        systemInstruction: expect.objectContaining({
          parts: [expect.objectContaining({ text: expect.stringContaining('Samvaad') })],
        }),
      })
    );
  });

  it('returns error on Cloud Function failure', async () => {
    mockCallable.mockRejectedValue({ code: 'functions/internal', message: 'Server error' });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
    expect(result.error).toBe('Server error');
  });

  it('returns error on rate limit exhausted', async () => {
    mockCallable.mockRejectedValue({
      code: 'functions/resource-exhausted',
      message: 'Daily message limit reached.',
    });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
    expect(result.error).toBe('Daily message limit reached.');
  });

  it('returns empty message when Cloud Function returns empty text', async () => {
    mockCallable.mockResolvedValue({ data: { message: '' } });

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
  });

  it('includes English language instruction for en context', async () => {
    mockCallable.mockResolvedValue({ data: { message: 'Response' } });

    await sendChatMessage(baseRequest);

    const callArg = mockCallable.mock.calls[0][0];
    expect(callArg.systemInstruction.parts[0].text).toContain('Respond in English');
  });

  it('includes Hindi language instruction for hi context', async () => {
    mockCallable.mockResolvedValue({ data: { message: 'Response' } });

    const hindiRequest = {
      ...baseRequest,
      context: { ...baseRequest.context, language: 'hi' as const },
    };
    await sendChatMessage(hindiRequest);

    const callArg = mockCallable.mock.calls[0][0];
    expect(callArg.systemInstruction.parts[0].text).toContain('Respond in Hindi');
  });

  it('includes user profile in system prompt', async () => {
    mockCallable.mockResolvedValue({ data: { message: 'Response' } });

    await sendChatMessage(baseRequest);

    const systemText = mockCallable.mock.calls[0][0].systemInstruction.parts[0].text;
    expect(systemText).toContain('female');
    expect(systemText).toContain('26-28');
    expect(systemText).toContain('Yes');
  });

  it('includes priority profile in system prompt', async () => {
    mockCallable.mockResolvedValue({ data: { message: 'Response' } });

    await sendChatMessage(baseRequest);

    const systemText = mockCallable.mock.calls[0][0].systemInstruction.parts[0].text;
    expect(systemText).toContain('HIGH');
    expect(systemText).toContain('MEDIUM');
    expect(systemText).toContain('FLEXIBLE');
  });

  it('handles null basicInfo in context', async () => {
    mockCallable.mockResolvedValue({ data: { message: 'Response' } });

    const nullInfoRequest = {
      ...baseRequest,
      context: { ...baseRequest.context, basicInfo: null },
    };
    await sendChatMessage(nullInfoRequest);

    const systemText = mockCallable.mock.calls[0][0].systemInstruction.parts[0].text;
    expect(systemText).not.toContain('Gender:');
  });

  it('handles null priorityProfile in context', async () => {
    mockCallable.mockResolvedValue({ data: { message: 'Response' } });

    const nullProfileRequest = {
      ...baseRequest,
      context: { ...baseRequest.context, priorityProfile: null },
    };
    await sendChatMessage(nullProfileRequest);

    const systemText = mockCallable.mock.calls[0][0].systemInstruction.parts[0].text;
    expect(systemText).not.toContain('Priority Profile');
  });

  it('handles empty messages array', async () => {
    mockCallable.mockResolvedValue({ data: { message: 'Response' } });

    await sendChatMessage({ ...baseRequest, messages: [] });

    expect(mockCallable.mock.calls[0][0].contents).toEqual([]);
  });

  it('maps assistant role to model for Gemini', async () => {
    mockCallable.mockResolvedValue({ data: { message: 'Response' } });

    const multiMsgRequest: IChatRequest = {
      ...baseRequest,
      messages: [
        { id: '1', role: 'user', content: 'Hello', timestamp: 1000 },
        { id: '2', role: 'assistant', content: 'Hi!', timestamp: 1001 },
        { id: '3', role: 'user', content: 'Help me prepare', timestamp: 1002 },
      ],
    };

    await sendChatMessage(multiMsgRequest);

    expect(mockCallable.mock.calls[0][0].contents).toEqual([
      { role: 'user', parts: [{ text: 'Hello' }] },
      { role: 'model', parts: [{ text: 'Hi!' }] },
      { role: 'user', parts: [{ text: 'Help me prepare' }] },
    ]);
  });

  it('returns Unknown error for non-Error throws', async () => {
    mockCallable.mockRejectedValue('something weird');

    const result = await sendChatMessage(baseRequest);
    expect(result.message).toBe('');
    expect(result.error).toBeDefined();
  });
});
