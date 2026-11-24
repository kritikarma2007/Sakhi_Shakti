/**
 * SakhiShakti Seed Data
 * Seeds: Demo users (USER/DOCTOR/VOLUNTEER/ADMIN), Health Cards (all age groups), Government Schemes
 * Works with both MongoDB and JSON fallback store
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { connectDB, jsonStore, isUsingFallback } = require('../src/db');
let User, HealthCard, Scheme;
try {
  User = require('../src/models/User');
  HealthCard = require('../src/models/HealthCard');
  Scheme = require('../src/models/Scheme');
} catch {}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO USERS
// ─────────────────────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { name: 'Priya Sharma', email: 'demo@sakhishakti.in', password: 'Demo@123', role: 'USER', state: 'Madhya Pradesh', language: 'hi' },
  { name: 'Dr. Ananya Verma', email: 'doctor@sakhishakti.in', password: 'Demo@123', role: 'DOCTOR', state: 'Maharashtra', language: 'en' },
  { name: 'Meera Patel', email: 'volunteer@sakhishakti.in', password: 'Demo@123', role: 'VOLUNTEER', state: 'Gujarat', language: 'en' },
  { name: 'Admin SakhiShakti', email: 'admin@sakhishakti.in', password: 'Demo@123', role: 'ADMIN', state: '', language: 'en' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH CARDS
// ─────────────────────────────────────────────────────────────────────────────
const HEALTH_CARDS = [
  {
    ageGroup: '0-12',
    title: { en: 'Child Health (0-12 Years)', hi: 'बाल स्वास्थ्य (0-12 वर्ष)' },
    icon: '🌱',
    color: '#4ade80',
    conditions: [
      { en: 'Malnutrition', hi: 'कुपोषण' },
      { en: 'Anaemia', hi: 'खून की कमी' },
      { en: 'Diarrhoea', hi: 'दस्त' },
      { en: 'Respiratory Infections', hi: 'श्वसन संक्रमण' }
    ],
    symptoms: [
      { en: 'Low weight for age or height', hi: 'उम्र या लंबाई के अनुसार कम वजन' },
      { en: 'Pale skin or white inner eyelids (anaemia)', hi: 'पीली त्वचा या सफेद अंदरूनी पलकें (खून की कमी)' },
      { en: 'Frequent loose motions with/without blood', hi: 'खून के साथ या बिना बार-बार पतला मल' },
      { en: 'Persistent cough or fast breathing', hi: 'लगातार खाँसी या तेज सांस' },
      { en: 'Swollen belly, thin limbs', hi: 'सूजा हुआ पेट, पतले हाथ-पाँव' }
    ],
    prevention: [
      { en: 'Exclusive breastfeeding for 6 months', hi: '6 महीने तक सिर्फ माँ का दूध पिलाएं' },
      { en: 'Timely vaccination (Immunization card)', hi: 'समय पर टीकाकरण (टीकाकरण कार्ड)' },
      { en: 'Iron-folic acid syrup as prescribed', hi: 'निर्धारित आयरन-फोलिक एसिड सिरप' },
      { en: 'Hand washing before meals and after toilet', hi: 'खाने से पहले और शौच के बाद हाथ धोएं' },
      { en: 'Clean drinking water / ORS for diarrhoea', hi: 'साफ पीने का पानी / दस्त के लिए ORS' }
    ],
    homeRemedies: [
      { en: 'ORS (Oral Rehydration Solution) for diarrhoea — 1 sachet in 1 litre clean water', hi: 'दस्त के लिए ORS — 1 थैली 1 लीटर साफ पानी में' },
      { en: 'Zinc tablets with ORS (prescribed by doctor)', hi: 'ORS के साथ जिंक की गोली (डॉक्टर द्वारा निर्धारित)' },
      { en: 'Vitamin A supplement every 6 months from ASHA/ANM', hi: 'हर 6 महीने में ASHA/ANM से विटामिन A की खुराक' },
      { en: 'Soft khichdi, banana, curd for malnourished children', hi: 'कुपोषित बच्चों के लिए नरम खिचड़ी, केला, दही' }
    ],
    redFlags: [
      { en: 'Child not eating for 2+ days', hi: 'बच्चा 2+ दिनों से कुछ नहीं खा रहा' },
      { en: 'Blood in stool or vomit', hi: 'मल या उल्टी में खून' },
      { en: 'High fever (>102°F / 39°C) with fits', hi: '102°F से ज्यादा बुखार के साथ दौरे' },
      { en: 'Child unconscious or not responding', hi: 'बच्चा बेहोश या प्रतिक्रिया नहीं दे रहा' },
      { en: 'Rapid weight loss with swollen feet', hi: 'तेज वजन घटना और सूजे हुए पाँव' }
    ]
  },
  {
    ageGroup: '13-19',
    title: { en: 'Adolescent Health (13-19 Years)', hi: 'किशोरी स्वास्थ्य (13-19 वर्ष)' },
    icon: '🌸',
    color: '#f472b6',
    conditions: [
      { en: 'Anaemia', hi: 'खून की कमी' },
      { en: 'Menstrual Irregularities', hi: 'मासिक धर्म अनियमितता' },
      { en: 'Malnutrition / Underweight', hi: 'कुपोषण / कम वजन' },
      { en: 'Mental Health (Stress, Anxiety)', hi: 'मानसिक स्वास्थ्य (तनाव, चिंता)' }
    ],
    symptoms: [
      { en: 'Extreme fatigue, dizziness, pale complexion', hi: 'अत्यधिक थकान, चक्कर, पीला चेहरा' },
      { en: 'Periods absent for 3+ months (not pregnant)', hi: '3+ महीने माहवारी न आना (गर्भ नहीं है)' },
      { en: 'Very heavy bleeding (soaking 1 pad/hour)', hi: 'बहुत अधिक रक्तस्राव (1 घंटे में 1 पैड भीगना)' },
      { en: 'Severe cramping before/during periods', hi: 'माहवारी से पहले/दौरान तेज दर्द' },
      { en: 'Persistent sadness, withdrawal, self-harm thoughts', hi: 'लगातार उदासी, अकेलापन, खुद को नुकसान पहुँचाने के विचार' }
    ],
    prevention: [
      { en: 'Weekly Iron-Folic Acid (IFA) tablet — WIFS programme', hi: 'साप्ताहिक आयरन-फोलिक एसिड (IFA) गोली — WIFS कार्यक्रम' },
      { en: 'Eat green leafy vegetables, jaggery, lentils daily', hi: 'हरी पत्तेदार सब्जियाँ, गुड़, दाल रोज खाएं' },
      { en: 'Maintain a period diary to track cycle', hi: 'माहवारी डायरी बनाएं और चक्र को ट्रैक करें' },
      { en: 'Talk to a trusted adult or counsellor about stress', hi: 'किसी विश्वसनीय बड़े या काउंसलर से तनाव की बात करें' },
      { en: 'Avoid early marriage — stay in school', hi: 'बाल विवाह से बचें — स्कूल में रहें' }
    ],
    homeRemedies: [
      { en: 'Ginger tea with jaggery for cramps', hi: 'ऐंठन के लिए गुड़ वाली अदरक की चाय' },
      { en: 'Warm water bottle on abdomen for period pain', hi: 'पेट दर्द के लिए पेट पर गर्म पानी की बोतल' },
      { en: 'Ajwain (carom seeds) water for bloating', hi: 'पेट फूलने पर अजवाइन का पानी' },
      { en: 'Sesame seeds + jaggery ladoo for iron', hi: 'आयरन के लिए तिल + गुड़ के लड्डू' }
    ],
    redFlags: [
      { en: 'Periods absent for 3+ months', hi: '3+ महीने माहवारी न आना' },
      { en: 'Fainting spells from heavy bleeding', hi: 'भारी रक्तस्राव से बेहोशी' },
      { en: 'Self-harm or suicidal thoughts — call iCall: 9152987821', hi: 'खुद को नुकसान या आत्महत्या के विचार — iCall: 9152987821 पर कॉल करें' },
      { en: 'Severe abdominal pain with fever', hi: 'बुखार के साथ पेट में तेज दर्द' }
    ]
  },
  {
    ageGroup: '20-35',
    title: { en: 'Reproductive Health (20-35 Years)', hi: 'प्रजनन स्वास्थ्य (20-35 वर्ष)' },
    icon: '🌺',
    color: '#f97316',
    conditions: [
      { en: 'PCOS / PCOD', hi: 'PCOS / PCOD' },
      { en: 'Anaemia in Pregnancy', hi: 'गर्भावस्था में खून की कमी' },
      { en: 'Gestational Diabetes', hi: 'गर्भावधि मधुमेह' },
      { en: 'Postpartum Depression', hi: 'प्रसव के बाद अवसाद' },
      { en: 'Cervical / Breast Health', hi: 'गर्भाशय ग्रीवा / स्तन स्वास्थ्य' }
    ],
    symptoms: [
      { en: 'Irregular periods, weight gain, excessive hair on face/body', hi: 'अनियमित माहवारी, वजन बढ़ना, चेहरे/शरीर पर बाल' },
      { en: 'Extreme fatigue, breathlessness in pregnancy', hi: 'गर्भावस्था में अत्यधिक थकान, सांस फूलना' },
      { en: 'Excessive thirst / urination during pregnancy', hi: 'गर्भावस्था में अत्यधिक प्यास / पेशाब' },
      { en: 'Persistent sadness or crying after delivery', hi: 'प्रसव के बाद लगातार दुख या रोना' },
      { en: 'Unusual vaginal discharge, itching, pain', hi: 'असामान्य योनि स्राव, खुजली, दर्द' }
    ],
    prevention: [
      { en: 'Register at nearest PHC/ASHA for ANC (Antenatal Care)', hi: 'ANC (प्रसवपूर्व देखभाल) के लिए नजदीकी PHC/ASHA में पंजीकरण' },
      { en: 'Institutional delivery — Janani Suraksha Yojana cash benefit', hi: 'संस्थागत प्रसव — जननी सुरक्षा योजना नकद लाभ' },
      { en: 'Cervical cancer screening (Pap smear) every 3 years', hi: 'हर 3 साल में सर्वाइकल कैंसर जांच (पैप स्मीयर)' },
      { en: 'Monthly breast self-examination', hi: 'मासिक स्तन स्व-परीक्षण' },
      { en: 'Iron + calcium supplements as prescribed', hi: 'निर्धारित आयरन + कैल्शियम की गोलियाँ' }
    ],
    homeRemedies: [
      { en: 'Methi seeds soaked overnight — drink water for PCOS', hi: 'रात भर भिगोए मेथी के बीज — PCOS के लिए पानी पीएं' },
      { en: 'Coconut water for hydration during pregnancy', hi: 'गर्भावस्था में हाइड्रेशन के लिए नारियल पानी' },
      { en: 'Turmeric milk for postpartum recovery', hi: 'प्रसव के बाद रिकवरी के लिए हल्दी दूध' },
      { en: 'Ajwain ladoo (traditional postpartum food)', hi: 'प्रसव के बाद अजवाइन के लड्डू (पारंपरिक भोजन)' }
    ],
    redFlags: [
      { en: 'Bleeding in pregnancy (any trimester)', hi: 'गर्भावस्था में कभी भी रक्तस्राव' },
      { en: 'Severe headache + blurred vision + swelling in pregnancy (preeclampsia)', hi: 'गर्भावस्था में तेज सिरदर्द + धुंधला दिखना + सूजन (प्रीक्लेम्पसिया)' },
      { en: 'Baby not moving after 28 weeks', hi: '28 सप्ताह के बाद बच्चे का हिलना-डुलना बंद' },
      { en: 'High fever (>101°F) during pregnancy', hi: 'गर्भावस्था में तेज बुखार (101°F से ज्यादा)' },
      { en: 'Thoughts of harming self or baby after delivery', hi: 'प्रसव के बाद खुद को या बच्चे को नुकसान पहुँचाने के विचार' }
    ]
  },
  {
    ageGroup: '36-50',
    title: { en: 'Midlife Health (36-50 Years)', hi: 'मध्यावस्था स्वास्थ्य (36-50 वर्ष)' },
    icon: '🌻',
    color: '#eab308',
    conditions: [
      { en: 'Perimenopause', hi: 'रजोनिवृत्ति से पहले की अवस्था' },
      { en: 'Hypertension', hi: 'उच्च रक्तचाप' },
      { en: 'Type 2 Diabetes', hi: 'टाइप 2 मधुमेह' },
      { en: 'Thyroid Disorders', hi: 'थायरॉइड विकार' },
      { en: 'Bone Health (Osteoporosis)', hi: 'हड्डियों का स्वास्थ्य (ऑस्टियोपोरोसिस)' }
    ],
    symptoms: [
      { en: 'Hot flashes, night sweats, mood swings', hi: 'गर्म लहरें, रात को पसीना, मूड बदलना' },
      { en: 'Persistent headache, dizziness (high BP)', hi: 'लगातार सिरदर्द, चक्कर (उच्च रक्तचाप)' },
      { en: 'Increased thirst, frequent urination, blurred vision (diabetes)', hi: 'अधिक प्यास, बार-बार पेशाब, धुंधला दिखना (मधुमेह)' },
      { en: 'Unexplained weight gain/loss, fatigue (thyroid)', hi: 'अनजाने वजन बढ़ना/घटना, थकान (थायरॉइड)' },
      { en: 'Joint pain, back pain, frequent fractures', hi: 'जोड़ों में दर्द, पीठ दर्द, बार-बार फ्रैक्चर' }
    ],
    prevention: [
      { en: 'Blood pressure check every 6 months', hi: 'हर 6 महीने में रक्तचाप जांच' },
      { en: 'Blood sugar (fasting + PP) test annually', hi: 'सालाना ब्लड शुगर (फास्टिंग + PP) जांच' },
      { en: 'Calcium-rich diet: milk, curd, sesame, ragi', hi: 'कैल्शियम युक्त आहार: दूध, दही, तिल, रागी' },
      { en: 'Weight-bearing exercise (walking 45 min/day)', hi: 'वजन-वहन व्यायाम (रोजाना 45 मिनट पैदल चलना)' },
      { en: 'Thyroid function test (TSH) every 1-2 years', hi: 'हर 1-2 साल में थायरॉइड फंक्शन टेस्ट (TSH)' }
    ],
    homeRemedies: [
      { en: 'Flaxseed (alsi) powder in buttermilk for hot flashes', hi: 'गर्म लहरों के लिए छाछ में अलसी पाउडर' },
      { en: 'Ragi (finger millet) for calcium and bone health', hi: 'कैल्शियम और हड्डियों के लिए रागी' },
      { en: 'Amla juice for immunity and diabetes support', hi: 'रोग प्रतिरोधक क्षमता और मधुमेह के लिए आँवले का रस' },
      { en: 'Methi water for blood sugar management', hi: 'ब्लड शुगर प्रबंधन के लिए मेथी का पानी' }
    ],
    redFlags: [
      { en: 'BP > 160/100 — seek emergency care', hi: 'BP > 160/100 — आपातकालीन देखभाल लें' },
      { en: 'Blood sugar > 300 mg/dL (diabetic emergency)', hi: 'ब्लड शुगर > 300 mg/dL (मधुमेह आपातकाल)' },
      { en: 'Chest pain or breathlessness — call 108', hi: 'सीने में दर्द या सांस फूलना — 108 पर कॉल करें' },
      { en: 'Post-menopausal bleeding', hi: 'रजोनिवृत्ति के बाद रक्तस्राव' },
      { en: 'Sudden severe headache (could be stroke)', hi: 'अचानक तेज सिरदर्द (स्ट्रोक हो सकता है)' }
    ]
  },
  {
    ageGroup: '50+',
    title: { en: 'Senior Women\'s Health (50+ Years)', hi: 'वरिष्ठ महिला स्वास्थ्य (50+ वर्ष)' },
    icon: '🌷',
    color: '#8b5cf6',
    conditions: [
      { en: 'Post-Menopause', hi: 'रजोनिवृत्ति के बाद' },
      { en: 'Osteoporosis', hi: 'ऑस्टियोपोरोसिस' },
      { en: 'Heart Disease', hi: 'हृदय रोग' },
      { en: 'Depression & Loneliness', hi: 'अवसाद और अकेलापन' },
      { en: 'Visual & Hearing Impairment', hi: 'दृष्टि और श्रवण दुर्बलता' }
    ],
    symptoms: [
      { en: 'Bone fractures from minor falls', hi: 'छोटी-सी गिरावट से हड्डी टूटना' },
      { en: 'Irregular heartbeat, chest discomfort', hi: 'अनियमित दिल की धड़कन, सीने में तकलीफ' },
      { en: 'Memory loss, confusion, forgetting routine tasks', hi: 'याददाश्त कम होना, भ्रम, दैनिक कार्य भूलना' },
      { en: 'Persistent sadness, isolation, loss of interest', hi: 'लगातार उदासी, अकेलापन, रुचि में कमी' },
      { en: 'Frequent falls due to weakness/dizziness', hi: 'कमजोरी/चक्कर के कारण बार-बार गिरना' }
    ],
    prevention: [
      { en: 'Annual full health check-up (BP, sugar, cholesterol, eye, ear)', hi: 'वार्षिक स्वास्थ्य जांच (BP, शुगर, कोलेस्ट्रॉल, आँख, कान)' },
      { en: 'Calcium 1200mg + Vitamin D3 supplement daily', hi: 'रोजाना कैल्शियम 1200mg + विटामिन D3 सप्लीमेंट' },
      { en: 'Stay socially active — Mahila Mandal, SHG groups', hi: 'सामाजिक रूप से सक्रिय रहें — महिला मंडल, SHG समूह' },
      { en: 'Remove fall hazards at home (rugs, slippery floors)', hi: 'घर पर गिरने के खतरे हटाएं (कालीन, फिसलन भरे फर्श)' },
      { en: 'Yoga / light stretching for joint flexibility', hi: 'जोड़ों की लचीलेपन के लिए योग / हल्की स्ट्रेचिंग' }
    ],
    homeRemedies: [
      { en: 'Warm sesame oil massage for joint pain', hi: 'जोड़ों के दर्द के लिए गर्म तिल के तेल की मालिश' },
      { en: 'Ashwagandha milk for energy and sleep', hi: 'ऊर्जा और नींद के लिए अश्वगंधा दूध' },
      { en: 'Mulethi (liquorice) tea for throat and immunity', hi: 'गले और रोग प्रतिरोधक क्षमता के लिए मुलेठी की चाय' },
      { en: 'Turmeric + black pepper in warm milk for inflammation', hi: 'सूजन के लिए गर्म दूध में हल्दी + काली मिर्च' }
    ],
    redFlags: [
      { en: 'Sudden weakness on one side of body (stroke) — call 108', hi: 'शरीर के एक तरफ अचानक कमजोरी (स्ट्रोक) — 108 पर कॉल करें' },
      { en: 'Chest pain radiating to arm/jaw — call 108', hi: 'हाथ/जबड़े तक जाता सीने का दर्द — 108 पर कॉल करें' },
      { en: 'Post-menopausal vaginal bleeding', hi: 'रजोनिवृत्ति के बाद योनि से रक्तस्राव' },
      { en: 'Severe memory loss affecting daily functioning', hi: 'रोजमर्रा के काम प्रभावित करने वाली गंभीर याददाश्त हानि' },
      { en: 'Any new lump in breast or abdomen', hi: 'स्तन या पेट में कोई नई गांठ' }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// GOVERNMENT SCHEMES
// ─────────────────────────────────────────────────────────────────────────────
const SCHEMES = [
  {
    name: { en: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)', hi: 'प्रधानमंत्री मातृ वंदना योजना (PMMVY)' },
    level: 'CENTRAL',
    state: 'All India',
    category: 'Health',
    icon: '🤱',
    color: '#ec4899',
    description: {
      en: 'Cash incentive of ₹5,000 in 3 instalments for pregnant and lactating mothers for the first live birth. Promotes institutional delivery and immunisation.',
      hi: 'पहले जीवित जन्म के लिए गर्भवती और स्तनपान कराने वाली माताओं को 3 किश्तों में ₹5,000 की नकद सहायता। संस्थागत प्रसव और टीकाकरण को बढ़ावा देती है।'
    },
    eligibility: {
      minAge: 19,
      maxAge: 45,
      maxIncomeLPA: null,
      criteria: [
        { en: 'Indian woman, 19 years or older', hi: 'भारतीय महिला, 19 वर्ष या उससे अधिक' },
        { en: 'First live birth only', hi: 'केवल पहले जीवित जन्म के लिए' },
        { en: 'Not a central/state government employee with maternity benefits', hi: 'केंद्र/राज्य सरकार की कर्मचारी न हो जिसे मातृत्व लाभ मिलता हो' }
      ]
    },
    benefits: [
      { en: '₹1,000 on early pregnancy registration', hi: 'प्रारंभिक गर्भावस्था पंजीकरण पर ₹1,000' },
      { en: '₹2,000 after 6 months of pregnancy + 1 ANC checkup', hi: '6 महीने गर्भावस्था + 1 ANC जांच के बाद ₹2,000' },
      { en: '₹2,000 after child birth + first cycle of vaccination', hi: 'प्रसव + पहले टीकाकरण चक्र के बाद ₹2,000' }
    ],
    documents: [
      { en: 'MCP Card (Mother and Child Protection Card)', hi: 'MCP कार्ड (माँ और बाल संरक्षण कार्ड)' },
      { en: 'Aadhaar card of mother and husband', hi: 'माँ और पति का आधार कार्ड' },
      { en: 'Bank account passbook (Jan Dhan preferred)', hi: 'बैंक खाता पासबुक (जन धन खाता अच्छा)' },
      { en: 'Ration card', hi: 'राशन कार्ड' }
    ],
    applySteps: [
      { en: 'Visit nearest Anganwadi Centre or PHC', hi: 'नजदीकी आंगनवाड़ी केंद्र या PHC पर जाएं' },
      { en: 'Fill Form 1A for first instalment', hi: 'पहली किश्त के लिए फॉर्म 1A भरें' },
      { en: 'Carry Aadhaar, MCP Card, and bank passbook', hi: 'आधार, MCP कार्ड और बैंक पासबुक लेकर जाएं' },
      { en: 'Money transferred directly to bank account via DBT', hi: 'DBT के माध्यम से पैसा सीधे बैंक खाते में आएगा' }
    ],
    officialLink: 'https://pmmvy.wcd.gov.in'
  },
  {
    name: { en: 'Janani Suraksha Yojana (JSY)', hi: 'जननी सुरक्षा योजना (JSY)' },
    level: 'CENTRAL',
    state: 'All India',
    category: 'Health',
    icon: '🏥',
    color: '#3b82f6',
    description: {
      en: 'Cash assistance to pregnant women for institutional delivery. Special focus on BPL women, SC/ST categories. ₹1,400 (rural) and ₹1,000 (urban) for delivery in government hospital.',
      hi: 'संस्थागत प्रसव के लिए गर्भवती महिलाओं को नकद सहायता। BPL, SC/ST महिलाओं पर विशेष ध्यान। सरकारी अस्पताल में प्रसव के लिए ₹1,400 (ग्रामीण) और ₹1,000 (शहरी)।'
    },
    eligibility: {
      minAge: 10,
      maxAge: 50,
      maxIncomeLPA: null,
      criteria: [
        { en: 'BPL / SC / ST category women preferred', hi: 'BPL / SC / ST वर्ग की महिलाएं' },
        { en: 'Delivery in government or accredited private health facility', hi: 'सरकारी या मान्यता प्राप्त निजी स्वास्थ्य सुविधा में प्रसव' },
        { en: 'All states; LPS (Low Performing States) get higher benefits', hi: 'सभी राज्य; LPS (कम प्रदर्शन वाले राज्य) को अधिक लाभ' }
      ]
    },
    benefits: [
      { en: '₹1,400 cash for rural women in LPS states', hi: 'LPS राज्यों में ग्रामीण महिलाओं को ₹1,400 नकद' },
      { en: '₹600 for ASHA workers who facilitate delivery', hi: 'प्रसव में सहायता करने वाली ASHA कार्यकर्ताओं को ₹600' },
      { en: 'Free delivery and post-delivery care in govt hospitals', hi: 'सरकारी अस्पतालों में मुफ्त प्रसव और प्रसव के बाद देखभाल' }
    ],
    documents: [
      { en: 'JSY card / MCP card', hi: 'JSY कार्ड / MCP कार्ड' },
      { en: 'Aadhaar card', hi: 'आधार कार्ड' },
      { en: 'BPL / SC / ST certificate (if applicable)', hi: 'BPL / SC / ST प्रमाण पत्र (यदि लागू हो)' },
      { en: 'Bank account details', hi: 'बैंक खाता विवरण' }
    ],
    applySteps: [
      { en: 'Register with ASHA worker or ANM in village', hi: 'गाँव में ASHA कार्यकर्ता या ANM के साथ पंजीकरण करें' },
      { en: 'Obtain JSY card during ANC visits', hi: 'ANC दौरे के दौरान JSY कार्ड प्राप्त करें' },
      { en: 'Deliver at government hospital — ASHA accompanies you', hi: 'सरकारी अस्पताल में प्रसव — ASHA आपके साथ जाएगी' },
      { en: 'Cash disbursed within 7 days of delivery', hi: 'प्रसव के 7 दिन के भीतर नकद प्रदान किया जाएगा' }
    ],
    officialLink: 'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309'
  },
  {
    name: { en: 'Sukanya Samriddhi Yojana (SSY)', hi: 'सुकन्या समृद्धि योजना (SSY)' },
    level: 'CENTRAL',
    state: 'All India',
    category: 'Financial',
    icon: '💰',
    color: '#10b981',
    description: {
      en: 'High-interest savings scheme for girl children. Parents/guardians open account for girls under 10. 8.2% annual interest (tax-free). Matures at 21 years.',
      hi: 'बालिकाओं के लिए उच्च ब्याज बचत योजना। माता-पिता/अभिभावक 10 वर्ष से कम की बालिकाओं के लिए खाता खोलते हैं। 8.2% वार्षिक ब्याज (कर-मुक्त)। 21 वर्ष में परिपक्व होती है।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 10,
      maxIncomeLPA: null,
      criteria: [
        { en: 'Indian girl child below 10 years of age', hi: '10 वर्ष से कम आयु की भारतीय बालिका' },
        { en: 'Maximum 2 accounts per family (3 for twins)', hi: 'प्रति परिवार अधिकतम 2 खाते (जुड़वाँ के लिए 3)' },
        { en: 'Minimum deposit ₹250/year, maximum ₹1.5 lakh/year', hi: 'न्यूनतम ₹250/वर्ष, अधिकतम ₹1.5 लाख/वर्ष जमा' }
      ]
    },
    benefits: [
      { en: '8.2% interest per annum — highest among small savings schemes', hi: '8.2% वार्षिक ब्याज — छोटी बचत योजनाओं में सर्वाधिक' },
      { en: 'Tax exemption under Section 80C on deposits and interest', hi: 'जमा और ब्याज पर धारा 80C के अंतर्गत कर छूट' },
      { en: '50% withdrawal at age 18 for education', hi: 'शिक्षा के लिए 18 वर्ष में 50% निकासी' },
      { en: 'Full maturity at 21 years', hi: '21 वर्ष में पूर्ण परिपक्वता' }
    ],
    documents: [
      { en: 'Birth certificate of girl child', hi: 'बालिका का जन्म प्रमाण पत्र' },
      { en: 'Aadhaar card of parent/guardian', hi: 'माता-पिता/अभिभावक का आधार कार्ड' },
      { en: 'Address proof', hi: 'पते का प्रमाण' },
      { en: 'Passport-size photographs', hi: 'पासपोर्ट आकार की तस्वीरें' }
    ],
    applySteps: [
      { en: 'Visit nearest Post Office or authorised bank (SBI, PNB, etc.)', hi: 'नजदीकी डाकघर या अधिकृत बैंक (SBI, PNB, आदि) जाएं' },
      { en: 'Fill SSY account opening form', hi: 'SSY खाता खोलने का फॉर्म भरें' },
      { en: 'Submit documents and initial deposit (min ₹250)', hi: 'दस्तावेज और प्रारंभिक जमा (न्यूनतम ₹250) जमा करें' },
      { en: 'Receive passbook — deposit annually to keep account active', hi: 'पासबुक प्राप्त करें — खाता सक्रिय रखने के लिए वार्षिक जमा करें' }
    ],
    officialLink: 'https://www.indiapost.gov.in/Financial/pages/Content/Sukanya-Samridhi-Account.aspx'
  },
  {
    name: { en: 'Beti Bachao Beti Padhao (BBBP)', hi: 'बेटी बचाओ बेटी पढ़ाओ (BBBP)' },
    level: 'CENTRAL',
    state: 'All India',
    category: 'Education',
    icon: '📚',
    color: '#8b5cf6',
    description: {
      en: 'Campaign to prevent gender-biased sex selective elimination, ensure survival and protection of girl child, and promote education and participation in society.',
      hi: 'लिंग-पक्षपाती लिंग चयनात्मक उन्मूलन को रोकना, बालिका की उत्तरजीविता और सुरक्षा सुनिश्चित करना, और समाज में शिक्षा और भागीदारी को बढ़ावा देना।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 18,
      maxIncomeLPA: null,
      criteria: [
        { en: 'All girl children', hi: 'सभी बालिकाएं' },
        { en: 'Focus on districts with low Child Sex Ratio', hi: 'कम लिंगानुपात वाले जिलों पर ध्यान' }
      ]
    },
    benefits: [
      { en: 'Free education for girls in government schools', hi: 'सरकारी स्कूलों में बालिकाओं के लिए मुफ्त शिक्षा' },
      { en: 'Scholarship for meritorious girls', hi: 'मेधावी बालिकाओं के लिए छात्रवृत्ति' },
      { en: 'Linkage to Sukanya Samriddhi Yojana for savings', hi: 'बचत के लिए सुकन्या समृद्धि योजना से जुड़ाव' },
      { en: 'Awareness campaigns against child marriage', hi: 'बाल विवाह के खिलाफ जागरूकता अभियान' }
    ],
    documents: [
      { en: 'Birth certificate', hi: 'जन्म प्रमाण पत्र' },
      { en: 'School enrollment certificate', hi: 'स्कूल नामांकन प्रमाण पत्र' }
    ],
    applySteps: [
      { en: 'Contact nearest Anganwadi or school', hi: 'नजदीकी आंगनवाड़ी या स्कूल से संपर्क करें' },
      { en: 'Register girl child for BBBP benefits', hi: 'BBBP लाभ के लिए बालिका का पंजीकरण कराएं' },
      { en: 'Open Sukanya Samriddhi account for financial security', hi: 'वित्तीय सुरक्षा के लिए सुकन्या समृद्धि खाता खोलें' }
    ],
    officialLink: 'https://wcd.nic.in/bbbp-schemes'
  },
  {
    name: { en: 'Stand-Up India Scheme', hi: 'स्टैंड-अप इंडिया योजना' },
    level: 'CENTRAL',
    state: 'All India',
    category: 'Employment',
    icon: '💼',
    color: '#f97316',
    description: {
      en: 'Bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.',
      hi: 'प्रत्येक बैंक शाखा से कम से कम एक SC/ST ऋणकर्ता और कम से कम एक महिला ऋणकर्ता को ₹10 लाख से ₹1 करोड़ तक का बैंक ऋण नए उद्यम स्थापित करने के लिए।'
    },
    eligibility: {
      minAge: 18,
      maxAge: null,
      maxIncomeLPA: null,
      criteria: [
        { en: 'Women entrepreneur (any caste/category)', hi: 'महिला उद्यमी (कोई भी जाति/वर्ग)' },
        { en: 'SC / ST entrepreneur', hi: 'SC / ST उद्यमी' },
        { en: 'Greenfield enterprise (first-time business in manufacturing, services, trading)', hi: 'ग्रीनफील्ड उद्यम (विनिर्माण, सेवा, व्यापार में पहला व्यवसाय)' },
        { en: 'Non-defaulter with any bank/financial institution', hi: 'किसी भी बैंक/वित्तीय संस्था की चूककर्ता न हो' }
      ]
    },
    benefits: [
      { en: 'Composite loan ₹10 lakh to ₹1 crore (75% of project cost)', hi: '₹10 लाख से ₹1 करोड़ की मिश्रित ऋण (परियोजना लागत का 75%)' },
      { en: 'Repayment period up to 7 years with moratorium of 18 months', hi: '18 महीने के अधिस्थगन के साथ 7 साल तक की चुकौती अवधि' },
      { en: 'Working capital via CC/OD facility', hi: 'CC/OD सुविधा के माध्यम से कार्यशील पूंजी' }
    ],
    documents: [
      { en: 'Identity proof (Aadhaar/PAN)', hi: 'पहचान प्रमाण (आधार/PAN)' },
      { en: 'Detailed project report', hi: 'विस्तृत परियोजना रिपोर्ट' },
      { en: 'Address proof of business', hi: 'व्यवसाय का पते का प्रमाण' },
      { en: 'Caste certificate if SC/ST', hi: 'SC/ST होने पर जाति प्रमाण पत्र' }
    ],
    applySteps: [
      { en: 'Visit standupmitra.in portal or nearest bank branch', hi: 'standupmitra.in पोर्टल या नजदीकी बैंक शाखा जाएं' },
      { en: 'Register and fill loan application online', hi: 'ऑनलाइन पंजीकरण करें और ऋण आवेदन भरें' },
      { en: 'Submit project report and documents', hi: 'परियोजना रिपोर्ट और दस्तावेज जमा करें' },
      { en: 'Bank verifies and sanctions loan within 45 days', hi: 'बैंक 45 दिनों के भीतर ऋण सत्यापित और स्वीकृत करता है' }
    ],
    officialLink: 'https://www.standupmitra.in'
  },
  {
    name: { en: 'Ladli Behna Yojana', hi: 'लाड़ली बहना योजना' },
    level: 'STATE',
    state: 'Madhya Pradesh',
    category: 'Financial',
    icon: '🌸',
    color: '#ec4899',
    description: {
      en: 'Monthly financial assistance of ₹1,250 to eligible women of Madhya Pradesh. Direct bank transfer to promote financial independence of rural women.',
      hi: 'मध्यप्रदेश की पात्र महिलाओं को ₹1,250 मासिक वित्तीय सहायता। ग्रामीण महिलाओं की आर्थिक स्वतंत्रता के लिए सीधे बैंक खाते में हस्तांतरण।'
    },
    eligibility: {
      minAge: 21,
      maxAge: 60,
      maxIncomeLPA: 2.5,
      criteria: [
        { en: 'Domicile of Madhya Pradesh', hi: 'मध्यप्रदेश की मूल निवासी' },
        { en: 'Age 21-60 years', hi: 'आयु 21-60 वर्ष' },
        { en: 'Family income less than ₹2.5 lakh per year', hi: 'परिवार की आय ₹2.5 लाख प्रति वर्ष से कम' },
        { en: 'Not an income tax payer', hi: 'आयकर दाता न हो' }
      ]
    },
    benefits: [
      { en: '₹1,250/month directly to bank account', hi: '₹1,250/माह सीधे बैंक खाते में' },
      { en: 'Gas cylinder subsidy linkage', hi: 'गैस सिलेंडर सब्सिडी लिंकेज' }
    ],
    documents: [
      { en: 'Aadhaar card', hi: 'आधार कार्ड' },
      { en: 'Samgra ID', hi: 'समग्र आईडी' },
      { en: 'Bank passbook (account linked to Aadhaar)', hi: 'बैंक पासबुक (आधार से जुड़ा खाता)' },
      { en: 'Mobile number linked to Aadhaar', hi: 'आधार से जुड़ा मोबाइल नंबर' }
    ],
    applySteps: [
      { en: 'Visit cmladlibahna.mp.gov.in or nearest camp', hi: 'cmladlibahna.mp.gov.in पर जाएं या नजदीकी कैंप में जाएं' },
      { en: 'Fill eKYC with Aadhaar + Samgra ID', hi: 'आधार + समग्र ID से eKYC भरें' },
      { en: 'Submit self-declaration form at village camp', hi: 'ग्राम कैंप में स्व-घोषणा पत्र जमा करें' },
      { en: 'Receive confirmation SMS on registered mobile', hi: 'पंजीकृत मोबाइल पर पुष्टि SMS प्राप्त करें' }
    ],
    officialLink: 'https://cmladlibahna.mp.gov.in'
  },
  {
    name: { en: 'Mukhyamantri Kanya Sumangala Yojana', hi: 'मुख्यमंत्री कन्या सुमंगला योजना' },
    level: 'STATE',
    state: 'Uttar Pradesh',
    category: 'Education',
    icon: '🎓',
    color: '#3b82f6',
    description: {
      en: 'Uttar Pradesh scheme providing financial support of ₹15,000 in 6 instalments for girl children from birth to graduation. Promotes education and health of girls.',
      hi: 'उत्तर प्रदेश योजना जो जन्म से स्नातक तक बालिकाओं को 6 किश्तों में ₹15,000 की वित्तीय सहायता प्रदान करती है। बालिकाओं की शिक्षा और स्वास्थ्य को बढ़ावा देती है।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 22,
      maxIncomeLPA: 3,
      criteria: [
        { en: 'UP domicile; Family income ≤ ₹3 lakh/year', hi: 'UP निवासी; पारिवारिक आय ≤ ₹3 लाख/वर्ष' },
        { en: 'Maximum 2 girl children per family', hi: 'प्रति परिवार अधिकतम 2 बालिकाएं' },
        { en: 'Institutional delivery required for birth instalment', hi: 'जन्म किश्त के लिए संस्थागत प्रसव आवश्यक' }
      ]
    },
    benefits: [
      { en: '₹2,000 at birth', hi: 'जन्म पर ₹2,000' },
      { en: '₹1,000 at 1-year vaccination', hi: '1 वर्ष टीकाकरण पर ₹1,000' },
      { en: '₹2,000 on Class 1 admission', hi: 'कक्षा 1 में प्रवेश पर ₹2,000' },
      { en: '₹2,000 on Class 6 admission', hi: 'कक्षा 6 में प्रवेश पर ₹2,000' },
      { en: '₹3,000 on Class 9 admission', hi: 'कक्षा 9 में प्रवेश पर ₹3,000' },
      { en: '₹5,000 on graduation/diploma enrolment', hi: 'स्नातक/डिप्लोमा में प्रवेश पर ₹5,000' }
    ],
    documents: [
      { en: 'Birth certificate of girl child', hi: 'बालिका का जन्म प्रमाण पत्र' },
      { en: 'UP domicile certificate', hi: 'UP निवास प्रमाण पत्र' },
      { en: 'Income certificate', hi: 'आय प्रमाण पत्र' },
      { en: 'Aadhaar card', hi: 'आधार कार्ड' },
      { en: 'Bank passbook', hi: 'बैंक पासबुक' }
    ],
    applySteps: [
      { en: 'Register at mksy.up.gov.in', hi: 'mksy.up.gov.in पर पंजीकरण करें' },
      { en: 'Create account using mobile number', hi: 'मोबाइल नंबर से खाता बनाएं' },
      { en: 'Upload documents for each instalment stage', hi: 'प्रत्येक किश्त चरण के लिए दस्तावेज अपलोड करें' },
      { en: 'Track application status online', hi: 'ऑनलाइन आवेदन स्थिति देखें' }
    ],
    officialLink: 'https://mksy.up.gov.in'
  },
  {
    name: { en: 'Rajshri Yojana', hi: 'राजश्री योजना' },
    level: 'STATE',
    state: 'Rajasthan',
    category: 'Education',
    icon: '⭐',
    color: '#f59e0b',
    description: {
      en: 'Rajasthan scheme offering ₹50,000 total in 6 instalments from birth to Class 12 for girl children to promote their education and overall development.',
      hi: 'राजस्थान योजना जो बालिकाओं की शिक्षा और समग्र विकास को बढ़ावा देने के लिए जन्म से कक्षा 12 तक 6 किश्तों में कुल ₹50,000 प्रदान करती है।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 18,
      maxIncomeLPA: null,
      criteria: [
        { en: 'Rajasthan domicile', hi: 'राजस्थान की मूल निवासी' },
        { en: 'Birth in government hospital', hi: 'सरकारी अस्पताल में जन्म' },
        { en: 'Bhamashah card or Jan Aadhaar card required', hi: 'भामाशाह कार्ड या जन आधार कार्ड आवश्यक' }
      ]
    },
    benefits: [
      { en: '₹2,500 at birth', hi: 'जन्म पर ₹2,500' },
      { en: '₹2,500 on 1st birthday (vaccinations complete)', hi: '1वें जन्मदिन पर ₹2,500 (टीकाकरण पूर्ण)' },
      { en: '₹4,000 on Class 1 admission', hi: 'कक्षा 1 में प्रवेश पर ₹4,000' },
      { en: '₹5,000 on Class 6 admission', hi: 'कक्षा 6 में प्रवेश पर ₹5,000' },
      { en: '₹11,000 on Class 10 admission', hi: 'कक्षा 10 में प्रवेश पर ₹11,000' },
      { en: '₹25,000 on Class 12 pass', hi: 'कक्षा 12 उत्तीर्ण पर ₹25,000' }
    ],
    documents: [
      { en: 'Jan Aadhaar card', hi: 'जन आधार कार्ड' },
      { en: 'Birth certificate (institutional delivery)', hi: 'जन्म प्रमाण पत्र (संस्थागत प्रसव)' },
      { en: 'School admission certificates', hi: 'विद्यालय प्रवेश प्रमाण पत्र' }
    ],
    applySteps: [
      { en: 'Register at nearest hospital at time of delivery', hi: 'प्रसव के समय नजदीकी अस्पताल में पंजीकरण' },
      { en: 'Subsequent instalments via rajssp.raj.nic.in', hi: 'बाद की किश्तें rajssp.raj.nic.in के माध्यम से' },
      { en: 'Each instalment requires uploading proof (school certificate, etc.)', hi: 'प्रत्येक किश्त के लिए प्रमाण अपलोड करें (विद्यालय प्रमाण पत्र, आदि)' }
    ],
    officialLink: 'https://rajssp.raj.nic.in'
  },
  {
    name: { en: 'Mukhyamantri Mahila Utkarsh Yojana', hi: 'मुख्यमंत्री महिला उत्कर्ष योजना' },
    level: 'STATE',
    state: 'Gujarat',
    category: 'Financial',
    icon: '💡',
    color: '#6366f1',
    description: {
      en: 'Interest-free loans up to ₹1 lakh to women SHGs (Self-Help Groups) in Gujarat for income-generating activities and entrepreneurship.',
      hi: 'आय-सृजन गतिविधियों और उद्यमिता के लिए गुजरात में महिला SHG (स्व-सहायता समूह) को ₹1 लाख तक के ब्याज-मुक्त ऋण।'
    },
    eligibility: {
      minAge: 18,
      maxAge: null,
      maxIncomeLPA: null,
      criteria: [
        { en: 'Gujarat domicile', hi: 'गुजरात की निवासी' },
        { en: 'Member of registered Women SHG', hi: 'पंजीकृत महिला SHG की सदस्य' },
        { en: 'SHG must have been active for 6+ months', hi: 'SHG 6+ महीने से सक्रिय होनी चाहिए' }
      ]
    },
    benefits: [
      { en: 'Up to ₹1 lakh interest-free loan per SHG member', hi: 'प्रति SHG सदस्य ₹1 लाख तक ब्याज-मुक्त ऋण' },
      { en: 'Government pays 100% interest subvention', hi: 'सरकार 100% ब्याज अनुदान वहन करती है' },
      { en: 'Support for livelihood and enterprise creation', hi: 'आजीविका और उद्यम निर्माण के लिए सहायता' }
    ],
    documents: [
      { en: 'Aadhaar card of members', hi: 'सदस्यों का आधार कार्ड' },
      { en: 'SHG bank passbook and registration certificate', hi: 'SHG बैंक पासबुक और पंजीकरण प्रमाण पत्र' },
      { en: 'Gujarat domicile proof', hi: 'गुजरात का निवास प्रमाण पत्र' }
    ],
    applySteps: [
      { en: 'Apply through Gujarat Livelihood Promotion Company (GLPC)', hi: 'गुजरात लाइवलीहुड प्रमोशन कंपनी (GLPC) के माध्यम से आवेदन करें' },
      { en: 'Submit SHG resolution and member KYC documents', hi: 'SHG प्रस्ताव और सदस्यों के KYC दस्तावेज जमा करें' },
      { en: 'Bank sanctions loan post verification', hi: 'सत्यापन के बाद बैंक ऋण स्वीकृत करता है' }
    ],
    officialLink: 'https://glpc.gujarat.gov.in'
  },
  {
    name: { en: 'Lek Ladki Yojana', hi: 'लेक लाड़की योजना' },
    level: 'STATE',
    state: 'Maharashtra',
    category: 'Financial',
    icon: '👧',
    color: '#f43f5e',
    description: {
      en: 'Maharashtra state scheme providing financial assistance of ₹1,01,000 in stages from birth to age 18 to girl children of yellow and orange ration card holder families.',
      hi: 'महाराष्ट्र राज्य योजना जो पीले और नारंगी राशन कार्ड धारक परिवारों की बालिकाओं को जन्म से 18 वर्ष की आयु तक विभिन्न चरणों में कुल ₹1,01,000 की वित्तीय सहायता प्रदान करती है।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 18,
      maxIncomeLPA: null,
      criteria: [
        { en: 'Resident of Maharashtra state', hi: 'महाराष्ट्र राज्य की निवासी' },
        { en: 'Yellow or orange ration card holder families', hi: 'पीला या नारंगी राशन कार्ड धारक परिवार' },
        { en: 'Girl child born on or after April 1, 2023', hi: '1 अप्रैल 2023 या उसके बाद जन्मी बालिका' }
      ]
    },
    benefits: [
      { en: '₹5,000 at birth', hi: 'जन्म के समय ₹5,000' },
      { en: '₹6,000 on admission to Class 1', hi: 'कक्षा 1 में प्रवेश पर ₹6,000' },
      { en: '₹7,000 on admission to Class 6', hi: 'कक्षा 6 में प्रवेश पर ₹7,000' },
      { en: '₹8,000 on admission to Class 11', hi: 'कक्षा 11 में प्रवेश पर ₹8,000' },
      { en: '₹75,000 upon reaching 18 years of age (unmarried)', hi: '18 वर्ष की आयु पूरी होने पर ₹75,000 (अविवाहित)' }
    ],
    documents: [
      { en: 'Birth certificate of girl child', hi: 'बालिका का जन्म प्रमाण पत्र' },
      { en: 'Aadhaar cards of parents and child', hi: 'माता-पिता और बच्चे का आधार कार्ड' },
      { en: 'Yellow or Orange Ration Card', hi: 'पीला या नारंगी राशन कार्ड' },
      { en: 'Maharashtra Domicile Certificate', hi: 'महाराष्ट्र निवास प्रमाण पत्र' },
      { en: 'Bank passbook copy', hi: 'बैंक पासबुक की प्रति' }
    ],
    applySteps: [
      { en: 'Visit nearest Anganwadi centre or Gram Panchayat', hi: 'नजदीकी आंगनवाड़ी केंद्र या ग्राम पंचायत जाएं' },
      { en: 'Submit application form along with ration card and birth certificate', hi: 'राशन कार्ड और जन्म प्रमाण पत्र के साथ आवेदन पत्र जमा करें' },
      { en: 'Verification by Child Development Project Officer (CDPO)', hi: 'बाल विकास परियोजना अधिकारी (CDPO) द्वारा सत्यापन' },
      { en: 'Funds deposited directly into bank account via DBT', hi: 'DBT के माध्यम से धनराशि सीधे बैंक खाते में जमा' }
    ],
    officialLink: 'https://womenchild.maharashtra.gov.in'
  },
  {
    name: { en: 'Mukhyamantri Kanya Utthan Yojana', hi: 'मुख्यमंत्री कन्या उत्थान योजना' },
    level: 'STATE',
    state: 'Bihar',
    category: 'Education',
    icon: '👩‍🎓',
    color: '#06b6d4',
    description: {
      en: 'Bihar government initiative providing up to ₹54,100 to girl children from birth until graduation to prevent child marriage and promote women\'s higher education.',
      hi: 'बाल विवाह रोकने और महिलाओं की उच्च शिक्षा को बढ़ावा देने के लिए जन्म से स्नातक तक बालिकाओं को ₹54,100 तक की वित्तीय सहायता प्रदान करने वाली बिहार सरकार की पहल।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 25,
      maxIncomeLPA: null,
      criteria: [
        { en: 'Permanent resident of Bihar', hi: 'बिहार की स्थायी निवासी' },
        { en: 'Girl child from any family (up to 2 girls per family for birth benefit)', hi: 'किसी भी परिवार की बालिका (जन्म लाभ हेतु प्रति परिवार अधिकतम 2 लड़कियाँ)' },
        { en: 'Unmarried at Intermediate graduation; all girls for Degree graduation', hi: 'इंटरमीडिएट पर अविवाहित; स्नातक उत्तीर्ण सभी छात्राएं पात्र' }
      ]
    },
    benefits: [
      { en: '₹2,000 at birth and ₹1,000 on completing 1 year with Aadhaar registration', hi: 'जन्म पर ₹2,000 और आधार पंजीकरण के साथ 1 वर्ष पूर्ण होने पर ₹1,000' },
      { en: '₹2,000 on completing full vaccination within 2 years', hi: '2 वर्ष में पूर्ण टीकाकरण पर ₹2,000' },
      { en: 'Annual sanitary napkin and uniform assistance from Class 1 to 12', hi: 'कक्षा 1 से 12 तक वार्षिक सेनेटरी नैपकिन और पोशाक सहायता' },
      { en: '₹25,000 on passing Intermediate (Class 12 - unmarried)', hi: 'इंटरमीडिएट (12वीं) उत्तीर्ण होने पर ₹25,000 (अविवाहित)' },
      { en: '₹50,000 on passing Graduation degree', hi: 'स्नातक उत्तीर्ण होने पर ₹50,000' }
    ],
    documents: [
      { en: 'Aadhaar card of student', hi: 'छात्रा का आधार कार्ड' },
      { en: 'Bihar resident certificate', hi: 'बिहार निवास प्रमाण पत्र' },
      { en: 'Graduation/Intermediate marksheet and admit card', hi: 'स्नातक/इंटरमीडिएट अंकतालिका और प्रवेश पत्र' },
      { en: 'Bank passbook (in student\'s name linked to Aadhaar)', hi: 'बैंक पासबुक (छात्रा के नाम पर आधार से जुड़ी)' }
    ],
    applySteps: [
      { en: 'Visit Medhasoft Bihar portal (medhasoft.bih.nic.in)', hi: 'मेधासॉफ्ट बिहार पोर्टल (medhasoft.bih.nic.in) पर जाएं' },
      { en: 'Register with Aadhaar number and college registration details', hi: 'आधार नंबर और कॉलेज पंजीकरण विवरण के साथ पंजीकरण करें' },
      { en: 'Upload marksheet, bank details, and photo', hi: 'अंकतालिका, बैंक विवरण और फोटो अपलोड करें' },
      { en: 'Direct benefit transfer after university and department verification', hi: 'विश्वविद्यालय और विभाग के सत्यापन के बाद सीधा बैंक हस्तांतरण' }
    ],
    officialLink: 'https://medhasoft.bih.nic.in'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED EXECUTION
// ─────────────────────────────────────────────────────────────────────────────
async function seedData() {
  try {
    console.log('🌱 Starting SakhiShakti database seeding...');
    await connectDB();

    if (isUsingFallback()) {
      console.log('📁 Seeding into JSON fallback store...');

      // Seed Users with hashed passwords
      const usersToInsert = [];
      for (const u of DEMO_USERS) {
        const hashedPassword = await bcrypt.hash(u.password, 12);
        usersToInsert.push({
          _id: uuidv4(),
          name: u.name,
          email: u.email.toLowerCase(),
          password: hashedPassword,
          role: u.role,
          state: u.state,
          language: u.language,
          isOnline: false,
          socketId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      jsonStore.set('users', usersToInsert);
      console.log(`✅ Seeded ${usersToInsert.length} demo users`);

      // Seed Health Cards
      const healthCardsToInsert = HEALTH_CARDS.map(card => ({
        _id: uuidv4(),
        ...card,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      jsonStore.set('healthCards', healthCardsToInsert);
      console.log(`✅ Seeded ${healthCardsToInsert.length} health cards`);

      // Seed Schemes
      const schemesToInsert = SCHEMES.map(scheme => ({
        _id: uuidv4(),
        ...scheme,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      jsonStore.set('schemes', schemesToInsert);
      console.log(`✅ Seeded ${schemesToInsert.length} government schemes`);

    } else {
      console.log('🍃 Seeding into MongoDB...');

      // Seed Users
      if (User) {
        await User.deleteMany({});
        for (const u of DEMO_USERS) {
          await User.create(u);
        }
        console.log(`✅ Seeded ${DEMO_USERS.length} demo users`);
      }

      // Seed Health Cards
      if (HealthCard) {
        await HealthCard.deleteMany({});
        await HealthCard.insertMany(HEALTH_CARDS);
        console.log(`✅ Seeded ${HEALTH_CARDS.length} health cards`);
      }

      // Seed Schemes
      if (Scheme) {
        await Scheme.deleteMany({});
        await Scheme.insertMany(SCHEMES);
        console.log(`✅ Seeded ${SCHEMES.length} government schemes`);
      }
    }

    console.log('✨ Database seeding completed successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedData();
}

module.exports = { seedData, DEMO_USERS, HEALTH_CARDS, SCHEMES };
