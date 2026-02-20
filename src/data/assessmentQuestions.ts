// Assessment question types and data
// 20 questions across 6 dimensions

export type Dimension = 'family' | 'career' | 'finances' | 'lifestyle' | 'values' | 'intimacy';

export interface IAssessmentOption {
  id: 'A' | 'B' | 'C' | 'D';
  text_en: string;
  text_hi: string;
  points: number; // A=3, B=2, C=1, D=0
}

export interface IAssessmentQuestion {
  id: string;
  dimension: Dimension;
  question_en: string;
  question_hi: string;
  options: IAssessmentOption[];
}

export interface IDimensionInfo {
  id: Dimension;
  name_en: string;
  name_hi: string;
  icon: string; // Icon name for display
}

// Dimension metadata
export const dimensions: IDimensionInfo[] = [
  { id: 'family', name_en: 'Family & Relationships', name_hi: 'परिवार और रिश्ते', icon: 'home' },
  {
    id: 'career',
    name_en: 'Career & Ambition',
    name_hi: 'करियर और महत्वाकांक्षा',
    icon: 'briefcase',
  },
  { id: 'finances', name_en: 'Financial Values', name_hi: 'आर्थिक सोच', icon: 'wallet' },
  {
    id: 'lifestyle',
    name_en: 'Lifestyle & Daily Life',
    name_hi: 'जीवनशैली और रोज़मर्रा',
    icon: 'sun',
  },
  { id: 'values', name_en: 'Values & Communication', name_hi: 'मूल्य और संवाद', icon: 'heart' },
  {
    id: 'intimacy',
    name_en: 'Intimacy & Family Planning',
    name_hi: 'अंतरंगता और परिवार नियोजन',
    icon: 'users',
  },
];

