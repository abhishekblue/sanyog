/**
 * Output Questions Bank
 * These are questions users can ask prospective partners during meetings.
 * Selected based on user's priority profile from assessment.
 */

import { Dimension } from './assessmentQuestions';

export interface IOutputQuestion {
  id: string;
  dimension: Dimension;
  priorityLevel: 'essential' | 'high';
  question_en: string;
  question_hi: string;
  whyItMatters_en: string;
  whyItMatters_hi: string;
  whatToListenFor_en: string;
  whatToListenFor_hi: string;
}

export const outputQuestions: IOutputQuestion[] = [
  // ============================================
  // FAMILY QUESTIONS (6 questions)
  // ============================================
  {
    id: 'family_out_01',
    dimension: 'family',
    priorityLevel: 'essential',
    question_en: 'What role do you see your parents playing in our daily lives after marriage?',
    question_hi:
      'शादी के बाद आप अपने माता-पिता की हमारी रोज़मर्रा की ज़िंदगी में क्या भूमिका देखते हैं?',
    whyItMatters_en:
      'This reveals expectations about boundaries, family involvement, and potential sources of daily friction.',
    whyItMatters_hi:
      'इससे पता चलता है कि सीमाओं, परिवार की भागीदारी और रोज़मर्रा की संभावित समस्याओं के बारे में क्या उम्मीदें हैं।',
    whatToListenFor_en:
      "Clarity in their answer. Vague responses like 'we'll figure it out' may indicate they haven't thought about it or are avoiding the topic.",
    whatToListenFor_hi:
      "उनके जवाब में स्पष्टता। 'देखेंगे' जैसे अस्पष्ट जवाब का मतलब हो सकता है कि उन्होंने इस बारे में सोचा नहीं है या टाल रहे हैं।",
  },
  {
    id: 'family_out_02',
    dimension: 'family',
    priorityLevel: 'high',
    question_en: 'How does your family typically handle disagreements?',
    question_hi: 'आपके परिवार में आम तौर पर असहमति कैसे सुलझाई जाती है?',
    whyItMatters_en:
      "Family conflict patterns often carry into marriage. Understanding their family's approach tells you what to expect.",
    whyItMatters_hi:
      'परिवार में झगड़े सुलझाने का तरीका अक्सर शादी में भी आता है। उनके परिवार के तरीके को समझने से पता चलता है क्या उम्मीद करें।',
    whatToListenFor_en:
      "Whether they describe healthy discussion or dominance by one person. If 'my father's word is final' - understand what that means for your voice.",
    whatToListenFor_hi:
      "क्या वे स्वस्थ चर्चा का वर्णन करते हैं या एक व्यक्ति का दबदबा। अगर 'पिताजी की बात आखिरी है' - समझें इसका मतलब आपकी आवाज़ के लिए क्या है।",
  },
  {
    id: 'family_out_03',
    dimension: 'family',
    priorityLevel: 'essential',
    question_en: 'What are your thoughts on where we would live after marriage?',
    question_hi: 'शादी के बाद हम कहाँ रहेंगे, इस बारे में आपकी क्या सोच है?',
    whyItMatters_en:
      'Living arrangements are one of the biggest sources of conflict in Indian marriages. Best discussed early.',
    whyItMatters_hi:
      'रहने की व्यवस्था भारतीय शादियों में सबसे बड़े विवाद का कारण है। जल्दी चर्चा करना बेहतर है।',
    whatToListenFor_en:
      "Whether their answer is flexible or fixed. 'I'll always live with my parents' is very different from 'I'd like to be close but we can discuss.'",
    whatToListenFor_hi:
      "उनका जवाब लचीला है या तय। 'मैं हमेशा माता-पिता के साथ रहूंगा' बहुत अलग है 'पास रहना चाहूंगा पर चर्चा कर सकते हैं' से।",
  },
  {
    id: 'family_out_04',
    dimension: 'family',
    priorityLevel: 'high',
    question_en: 'How often do you currently visit or stay with your parents?',
    question_hi: 'आजकल आप अपने माता-पिता से कितनी बार मिलते हैं या उनके साथ रहते हैं?',
    whyItMatters_en: 'Current behavior is the best predictor of future behavior.',
    whyItMatters_hi: 'वर्तमान व्यवहार भविष्य के व्यवहार का सबसे अच्छा संकेत है।',
    whatToListenFor_en:
      'The frequency and emotional tone. Do they seem happy about family time or obligated?',
    whatToListenFor_hi:
      'कितनी बार और भावनात्मक स्वर। क्या वे परिवार के समय से खुश लगते हैं या मजबूर?',
  },
  {
    id: 'family_out_05',
    dimension: 'family',
    priorityLevel: 'high',
    question_en: 'How would you handle a situation where your spouse and parent disagreed?',
    question_hi: 'अगर आपके जीवनसाथी और माता-पिता में असहमति हो तो आप क्या करेंगे?',
    whyItMatters_en:
      'This is the most common stress test in Indian marriages. Their approach here matters enormously.',
    whyItMatters_hi:
      'यह भारतीय शादियों में सबसे आम परीक्षा है। यहाँ उनका तरीका बहुत मायने रखता है।',
    whatToListenFor_en:
      "'I'd try to mediate' is good. 'My parents are always right' or 'My spouse should adjust' are concerning.",
    whatToListenFor_hi:
      "'मैं बीच-बचाव करूंगा' अच्छा है। 'मेरे माता-पिता हमेशा सही हैं' या 'जीवनसाथी को adjust करना चाहिए' चिंताजनक है।",
  },
  {
    id: 'family_out_06',
    dimension: 'family',
    priorityLevel: 'high',
    question_en: 'Tell me about your relationship with your siblings.',
    question_hi: 'अपने भाई-बहनों के साथ अपने रिश्ते के बारे में बताइए।',
    whyItMatters_en:
      'Sibling dynamics often influence married life - financial obligations, family events, emotional bonds.',
    whyItMatters_hi:
      'भाई-बहनों के रिश्ते अक्सर शादीशुदा जीवन को प्रभावित करते हैं - आर्थिक जिम्मेदारियां, पारिवारिक कार्यक्रम, भावनात्मक बंधन।',
    whatToListenFor_en:
      'Warmth, involvement level, any complications that might affect your married life.',
    whatToListenFor_hi:
      'गर्मजोशी, भागीदारी का स्तर, कोई जटिलता जो आपकी शादीशुदा जीवन को प्रभावित कर सकती है।',
  },

  // ============================================
  // CAREER QUESTIONS (5 questions)
  // ============================================
  {
    id: 'career_out_01',
    dimension: 'career',
    priorityLevel: 'essential',
    question_en: 'What do you find most meaningful about your work?',
    question_hi: 'अपने काम में आपको सबसे ज़्यादा क्या meaningful लगता है?',
    whyItMatters_en:
      'Reveals whether they work to live or live to work. This affects time, energy, and priorities in marriage.',
    whyItMatters_hi:
      'पता चलता है कि वे जीने के लिए काम करते हैं या काम के लिए जीते हैं। यह शादी में समय, ऊर्जा और प्राथमिकताओं को प्रभावित करता है।',
    whatToListenFor_en:
      'Passion vs. practicality. Neither is wrong, but alignment with your own approach matters.',
    whatToListenFor_hi:
      'जुनून बनाम व्यावहारिकता। दोनों सही हैं, पर आपके अपने नज़रिये से मेल ज़रूरी है।',
  },
  {
    id: 'career_out_02',
    dimension: 'career',
    priorityLevel: 'high',
    question_en: 'Where do you see your career in 5 years?',
    question_hi: '5 साल में आप अपने करियर को कहाँ देखते हैं?',
    whyItMatters_en:
      'Ambition level and direction. May involve relocation, long hours, or career switches that affect both of you.',
    whyItMatters_hi:
      'महत्वाकांक्षा का स्तर और दिशा। इसमें स्थानांतरण, लंबे घंटे, या करियर बदलाव शामिल हो सकते हैं जो दोनों को प्रभावित करें।',
    whatToListenFor_en:
      "Specificity shows planning. Vagueness might mean they haven't thought ahead.",
    whatToListenFor_hi:
      'विशिष्टता योजना दिखाती है। अस्पष्टता का मतलब हो सकता है उन्होंने आगे नहीं सोचा।',
  },
  {
    id: 'career_out_03',
    dimension: 'career',
    priorityLevel: 'essential',
    question_en: "How would you feel about relocating for a spouse's career opportunity?",
    question_hi: 'अगर जीवनसाथी के करियर के लिए शहर बदलना पड़े तो आप कैसा महसूस करेंगे?',
    whyItMatters_en:
      'Tests flexibility and whether they see marriage as a partnership or expect one person to adjust.',
    whyItMatters_hi:
      'लचीलापन परखता है और क्या वे शादी को साझेदारी मानते हैं या एक व्यक्ति से adjust करने की उम्मीद करते हैं।',
    whatToListenFor_en:
      "Willingness to discuss vs. immediate dismissal. 'Never' is a strong position to understand early.",
    whatToListenFor_hi:
      "चर्चा की इच्छा बनाम तुरंत नकारना। 'कभी नहीं' एक मजबूत स्थिति है जो जल्दी समझना ज़रूरी है।",
  },
  {
    id: 'career_out_04',
    dimension: 'career',
    priorityLevel: 'high',
    question_en: 'How do you handle work stress? Does it affect your mood at home?',
    question_hi: 'काम का तनाव कैसे handle करते हैं? क्या इसका असर घर पर दिखता है?',
    whyItMatters_en: 'Work stress is inevitable. How they manage it affects daily life quality.',
    whyItMatters_hi:
      'काम का तनाव अवश्यंभावी है। वे इसे कैसे संभालते हैं, यह दैनिक जीवन की गुणवत्ता को प्रभावित करता है।',
    whatToListenFor_en:
      "Self-awareness. Someone who says 'I tend to get quiet/irritable' shows they know themselves.",
    whatToListenFor_hi: "आत्म-जागरूकता। जो कहे 'मैं चुप/चिड़चिड़ा हो जाता हूं' वह खुद को जानता है।",
  },
  {
    id: 'career_out_05',
    dimension: 'career',
    priorityLevel: 'high',
    question_en: "What's your view on both partners working after having children?",
    question_hi: 'बच्चे होने के बाद दोनों पार्टनर्स के काम करने पर आपकी क्या राय है?',
    whyItMatters_en: 'Reveals expectations about gender roles and career sacrifices.',
    whyItMatters_hi: 'लिंग भूमिकाओं और करियर त्याग के बारे में उम्मीदों का पता चलता है।',
    whatToListenFor_en:
      'Whether they assume one partner (usually the woman) will stop working, or see it as a joint decision.',
    whatToListenFor_hi:
      'क्या वे मानते हैं कि एक पार्टनर (आमतौर पर महिला) काम छोड़ देगी, या इसे संयुक्त निर्णय मानते हैं।',
  },

  // ============================================
  // FINANCE QUESTIONS (5 questions)
  // ============================================
  {
    id: 'finance_out_01',
    dimension: 'finances',
    priorityLevel: 'essential',
    question_en: 'How would you describe your approach to money - spender or saver?',
    question_hi: 'पैसों के मामले में आप कैसे हैं - खर्च करने वाले या बचाने वाले?',
    whyItMatters_en:
      'Financial incompatibility is a leading cause of marital conflict. Understanding their basic relationship with money is foundational.',
    whyItMatters_hi:
      'आर्थिक असंगतता वैवाहिक विवाद का प्रमुख कारण है। पैसे के साथ उनके बुनियादी रिश्ते को समझना आधार है।',
    whatToListenFor_en:
      'Honesty and self-awareness. Also whether their approach complements or clashes with yours.',
    whatToListenFor_hi:
      'ईमानदारी और आत्म-जागरूकता। और क्या उनका तरीका आपके साथ मेल खाता है या टकराता है।',
  },
  {
    id: 'finance_out_02',
    dimension: 'finances',
    priorityLevel: 'high',
    question_en: 'What financial goals are important to you in the next 5 years?',
    question_hi: 'अगले 5 सालों में आपके लिए कौन से financial goals ज़रूरी हैं?',
    whyItMatters_en:
      'Reveals priorities - home ownership, investments, lifestyle, travel, family support.',
    whyItMatters_hi: 'प्राथमिकताओं का पता चलता है - घर, निवेश, जीवनशैली, यात्रा, परिवार की मदद।',
    whatToListenFor_en:
      'Whether goals are realistic and whether they include planning for two people, not just themselves.',
    whatToListenFor_hi:
      'क्या लक्ष्य यथार्थवादी हैं और क्या उनमें दो लोगों की योजना शामिल है, सिर्फ अपनी नहीं।',
  },
  {
    id: 'finance_out_03',
    dimension: 'finances',
    priorityLevel: 'essential',
    question_en: 'How do you think a couple should manage finances together?',
    question_hi: 'आपके हिसाब से पति-पत्नी को मिलकर पैसे कैसे मैनेज करने चाहिए?',
    whyItMatters_en:
      'Joint vs. separate accounts, spending autonomy, transparency expectations - all critical.',
    whyItMatters_hi:
      'जॉइंट बनाम अलग अकाउंट, खर्च की स्वतंत्रता, पारदर्शिता की उम्मीदें - सब महत्वपूर्ण।',
    whatToListenFor_en:
      "Whether they've thought about this at all. And whether their approach respects both partners' autonomy.",
    whatToListenFor_hi:
      'क्या उन्होंने इस बारे में सोचा है। और क्या उनका तरीका दोनों पार्टनर्स की स्वतंत्रता का सम्मान करता है।',
  },
  {
    id: 'finance_out_04',
    dimension: 'finances',
    priorityLevel: 'high',
    question_en: 'Are there any significant financial commitments I should know about?',
    question_hi: 'क्या कोई बड़ी financial commitment है जो मुझे पता होनी चाहिए?',
    whyItMatters_en:
      'Loans, family financial obligations, investments - these directly affect your shared financial life.',
    whyItMatters_hi:
      'लोन, परिवार की आर्थिक जिम्मेदारियां, निवेश - ये सीधे आपकी साझा आर्थिक जीवन को प्रभावित करते हैं।',
    whatToListenFor_en: 'Openness. Reluctance to discuss may be a yellow flag.',
    whatToListenFor_hi: 'खुलापन। चर्चा करने में हिचकिचाहट एक पीला झंडा हो सकता है।',
  },
  {
    id: 'finance_out_05',
    dimension: 'finances',
    priorityLevel: 'high',
    question_en: "What's your view on supporting extended family financially?",
    question_hi: 'बड़े परिवार को आर्थिक मदद करने पर आपकी क्या राय है?',
    whyItMatters_en:
      'In Indian families, financial support to parents/siblings is common. Expectations need alignment.',
    whyItMatters_hi:
      'भारतीय परिवारों में माता-पिता/भाई-बहनों को आर्थिक सहायता आम है। उम्मीदों का मेल ज़रूरी है।',
    whatToListenFor_en:
      'Whether expectations are reasonable and discussed openly, or assumed without discussion.',
    whatToListenFor_hi:
      'क्या उम्मीदें उचित हैं और खुले तौर पर चर्चा की गई हैं, या बिना चर्चा मान लिया गया है।',
  },

  // ============================================
  // LIFESTYLE QUESTIONS (6 questions)
  // ============================================
  {
    id: 'lifestyle_out_01',
    dimension: 'lifestyle',
    priorityLevel: 'essential',
    question_en: 'Walk me through a typical weekend for you.',
    question_hi: 'अपने एक typical weekend के बारे में बताइए।',
    whyItMatters_en:
      'Weekend habits reveal lifestyle, energy levels, social preferences, and daily compatibility.',
    whyItMatters_hi:
      'वीकेंड की आदतें जीवनशैली, ऊर्जा स्तर, सामाजिक पसंद और दैनिक संगतता प्रकट करती हैं।',
    whatToListenFor_en:
      "Energy match - if you're a homebody and they're out every weekend, that's worth noting.",
    whatToListenFor_hi:
      'ऊर्जा मेल - अगर आप घर पर रहना पसंद करते हैं और वे हर वीकेंड बाहर, यह ध्यान देने योग्य है।',
  },
  {
    id: 'lifestyle_out_02',
    dimension: 'lifestyle',
    priorityLevel: 'high',
    question_en: 'How do you like to unwind after a long day?',
    question_hi: 'लंबे दिन के बाद आप कैसे relax करते हैं?',
    whyItMatters_en:
      'Daily de-stress habits affect shared living. TV binging, gym, reading, socializing - all different.',
    whyItMatters_hi:
      'दैनिक तनाव-मुक्ति की आदतें साथ रहने को प्रभावित करती हैं। TV, जिम, पढ़ना, मिलना-जुलना - सब अलग हैं।',
    whatToListenFor_en: 'Whether their unwinding style gives you space or creates friction.',
    whatToListenFor_hi: 'क्या उनकी relax करने की शैली आपको space देती है या टकराव पैदा करती है।',
  },
  {
    id: 'lifestyle_out_03',
    dimension: 'lifestyle',
    priorityLevel: 'essential',
    question_en: 'What does your social life look like?',
    question_hi: 'आपकी social life कैसी है?',
    whyItMatters_en:
      'Friends, socializing frequency, and social expectations affect married life significantly.',
    whyItMatters_hi:
      'दोस्त, मिलने-जुलने की frequency, और सामाजिक उम्मीदें शादीशुदा जीवन को काफी प्रभावित करती हैं।',
    whatToListenFor_en:
      'Balance. Very active social life or no friends at all - both worth understanding.',
    whatToListenFor_hi:
      'संतुलन। बहुत active social life या बिल्कुल दोस्त नहीं - दोनों समझने योग्य।',
  },
  {
    id: 'lifestyle_out_04',
    dimension: 'lifestyle',
    priorityLevel: 'high',
    question_en: 'How important is health and fitness in your daily routine?',
    question_hi: 'आपकी daily routine में health और fitness कितनी ज़रूरी है?',
    whyItMatters_en: 'Health habits, diet, exercise - these shape daily life and long-term health.',
    whyItMatters_hi:
      'स्वास्थ्य की आदतें, खान-पान, व्यायाम - ये दैनिक जीवन और दीर्घकालिक स्वास्थ्य को आकार देते हैं।',
    whatToListenFor_en: "Whether it's a genuine priority or just talk.",
    whatToListenFor_hi: 'क्या यह वास्तविक प्राथमिकता है या सिर्फ बातें।',
  },
  {
    id: 'lifestyle_out_05',
    dimension: 'lifestyle',
    priorityLevel: 'high',
    question_en: 'Are you a morning person or night owl?',
    question_hi: 'आप सुबह जल्दी उठने वाले हैं या रात को देर तक जागने वाले?',
    whyItMatters_en: 'Sounds trivial but daily rhythm mismatch is a real source of friction.',
    whyItMatters_hi: 'मामूली लगता है पर दैनिक लय में बेमेल वास्तविक टकराव का कारण है।',
    whatToListenFor_en: 'How rigid they are about it.',
    whatToListenFor_hi: 'वे इस बारे में कितने कठोर हैं।',
  },
  {
    id: 'lifestyle_out_06',
    dimension: 'lifestyle',
    priorityLevel: 'high',
    question_en: "What are your hobbies - things you'd never want to give up?",
    question_hi: 'आपकी hobbies क्या हैं - ऐसी चीज़ें जो आप कभी नहीं छोड़ना चाहेंगे?',
    whyItMatters_en: 'Non-negotiable hobbies need space in married life. Better to know now.',
    whyItMatters_hi:
      'जो hobbies छोड़ी नहीं जा सकतीं उन्हें शादीशुदा जीवन में जगह चाहिए। अभी जानना बेहतर है।',
    whatToListenFor_en:
      'Time and money commitment to hobbies. Weekend biking is different from competitive gaming 4 hours daily.',
    whatToListenFor_hi:
      'Hobbies पर समय और पैसे की प्रतिबद्धता। वीकेंड बाइकिंग और रोज़ 4 घंटे gaming अलग हैं।',
  },

  // ============================================
  // VALUES & COMMUNICATION QUESTIONS (6 questions)
  // ============================================
  {
    id: 'values_out_01',
    dimension: 'values',
    priorityLevel: 'essential',
    question_en: 'What values were you raised with that you want to carry forward?',
    question_hi: 'आपको बचपन में कौन से संस्कार मिले जो आप आगे ले जाना चाहते हैं?',
    whyItMatters_en:
      "Core values drive everything - from daily decisions to life philosophy. This question reveals what's non-negotiable.",
    whyItMatters_hi:
      'मूल मूल्य सब कुछ चलाते हैं - दैनिक निर्णयों से लेकर जीवन दर्शन तक। यह सवाल बताता है क्या non-negotiable है।',
    whatToListenFor_en:
      "Depth and conviction. Surface answers like 'honesty' are fine, but follow up with 'what does that look like in practice?'",
    whatToListenFor_hi:
      "गहराई और दृढ़ विश्वास। 'ईमानदारी' जैसे सतही जवाब ठीक हैं, पर पूछें 'व्यवहार में यह कैसा दिखता है?'",
  },
  {
    id: 'values_out_02',
    dimension: 'values',
    priorityLevel: 'high',
    question_en: 'What does spirituality or religion look like in your daily life?',
    question_hi: 'आपकी रोज़मर्रा की ज़िंदगी में धर्म या अध्यात्म कैसा दिखता है?',
    whyItMatters_en:
      "Not whether they're religious, but how it shows up practically - temple visits, dietary restrictions, festival observance.",
    whyItMatters_hi:
      'वे धार्मिक हैं या नहीं यह नहीं, बल्कि व्यावहारिक रूप से कैसे दिखता है - मंदिर जाना, खान-पान प्रतिबंध, त्योहार मनाना।',
    whatToListenFor_en:
      'Practical implications for your shared life. Daily puja is different from festival-only observance.',
    whatToListenFor_hi:
      'आपकी साझा ज़िंदगी के लिए व्यावहारिक प्रभाव। रोज़ पूजा और सिर्फ त्योहारों पर मनाना अलग हैं।',
  },
  {
    id: 'values_out_03',
    dimension: 'values',
    priorityLevel: 'essential',
    question_en: 'What would you consider a deal-breaker in a relationship?',
    question_hi: 'एक रिश्ते में आपके लिए deal-breaker क्या होगा?',
    whyItMatters_en: 'Knowing their non-negotiables upfront saves time and heartbreak.',
    whyItMatters_hi: 'उनके non-negotiables को पहले जानना समय और दिल टूटने से बचाता है।',
    whatToListenFor_en:
      'Clarity and conviction. Also whether their deal-breakers conflict with who you are.',
    whatToListenFor_hi:
      'स्पष्टता और दृढ़ विश्वास। और क्या उनके deal-breakers आपके व्यक्तित्व से टकराते हैं।',
  },
  {
    id: 'values_out_04',
    dimension: 'values',
    priorityLevel: 'high',
    question_en: 'When you and your partner disagree, what does resolution look like for you?',
    question_hi: 'जब आप और आपका पार्टनर सहमत न हों, तो समाधान कैसा दिखना चाहिए?',
    whyItMatters_en:
      'Conflict resolution style is one of the strongest predictors of relationship success.',
    whyItMatters_hi: 'विवाद समाधान शैली रिश्ते की सफलता के सबसे मजबूत संकेतकों में से एक है।',
    whatToListenFor_en:
      "Whether they describe a process (discussion, compromise) or a stance ('I don't fight' often means avoidance).",
    whatToListenFor_hi:
      "क्या वे प्रक्रिया का वर्णन करते हैं (चर्चा, समझौता) या रुख ('मैं झगड़ा नहीं करता' अक्सर बचाव का मतलब है)।",
  },
  {
    id: 'values_out_05',
    dimension: 'values',
    priorityLevel: 'essential',
    question_en: 'What does a happy married life look like to you?',
    question_hi: 'एक खुशहाल शादीशुदा ज़िंदगी आपके लिए कैसी दिखती है?',
    whyItMatters_en:
      'The most important question. Their vision of marriage should be compatible with yours.',
    whyItMatters_hi:
      'सबसे महत्वपूर्ण सवाल। शादी की उनकी दृष्टि आपकी दृष्टि से compatible होनी चाहिए।',
    whatToListenFor_en:
      'Specificity and emotional honesty. Vague answers are fine early on, but the direction should align with yours.',
    whatToListenFor_hi:
      'विशिष्टता और भावनात्मक ईमानदारी। शुरू में अस्पष्ट जवाब ठीक हैं, पर दिशा आपकी दिशा से मेल खानी चाहिए।',
  },
  {
    id: 'values_out_06',
    dimension: 'values',
    priorityLevel: 'high',
    question_en: 'What makes you feel most loved and appreciated?',
    question_hi: 'आपको सबसे ज़्यादा प्यार और सम्मान कब महसूस होता है?',
    whyItMatters_en: 'Understanding love languages early prevents years of miscommunication.',
    whyItMatters_hi: 'प्रेम भाषाओं को जल्दी समझना वर्षों की गलतफहमी से बचाता है।',
    whatToListenFor_en:
      "Whether it's words, actions, time, gifts, or touch. Match with how you naturally express love.",
    whatToListenFor_hi:
      'क्या यह शब्द, कार्य, समय, उपहार, या स्पर्श है। इसे अपने प्यार व्यक्त करने के तरीके से मिलाएं।',
  },
];

/**
 * Get questions by dimension
 */
export function getOutputQuestionsByDimension(dimension: Dimension): IOutputQuestion[] {
  return outputQuestions.filter((q) => q.dimension === dimension);
}

/**
 * Get only essential questions for a dimension
 */
export function getEssentialQuestions(dimension: Dimension): IOutputQuestion[] {
  return outputQuestions.filter(
    (q) => q.dimension === dimension && q.priorityLevel === 'essential'
  );
}

/** Total output questions count */
export const TOTAL_OUTPUT_QUESTIONS = outputQuestions.length; // 28
