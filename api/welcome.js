export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const welcomeVerses = [
      {
        type: "welcome",
        shloka: {
          devanagari: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
          roman: "karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
          citation: "Chapter 2, Verse 47"
        },
        translation: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself to be the cause of the results of your activities, and never be attached to not doing your duty."
      },
      {
        type: "welcome",
        shloka: {
          devanagari: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
          roman: "yadā yadā hi dharmasya glānir bhavati bhārata\nabhyutthānam adharmasya tadātmānaṁ sṛjāmy aham",
          citation: "Chapter 4, Verse 7"
        },
        translation: "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion—at that time I descend Myself."
      },
      {
        type: "welcome",
        shloka: {
          devanagari: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
          roman: "uddhared ātmanātmānaṁ nātmānam avasādayet\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
          citation: "Chapter 6, Verse 5"
        },
        translation: "A man must elevate himself by his own mind, not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well."
      },
      {
        type: "welcome",
        shloka: {
          devanagari: "तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया।\nउपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस्तत्त्वदर्शिनः॥",
          roman: "tad viddhi praṇipātena paripraśnena sevayā\nupadekṣyanti te jñānaṁ jñāninas tattva-darśinaḥ",
          citation: "Chapter 4, Verse 34"
        },
        translation: "Just try to learn the truth by approaching a spiritual master. Inquire from him submissively and render service unto him. The self-realized soul can impart knowledge unto you because he has seen the truth."
      },
      {
        type: "welcome",
        shloka: {
          devanagari: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
          roman: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja\nahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ",
          citation: "Chapter 18, Verse 66"
        },
        translation: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reaction. Do not fear."
      }
    ];

    const randomVerse = welcomeVerses[Math.floor(Math.random() * welcomeVerses.length)];
    
    return res.status(200).json(randomVerse);

  } catch (error) {
    console.error("Welcome endpoint error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