// All 20 assessment questions
export const assessmentQuestions: IAssessmentQuestion[] = [
  // ============================================
  // FAMILY & RELATIONSHIPS (3 questions)
  // ============================================
  {
    id: 'family_01',
    dimension: 'family',
    question_en: 'After marriage, where would you ideally want to live?',
    question_hi: 'शादी के बाद, आप आदर्श रूप से कहाँ रहना चाहेंगे?',
    options: [
      {
        id: 'A',
        text_en: 'With or very close to my parents',
        text_hi: 'अपने माता-पिता के साथ या बहुत पास',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Same city as family, but our own place',
        text_hi: 'परिवार के शहर में, लेकिन अपना घर',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Wherever makes sense for our careers',
        text_hi: 'जहाँ करियर के लिए सही हो',
        points: 1,
      },
      { id: 'D', text_en: "I'm flexible on this", text_hi: 'मैं इसमें लचीला/लचीली हूँ', points: 0 },
    ],
  },
  {
    id: 'family_02',
    dimension: 'family',
    question_en: 'When making major life decisions, whose input matters most?',
    question_hi: 'बड़े फैसले लेते समय, किसकी राय सबसे ज़्यादा मायने रखती है?',
    options: [
      {
        id: 'A',
        text_en: 'Primarily my spouse and I decide together',
        text_hi: 'मुख्य रूप से मैं और मेरा जीवनसाथी मिलकर',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'We decide but with significant family input',
        text_hi: 'हम तय करें, परिवार की राय भी ज़रूरी',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Family consensus is essential',
        text_hi: 'परिवार की सहमति ज़रूरी है',
        points: 1,
      },
      {
        id: 'D',
        text_en: 'Depends on the decision',
        text_hi: 'फैसले पर निर्भर करता है',
        points: 0,
      },
    ],
  },
  {
    id: 'family_03',
    dimension: 'family',
    question_en: 'How involved do you expect families to be in daily married life?',
    question_hi: 'रोज़मर्रा की शादीशुदा ज़िंदगी में परिवार की कितनी भागीदारी चाहते हैं?',
    options: [
      {
        id: 'A',
        text_en: 'Very - regular visits, shared meals, festivals together',
        text_hi: 'बहुत - नियमित मिलना, साथ खाना, त्योहार साथ',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Moderate - weekly or monthly connection',
        text_hi: 'मध्यम - हफ्ते या महीने में मिलना',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Minimal - we mostly live our own life',
        text_hi: 'कम - ज़्यादातर अपनी ज़िंदगी अलग',
        points: 1,
      },
      {
        id: 'D',
        text_en: "Haven't thought about this much",
        text_hi: 'इसके बारे में ज़्यादा नहीं सोचा',
        points: 0,
      },
    ],
  },

  // ============================================
  // CAREER & AMBITION (3 questions)
  // ============================================
  {
    id: 'career_01',
    dimension: 'career',
    question_en: 'If your spouse got a great job in another city, your first reaction:',
    question_hi: 'अगर आपके जीवनसाथी को दूसरे शहर में अच्छी नौकरी मिले, तो आपकी पहली प्रतिक्रिया:',
    options: [
      {
        id: 'A',
        text_en: "Exciting! Let's make it work",
        text_hi: 'शानदार! हम कर लेंगे',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Concerned but open to discussion',
        text_hi: 'चिंता होगी पर बात कर सकते हैं',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Hesitant - stability matters more',
        text_hi: 'हिचकिचाहट - स्थिरता ज़्यादा ज़रूरी',
        points: 1,
      },
      { id: 'D', text_en: 'Depends on specifics', text_hi: 'परिस्थिति पर निर्भर', points: 0 },
    ],
  },
  {
    id: 'career_02',
    dimension: 'career',
    question_en: "How important is it that your spouse's career ambition matches yours?",
    question_hi: 'क्या ज़रूरी है कि जीवनसाथी की करियर महत्वाकांक्षा आपसे मिलती हो?',
    options: [
      {
        id: 'A',
        text_en: 'Very - we should both be equally driven',
        text_hi: 'बहुत - दोनों में बराबर जुनून हो',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Somewhat - baseline ambition is needed',
        text_hi: 'कुछ हद तक - बुनियादी महत्वाकांक्षा ज़रूरी',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Not much - I care more about who they are',
        text_hi: 'ज़्यादा नहीं - इंसान ज़्यादा मायने रखता है',
        points: 1,
      },
      {
        id: 'D',
        text_en: "Haven't thought about it",
        text_hi: 'इसके बारे में नहीं सोचा',
        points: 0,
      },
    ],
  },
  {
    id: 'career_03',
    dimension: 'career',
    question_en: 'Your view on work-life balance in marriage:',
    question_hi: 'शादी में वर्क-लाइफ बैलेंस पर आपकी राय:',
    options: [
      {
        id: 'A',
        text_en: 'Career comes first in early years, balance later',
        text_hi: 'शुरुआती सालों में करियर पहले, बैलेंस बाद में',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Balance is important from day one',
        text_hi: 'पहले दिन से बैलेंस ज़रूरी',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Family should always come before career',
        text_hi: 'परिवार हमेशा करियर से पहले',
        points: 1,
      },
      {
        id: 'D',
        text_en: 'Flexible based on circumstances',
        text_hi: 'हालात के हिसाब से',
        points: 0,
      },
    ],
  },

  // ============================================
  // FINANCIAL VALUES (3 questions)
  // ============================================
  {
    id: 'finances_01',
    dimension: 'finances',
    question_en: 'Discussing exact salaries and savings before marriage is:',
    question_hi: 'शादी से पहले सैलरी और बचत के बारे में बात करना:',
    options: [
      {
        id: 'A',
        text_en: 'Essential - complete transparency',
        text_hi: 'ज़रूरी - पूरी पारदर्शिता',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Important but can happen gradually',
        text_hi: 'ज़रूरी पर धीरे-धीरे हो सकता है',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Uncomfortable - general sense is enough',
        text_hi: 'असहज - सामान्य जानकारी काफ़ी है',
        points: 1,
      },
      { id: 'D', text_en: 'Not sure how I feel', text_hi: 'पक्का नहीं पता', points: 0 },
    ],
  },
  {
    id: 'finances_02',
    dimension: 'finances',
    question_en: 'How should a couple manage money?',
    question_hi: 'पति-पत्नी को पैसे कैसे मैनेज करने चाहिए?',
    options: [
      {
        id: 'A',
        text_en: 'Everything pooled into joint accounts',
        text_hi: 'सब कुछ जॉइंट अकाउंट में',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Joint for shared, separate for personal',
        text_hi: 'साझा खर्चों के लिए जॉइंट, निजी अलग',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Mostly separate with agreed contributions',
        text_hi: 'ज़्यादातर अलग, तय योगदान के साथ',
        points: 1,
      },
      {
        id: 'D',
        text_en: 'Will figure it out together',
        text_hi: 'साथ मिलकर तय करेंगे',
        points: 0,
      },
    ],
  },
  {
    id: 'finances_03',
    dimension: 'finances',
    question_en: 'Financial support to extended family:',
    question_hi: 'बड़े परिवार को आर्थिक मदद:',
    options: [
      {
        id: 'A',
        text_en: 'Expected and budgeted for',
        text_hi: 'उम्मीद है और बजट में शामिल',
        points: 3,
      },
      { id: 'B', text_en: 'Case-by-case basis', text_hi: 'ज़रूरत के हिसाब से', points: 2 },
      {
        id: 'C',
        text_en: 'Our nuclear family comes first',
        text_hi: 'पहले अपना परिवार',
        points: 1,
      },
      {
        id: 'D',
        text_en: "Haven't considered this",
        text_hi: 'इसके बारे में नहीं सोचा',
        points: 0,
      },
    ],
  },

  // ============================================
  // LIFESTYLE & DAILY LIFE (4 questions)
  // ============================================
  {
    id: 'lifestyle_01',
    dimension: 'lifestyle',
    question_en: 'Your ideal weekend looks like:',
    question_hi: 'आपका आदर्श वीकेंड कैसा होता है:',
    options: [
      {
        id: 'A',
        text_en: 'Active - outings, socializing, activities',
        text_hi: 'एक्टिव - बाहर जाना, लोगों से मिलना',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Balanced - some plans, some rest',
        text_hi: 'बैलेंस्ड - कुछ प्लान, कुछ आराम',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Quiet - home, rest, personal hobbies',
        text_hi: 'शांत - घर, आराम, अपनी हॉबी',
        points: 1,
      },
      { id: 'D', text_en: 'Varies based on mood', text_hi: 'मूड पर निर्भर', points: 0 },
    ],
  },
  {
    id: 'lifestyle_02',
    dimension: 'lifestyle',
    question_en: 'How important is it that your spouse shares your dietary preferences?',
    question_hi: 'क्या ज़रूरी है कि जीवनसाथी की खान-पान की पसंद आपसे मिले?',
    options: [
      {
        id: 'A',
        text_en: 'Very - we should eat the same way',
        text_hi: 'बहुत - हमें एक जैसा खाना चाहिए',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Somewhat - respect is enough',
        text_hi: 'कुछ हद तक - सम्मान काफ़ी है',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Not at all - food is personal choice',
        text_hi: 'बिल्कुल नहीं - खाना निजी पसंद है',
        points: 1,
      },
      { id: 'D', text_en: 'Flexible', text_hi: 'लचीला', points: 0 },
    ],
  },
  {
    id: 'lifestyle_03',
    dimension: 'lifestyle',
    question_en: 'Social life after marriage:',
    question_hi: 'शादी के बाद सामाजिक जीवन:',
    options: [
      {
        id: 'A',
        text_en: 'Active social life with friends is important',
        text_hi: 'दोस्तों के साथ एक्टिव सोशल लाइफ ज़रूरी',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Some social time but mostly couple/family focused',
        text_hi: 'कुछ सोशल टाइम, पर ज़्यादातर परिवार',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Prefer private life, small circle',
        text_hi: 'प्राइवेट लाइफ पसंद, छोटा सर्कल',
        points: 1,
      },
      { id: 'D', text_en: 'No strong preference', text_hi: 'कोई ख़ास पसंद नहीं', points: 0 },
    ],
  },
  {
    id: 'lifestyle_04',
    dimension: 'lifestyle',
    question_en: 'Daily routines and habits:',
    question_hi: 'रोज़ की दिनचर्या और आदतें:',
    options: [
      {
        id: 'A',
        text_en: 'Should be aligned - similar wake/sleep times',
        text_hi: 'मिलनी चाहिए - एक जैसे सोने-जागने के टाइम',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Some alignment, but flexibility is fine',
        text_hi: 'कुछ मिलान, पर लचीलापन ठीक',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'We can have different routines',
        text_hi: 'अलग-अलग दिनचर्या चल सकती है',
        points: 1,
      },
      {
        id: 'D',
        text_en: "Haven't thought about it",
        text_hi: 'इसके बारे में नहीं सोचा',
        points: 0,
      },
    ],
  },

  // ============================================
  // VALUES & COMMUNICATION (4 questions)
  // ============================================
  {
    id: 'values_01',
    dimension: 'values',
    question_en: 'How important is religious/spiritual alignment?',
    question_hi: 'धार्मिक/आध्यात्मिक तालमेल कितना ज़रूरी है?',
    options: [
      {
        id: 'A',
        text_en: 'Essential - must share beliefs and practices',
        text_hi: 'बहुत - एक जैसी आस्था और प्रथाएं ज़रूरी',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Important - similar values, flexible on practices',
        text_hi: 'ज़रूरी - मूल्य मिलें, प्रथाओं में लचीलापन',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Not important - mutual respect is enough',
        text_hi: 'ज़रूरी नहीं - आपसी सम्मान काफ़ी',
        points: 1,
      },
      {
        id: 'D',
        text_en: 'Prefer someone with different perspective',
        text_hi: 'अलग नज़रिये वाला कोई अच्छा',
        points: 0,
      },
    ],
  },
  {
    id: 'values_02',
    dimension: 'values',
    question_en: "When upset with your partner, you're most likely to:",
    question_hi: 'जब पार्टनर से नाराज़ हों, तो आप क्या करेंगे:',
    options: [
      {
        id: 'A',
        text_en: 'Address it directly and immediately',
        text_hi: 'तुरंत सीधे बात करूँगा/करूँगी',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Wait until calm, then discuss',
        text_hi: 'शांत होने के बाद बात करूँगा/करूँगी',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Drop hints and hope they notice',
        text_hi: 'इशारे दूँगा/दूँगी उम्मीद है समझ जाएं',
        points: 1,
      },
      {
        id: 'D',
        text_en: 'Withdraw until it passes',
        text_hi: 'चुप हो जाऊँगा/जाऊँगी जब तक गुज़र न जाए',
        points: 0,
      },
    ],
  },
  {
    id: 'values_03',
    dimension: 'values',
    question_en: "What's your biggest deal-breaker?",
    question_hi: 'आपके लिए सबसे बड़ी deal-breaker क्या है?',
    options: [
      {
        id: 'A',
        text_en: 'Dishonesty or lack of transparency',
        text_hi: 'बेईमानी या पारदर्शिता की कमी',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Disrespect towards my family',
        text_hi: 'मेरे परिवार के प्रति अनादर',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Lack of ambition or drive',
        text_hi: 'महत्वाकांक्षा या जुनून की कमी',
        points: 1,
      },
      {
        id: 'D',
        text_en: 'Incompatible life goals',
        text_hi: 'जीवन के लक्ष्यों में मेल न होना',
        points: 0,
      },
    ],
  },
  {
    id: 'values_04',
    dimension: 'values',
    question_en: 'How much personal space do you need in a relationship?',
    question_hi: 'रिश्ते में आपको कितनी पर्सनल स्पेस चाहिए?',
    options: [
      {
        id: 'A',
        text_en: 'A lot - I need regular alone time',
        text_hi: 'बहुत - मुझे अकेले समय चाहिए',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Some - but togetherness is important too',
        text_hi: 'कुछ - पर साथ रहना भी ज़रूरी',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Not much - I prefer being together',
        text_hi: 'ज़्यादा नहीं - साथ रहना पसंद है',
        points: 1,
      },
      { id: 'D', text_en: 'Flexible', text_hi: 'लचीला', points: 0 },
    ],
  },

  // ============================================
  // INTIMACY & FAMILY PLANNING (3 questions)
  // ============================================
  {
    id: 'intimacy_01',
    dimension: 'intimacy',
    question_en: 'When do you see yourself having children?',
    question_hi: 'आप कब बच्चे चाहते हैं?',
    options: [
      {
        id: 'A',
        text_en: 'Soon after marriage (1-2 years)',
        text_hi: 'शादी के जल्दी बाद (1-2 साल)',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'After settling down (3-5 years)',
        text_hi: 'सेटल होने के बाद (3-5 साल)',
        points: 2,
      },
      {
        id: 'C',
        text_en: 'Not sure / open to discussion',
        text_hi: 'पक्का नहीं / बात करके तय करेंगे',
        points: 1,
      },
      {
        id: 'D',
        text_en: 'May not want children',
        text_hi: 'शायद बच्चे नहीं चाहिए',
        points: 0,
      },
    ],
  },
  {
    id: 'intimacy_02',
    dimension: 'intimacy',
    question_en:
      'How important is it to discuss physical compatibility expectations before marriage?',
    question_hi: 'शादी से पहले शारीरिक अनुकूलता की उम्मीदों पर बात करना कितना ज़रूरी है?',
    options: [
      {
        id: 'A',
        text_en: 'Very — we should discuss openly before deciding',
        text_hi: 'बहुत — फैसले से पहले खुलकर बात होनी चाहिए',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Somewhat — general comfort level is enough',
        text_hi: 'कुछ हद तक — सामान्य सहजता काफ़ी है',
        points: 2,
      },
      {
        id: 'C',
        text_en: "Not much — it'll work out after marriage",
        text_hi: 'ज़्यादा नहीं — शादी के बाद हो जाएगा',
        points: 1,
      },
      {
        id: 'D',
        text_en: 'Uncomfortable discussing this',
        text_hi: 'इस बारे में बात करने में असहज',
        points: 0,
      },
    ],
  },
  {
    id: 'intimacy_03',
    dimension: 'intimacy',
    question_en:
      'How comfortable are you discussing sensitive topics like intimacy with a prospective partner?',
    question_hi:
      'अंतरंगता जैसे संवेदनशील विषयों पर संभावित जीवनसाथी से बात करने में कितने सहज हैं?',
    options: [
      {
        id: 'A',
        text_en: 'Very — these conversations are essential',
        text_hi: 'बहुत — ये बातचीत ज़रूरी है',
        points: 3,
      },
      {
        id: 'B',
        text_en: 'Somewhat — with the right person, I can',
        text_hi: 'कुछ हद तक — सही इंसान के साथ कर सकता/सकती हूँ',
        points: 2,
      },
      {
        id: 'C',
        text_en: "Difficult — but I know it's important",
        text_hi: 'मुश्किल — पर पता है ज़रूरी है',
        points: 1,
      },
      {
        id: 'D',
        text_en: 'Would rather not until after engagement',
        text_hi: 'सगाई के बाद ही बात करूँगा/करूँगी',
        points: 0,
      },
    ],
  },
];

// Helper to get questions by dimension
export function getQuestionsByDimension(dimension: Dimension): IAssessmentQuestion[] {
  return assessmentQuestions.filter((q) => q.dimension === dimension);
}

// Helper to get dimension info
export function getDimensionInfo(dimension: Dimension): IDimensionInfo | undefined {
  return dimensions.find((d) => d.id === dimension);
}

// Total questions count
export const TOTAL_QUESTIONS = assessmentQuestions.length; // 20
