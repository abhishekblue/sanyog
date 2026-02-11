const MAX_MESSAGE_LENGTH = 700;

const INJECTION_PATTERNS: RegExp[] = [
  // Direct instruction override attempts
  /ignore\s+(all\s+)?(previous|prior|above|earlier|your)\s+(instructions?|prompts?|rules?|guidelines?|directions?)/i,
  /disregard\s+(all\s+)?(previous|prior|above|earlier|your)\s+(instructions?|prompts?|rules?|guidelines?|directions?)/i,
  /forget\s+(all\s+)?(previous|prior|above|earlier|your)\s+(instructions?|prompts?|rules?|guidelines?|directions?)/i,
  /override\s+(all\s+)?(previous|prior|above|earlier|your)\s+(instructions?|prompts?|rules?|guidelines?|directions?)/i,

  // Role reassignment
  /you\s+are\s+now\s+(a|an|the)\b/i,
  /act\s+as\s+(a|an|if)\b/i,
  /pretend\s+(to\s+be|you\s*(?:are|'re))\b/i,
  /from\s+now\s+on\s+you\s+(are|will|should|must)\b/i,
  /new\s+instructions?\s*:/i,
  /your\s+new\s+role\b/i,

  // System prompt extraction
  /(?:what|show|tell|reveal|repeat|print|output|display|give)\s+(?:me\s+)?(?:your|the)\s+(?:system\s+)?(?:prompt|instructions?|rules?|guidelines?)/i,
  /system\s*(?:prompt|message|instruction)/i,

  // Developer/debug mode
  /(?:enter|switch\s+to|enable|activate)\s+(?:developer|dev|debug|admin|sudo|root)\s*(?:mode)?/i,
  /\[(?:system|admin|developer|debug)\]/i,

  // Delimiter injection — faking system/assistant turns
  /^(?:system|assistant|model)\s*:/im,

  // "Do anything now" / DAN-style
  /\bDAN\b/,
  /do\s+anything\s+now/i,
  /jailbreak/i,

  // Encoded/obfuscated injection attempts
  /base64\s*(?:decode|encode)/i,
  /eval\s*\(/i,

  // Token manipulation
  /\b(?:end|stop|terminate)\s*(?:of\s+)?(?:system|prompt|instruction)/i,
  /---+\s*(?:system|new\s+prompt|instruction)/i,
];

export interface ISanitizeResult {
  safe: boolean;
  sanitizedText: string;
  reason?: 'injection' | 'tooLong' | 'empty';
}

export function sanitizeUserMessage(text: string): ISanitizeResult {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { safe: false, sanitizedText: '', reason: 'empty' };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return { safe: false, sanitizedText: trimmed, reason: 'tooLong' };
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { safe: false, sanitizedText: trimmed, reason: 'injection' };
    }
  }

  return { safe: true, sanitizedText: trimmed };
}
