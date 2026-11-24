import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';
import { useSpeech } from '../hooks/useSpeech';
import {
  Heart,
  Calendar,
  Activity,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  User,
  UserCheck,
  Stethoscope,
  RefreshCw,
  Clock,
  Info,
  Shield,
  Check,
  FileText,
  ArrowRight,
  X,
  ExternalLink,
  Search,
  MessageSquare,
  Play,
  Square,
  HelpCircle,
  Award,
  AlertCircle
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Fallback Health Cards Data (Structured per schema in backend/src/models/HealthCard.js)
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_HEALTH_CARDS = [
  {
    _id: 'hc-1',
    ageGroup: '0-12',
    icon: '👧',
    color: '#EC4899', // rose/pink
    title: {
      en: 'Childhood Nutrition & Anemia Prevention',
      hi: 'बाल्यावस्था पोषण एवं रक्ताल्पता (एनीमिया) रोकथाम'
    },
    symptoms: [
      { en: 'Fatigue, pale skin and brittle nails', hi: 'जल्दी थकान, पीली त्वचा और कमजोर नाखून' },
      { en: 'Poor appetite and slow weight gain', hi: 'भूख कम लगना और वजन न बढ़ना' },
      { en: 'Frequent colds and mild infections', hi: 'बार-बार सर्दी और हल्का बुखार होना' }
    ],
    prevention: [
      { en: 'Iron-rich diet (spinach, jaggery, lentils, seasonal fruits)', hi: 'आयरन युक्त आहार (पालक, गुड़, दालें, मौसमी फल)' },
      { en: 'Timely vaccination as per National Immunization Schedule', hi: 'राष्ट्रीय टीकाकरण समयसारिणी के अनुसार समय पर टीके लगवाना' },
      { en: 'Clean boiled drinking water and handwashing before meals', hi: 'स्वच्छ उबला पानी और भोजन से पहले हाथ धोना' }
    ],
    homeRemedies: [
      { en: 'Daily spoonful of jaggery with roasted grams (Chana-Gud)', hi: 'भुने चने के साथ थोड़ा गुड़ प्रतिदिन देना' },
      { en: 'Fresh amla or lemon water for Vitamin C absorption', hi: 'आयरन अवशोषण हेतु आंवला या हल्का नींबू पानी' },
      { en: 'Moringa (Sahjan) leaf soup once a week', hi: 'सहजन (मोरिंगा) की पत्तियों का सूप या दाल में उपयोग' }
    ],
    redFlags: [
      { en: 'Extreme pallor, breathless while playing', hi: 'अत्यधिक पीलापन, खेलने में सांस फूलना' },
      { en: 'Persistent high fever for over 3 days', hi: '3 दिन से अधिक लगातार तेज बुखार' },
      { en: 'Swelling on feet or swollen abdomen', hi: 'पैरों या पेट में असामान्य सूजन' }
    ]
  },
  {
    _id: 'hc-2',
    ageGroup: '13-19',
    icon: '🌸',
    color: '#8B5CF6', // purple
    title: {
      en: 'Menstrual Hygiene & Puberty Awareness',
      hi: 'माहवारी स्वच्छता एवं किशोरावस्था स्वास्थ्य'
    },
    symptoms: [
      { en: 'Painful cramps and lower back pain during periods', hi: 'माहवारी के दौरान पेट के निचले हिस्से और कमर में दर्द' },
      { en: 'Mood swings, irritability, and skin breakouts', hi: 'चिड़चिड़ापन, तनाव और चेहरे पर मुंहासे' },
      { en: 'Mild irregular cycle during initial years', hi: 'शुरुआती 1-2 वर्षों में चक्र का थोड़ा अनियमित होना' }
    ],
    prevention: [
      { en: 'Change sanitary pads every 4 to 6 hours', hi: 'सैनिटरी पैड को हर 4 से 6 घंटे में अवश्य बदलें' },
      { en: 'Use clean breathable cotton undergarments', hi: 'साफ, सूखे सूती अंतर्वस्त्रों का उपयोग करें' },
      { en: 'Never use dirty cloths or damp rags', hi: 'गंदे कपड़े या गीले पैड का उपयोग कतई न करें' }
    ],
    homeRemedies: [
      { en: 'Warm water bottle / heating pad on lower abdomen', hi: 'पेट के निचले हिस्से पर गर्म पानी की सिकाई' },
      { en: 'Warm carom seed (Ajwain) water with a pinch of rock salt', hi: 'अजवाइन का गुनगुना पानी और हल्का सेंधा नमक' },
      { en: 'Gentle stretching and walking during menses', hi: 'हल्का टहलना और आसान योगासन (बालासन)' }
    ],
    redFlags: [
      { en: 'Bleeding so heavy that pad soaks within 1-2 hours', hi: 'इतना भारी रक्तस्राव कि 1-2 घंटे में पैड भीग जाए' },
      { en: 'Severe abdominal pain causing fainting or vomiting', hi: 'अत्यधिक दर्द जिसके कारण उल्टी या चक्कर आएं' },
      { en: 'Foul-smelling vaginal discharge or severe burning itching', hi: 'दुर्गंधयुक्त स्राव या अत्यधिक खुजली व जलन' }
    ]
  },
  {
    _id: 'hc-3',
    ageGroup: '20-35',
    icon: '🌺',
    color: '#F43F5E', // rose
    title: {
      en: 'Reproductive Health, PCOS & Safe Pregnancy',
      hi: 'प्रजनन स्वास्थ्य, पीसीओएस एवं सुरक्षित मातृत्व'
    },
    symptoms: [
      { en: 'Delayed periods, facial hair growth, sudden weight gain', hi: 'माहवारी में देरी, चेहरे पर बाल उगना, अचानक वजन बढ़ना' },
      { en: 'Morning nausea, extreme tiredness in early conception', hi: 'गर्भावस्था के शुरुआती दिनों में सुबह जी मिचलाना, भारी थकान' },
      { en: 'White discharge causing burning sensation', hi: 'सफेद पानी गिरना जिससे जलन या खुजली हो' }
    ],
    prevention: [
      { en: 'Regular 30-min brisk walk or yoga daily', hi: 'प्रतिदिन 30 मिनट तेज पैदल चलना या योगाभ्यास' },
      { en: 'Minimum 4 antenatal checkups (ANC) during pregnancy', hi: 'गर्भावस्था में कम से कम 4 बार एएनसी स्वास्थ्य जांच' },
      { en: 'Daily Folic Acid and Iron supplement as prescribed', hi: 'डॉक्टर द्वारा निर्देशित फोलिक एसिड और आयरन की गोली' }
    ],
    homeRemedies: [
      { en: 'Soaked fenugreek (Methi) seeds water empty stomach', hi: 'सुबह खाली पेट मेथी दाने का भिगोया पानी' },
      { en: 'Fresh buttermilk with roasted cumin powder after lunch', hi: 'दोपहर भोजन के बाद भुने जीरे वाला ताजा छाछ' },
      { en: 'Ginger tea with honey for morning sickness', hi: 'हल्की अदरक की चाय मॉर्निंग सिकनेस कम करने हेतु' }
    ],
    redFlags: [
      { en: 'Any vaginal bleeding during pregnancy', hi: 'गर्भावस्था के दौरान किसी भी प्रकार का रक्तस्राव' },
      { en: 'Severe headache, blurred vision, sudden facial swelling', hi: 'तेज सिरदर्द, धुंधला दिखना या चेहरे पर अचानक सूजन' },
      { en: 'Continuous absence of period for over 3 months without pregnancy', hi: 'बिना गर्भावस्था 3 महीने से अधिक माहवारी न आना' }
    ]
  },
  {
    _id: 'hc-4',
    ageGroup: '36-50',
    icon: '🌾',
    color: '#D97706', // amber
    title: {
      en: 'Perimenopause, Thyroid & Bone Density',
      hi: 'पेरीमेनोपॉज, थायरॉयड एवं हड्डियों का स्वास्थ्य'
    },
    symptoms: [
      { en: 'Sudden feeling of heat and sweating (Hot flashes)', hi: 'अचानक बहुत गर्मी लगना और पसीना आना (हॉट फ्लैशेस)' },
      { en: 'Persistent joint pain, lower back stiffness', hi: 'जोड़ों में लगातार दर्द और कमर में जकड़न' },
      { en: 'Irregular spotting, insomnia and anxiety', hi: 'अनियमित माहवारी, अनिद्रा और घबराहट होना' }
    ],
    prevention: [
      { en: 'Calcium and Vitamin D rich diet (curd, sesame, ragi)', hi: 'कैल्शियम व विटामिन-डी युक्त आहार (दही, सफेद तिल, रागी)' },
      { en: '15-20 minutes of morning sunlight exposure', hi: 'सुबह की धूप में 15-20 मिनट बैठना' },
      { en: 'Annual screening for cervical cancer (Pap smear) & breast check', hi: 'वार्षिक स्तन स्व-जांच और गर्भाशय ग्रीवा जांच' }
    ],
    homeRemedies: [
      { en: 'Warm milk with pinch of turmeric and nutmeg before bedtime', hi: 'रात को सोते समय चुटकीभर हल्दी व जायफल वाला गुनगुना दूध' },
      { en: 'White sesame seeds (Til) laddoo with jaggery in winters', hi: 'सफेद तिल और गुड़ का लड्डू हड्डियों की मजबूती हेतु' },
      { en: 'Pranayama (Anulom-Vilom, Bhramari) for hormonal balance', hi: 'हार्मोनल संतुलन के लिए अनुलोम-विलोम व भ्रामरी प्राणायाम' }
    ],
    redFlags: [
      { en: 'Heavy continuous bleeding after months of stoppage', hi: 'कई महीनों बाद अचानक बहुत अधिक रक्तस्राव होना' },
      { en: 'Lump or hardening in breast or armpit', hi: 'स्तन या बगल में कोई गांठ या कड़ापन महसूस होना' },
      { en: 'Severe bone pain causing inability to walk', hi: 'हड्डियों में असहनीय दर्द जिससे चलने में कठिनाई हो' }
    ]
  },
  {
    _id: 'hc-5',
    ageGroup: '50+',
    icon: '👵',
    color: '#059669', // emerald
    title: {
      en: 'Senior Health, Osteoporosis & Heart Care',
      hi: 'वरिष्ठ महिला स्वास्थ्य, ऑस्टियोपोरोसिस व हृदय देखभाल'
    },
    symptoms: [
      { en: 'Frequent fractures from minor slips, curved posture', hi: 'मामूली गिरने पर हड्डी टूटना, रीढ़ का झुकना' },
      { en: 'High blood pressure, chest heaviness, breathlessness', hi: 'उच्च रक्तचाप, सीने में भारीपन, जल्दी सांस फूलना' },
      { en: 'Frequent urination, burning while passing urine', hi: 'बार-बार पेशाब आना या पेशाब में जलन होना' }
    ],
    prevention: [
      { en: 'Low-sodium diet; reduce table salt and fried papad/pickles', hi: 'कम नमक वाला आहार; अचार और तले पापड़ से परहेज' },
      { en: 'Regular BP and blood sugar checks every month', hi: 'हर माह रक्तचाप (बीपी) और शुगर की नियमित जांच' },
      { en: 'Anti-skid slippers and non-slippery bathroom flooring', hi: 'फिसलन-रोधी चप्पलें और बाथरूम में पकड़ने हेतु हैंडल' }
    ],
    homeRemedies: [
      { en: 'Methi dana powder with warm water for blood sugar', hi: 'शुगर नियंत्रण हेतु मेथी दाना चूर्ण गुनगुने पानी के साथ' },
      { en: 'Garlic clove cooked in mustard oil for joint massage', hi: 'लहसुन पकाए सरसों के तेल से जोड़ों की हल्की मालिश' },
      { en: 'Tulsi and ginger warm decoction (kadha) for immunity', hi: 'रोग प्रतिरोधक क्षमता हेतु तुलसी-अदरक का हल्का काढ़ा' }
    ],
    redFlags: [
      { en: 'Chest pain radiating to left shoulder or jaw', hi: 'सीने में दर्द जो बाएं कंधे या जबड़े तक फैले (हार्ट अटैक संकेत)' },
      { en: 'Sudden weakness in one arm, slurred speech', hi: 'अचानक एक तरफ कमजोरी आना या बोलने में लड़खड़ाहट' },
      { en: 'Post-menopausal vaginal bleeding (even a single drop)', hi: 'मेनोपॉज के बाद एक बूंद भी रक्तस्राव होना (अति गंभीर)' }
    ]
  }
];

export default function HealthHubTab() {
  // ─── Global Contexts with Safe Fallback ───────────────────────────────────
  let appCtx = { language: 'hi', t: (k, fb) => fb || k };
  try {
    appCtx = useApp();
  } catch (err) {}
  const { language = 'hi', t } = appCtx || {};

  let socketCtx = { socket: null, isConnected: false };
  try {
    socketCtx = useSocket();
  } catch (err) {}
  const { socket, isConnected } = socketCtx || {};

  let speechHook = { speak: () => {}, stop: () => {}, isSpeaking: false, isSupported: false };
  try {
    speechHook = useSpeech();
  } catch (err) {}
  const { speak, stop, isSpeaking, isSupported } = speechHook || {};

  // ─── Sub-Tab Navigation State ───────────────────────────────────────────
  // 'cards' | 'period' | 'pcos' | 'doctor'
  const [activeSubTab, setActiveSubTab] = useState('cards');

  // ─────────────────────────────────────────────────────────────────────────
  // SUB-TAB 1: HEALTH CARDS STATE
  // ─────────────────────────────────────────────────────────────────────────
  const [healthCards, setHealthCards] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [cardsLoading, setCardsLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [currentlySpeakingCardId, setCurrentlySpeakingCardId] = useState(null);

  const ageGroups = [
    { id: 'all', en: 'All Ages', hi: 'सभी उम्र' },
    { id: '0-12', en: '0-12 Years (Childhood)', hi: '0-12 वर्ष (बचपन)' },
    { id: '13-19', en: '13-19 Years (Adolescence)', hi: '13-19 वर्ष (किशोरावस्था)' },
    { id: '20-35', en: '20-35 Years (Reproductive)', hi: '20-35 वर्ष (प्रजनन उम्र)' },
    { id: '36-50', en: '36-50 Years (Midlife)', hi: '36-50 वर्ष (प्रौढ़ावस्था)' },
    { id: '50+', en: '50+ Years (Senior)', hi: '50+ वर्ष (वरिष्ठ)' }
  ];

  // Fetch Health Cards on Mount
  useEffect(() => {
    let isMounted = true;
    async function fetchCards() {
      setCardsLoading(true);
      try {
        const query = selectedAgeGroup !== 'all' ? `?ageGroup=${selectedAgeGroup}` : '';
        const res = await fetch(`/api/health-cards${query}`);
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setHealthCards(data);
          } else {
            // Apply fallback filtered by age group
            const filtered = selectedAgeGroup === 'all'
              ? FALLBACK_HEALTH_CARDS
              : FALLBACK_HEALTH_CARDS.filter(c => c.ageGroup === selectedAgeGroup);
            setHealthCards(filtered);
          }
        }
      } catch (err) {
        if (isMounted) {
          const filtered = selectedAgeGroup === 'all'
            ? FALLBACK_HEALTH_CARDS
            : FALLBACK_HEALTH_CARDS.filter(c => c.ageGroup === selectedAgeGroup);
          setHealthCards(filtered);
        }
      } finally {
        if (isMounted) setCardsLoading(false);
      }
    }

    fetchCards();
    return () => {
      isMounted = false;
    };
  }, [selectedAgeGroup]);

  // Handle Speech for a Card in Hindi
  const handleListenCard = (card, e) => {
    e.stopPropagation();

    // If currently speaking this card, stop it
    if (currentlySpeakingCardId === card._id && isSpeaking) {
      stop();
      setCurrentlySpeakingCardId(null);
      return;
    }

    // Build Hindi text payload
    const title = card.title?.hi || card.title?.en || 'स्वास्थ्य कार्ड';
    const symptoms = (card.symptoms || [])
      .map(s => (typeof s === 'string' ? s : s.hi || s.en))
      .join(', ');
    const prevention = (card.prevention || [])
      .map(p => (typeof p === 'string' ? p : p.hi || p.en))
      .join(', ');
    const remedies = (card.homeRemedies || [])
      .map(r => (typeof r === 'string' ? r : r.hi || r.en))
      .join(', ');
    const redFlags = (card.redFlags || [])
      .map(rf => (typeof rf === 'string' ? rf : rf.hi || rf.en))
      .join(', ');

    const speechText = `${title}। मुख्य लक्षण: ${symptoms}। रोकथाम और बचाव: ${prevention}। घरेलू उपाय: ${remedies}। चेतावनी संकेत: ${redFlags}`;

    setCurrentlySpeakingCardId(card._id);
    speak(speechText, 'hi-IN');
  };

  // Reset speaking card tracking if speech finishes
  useEffect(() => {
    if (!isSpeaking) {
      setCurrentlySpeakingCardId(null);
    }
  }, [isSpeaking]);

  // ─────────────────────────────────────────────────────────────────────────
  // SUB-TAB 2: PERIOD TRACKER STATE
  // ─────────────────────────────────────────────────────────────────────────
  // Default last period date: 14 days ago
  const defaultDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split('T')[0];
  }, []);

  const [periodForm, setPeriodForm] = useState({
    last_period_date: defaultDateStr,
    cycle_number: 3,
    length_of_menses: 5,
    mean_cycle_length: 28,
    age: 24
  });

  const [periodLoading, setPeriodLoading] = useState(false);
  const [periodResult, setPeriodResult] = useState(null);
  const [periodError, setPeriodError] = useState(null);
  const [periodHistory, setPeriodHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('sakhi_period_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handlePeriodPredict = async (e) => {
    e.preventDefault();
    setPeriodLoading(true);
    setPeriodError(null);

    const payload = {
      last_period_date: periodForm.last_period_date,
      cycle_number: parseInt(periodForm.cycle_number, 10) || 1,
      length_of_menses: parseFloat(periodForm.length_of_menses) || 5,
      mean_cycle_length: periodForm.mean_cycle_length ? parseFloat(periodForm.mean_cycle_length) : 28,
      age: parseFloat(periodForm.age) || 24
    };

    try {
      // Attempt fast fetch to ML Service
      const res = await fetch('http://localhost:8000/predict-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('ML Service request failed');
      const data = await res.json();
      savePeriodResult(data);
    } catch (err) {
      // Robust mathematical local fallback matching clinical formula in ml-service/main.py
      const lastDate = new Date(payload.last_period_date);
      const cycleLen = Math.round(payload.mean_cycle_length || 28);
      const lutealDays = 14;
      const ovulationDays = Math.max(10, Math.min(cycleLen - lutealDays, cycleLen - 10));

      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + cycleLen);

      const ovDate = new Date(lastDate);
      ovDate.setDate(ovDate.getDate() + ovulationDays);

      const fertileStart = new Date(ovDate);
      fertileStart.setDate(fertileStart.getDate() - 5);

      const fertileEnd = new Date(ovDate);
      fertileEnd.setDate(fertileEnd.getDate() + 1);

      const isIrregular = cycleLen < 24 || cycleLen > 35;

      const fallbackData = {
        predicted_cycle_length: cycleLen,
        next_period_date: nextDate.toISOString().split('T')[0],
        ovulation_date: ovDate.toISOString().split('T')[0],
        fertile_window_start: fertileStart.toISOString().split('T')[0],
        fertile_window_end: fertileEnd.toISOString().split('T')[0],
        luteal_phase_days: lutealDays,
        irregularity_alert: isIrregular,
        alert_message_en: isIrregular
          ? `Your predicted cycle length (${cycleLen} days) is outside the typical 24–35 day range. Consider consulting a gynaecologist.`
          : 'Your cycle appears within normal healthy range.',
        alert_message_hi: isIrregular
          ? `आपकी अनुमानित चक्र अवधि (${cycleLen} दिन) सामान्य 24-35 दिन की सीमा से बाहर है। कृपया स्त्री रोग विशेषज्ञ से परामर्श लें।`
          : 'आपका चक्र सामान्य और स्वस्थ सीमा के भीतर प्रतीत होता है।'
      };

      savePeriodResult(fallbackData);
    } finally {
      setPeriodLoading(false);
    }
  };

  const savePeriodResult = (resultData) => {
    setPeriodResult(resultData);
    // Update history (keep last 3)
    const newEntry = {
      ...resultData,
      calculatedAt: new Date().toISOString(),
      inputDate: periodForm.last_period_date
    };
    const updated = [newEntry, ...periodHistory.filter(h => h.next_period_date !== resultData.next_period_date)].slice(0, 3);
    setPeriodHistory(updated);
    try {
      localStorage.setItem('sakhi_period_history', JSON.stringify(updated));
    } catch {}
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SUB-TAB 3: PCOS SCREENER STATE
  // ─────────────────────────────────────────────────────────────────────────
  const [pcosForm, setPcosForm] = useState({
    age: 24,
    weight_kg: 60,
    height_cm: 158,
    cycle_irregular: 0,
    weight_gain: 0,
    hair_growth: 0,
    skin_darkening: 0,
    pimples: 0,
    fast_food: 0
  });

  const [pcosLoading, setPcosLoading] = useState(false);
  const [pcosResult, setPcosResult] = useState(null);
  const [pcosError, setPcosError] = useState(null);

  const handlePcosSubmit = async (e) => {
    e.preventDefault();
    setPcosLoading(true);
    setPcosError(null);

    const payload = {
      age: parseFloat(pcosForm.age) || 24,
      weight_kg: parseFloat(pcosForm.weight_kg) || 60,
      height_cm: parseFloat(pcosForm.height_cm) || 158,
      cycle_irregular: pcosForm.cycle_irregular ? 1 : 0,
      cycle_length_days: 28,
      weight_gain: pcosForm.weight_gain ? 1 : 0,
      hair_growth: pcosForm.hair_growth ? 1 : 0,
      skin_darkening: pcosForm.skin_darkening ? 1 : 0,
      pimples: pcosForm.pimples ? 1 : 0,
      fast_food: pcosForm.fast_food ? 1 : 0
    };

    try {
      const res = await fetch('http://localhost:8000/predict-pcos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('PCOS ML API request failed');
      const data = await res.json();
      setPcosResult(data);
    } catch (err) {
      // Local rule-based calculation matching ml-service/main.py
      const heightM = payload.height_cm / 100;
      const rawBmi = payload.weight_kg / (heightM * heightM);
      const bmi = Math.round(rawBmi * 10) / 10;

      let bmiCat = 'Normal';
      if (bmi < 18.5) bmiCat = 'Underweight';
      else if (bmi < 25) bmiCat = 'Normal';
      else if (bmi < 30) bmiCat = 'Overweight';
      else bmiCat = 'Obese';

      let score = 0.0;
      if (payload.cycle_irregular) score += 0.25;
      if (payload.weight_gain) score += 0.20;
      if (payload.hair_growth) score += 0.20;
      if (payload.skin_darkening) score += 0.15;
      if (payload.pimples) score += 0.10;
      if (bmi > 27) score += 0.10;

      let level = 'LOW';
      if (score >= 0.65) level = 'HIGH';
      else if (score >= 0.35) level = 'MODERATE';

      const GUIDANCE = {
        LOW: {
          en: 'Your PCOS risk appears LOW. Maintain a balanced diet rich in whole grains, green vegetables, and lentils. Regular exercise (30 min/day) is beneficial.',
          hi: 'आपका PCOS जोखिम कम प्रतीत होता है। साबुत अनाज, हरी सब्जियों और दालों से भरपूर संतुलित आहार लें। रोजाना 30 मिनट टहलना या योग लाभकारी है।'
        },
        MODERATE: {
          en: 'Your PCOS risk is MODERATE. We recommend consulting a gynaecologist for a formal ultrasound and hormone evaluation. Lifestyle adjustments can significantly help.',
          hi: 'आपका PCOS जोखिम मध्यम है। कृपया किसी महिला चिकित्सक से परामर्श करें। खानपान में चीनी कम करें, नियमित व्यायाम और तनाव प्रबंधन अपनाएं।'
        },
        HIGH: {
          en: 'Your PCOS risk appears HIGH. Please consult a gynaecologist or endocrinologist at the earliest. PCOS is fully manageable with medical guidance and lifestyle care.',
          hi: 'आपका PCOS जोखिम अधिक है। कृपया जल्द से जल्द किसी स्त्री रोग विशेषज्ञ से मिलें। उचित चिकित्सा और जीवनशैली में बदलाव से PCOS नियंत्रित किया जा सकता है।'
        }
      };

      const fallbackPcos = {
        bmi,
        bmi_category: bmiCat,
        risk_score: Math.round(score * 100),
        risk_level: level,
        guidance_en: GUIDANCE[level].en,
        guidance_hi: GUIDANCE[level].hi,
        disclaimer_en: 'This AI screening tool is for informational purposes only and is NOT a medical diagnosis. Always consult a qualified healthcare professional before making health decisions.',
        disclaimer_hi: 'यह AI स्क्रीनिंग उपकरण केवल सूचना के उद्देश्य से है और यह चिकित्सीय निदान नहीं है। स्वास्थ्य संबंधी निर्णय लेने से पहले हमेशा किसी योग्य चिकित्सक से परामर्श करें।'
      };

      setPcosResult(fallbackPcos);
    } finally {
      setPcosLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SUB-TAB 4: DOCTOR CONNECT STATE
  // ─────────────────────────────────────────────────────────────────────────
  const [doctorOnlineCount, setDoctorOnlineCount] = useState(3);
  const [userRole, setUserRole] = useState(null); // 'patient' | 'doctor'
  const [connectStatus, setConnectStatus] = useState('idle'); // 'idle' | 'waiting' | 'matched'
  const [activeRoom, setActiveRoom] = useState(null); // { roomId, doctorName, userName }
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const chatScrollRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Socket event listeners for real matchmaking
  useEffect(() => {
    if (!socket || isDemoMode) return;

    const handleMatchedRoom = (data) => {
      setActiveRoom(data);
      setConnectStatus('matched');
      setChatMessages([
        {
          sender: 'system',
          message: language === 'hi'
            ? 'परामर्श कक्ष में आपका स्वागत है। डॉक्टर एवं मरीज सुरक्षित रूप से जुड़ चुके हैं।'
            : 'Welcome to private consultation. Doctor & Patient connected securely.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    };

    const handleChatMessage = (data) => {
      setChatMessages(prev => [...prev, data]);
    };

    const handlePeerLeft = () => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'system',
          message: language === 'hi' ? 'साथी उपयोगकर्ता डिस्कनेक्ट हो गया।' : 'The other participant has left the consultation.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    };

    socket.on('matched-room', handleMatchedRoom);
    socket.on('chat-message', handleChatMessage);
    socket.on('peer-left', handlePeerLeft);

    return () => {
      socket.off('matched-room', handleMatchedRoom);
      socket.off('chat-message', handleChatMessage);
      socket.off('peer-left', handlePeerLeft);
    };
  }, [socket, isDemoMode, language]);

  // Join as Patient
  const handleJoinAsPatient = () => {
    setUserRole('patient');
    setConnectStatus('waiting');

    if (isDemoMode || !socket) {
      // Simulate matchmaking after 2 seconds
      setTimeout(() => {
        const fakeRoom = {
          roomId: `room_${Date.now()}`,
          doctorName: 'Dr. Anita Sharma (MBBS, DGO)',
          userName: 'Sakhi Patient'
        };
        setActiveRoom(fakeRoom);
        setConnectStatus('matched');
        setChatMessages([
          {
            sender: 'system',
            message: language === 'hi'
              ? 'डेमो मोड: आप डॉ. अनिता शर्मा (स्त्री रोग विशेषज्ञ) से जुड़ चुके हैं।'
              : 'Demo Mode: You are now connected with Dr. Anita Sharma (Gynaecologist).',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          {
            sender: 'Dr. Anita Sharma',
            message: language === 'hi'
              ? 'नमस्ते! मैं डॉ. अनिता हूँ। आप अपनी स्वास्थ्य समस्या या लक्षण बेझिझक साझा कर सकती हैं।'
              : 'Namaste! I am Dr. Anita. Please feel free to share your symptoms or concerns.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 1800);
      return;
    }

    socket.emit('join-doctor-queue', {
      name: 'Sakhi User',
      role: 'patient',
      requestedAt: new Date().toISOString()
    });
  };

  // Join as Doctor
  const handleJoinAsDoctor = () => {
    setUserRole('doctor');
    setConnectStatus('waiting');

    if (isDemoMode || !socket) {
      setTimeout(() => {
        const fakeRoom = {
          roomId: `room_${Date.now()}`,
          doctorName: 'Dr. You (Volunteer Doctor)',
          userName: 'Sunita Devi (Rural Patient)'
        };
        setActiveRoom(fakeRoom);
        setConnectStatus('matched');
        setChatMessages([
          {
            sender: 'system',
            message: language === 'hi'
              ? 'डेमो मोड: मरीज सुनीता देवी परामर्श कक्ष में आ चुकी हैं।'
              : 'Demo Mode: Patient Sunita Devi has entered your consultation room.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          {
            sender: 'Sunita Devi',
            message: language === 'hi'
              ? 'डॉक्टर साहिबा प्रणाम! मुझे पिछले दो महीने से कमजोरी और पेट के निचले हिस्से में दर्द की शिकायत है।'
              : 'Doctor saheba, I have been having severe weakness and lower abdomen pain for 2 months.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 1800);
      return;
    }

    socket.emit('doctor-available', {
      name: 'Dr. Sakhi Specialist',
      role: 'doctor',
      availableAt: new Date().toISOString()
    });
  };

  // Send Chat Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const mySenderName = userRole === 'doctor' ? 'Doctor' : 'You';
    const msgObj = {
      message: messageText.trim(),
      sender: mySenderName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (isDemoMode || !socket) {
      setChatMessages(prev => [...prev, msgObj]);
      setMessageText('');

      // Auto response in demo mode after 1.5 seconds
      if (userRole === 'patient') {
        setTimeout(() => {
          setChatMessages(prev => [
            ...prev,
            {
              sender: 'Dr. Anita Sharma',
              message: language === 'hi'
                ? 'मैं आपके लक्षण समझ पा रही हूँ। कृपया खूब पानी पिएं और नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) से मुफ्त आयरन की गोलियां अवश्य लें।'
                : 'I understand your symptoms. Please drink adequate fluids and collect free iron supplements from your nearest PHC center.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }, 1500);
      }
      return;
    }

    if (activeRoom?.roomId) {
      socket.emit('chat-message', {
        roomId: activeRoom.roomId,
        message: messageText.trim(),
        sender: mySenderName
      });
    }
    setMessageText('');
  };

  // Disconnect Consultation
  const handleDisconnectConsultation = () => {
    if (socket && activeRoom?.roomId) {
      socket.emit('leave-room', { roomId: activeRoom.roomId });
    }
    setActiveRoom(null);
    setConnectStatus('idle');
    setUserRole(null);
    setChatMessages([]);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* ─── Header & Title ───────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-rose-100 dark:border-gray-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 fill-current" />
            <span>{language === 'hi' ? 'महिला स्वास्थ्य केंद्र' : "Women's Health Hub"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'सखी शक्ति संपूर्ण स्वास्थ्य केंद्र' : 'SakhiShakti Comprehensive Health Hub'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'माहवारी चक्र ट्रैकर, एआई पीसीओएस जांच, स्वास्थ्य परामर्श कार्ड और विशेषज्ञ डॉक्टरों से सीधा वीडियो संपर्क।'
              : 'Cycle prediction, AI PCOS risk screener, lifecycle health guide cards, and instant doctor telemedicine.'}
          </p>
        </div>

        {/* Global TTS Status Badge */}
        {isSpeaking && (
          <div className="flex items-center gap-2.5 px-4 py-2 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/50 rounded-xl animate-pulse">
            <Volume2 className="w-5 h-5 text-rose-600 dark:text-rose-400 animate-bounce" />
            <span className="text-xs font-medium text-rose-900 dark:text-rose-200">
              {language === 'hi' ? 'ऑडियो मार्गदर्शिका चल रही है...' : 'Audio guide playing...'}
            </span>
            <button
              onClick={stop}
              className="ml-2 text-xs bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded-md font-semibold transition"
            >
              {language === 'hi' ? 'रोकें' : 'Stop'}
            </button>
          </div>
        )}
      </div>

      {/* ─── Horizontal Scrollable Tab Pills ──────────────────────────────── */}
      <div className="relative">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-rose-200 dark:scrollbar-thumb-gray-800">
          {/* Tab 1: Health Cards */}
          <button
            onClick={() => setActiveSubTab('cards')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-200 shadow-sm ${
              activeSubTab === 'cards'
                ? 'bg-rose-600 text-white shadow-rose-200 dark:shadow-none ring-2 ring-rose-600 ring-offset-2 dark:ring-offset-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeSubTab === 'cards' ? 'text-white fill-current' : 'text-rose-500'}`} />
            <span>{language === 'hi' ? 'स्वास्थ्य कार्ड' : 'Health Cards'}</span>
          </button>

          {/* Tab 2: Period Tracker */}
          <button
            onClick={() => setActiveSubTab('period')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-200 shadow-sm ${
              activeSubTab === 'period'
                ? 'bg-rose-600 text-white shadow-rose-200 dark:shadow-none ring-2 ring-rose-600 ring-offset-2 dark:ring-offset-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <Calendar className={`w-4 h-4 ${activeSubTab === 'period' ? 'text-white' : 'text-pink-500'}`} />
            <span>{language === 'hi' ? 'माहवारी ट्रैकर' : 'Period Tracker'}</span>
          </button>

          {/* Tab 3: PCOS Screener */}
          <button
            onClick={() => setActiveSubTab('pcos')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-200 shadow-sm ${
              activeSubTab === 'pcos'
                ? 'bg-rose-600 text-white shadow-rose-200 dark:shadow-none ring-2 ring-rose-600 ring-offset-2 dark:ring-offset-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <Activity className={`w-4 h-4 ${activeSubTab === 'pcos' ? 'text-white' : 'text-indigo-500'}`} />
            <span>{language === 'hi' ? 'पीसीओएस जांच' : 'PCOS Screener'}</span>
          </button>

          {/* Tab 4: Doctor Connect */}
          <button
            onClick={() => setActiveSubTab('doctor')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-200 shadow-sm ${
              activeSubTab === 'doctor'
                ? 'bg-rose-600 text-white shadow-rose-200 dark:shadow-none ring-2 ring-rose-600 ring-offset-2 dark:ring-offset-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <Stethoscope className={`w-4 h-4 ${activeSubTab === 'doctor' ? 'text-white' : 'text-emerald-500'}`} />
            <span>{language === 'hi' ? 'डॉक्टर परामर्श' : 'Doctor Connect'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. HEALTH CARDS SECTION                                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'cards' && (
        <div className="space-y-6">
          {/* Age Group Selector Bar */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                {language === 'hi' ? 'उम्र समूह चुनें:' : 'Select Age Group:'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {healthCards.length} {language === 'hi' ? 'मार्गदर्शिका कार्ड' : 'Guides'}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {ageGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => setSelectedAgeGroup(group.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                    selectedAgeGroup === group.id
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {language === 'hi' ? group.hi : group.en}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Skeleton */}
          {cardsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map(idx => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 border-rose-300 dark:border-rose-900 border border-gray-200 dark:border-gray-700 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 dark:bg-gray-750 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-3 bg-gray-100 dark:bg-gray-750 rounded w-full" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-750 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Health Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {healthCards.map((card) => {
                const isExpanded = expandedCardId === card._id;
                const isThisSpeaking = currentlySpeakingCardId === card._id && isSpeaking;
                const cardTitle = language === 'hi' ? card.title?.hi || card.title?.en : card.title?.en || card.title?.hi;
                const accentColor = card.color || '#EC4899';

                return (
                  <div
                    key={card._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/90 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    style={{ borderLeftWidth: '6px', borderLeftColor: accentColor }}
                  >
                    {/* Card Header */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0"
                            style={{ backgroundColor: `${accentColor}18` }}
                          >
                            {card.icon || '🩺'}
                          </div>
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mb-1">
                              {language === 'hi' ? `उम्र: ${card.ageGroup} वर्ष` : `Age: ${card.ageGroup}`}
                            </span>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                              {cardTitle}
                            </h3>
                          </div>
                        </div>

                        {/* Listen Button (Hindi Voice) */}
                        <button
                          onClick={(e) => handleListenCard(card, e)}
                          title={language === 'hi' ? 'यह जानकारी हिंदी में सुनें' : 'Listen to this card in Hindi'}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                            isThisSpeaking
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900'
                          }`}
                        >
                          {isThisSpeaking ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-current" />
                              <span>{language === 'hi' ? 'रोकें' : 'Stop'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>सुनिए (Listen)</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Quick Summary Preview */}
                      {!isExpanded && (
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-750 flex items-center justify-between">
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80%]">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {language === 'hi' ? 'मुख्य लक्षण:' : 'Key Symptoms:'}{' '}
                            </span>
                            {(card.symptoms || [])
                              .slice(0, 2)
                              .map(s => (typeof s === 'string' ? s : language === 'hi' ? s.hi : s.en))
                              .join(', ')}
                          </div>
                          <button
                            onClick={() => setExpandedCardId(card._id)}
                            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 shrink-0"
                          >
                            <span>{language === 'hi' ? 'विस्तार' : 'More'}</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 space-y-4 border-t border-gray-100 dark:border-gray-750 bg-gray-50/50 dark:bg-gray-850/40">
                        {/* 1. Symptoms */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 mb-2 uppercase tracking-wider">
                            <Activity className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'सामान्य लक्षण (Symptoms)' : 'Symptoms'}</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                            {(card.symptoms || []).map((sym, i) => (
                              <li key={i} className="flex items-start gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                <span className="text-rose-500 mt-0.5">•</span>
                                <span>{typeof sym === 'string' ? sym : language === 'hi' ? sym.hi : sym.en}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 2. Prevention */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wider">
                            <Shield className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'रोकथाम व बचाव (Prevention)' : 'Prevention & Care'}</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                            {(card.prevention || []).map((prev, i) => (
                              <li key={i} className="flex items-start gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                <Check className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                                <span>{typeof prev === 'string' ? prev : language === 'hi' ? prev.hi : prev.en}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 3. Home Remedies */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'घरेलू उपाय एवं पोषण (Home Remedies)' : 'Home Remedies'}</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                            {(card.homeRemedies || []).map((rem, i) => (
                              <li key={i} className="flex items-start gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                <span className="text-emerald-500 mt-0.5">🌿</span>
                                <span>{typeof rem === 'string' ? rem : language === 'hi' ? rem.hi : rem.en}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 4. Red Flags */}
                        <div className="bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-900">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-400 mb-2 uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'चेतावनी संकेत - तुरंत डॉक्टर से मिलें (Red Flags)' : 'Warning Signs (Red Flags)'}</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-red-800 dark:text-red-200">
                            {(card.redFlags || []).map((rf, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-red-600 font-bold">•</span>
                                <span>{typeof rf === 'string' ? rf : language === 'hi' ? rf.hi : rf.en}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Collapse Button */}
                        <div className="pt-2 text-center">
                          <button
                            onClick={() => setExpandedCardId(null)}
                            className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center gap-1"
                          >
                            <span>{language === 'hi' ? 'संक्षिप्त करें' : 'Show Less'}</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. PERIOD TRACKER SECTION                                          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'period' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: 5 Columns */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-500" />
                <span>{language === 'hi' ? 'माहवारी चक्र अनुमान' : 'Menstrual Cycle Predictor'}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {language === 'hi'
                  ? 'अपनी पिछली माहवारी और चक्र की जानकारी दर्ज करें।'
                  : 'Enter your last period date to calculate next period and fertile days.'}
              </p>
            </div>

            <form onSubmit={handlePeriodPredict} className="space-y-4">
              {/* Last Period Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'hi' ? 'पिछली माहवारी की तिथि *' : 'Last Period Date *'}
                </label>
                <input
                  type="date"
                  required
                  value={periodForm.last_period_date}
                  onChange={(e) => setPeriodForm(prev => ({ ...prev, last_period_date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* Cycle Number & Menses Length in 2 Columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'hi' ? 'चक्र संख्या (Cycle No.)' : 'Cycle Number'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={periodForm.cycle_number}
                    onChange={(e) => setPeriodForm(prev => ({ ...prev, cycle_number: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'hi' ? 'स्राव के दिन (Menses Days) *' : 'Length of Menses *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    required
                    value={periodForm.length_of_menses}
                    onChange={(e) => setPeriodForm(prev => ({ ...prev, length_of_menses: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mean Cycle Length & Age in 2 Columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'hi' ? 'औसत चक्र दिन (वैकल्पिक)' : 'Mean Cycle Days'}
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="60"
                    placeholder="28"
                    value={periodForm.mean_cycle_length}
                    onChange={(e) => setPeriodForm(prev => ({ ...prev, mean_cycle_length: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'hi' ? 'आपकी उम्र (Age) *' : 'Age (Years) *'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="65"
                    required
                    value={periodForm.age}
                    onChange={(e) => setPeriodForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={periodLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {periodLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'गणना हो रही है...' : 'Predicting...'}</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>{language === 'hi' ? 'चक्र का अनुमान लगाएं' : 'Predict Cycle'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Results Display: 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            {periodResult ? (
              <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/40 dark:via-pink-900/30 dark:to-purple-950/30 border border-rose-200 dark:border-rose-800/80 rounded-3xl p-6 shadow-sm space-y-6">
                {/* Result Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl shadow-md">
                      📅
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {language === 'hi' ? 'अनुमानित चक्र परिणाम' : 'Predicted Cycle Details'}
                      </h3>
                      <p className="text-xs text-rose-800 dark:text-rose-300">
                        {language === 'hi' ? 'क्लिनिकल ल्यूटियल मॉडल द्वारा संकलित' : 'Calculated via Clinical Luteal Phase Model'}
                      </p>
                    </div>
                  </div>

                  {/* Irregularity Alert Badge */}
                  {periodResult.irregularity_alert ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'hi' ? 'अनियमित चक्र' : 'Irregular Cycle'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'hi' ? 'सामान्य चक्र' : 'Healthy Regular'}</span>
                    </span>
                  )}
                </div>

                {/* 4 Key Metric Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Next Period Date */}
                  <div className="bg-white dark:bg-gray-800/80 p-3.5 rounded-2xl border border-rose-100 dark:border-gray-700">
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block mb-1">
                      {language === 'hi' ? 'अगली माहवारी' : 'Next Period'}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white block">
                      {periodResult.next_period_date}
                    </span>
                  </div>

                  {/* Ovulation Date */}
                  <div className="bg-white dark:bg-gray-800/80 p-3.5 rounded-2xl border border-rose-100 dark:border-gray-700">
                    <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 block mb-1">
                      {language === 'hi' ? 'ओव्यूलेशन दिन' : 'Ovulation Day'}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white block">
                      {periodResult.ovulation_date}
                    </span>
                  </div>

                  {/* Cycle Length */}
                  <div className="bg-white dark:bg-gray-800/80 p-3.5 rounded-2xl border border-rose-100 dark:border-gray-700">
                    <span className="text-[11px] font-semibold text-pink-600 dark:text-pink-400 block mb-1">
                      {language === 'hi' ? 'चक्र अवधि' : 'Cycle Length'}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white block">
                      {periodResult.predicted_cycle_length} {language === 'hi' ? 'दिन' : 'Days'}
                    </span>
                  </div>

                  {/* Fertile Window */}
                  <div className="bg-white dark:bg-gray-800/80 p-3.5 rounded-2xl border border-rose-100 dark:border-gray-700">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                      {language === 'hi' ? 'प्रजनन अवधि' : 'Fertile Window'}
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      {periodResult.fertile_window_start}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      से {periodResult.fertile_window_end}
                    </span>
                  </div>
                </div>

                {/* Alert / Guidance Text */}
                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl border border-rose-100 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">
                    {language === 'hi' ? 'चिकित्सकीय टिप्पणी:' : 'Clinical Advice:'}
                  </span>
                  {language === 'hi' ? periodResult.alert_message_hi : periodResult.alert_message_en}
                </div>

                {/* Read Out Result Audio Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const msg = language === 'hi'
                        ? `आपकी अगली अनुमानित माहवारी तिथि है ${periodResult.next_period_date}। ओव्यूलेशन का दिन ${periodResult.ovulation_date} है। ${periodResult.alert_message_hi}`
                        : `Your predicted next period is on ${periodResult.next_period_date}. Ovulation is around ${periodResult.ovulation_date}. ${periodResult.alert_message_en}`;
                      speak(msg, 'hi-IN');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'परिणाम सुनें (Audio)' : 'Listen to Results'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Empty Placeholder State */
              <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center text-3xl">
                  🌸
                </div>
                <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">
                  {language === 'hi' ? 'चक्र परिणाम यहाँ प्रदर्शित होंगे' : 'Prediction Result Will Appear Here'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {language === 'hi'
                    ? 'बाईं ओर फॉर्म भरकर "चक्र का अनुमान लगाएं" बटन दबाएं।'
                    : 'Fill the form on the left and tap Predict Cycle to view your dates.'}
                </p>
              </div>
            )}

            {/* History Section: Last 3 Results */}
            {periodHistory.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'hi' ? 'पिछला रिकॉर्ड (अंतिम 3 परिणाम)' : 'Past Records (Last 3)'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {periodHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 text-xs space-y-1"
                    >
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 block">
                        {language === 'hi' ? 'पिछली माहवारी:' : 'Last:'} {item.inputDate || item.next_period_date}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white block">
                        {language === 'hi' ? 'अगली:' : 'Next:'} {item.next_period_date}
                      </span>
                      <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold block">
                        {item.predicted_cycle_length} {language === 'hi' ? 'दिन का चक्र' : 'Days'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. PCOS SCREENER SECTION                                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'pcos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* PCOS Form: 6 Columns */}
          <div className="lg:col-span-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span>AI Screening</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {language === 'hi' ? 'पीसीओएस (PCOS) जोखिम जांच' : 'PCOS Risk Assessment Tool'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {language === 'hi'
                  ? 'यह उपकरण पॉलीसिस्टिक ओवरी सिंड्रोम के सामान्य लक्षणों का मूल्यांकन करता है।'
                  : 'Answer these questions to calculate your statistical PCOS risk indicator.'}
              </p>
            </div>

            <form onSubmit={handlePcosSubmit} className="space-y-4">
              {/* Numeric Inputs: Age, Weight, Height in 3 Columns */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'hi' ? 'उम्र (Age)' : 'Age (Yrs)'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="65"
                    required
                    value={pcosForm.age}
                    onChange={(e) => setPcosForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'hi' ? 'वजन (Weight kg)' : 'Weight (kg)'}
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="180"
                    required
                    value={pcosForm.weight_kg}
                    onChange={(e) => setPcosForm(prev => ({ ...prev, weight_kg: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'hi' ? 'लंबाई (Height cm)' : 'Height (cm)'}
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="220"
                    required
                    value={pcosForm.height_cm}
                    onChange={(e) => setPcosForm(prev => ({ ...prev, height_cm: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Yes / No Toggles with Bilingual Labels */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-700">
                {[
                  {
                    key: 'cycle_irregular',
                    en: 'Irregular Menstrual Cycle? (Delayed / Skipped)',
                    hi: 'क्या आपका मासिक धर्म अनियमित रहता है?'
                  },
                  {
                    key: 'weight_gain',
                    en: 'Recent unexplained rapid weight gain?',
                    hi: 'क्या हाल ही में अचानक वजन बढ़ा है?'
                  },
                  {
                    key: 'hair_growth',
                    en: 'Excessive facial or body hair (Hirsutism)?',
                    hi: 'क्या चेहरे या शरीर पर अनचाहे बाल बढ़ रहे हैं?'
                  },
                  {
                    key: 'skin_darkening',
                    en: 'Skin darkening around neck, armpits, or folds?',
                    hi: 'क्या गर्दन या बगलों में त्वचा काली पड़ रही है?'
                  },
                  {
                    key: 'pimples',
                    en: 'Frequent acne or pimples breakouts?',
                    hi: 'क्या चेहरे पर बार-बार मुंहासे होते हैं?'
                  },
                  {
                    key: 'fast_food',
                    en: 'Regular fast food / oily food consumption?',
                    hi: 'क्या तला-भुना या फास्ट फूड का अधिक सेवन करते हैं?'
                  }
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="pr-2">
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">
                        {language === 'hi' ? item.hi : item.en}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPcosForm(prev => ({ ...prev, [item.key]: 0 }))}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          pcosForm[item.key] === 0
                            ? 'bg-gray-700 text-white dark:bg-gray-600'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {language === 'hi' ? 'नहीं' : 'No'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPcosForm(prev => ({ ...prev, [item.key]: 1 }))}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          pcosForm[item.key] === 1
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {language === 'hi' ? 'हाँ' : 'Yes'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={pcosLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {pcosLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'जोखिम का विश्लेषण जारी है...' : 'Analyzing Risk...'}</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4" />
                    <span>{language === 'hi' ? 'जोखिम का विश्लेषण करें' : 'Analyze Risk'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* PCOS Results Display: 6 Columns */}
          <div className="lg:col-span-6 space-y-6">
            {pcosResult ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-sm space-y-6">
                {/* Result Title & Level Badge */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {language === 'hi' ? 'पीसीओएस विश्लेषण परिणाम' : 'PCOS Assessment Result'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      BMI: {pcosResult.bmi} ({pcosResult.bmi_category})
                    </p>
                  </div>

                  {/* Level Badge */}
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      pcosResult.risk_level === 'HIGH'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border border-red-300 dark:border-red-800'
                        : pcosResult.risk_level === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    }`}
                  >
                    {pcosResult.risk_level === 'HIGH'
                      ? language === 'hi' ? 'उच्च जोखिम (HIGH)' : 'High Risk'
                      : pcosResult.risk_level === 'MODERATE'
                      ? language === 'hi' ? 'मध्यम जोखिम (MODERATE)' : 'Moderate Risk'
                      : language === 'hi' ? 'कम जोखिम (LOW)' : 'Low Risk'}
                  </span>
                </div>

                {/* Risk Gauge (Visual Progress Bar colored green/yellow/red) */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>{language === 'hi' ? 'जोखिम स्कोर:' : 'Risk Score:'}</span>
                    <span className="text-sm font-extrabold">{pcosResult.risk_score}%</span>
                  </div>

                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pcosResult.risk_score >= 65
                          ? 'bg-gradient-to-r from-amber-500 to-red-600'
                          : pcosResult.risk_score >= 35
                          ? 'bg-gradient-to-r from-emerald-400 to-amber-500'
                          : 'bg-gradient-to-r from-teal-400 to-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(8, pcosResult.risk_score))}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 font-semibold px-1">
                    <span>0% (कम)</span>
                    <span>35% (मध्यम)</span>
                    <span>65%+ (उच्च)</span>
                  </div>
                </div>

                {/* BMI Tile */}
                <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                      {language === 'hi' ? 'बॉडी मास इंडेक्स (BMI):' : 'Body Mass Index (BMI):'}
                    </span>
                    <span className="text-indigo-700 dark:text-indigo-300">
                      {pcosResult.bmi} kg/m² — {pcosResult.bmi_category}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 shadow-sm">
                    {pcosResult.bmi_category}
                  </span>
                </div>

                {/* Guidance Text in Hindi & English */}
                <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-2 text-xs">
                  <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-indigo-500" />
                    <span>{language === 'hi' ? 'सलाह एवं मार्गदर्शन:' : 'Clinical Guidance:'}</span>
                  </span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                    {pcosResult.guidance_hi}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 italic text-[11px]">
                    {pcosResult.guidance_en}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => speak(pcosResult.guidance_hi, 'hi-IN')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'यह सलाह सुनें' : 'Listen Guidance'}</span>
                    </button>
                  </div>
                </div>

                {/* Medical Disclaimer */}
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300 leading-snug">
                  <span className="font-bold block mb-0.5">⚠️ {language === 'hi' ? 'चिकित्सीय अस्वीकरण:' : 'Medical Disclaimer:'}</span>
                  {language === 'hi' ? pcosResult.disclaimer_hi : pcosResult.disclaimer_en}
                </div>
              </div>
            ) : (
              /* Empty Placeholder State */
              <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center text-3xl">
                  🔬
                </div>
                <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">
                  {language === 'hi' ? 'पीसीओएस जोखिम परिणाम यहाँ दिखेगा' : 'PCOS Risk Result Will Appear Here'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {language === 'hi'
                    ? 'प्रश्नों का उत्तर दें और "जोखिम का विश्लेषण करें" दबाएं।'
                    : 'Fill the questionnaire on the left to compute your personalized PCOS assessment.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. DOCTOR CONNECT SECTION                                          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'doctor' && (
        <div className="space-y-6">
          {/* Status Bar & Demo Mode Toggle */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {language === 'hi' ? 'ऑनलाइन डॉक्टर सेवा सक्रिय है' : 'Doctor Telemedicine Active'}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block">
                  {doctorOnlineCount} {language === 'hi' ? 'विशेषज्ञ डॉक्टर तुरंत उपलब्ध हैं' : 'Specialist Doctors Available Online'}
                </span>
              </div>
            </div>

            {/* Demo Mode Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600">
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => setIsDemoMode(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
              />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {language === 'hi' ? 'डेमो मोड (तत्काल स्थानीय सिमुलेशन)' : 'Demo Mode (Local Simulation)'}
              </span>
            </label>
          </div>

          {/* Not In Consultation: Choice of Patient vs Doctor */}
          {connectStatus !== 'matched' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Patient */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-rose-100 dark:border-gray-700 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-3xl">
                    👩‍🦰
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {language === 'hi' ? 'मैं मरीज हूँ (I am a Patient)' : 'I am a Patient (User)'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {language === 'hi'
                      ? 'अपनी स्वास्थ्य समस्याओं, माहवारी दर्द या अन्य महिला रोगों के लिए उपलब्ध महिला डॉक्टर से तुरंत निःशुल्क वीडियो व चैट परामर्श करें।'
                      : 'Connect with a certified gynaecologist or female doctor for immediate free telemedicine consultation.'}
                  </p>
                </div>

                <div>
                  <button
                    onClick={handleJoinAsPatient}
                    disabled={connectStatus === 'waiting'}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-700 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {connectStatus === 'waiting' && userRole === 'patient' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{language === 'hi' ? 'डॉक्टर से जोड़ा जा रहा है...' : 'Matching with Doctor...'}</span>
                      </>
                    ) : (
                      <>
                        <Stethoscope className="w-4 h-4" />
                        <span>{language === 'hi' ? 'डॉक्टर से जुड़ें (Connect with Doctor)' : 'Connect with a Doctor'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card 2: Doctor */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-emerald-100 dark:border-gray-700 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl">
                    👩‍⚕️
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {language === 'hi' ? 'मैं डॉक्टर हूँ (I am a Doctor)' : 'I am a Doctor'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {language === 'hi'
                      ? 'ग्रामीण और वंचित महिलाओं को चिकित्सीय सलाह देने के लिए उपलब्ध हों। कतार में प्रतीक्षारत मरीज आपसे सीधे जुड़ेंगे।'
                      : 'Volunteer healthcare guidance for rural women. Go online to receive matched telemedicine sessions.'}
                  </p>
                </div>

                <div>
                  <button
                    onClick={handleJoinAsDoctor}
                    disabled={connectStatus === 'waiting'}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {connectStatus === 'waiting' && userRole === 'doctor' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{language === 'hi' ? 'मरीज का इंतज़ार है...' : 'Waiting for Patient...'}</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>{language === 'hi' ? 'ऑनलाइन उपलब्ध हों (Go Online)' : 'Go Online (Be Available)'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Consultation Room (Matched Interface) */}
          {connectStatus === 'matched' && activeRoom && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden space-y-0">
              {/* Consultation Room Top Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-600 to-pink-600 text-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    🩺
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base leading-snug">
                      {userRole === 'doctor' ? `मरीज: ${activeRoom.userName || 'Patient'}` : `डॉक्टर: ${activeRoom.doctorName || 'Dr. Specialist'}`}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-rose-100">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                      <span>{language === 'hi' ? 'सुरक्षित निजी परामर्श कक्ष' : 'Private Encrypted Room'}</span>
                      <span className="opacity-60">• Room: {activeRoom.roomId?.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={handleDisconnectConsultation}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-rose-700 hover:bg-rose-50 transition shadow-sm"
                >
                  <PhoneOff className="w-4 h-4 text-red-600" />
                  <span>{language === 'hi' ? 'परामर्श समाप्त करें' : 'Disconnect'}</span>
                </button>
              </div>

              {/* Consultation Body: WebRTC Feeds & Chat in 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
                {/* Left Side: Video Preview Tiles & Controls (7 Cols) */}
                <div className="lg:col-span-7 p-5 space-y-4 bg-gray-900 text-white flex flex-col justify-between min-h-[380px]">
                  {/* Two Video Feeds: Doctor & Patient */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    {/* Doctor Feed Tile */}
                    <div className="relative rounded-2xl bg-gray-800 border border-gray-700 flex flex-col items-center justify-center p-6 text-center overflow-hidden min-h-[160px]">
                      <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl mb-2">
                        👩‍⚕️
                      </div>
                      <span className="text-xs font-bold text-gray-200">
                        {activeRoom.doctorName || 'Doctor'}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        {language === 'hi' ? 'सक्रिय ऑडियो / वीडियो' : 'Audio & Video Active'}
                      </span>
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-semibold text-white">
                        Doctor Feed
                      </div>
                    </div>

                    {/* Patient Feed Tile */}
                    <div className="relative rounded-2xl bg-gray-800 border border-gray-700 flex flex-col items-center justify-center p-6 text-center overflow-hidden min-h-[160px]">
                      {isVideoOff ? (
                        <div className="w-16 h-16 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center text-2xl mb-2">
                          <VideoOff className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center text-3xl mb-2">
                          👩‍🦰
                        </div>
                      )}
                      <span className="text-xs font-bold text-gray-200">
                        {activeRoom.userName || 'You'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {isVideoOff ? 'Camera Off' : isAudioMuted ? 'Muted' : 'Speaking'}
                      </span>
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-semibold text-white">
                        You
                      </div>
                    </div>
                  </div>

                  {/* WebRTC Video & Audio Controls Toolbar */}
                  <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-800">
                    <button
                      onClick={() => setIsAudioMuted(!isAudioMuted)}
                      className={`p-3 rounded-full transition ${
                        isAudioMuted
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                      }`}
                      title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
                    >
                      {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`p-3 rounded-full transition ${
                        isVideoOff
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                      }`}
                      title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                    >
                      {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={handleDisconnectConsultation}
                      className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
                      title="End Call"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Right Side: Chat Interface (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col h-[420px] bg-white dark:bg-gray-800">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-rose-500" />
                    <span>{language === 'hi' ? 'लाइव चैट संवाद' : 'Live Chat Consultation'}</span>
                  </div>

                  {/* Scrollable Message List */}
                  <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
                    {chatMessages.map((msg, i) => {
                      const isSystem = msg.sender === 'system';
                      const isMe = msg.sender === 'You' || (userRole === 'doctor' && msg.sender === 'Doctor');

                      if (isSystem) {
                        return (
                          <div key={i} className="text-center my-2">
                            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-750 text-gray-600 dark:text-gray-400">
                              {msg.message}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={i}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[10px] text-gray-400 mb-0.5 px-1 font-semibold">
                            {msg.sender}
                          </span>
                          <div
                            className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-sm ${
                              isMe
                                ? 'bg-rose-600 text-white rounded-br-none'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                            }`}
                          >
                            <p className="leading-relaxed">{msg.message}</p>
                            <span
                              className={`block text-[9px] mt-1 text-right ${
                                isMe ? 'text-rose-200' : 'text-gray-400'
                              }`}
                            >
                              {msg.timestamp || 'Now'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder={language === 'hi' ? 'अपना सवाल या लक्षण यहाँ लिखें...' : 'Type your message or symptom...'}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white transition shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
