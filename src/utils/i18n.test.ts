import { createTranslator, defaultTranslator } from './i18n';

describe('createTranslator', () => {
  describe('English translator', () => {
    const en = createTranslator('en');

    it('returns correct translation for simple key', () => {
      expect(en.t('app.name')).toBe('Samvaad');
    });

    it('returns correct translation for nested key', () => {
      expect(en.t('welcome.getStarted')).toBe('Get Started');
    });

    it('returns correct translation for deeply nested key', () => {
      expect(en.t('basicInfo.gender.male')).toBe('Male');
      expect(en.t('basicInfo.gender.female')).toBe('Female');
    });

    it('returns the key itself when translation not found', () => {
      expect(en.t('nonexistent.key')).toBe('nonexistent.key');
    });

    it('returns the key for completely invalid path', () => {
      expect(en.t('this.does.not.exist.at.all')).toBe('this.does.not.exist.at.all');
    });

    it('returns the key for empty string', () => {
      expect(en.t('')).toBe('');
    });

    it('interpolates template variables', () => {
      const result = en.t('assessment.questionOf', { current: 3, total: 17 });
      expect(result).toBe('Question 3 of 17');
    });

    it('preserves unreplaced template variables', () => {
      const result = en.t('assessment.questionOf', { current: 3 });
      expect(result).toContain('3');
      expect(result).toContain('{{total}}');
    });

    it('handles number params correctly', () => {
      const result = en.t('assessment.questionOf', { current: 1, total: 17 });
      expect(result).toBe('Question 1 of 17');
    });

    it('handles string params correctly', () => {
      const result = en.t('assessment.questionOf', { current: '5', total: '17' });
      expect(result).toBe('Question 5 of 17');
    });
  });

  describe('Hindi translator', () => {
    const hi = createTranslator('hi');

    it('returns correct Hindi translation', () => {
      expect(hi.t('app.name')).toBe('संवाद');
    });

    it('returns correct Hindi nested translation', () => {
      expect(hi.t('welcome.getStarted')).toBe('शुरू करें');
    });

    it('returns correct Hindi deeply nested translation', () => {
      expect(hi.t('basicInfo.gender.male')).toBe('पुरुष');
      expect(hi.t('basicInfo.gender.female')).toBe('महिला');
    });

    it('interpolates template variables in Hindi', () => {
      const result = hi.t('assessment.questionOf', { current: 3, total: 17 });
      expect(result).toBe('सवाल 3 / 17');
    });

    it('returns key when translation not found in Hindi', () => {
      expect(hi.t('nonexistent.key')).toBe('nonexistent.key');
    });
  });

  describe('common namespace', () => {
    const en = createTranslator('en');
    const hi = createTranslator('hi');

    it('returns translations from common namespace for English', () => {
      const result = en.common('yes');
      // If 'yes' exists in common, it returns the value; otherwise the key
      expect(typeof result).toBe('string');
    });

    it('returns translations from common namespace for Hindi', () => {
      const result = hi.common('yes');
      expect(typeof result).toBe('string');
    });

    it('returns key for missing common translation', () => {
      expect(en.common('nonexistent')).toBe('nonexistent');
    });
  });
});

describe('defaultTranslator', () => {
  it('is an English translator', () => {
    expect(defaultTranslator.t('app.name')).toBe('Samvaad');
  });

  it('has t function', () => {
    expect(typeof defaultTranslator.t).toBe('function');
  });

  it('has common function', () => {
    expect(typeof defaultTranslator.common).toBe('function');
  });
});

describe('edge cases', () => {
  const en = createTranslator('en');

  it('handles single-level key', () => {
    // 'app' is an object, not a string, so it should return the key
    expect(en.t('app')).toBe('app');
  });

  it('handles key with existing first part but invalid second part', () => {
    expect(en.t('app.nonexistent')).toBe('app.nonexistent');
  });

  it('returns without modifying text when no params passed', () => {
    const result = en.t('welcome.getStarted');
    expect(result).toBe('Get Started');
  });

  it('returns without modifying text when empty params passed', () => {
    const result = en.t('welcome.getStarted', {});
    expect(result).toBe('Get Started');
  });

  it('handles translation with special characters', () => {
    const result = en.t('welcome.privacyNote');
    expect(result).toContain('device');
  });

  it('handles param with value 0 (falsy but valid)', () => {
    const result = en.t('assessment.questionOf', { current: 0, total: 17 });
    expect(result).toBe('Question 0 of 17');
  });

  it('handles very deep nesting that does not exist', () => {
    expect(en.t('a.b.c.d.e.f.g')).toBe('a.b.c.d.e.f.g');
  });

  it('handles key that resolves to an object (not string)', () => {
    // 'basicInfo.gender' is an object { label, male, female }, not a string
    expect(en.t('basicInfo.gender')).toBe('basicInfo.gender');
  });

  it('handles multiple template variables in one string', () => {
    const result = en.t('assessment.questionOf', { current: 5, total: 17 });
    expect(result).toBe('Question 5 of 17');
    expect(result).not.toContain('{{');
  });

  it('does not modify text without template markers when params given', () => {
    const result = en.t('welcome.getStarted', { foo: 'bar' });
    expect(result).toBe('Get Started');
  });

  it('handles number 0 in interpolation correctly', () => {
    const result = en.t('assessment.questionOf', { current: 0, total: 0 });
    expect(result).toBe('Question 0 of 0');
  });
});
