import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Landmark,
  Search,
  Filter,
  CheckCircle2,
  FileCheck,
  ExternalLink,
  X,
  Sparkles,
  ChevronRight,
  AlertCircle,
  RotateCcw,
  Calendar,
  IndianRupee,
  Building2,
  Users,
  GraduationCap,
  HeartPulse,
  Briefcase,
  ShieldCheck,
  Check,
  FileText,
  BadgeCheck,
  Globe,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Authentic Fallback Schemes Data matching Scheme Model Schema
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_SCHEMES = [
  {
    _id: 'sch-1',
    name: {
      en: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
      hi: 'प्रधानमंत्री मातृ वंदना योजना (PMMVY)'
    },
    level: 'CENTRAL',
    state: 'All India',
    category: 'Health',
    icon: '🤰',
    color: '#059669',
    description: {
      en: 'Direct maternity cash benefit of ₹5,000 for pregnant women and lactating mothers for the first living child, and ₹6,000 for the birth of a second girl child to improve maternal nutrition.',
      hi: 'गर्भवती महिलाओं और स्तनपान कराने वाली माताओं को पहले बच्चे पर ₹5,000 तथा दूसरी बालिका के जन्म पर ₹6,000 का सीधा आर्थिक पोषण लाभ।'
    },
    eligibility: {
      minAge: 19,
      maxAge: 45,
      maxIncomeLPA: 8.0,
      criteria: [
        { en: 'Pregnant women and lactating mothers (19 years or above)', hi: '19 वर्ष या उससे अधिक आयु की गर्भवती एवं स्तनपान कराने वाली माताएं' },
        { en: 'Family annual income under ₹8 Lakh or holding BPL / EWS / Ayushman card', hi: 'पारिवारिक वार्षिक आय ₹8 लाख से कम अथवा बीपीएल/ईडब्ल्यूएस/आयुष्मान कार्ड धारक' },
        { en: 'Early registration at Anganwadi or nearest primary health centre (PHC)', hi: 'आंगनवाड़ी केंद्र या प्राथमिक स्वास्थ्य केंद्र पर शीघ्र गर्भावस्था पंजीकरण' }
      ]
    },
    benefits: [
      { en: '₹5,000 in two installments for the first child into Aadhaar-linked bank account', hi: 'पहले बच्चे पर दो किस्तों में कुल ₹5,000 की नकद राशि बैंक खाते में' },
      { en: '₹6,000 single installment upon the birth of second girl child', hi: 'दूसरी संतान के रूप में बालिका जन्म पर ₹6,000 की विशेष प्रोत्साहन राशि' },
      { en: 'Free antenatal checkups (ANC) and nutrition counseling via ASHA workers', hi: 'आशा कार्यकर्ताओं द्वारा मुफ्त प्रसवपूर्व जांच और पोषण परामर्श' }
    ],
    documents: [
      { en: 'Mother and Child Protection (MCP) Card with registration stamp', hi: 'मातृ एवं शिशु सुरक्षा (एमसीपी) कार्ड' },
      { en: 'Aadhaar Card of pregnant woman and husband', hi: 'गर्भवती महिला और पति का आधार कार्ड' },
      { en: 'Active bank account passbook with Aadhaar DBT enabled', hi: 'आधार से लिंक बैंक खाते की पासबुक' },
      { en: 'Institutional delivery certificate (for post-delivery installment)', hi: 'अस्पताल में संस्थागत प्रसव का प्रमाण पत्र' }
    ],
    applySteps: [
      { en: 'Visit your local Anganwadi Centre or primary healthcare clinic (PHC)', hi: 'अपने नजदीकी आंगनवाड़ी केंद्र या प्राथमिक स्वास्थ्य केंद्र (PHC) पर जाएं' },
      { en: 'Obtain and fill Form 1A within 150 days of your Last Menstrual Period (LMP)', hi: 'अंतिम माहवारी के 150 दिनों के भीतर फॉर्म 1A भरकर जमा करें' },
      { en: 'Complete at least one ANC checkup and submit verification slip', hi: 'कम से कम एक प्रसवपूर्व जांच (ANC) कराएं और पर्ची संलग्न करें' },
      { en: 'Direct Benefit Transfer (DBT) is credited directly to your registered bank account', hi: 'अनुदान राशि सीधे आपके आधार लिंक बैंक खाते में डीबीटी द्वारा आ जाएगी' }
    ],
    officialLink: 'https://pmmvy.wcd.gov.in/'
  },
  {
    _id: 'sch-2',
    name: {
      en: 'Sukanya Samriddhi Yojana (SSY)',
      hi: 'सुकन्या समृद्धि योजना (SSY)'
    },
    level: 'CENTRAL',
    state: 'All India',
    category: 'Financial',
    icon: '💰',
    color: '#8B5CF6',
    description: {
      en: 'Government-backed high-yield small savings scheme for girl children with 8.2% annual compounded interest, full tax exemption, and long-term financial security for higher education and marriage.',
      hi: 'बालिकाओं के सुरक्षित भविष्य हेतु 8.2% वार्षिक ब्याज वाली सरकारी बचत योजना, जिसमें उच्च शिक्षा और विवाह हेतु पूर्ण कर-मुक्त परिपक्वता लाभ मिलता है।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 10,
      maxIncomeLPA: 99.0,
      criteria: [
        { en: 'Girl child aged 0 to 10 years at time of account opening', hi: 'खाता खोलते समय बालिका की आयु 10 वर्ष से कम होनी चाहिए' },
        { en: 'Resident Indian citizen, maximum 2 girl children per household', hi: 'भारतीय नागरिक, एक परिवार में अधिकतम 2 बालिकाओं के लिए खाता मान्य' },
        { en: 'Account operated by natural or legal guardian until girl reaches 18', hi: 'बालिका के 18 वर्ष होने तक अभिभावक द्वारा खाता संचालन' }
      ]
    },
    benefits: [
      { en: 'Highest sovereign-guaranteed interest rate of 8.2% per annum', hi: 'सभी बचत योजनाओं में सर्वाधिक 8.2% वार्षिक चक्रवृद्धि ब्याज' },
      { en: '100% tax exemption under Section 80C on deposit, interest, and maturity (EEE)', hi: 'जमा राशि, ब्याज और निकासी तीनों पर धारा 80C के तहत पूर्ण कर छूट' },
      { en: 'Partial withdrawal up to 50% allowed after age 18 for higher education fees', hi: 'बालिका के 18 वर्ष पूर्ण होने पर कॉलेज शिक्षा हेतु 50% राशि निकालने की छूट' }
    ],
    documents: [
      { en: "Birth Certificate of the girl child issued by municipality or hospital", hi: 'बालिका का जन्म प्रमाण पत्र' },
      { en: "Identity and address proof of guardian (Aadhaar / Voter ID / PAN)", hi: 'माता-पिता/अभिभावक का आधार कार्ड और पहचान पत्र' },
      { en: 'Passport size photographs of guardian and child', hi: 'अभिभावक और बालिका के पासपोर्ट साइज फोटो' },
      { en: 'Initial deposit amount (minimum ₹250)', hi: 'प्रारंभिक जमा राशि (न्यूनतम मात्र ₹250)' }
    ],
    applySteps: [
      { en: 'Visit any nearest Post Office branch or authorized commercial bank', hi: 'किसी भी नजदीकी डाकघर (Post Office) या बैंक शाखा में जाएं' },
      { en: 'Fill out SSY Account Opening Form (Form-1) with girl child details', hi: 'सुकन्या समृद्धि खाता खोलने का फॉर्म-1 भरें' },
      { en: 'Attach child birth certificate and guardian KYC documents', hi: 'बालिका का जन्म प्रमाण पत्र और अभिभावक का आधार कार्ड संलग्न करें' },
      { en: 'Deposit minimum ₹250 to receive your SSY passbook instantly', hi: 'न्यूनतम ₹250 जमा कर तत्काल सुकन्या पासबुक प्राप्त करें' }
    ],
    officialLink: 'https://www.india.gov.in/sukanya-samriddhi-yojna'
  },
  {
    _id: 'sch-3',
    name: {
      en: 'Beti Bachao Beti Padhao (BBBP)',
      hi: 'बेटी बचाओ बेटी पढ़ाओ योजना'
    },
    level: 'CENTRAL',
    state: 'All India',
    category: 'Education',
    icon: '🎓',
    color: '#2563EB',
    description: {
      en: 'National initiative to prevent gender-biased sex selection, ensure survival and protection of the girl child, and guarantee quality secondary and higher education across rural districts.',
      hi: 'बालिकाओं के प्रति भेदभाव मिटाने, सुरक्षा सुनिश्चित करने और ग्रामीण क्षेत्रों में बालिकाओं की माध्यमिक व उच्च शिक्षा को बढ़ावा देने का राष्ट्रीय महाअभियान।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 21,
      maxIncomeLPA: 99.0,
      criteria: [
        { en: 'All girl children enrolled in government or recognized schools', hi: 'सरकारी या मान्यता प्राप्त विद्यालयों में नामांकित सभी बालिकाएं' },
        { en: 'Special focus on rural and aspirational backward districts', hi: 'विशेष रूप से ग्रामीण और आकांक्षी जिलों की छात्राओं हेतु' },
        { en: 'Continuous attendance without dropping out after primary schooling', hi: 'प्राथमिक स्तर के बाद माध्यमिक शिक्षा में निरंतर उपस्थिति' }
      ]
    },
    benefits: [
      { en: 'Free secondary schooling, textbook supplies, and school uniform kits', hi: 'मुफ्त माध्यमिक शिक्षा, पाठ्य पुस्तकें और स्कूल यूनिफॉर्म किट' },
      { en: 'Free bicycle distribution for girls traveling over 2 km to school', hi: '2 किमी से दूर स्कूल जाने वाली छात्राओं को मुफ्त साइकिल वितरण' },
      { en: 'Hostel and boarding facilities under Kasturba Gandhi Balika Vidyalayas', hi: 'कस्तूरबा गांधी बालिका विद्यालयों में मुफ्त आवासीय व भोजन व्यवस्था' }
    ],
    documents: [
      { en: 'School enrollment certificate and student admission number', hi: 'विद्यालय नामांकन प्रमाण पत्र व छात्र आईडी' },
      { en: "Aadhaar Card of girl student", hi: 'छात्रा का आधार कार्ड' },
      { en: "Domicile certificate or Gram Panchayat residence verification", hi: 'निवास प्रमाण पत्र या ग्राम पंचायत प्रमाण पत्र' },
      { en: 'Bank passbook in student or joint name for stipends', hi: 'छात्रवृत्ति हेतु छात्र का बैंक खाता विवरण' }
    ],
    applySteps: [
      { en: 'Approach your village government school principal or headmaster', hi: 'अपने गांव के प्राथमिक या माध्यमिक विद्यालय के प्रधानाध्यापक से संपर्क करें' },
      { en: 'Enroll girl child and register on state educational scholarship portal', hi: 'छात्रा का प्रवेश कराकर राज्य छात्रवृत्ति पोर्टल पर पंजीकरण कराएं' },
      { en: 'District Child Welfare Committee reviews application for special grants', hi: 'जिला बाल कल्याण समिति द्वारा विशेष अनुदान स्वीकृत किया जाता है' },
      { en: 'Receive uniforms, cycles, and scholarship stipends directly', hi: 'यूनिफॉर्म, साइकिल और छात्रवृत्ति का लाभ सीधे प्राप्त करें' }
    ],
    officialLink: 'https://wcd.nic.in/bbbp-schemes'
  },
  {
    _id: 'sch-4',
    name: {
      en: 'Lakhpati Didi Initiative (DAY-NRLM)',
      hi: 'लखपति दीदी योजना (दीनदयाल अंत्योदय - आजीविका मिशन)'
    },
    level: 'CENTRAL',
    state: 'All India',
    category: 'Employment',
    icon: '💼',
    color: '#D97706',
    description: {
      en: 'Transformational economic empowerment mission supporting women Self Help Group (SHG) members with enterprise training, drone technology, and credit to earn over ₹1 Lakh sustainably every year.',
      hi: 'स्वयं सहायता समूह (SHG) की महिलाओं को ड्रोन दीदी, सौर ऊर्जा व पशुपालन प्रशिक्षण देकर प्रतिवर्ष न्यूनतम ₹1 लाख की स्थायी आय अर्जित कराने की योजना।'
    },
    eligibility: {
      minAge: 18,
      maxAge: 55,
      maxIncomeLPA: 2.5,
      criteria: [
        { en: 'Active woman member of a registered Village Self Help Group (SHG)', hi: 'पंजीकृत ग्रामीण स्वयं सहायता समूह (SHG) की सक्रिय महिला सदस्य' },
        { en: 'Commitment to start or scale a micro-enterprise or sustainable farm venture', hi: 'लघु उद्यम, पशुपालन या कृषि व्यवसाय शुरू करने की प्रतिबद्धता' },
        { en: 'Family annual income under ₹2.5 Lakh from rural areas', hi: 'ग्रामीण क्षेत्र से पारिवारिक वार्षिक आय ₹2.5 लाख से कम' }
      ]
    },
    benefits: [
      { en: 'Free technical training in agri-drone operation, organic farming, and solar assembly', hi: 'ड्रोन दीदी प्रशिक्षण, जैविक खाद और सौर उपकरण मरम्मत का मुफ्त प्रशिक्षण' },
      { en: 'Collateral-free micro-credit loans up to ₹5 Lakh at subsidized interest', hi: 'बिना किसी गारंटी के ₹5 लाख तक का रियायती ब्याज दर पर ऋण' },
      { en: 'Direct market linkage through Saras Melas and government e-Marketplace (GeM)', hi: 'सरस मेलों और सरकारी ई-मार्केटप्लेस (GeM) के जरिए उत्पादों की बिक्री' }
    ],
    documents: [
      { en: 'SHG membership passbook and village organization verification letter', hi: 'स्वयं सहायता समूह की सदस्यता पासबुक व ग्राम संगठन प्रमाण पत्र' },
      { en: 'Aadhaar Card and Voter ID card of applicant', hi: 'आवेदिका का आधार कार्ड और पहचान पत्र' },
      { en: 'Individual savings bank passbook and PAN card', hi: 'व्यक्तिगत बैंक खाता पासबुक और पैन कार्ड' },
      { en: 'Micro-Enterprise Business Plan proposal (assisted by Community Resource Person)', hi: 'सीआरपी (CRP) द्वारा तैयार किया गया लघु व्यवसाय प्रस्ताव' }
    ],
    applySteps: [
      { en: 'Attend your monthly Village Organization (VO) or Cluster Level Federation (CLF) meeting', hi: 'अपने गांव के ग्राम संगठन (VO) या क्लस्टर बैठक में भाग लें' },
      { en: 'Select your preferred enterprise sector (Dairy, Agri-Drone, Poultry, Tailoring)', hi: 'अपनी पसंद का आजीविका क्षेत्र (डेयरी, ड्रोन, सिलाई, पोल्ट्री) चुनें' },
      { en: 'Complete 15-day certified vocational training at nearest RSETI institute', hi: 'नजदीकी आरसेटी (RSETI) संस्थान में 15 दिवसीय मुफ्त प्रशिक्षण पूरा करें' },
      { en: 'Receive seed capital grant and interest-subvention loan directly into your account', hi: 'सामुदायिक निवेश कोष से व्यवसाय शुरू करने हेतु अनुदान व ऋण प्राप्त करें' }
    ],
    officialLink: 'https://nrlm.gov.in/'
  },
  {
    _id: 'sch-5',
    name: {
      en: 'Pradhan Mantri Ujjwala Yojana 2.0 (PMUY)',
      hi: 'प्रधानमंत्री उज्ज्वला योजना 2.0 (PMUY)'
    },
    level: 'CENTRAL',
    state: 'All India',
    category: 'Health',
    icon: '🔥',
    color: '#E11D48',
    description: {
      en: 'Provides smoke-free rural kitchens and safeguards women against respiratory illness by delivering completely free LPG connections, first refill, and cooktop stoves to low-income households.',
      hi: 'ग्रामीण महिलाओं को धुएं से मुक्ति और श्वसन रोगों से सुरक्षा प्रदान करने हेतु मुफ्त एलपीजी गैस कनेक्शन, पहला भरा सिलेंडर और गैस चूल्हा वितरण योजना।'
    },
    eligibility: {
      minAge: 18,
      maxAge: 65,
      maxIncomeLPA: 2.0,
      criteria: [
        { en: 'Adult female member of BPL / SECC / SC-ST / PM Awas rural household', hi: 'बीपीएल, पीएम आवास या अनुसूचित जाति/जनजाति परिवार की वयस्क महिला' },
        { en: 'No existing active LPG gas connection registered in the entire household', hi: 'परिवार में किसी अन्य सदस्य के नाम पर पहले से गैस कनेक्शन न हो' },
        { en: 'Self-declaration of family income and ration card verification', hi: 'राशन कार्ड सत्यापन और आय का स्व-घोषणा पत्र' }
      ]
    },
    benefits: [
      { en: 'Completely free LPG gas connection with zero security deposit fee', hi: 'बिना कोई सुरक्षा शुल्क दिए पूर्णतः मुफ्त एलपीजी गैस कनेक्शन' },
      { en: 'Free first filled 14.2 kg LPG cylinder plus free ISI gas stove', hi: 'पहला 14.2 किग्रा भरा हुआ सिलेंडर और आईएसआई मार्क गैस चूल्हा बिल्कुल मुफ्त' },
      { en: 'Ongoing direct subsidy of ₹300 per cylinder credited to bank account', hi: 'प्रत्येक सिलेंडर रिफिल पर ₹300 की सीधी नकद सब्सिडी बैंक खाते में' }
    ],
    documents: [
      { en: 'Ration Card verifying family composition or BPL certificate', hi: 'राशन कार्ड (परिवार के सदस्यों के नाम सहित)' },
      { en: 'Aadhaar Card of the female applicant and adult family members', hi: 'महिला आवेदिका और परिवार के वयस्क सदस्यों का आधार कार्ड' },
      { en: 'Bank account passbook with IFSC code (DBT linked)', hi: 'बैंक खाता पासबुक (आधार से लिंक)' },
      { en: 'Passport size photograph and proof of residence', hi: 'पासपोर्ट साइज फोटो और निवास का प्रमाण' }
    ],
    applySteps: [
      { en: 'Visit your nearest LPG distributor (Indane, Bharat Gas, or HP Gas)', hi: 'अपने नजदीकी एलपीजी गैस एजेंसी (इंडेन, भारत गैस, एचपी गैस) पर जाएं' },
      { en: 'Submit Ujjwala 2.0 KYC Form along with ration card and Aadhaar copies', hi: 'उज्ज्वला 2.0 फॉर्म भरकर राशन कार्ड और आधार कार्ड की प्रतियां जमा करें' },
      { en: 'Distributor conducts biometrical e-KYC authentication', hi: 'गैस एजेंसी द्वारा बायोमेट्रिक ई-केवाईसी सत्यापन पूरा किया जाएगा' },
      { en: 'Receive gas cylinder, regulator, pipe, and stove delivered to your home', hi: 'गैस सिलेंडर, चूल्हा और रेगुलेटर आपके घर पर मुफ्त डिलीवर किया जाएगा' }
    ],
    officialLink: 'https://www.pmuy.gov.in/'
  },
  {
    _id: 'sch-6',
    name: {
      en: 'Mahila Samman Savings Certificate (MSSC)',
      hi: 'महिला सम्मान बचत पत्र (MSSC)'
    },
    level: 'CENTRAL',
    state: 'All India',
    category: 'Financial',
    icon: '🏦',
    color: '#0891B2',
    description: {
      en: 'Dedicated sovereign small savings scheme exclusively for women and girls offering guaranteed 7.5% quarterly compounded return over a 2-year tenure with flexible partial withdrawal.',
      hi: 'विशेष रूप से महिलाओं और बालिकाओं के लिए 7.5% निश्चित ब्याज दर वाली 2 वर्षीय सुरक्षित डाकघर बचत योजना।'
    },
    eligibility: {
      minAge: 10,
      maxAge: 75,
      maxIncomeLPA: 99.0,
      criteria: [
        { en: 'Any woman or girl child (guardian can open on behalf of minor)', hi: 'कोई भी महिला या बालिका (नाबालिग की ओर से अभिभावक द्वारा)' },
        { en: 'Deposit range from minimum ₹1,000 up to maximum ₹2,00,000', hi: 'न्यूनतम ₹1,000 से अधिकतम ₹2,00,000 तक जमा राशि' },
        { en: 'Fixed 2-year tenure with no risk of market fluctuation', hi: 'बाजार जोखिम से मुक्त 2 वर्ष की निश्चित परिपक्वता अवधि' }
      ]
    },
    benefits: [
      { en: 'Guaranteed 7.5% interest per year compounded every quarter', hi: 'प्रतिवर्ष 7.5% का निश्चित ब्याज, जो हर 3 महीने में चक्रवृद्धि होता है' },
      { en: '40% partial balance withdrawal allowed after 1 year of tenure', hi: 'खाता खुलने के 1 वर्ष बाद 40% राशि आपात स्थिति में निकालने की छूट' },
      { en: 'Backed 100% by Government of India with guaranteed payout', hi: 'भारत सरकार द्वारा पूर्णतः सुरक्षित और गारंटीकृत परिपक्वता भुगतान' }
    ],
    documents: [
      { en: 'Aadhaar Card and PAN Card of woman applicant', hi: 'आवेदिका का आधार कार्ड और पैन कार्ड' },
      { en: 'Active Post Office or Savings Bank passbook copy', hi: 'डाकघर या बैंक खाता पासबुक' },
      { en: 'Two passport size colored photographs', hi: 'दो पासपोर्ट साइज रंगीन फोटो' },
      { en: 'Cheque or cash for deposit amount (up to ₹2 Lakh)', hi: 'जमा राशि का चेक या नकद (अधिकतम ₹2 लाख)' }
    ],
    applySteps: [
      { en: 'Collect Form-A for MSSC from any India Post branch or PSU bank', hi: 'किसी भी डाकघर या सरकारी बैंक से MSSC फॉर्म-A प्राप्त करें' },
      { en: 'Fill applicant details and specify your deposit amount', hi: 'फॉर्म में अपनी जानकारी भरें और जमा राशि चुनें' },
      { en: 'Submit KYC documents (Aadhaar and PAN) along with payment', hi: 'आधार व पैन कार्ड के साथ राशि जमा करें' },
      { en: 'Receive official MSSC certificate and passbook on the spot', hi: 'तुरंत आधिकारिक महिला सम्मान प्रमाण पत्र और पासबुक प्राप्त करें' }
    ],
    officialLink: 'https://www.indiapost.gov.in/'
  },
  {
    _id: 'sch-7',
    name: {
      en: 'Ladli Behna Yojana (Madhya Pradesh)',
      hi: 'मुख्यमंत्री लाड़ली बहना योजना (मध्य प्रदेश)'
    },
    level: 'STATE',
    state: 'Madhya Pradesh',
    category: 'Financial',
    icon: '🌸',
    color: '#EC4899',
    description: {
      en: 'Direct monthly cash assistance of ₹1,250 transferred on the 10th of every month into bank accounts of married, widowed, and divorced women in Madhya Pradesh to foster economic self-reliance.',
      hi: 'मध्य प्रदेश की 21-60 वर्ष की विवाहित, विधवा व परित्यक्ता बहनों को हर माह की 10 तारीख को ₹1,250 की सीधी आर्थिक सहायता उनके बैंक खाते में।'
    },
    eligibility: {
      minAge: 21,
      maxAge: 60,
      maxIncomeLPA: 2.5,
      criteria: [
        { en: 'Permanent resident of Madhya Pradesh state', hi: 'मध्य प्रदेश की स्थायी निवासी विवाहित, विधवा अथवा तलाकशुदा महिला' },
        { en: 'Family combined annual income less than ₹2.5 Lakh', hi: 'परिवार की कुल वार्षिक आय ₹2.5 लाख से कम होनी चाहिए' },
        { en: 'Family owns less than 5 acres of agricultural land and no four-wheeler', hi: 'परिवार के पास 5 एकड़ से कम कृषि भूमि हो तथा कोई चार पहिया वाहन न हो' }
      ]
    },
    benefits: [
      { en: '₹1,250 credited directly to DBT bank account every month on the 10th (₹15,000/year)', hi: 'प्रति माह ₹1,250 (वार्षिक ₹15,000) सीधे डीबीटी बैंक खाते में' },
      { en: 'Free health insurance and micro-pension scheme integration', hi: 'मुफ्त स्वास्थ्य बीमा और सामाजिक सुरक्षा पेंशन से सीधा जुड़ाव' },
      { en: 'Priority in low-cost housing under Ladli Behna Awas Yojana', hi: 'लाड़ली बहना आवास योजना में पक्के मकान आवंटन में प्राथमिकता' }
    ],
    documents: [
      { en: 'Samagra Family ID and Member ID with Aadhaar e-KYC completed', hi: 'ई-केवाईसी युक्त समग्र परिवार आईडी एवं सदस्य आईडी' },
      { en: 'Individual Bank Account with Aadhaar Link and DBT Enabled', hi: 'आधार लिंक और डीबीटी (DBT) सक्रिय व्यक्तिगत बैंक खाता' },
      { en: 'Aadhaar Card of the applicant', hi: 'महिला आवेदिका का मूल आधार कार्ड' },
      { en: 'Active mobile number registered with Samagra portal', hi: 'समग्र पोर्टल में दर्ज सक्रिय मोबाइल नंबर' }
    ],
    applySteps: [
      { en: 'Visit your nearest Gram Panchayat or Ward special camp in Madhya Pradesh', hi: 'अपने ग्राम पंचायत या वार्ड में आयोजित लाड़ली बहना विशेष शिविर में जाएं' },
      { en: 'Camp officer enters Samagra ID; live photograph is captured on the spot', hi: 'शिविर प्रभारी समग्र आईडी दर्ज कर आपका लाइव फोटो खींचेंगे' },
      { en: 'Verify that Aadhaar DBT link is active in your bank branch', hi: 'यह सुनिश्चित करें कि आपके बैंक खाते में डीबीटी (DBT) सक्रिय है' },
      { en: 'Receive printed acknowledgment; ₹1,250 is credited on the 10th of every month', hi: 'पावती पर्ची लें; हर माह की 10 तारीख को राशि आपके खाते में आ जाएगी' }
    ],
    officialLink: 'https://cmladlibahna.mp.gov.in/'
  },
  {
    _id: 'sch-8',
    name: {
      en: 'Mukhyamantri Kanya Sumangala Yojana (Uttar Pradesh)',
      hi: 'मुख्यमंत्री कन्या सुमंगला योजना (उत्तर प्रदेश)'
    },
    level: 'STATE',
    state: 'Uttar Pradesh',
    category: 'Education',
    icon: '👧',
    color: '#F59E0B',
    description: {
      en: 'Staged financial incentive of ₹25,000 in 6 installments from girl child birth through college graduation in Uttar Pradesh to end female foeticide and advance higher education.',
      hi: 'उत्तर प्रदेश में बालिकाओं को जन्म से लेकर स्नातक तक की शिक्षा हेतु 6 चरणों में कुल ₹25,000 की वित्तीय सहायता राशि।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 25,
      maxIncomeLPA: 3.0,
      criteria: [
        { en: 'Permanent domicile resident of Uttar Pradesh', hi: 'उत्तर प्रदेश का स्थायी निवास प्रमाण पत्र होना अनिवार्य' },
        { en: 'Family annual household income not exceeding ₹3 Lakh', hi: 'परिवार की वार्षिक आय ₹3 लाख से अधिक न हो' },
        { en: 'Maximum two daughters per family eligible for benefits', hi: 'एक परिवार की अधिकतम दो बालिकाओं को इस योजना का लाभ देय' }
      ]
    },
    benefits: [
      { en: 'Stage 1: ₹5,000 on birth of girl child', hi: 'प्रथम चरण: बालिका के जन्म पर ₹5,000' },
      { en: 'Stage 2 & 3: ₹2,000 on vaccination, ₹3,000 on Class 1 admission', hi: 'द्वितीय व तृतीय: पूर्ण टीकाकरण पर ₹2,000, कक्षा 1 प्रवेश पर ₹3,000' },
      { en: 'Stage 4, 5 & 6: ₹3,000 (Class 6), ₹5,000 (Class 9), ₹7,000 (Degree/Diploma)', hi: 'कक्षा 6 में ₹3,000, कक्षा 9 में ₹5,000 और डिग्री/डिप्लोमा में ₹7,000' }
    ],
    documents: [
      { en: 'Uttar Pradesh Domicile Certificate (निवास प्रमाण पत्र)', hi: 'उत्तर प्रदेश का मूल निवास प्रमाण पत्र' },
      { en: 'Income Certificate under ₹3 Lakh issued by Tehsildar', hi: 'तहसीलदार द्वारा जारी ₹3 लाख से कम का आय प्रमाण पत्र' },
      { en: "Girl Child Birth Certificate or School Admission Slip", hi: 'बालिका का जन्म प्रमाण पत्र या स्कूल प्रवेश पर्ची' },
      { en: 'Joint or Individual Bank Passbook copy with IFSC', hi: 'बैंक पासबुक की प्रति (आईएफएससी कोड सहित)' }
    ],
    applySteps: [
      { en: 'Open official UP Kanya Sumangala portal at mksy.up.gov.in', hi: 'आधिकारिक पोर्टल mksy.up.gov.in पर जाएं' },
      { en: 'Register with mobile number and select applicable installment stage', hi: 'मोबाइल नंबर से पंजीकरण कर बालिका की वर्तमान कक्षा/चरण चुनें' },
      { en: 'Upload birth certificate, school ID, and UP residence proof', hi: 'जन्म प्रमाण पत्र, स्कूल आईडी और निवास प्रमाण पत्र अपलोड करें' },
      { en: 'Block Development Officer (BDO) approves; grant credited via DBT', hi: 'खंड विकास अधिकारी द्वारा सत्यापन उपरांत अनुदान सीधे खाते में प्राप्त होगा' }
    ],
    officialLink: 'https://mksy.up.gov.in/'
  },
  {
    _id: 'sch-9',
    name: {
      en: 'Mukhyamantri Kanya Utthan Yojana (Bihar)',
      hi: 'मुख्यमंत्री कन्या उत्थान योजना (बिहार)'
    },
    level: 'STATE',
    state: 'Bihar',
    category: 'Education',
    icon: '📚',
    color: '#10B981',
    description: {
      en: 'Historic financial reward scheme awarding ₹25,000 to unmarried girls passing Intermediate (12th) and ₹50,000 upon completing Graduation in Bihar to ensure women reach higher education.',
      hi: 'बिहार की बालिकाओं को इंटरमीडिएट (12वीं) पास करने पर ₹25,000 तथा स्नातक (Graduation) पास करने पर ₹50,000 की सीधी प्रोत्साहन राशि।'
    },
    eligibility: {
      minAge: 16,
      maxAge: 28,
      maxIncomeLPA: 99.0,
      criteria: [
        { en: 'Permanent resident girl of Bihar state', hi: 'बिहार राज्य की स्थायी निवासी अविवाहित छात्रा' },
        { en: 'Passed 12th Intermediate or Bachelor Degree from recognized Bihar institution', hi: 'बिहार के मान्यता प्राप्त कॉलेज/विश्वविद्यालय से 12वीं या स्नातक उत्तीर्ण' },
        { en: 'Account held in girl student personal name in a Bihar bank branch', hi: 'छात्रा का व्यक्तिगत बैंक खाता बिहार में स्थित किसी बैंक में होना चाहिए' }
      ]
    },
    benefits: [
      { en: '₹25,000 one-time grant for 12th Intermediate passed unmarried girls', hi: '12वीं इंटरमीडिएट पास करने पर ₹25,000 की एकमुश्त प्रोत्साहन राशि' },
      { en: '₹50,000 direct bank grant upon graduation in Arts, Science, Commerce or Professional courses', hi: 'स्नातक (Graduation) पास करने पर ₹50,000 की सीधी छात्रवृत्ति' },
      { en: 'No income barrier — open to all economic sections across Bihar', hi: 'बिना किसी आय सीमा के बिहार की सभी योग्य छात्राओं के लिए खुला' }
    ],
    documents: [
      { en: 'Bihar Permanent Domicile Certificate (आवासीय प्रमाण पत्र)', hi: 'बिहार का मूल आवासीय प्रमाण पत्र' },
      { en: 'Graduation / 12th Final Passing Marksheet and Admit Card', hi: 'स्नातक या 12वीं की अंतिम अंकतालिका (Marksheet) व प्रवेश पत्र' },
      { en: 'Aadhaar Card of the student', hi: 'छात्रा का आधार कार्ड' },
      { en: 'Student personal bank passbook linked with Aadhaar DBT', hi: 'छात्रा का आधार से जुड़ा व्यक्तिगत बैंक खाता' }
    ],
    applySteps: [
      { en: 'Visit official MedhaSoft portal at medhasoft.bih.nic.in', hi: 'आधिकारिक मेधासॉफ्ट पोर्टल medhasoft.bih.nic.in पर जाएं' },
      { en: 'Enter your University roll number and registration number to verify result', hi: 'अपना यूनिवर्सिटी रोल नंबर और रजिस्ट्रेशन नंबर डालकर परिणाम जांचें' },
      { en: 'Verify Aadhaar name and IFSC bank account details', hi: 'आधार नाम और बैंक खाता विवरण का मिलान करें' },
      { en: 'Upon college verification, ₹50,000 is transferred directly via DBT', hi: 'कॉलेज सत्यापन के बाद ₹50,000 सीधे बैंक खाते में ट्रांसफर हो जाते हैं' }
    ],
    officialLink: 'https://medhasoft.bih.nic.in/'
  },
  {
    _id: 'sch-10',
    name: {
      en: 'Mukhyamantri Rajshree Yojana (Rajasthan)',
      hi: 'मुख्यमंत्री राजश्री योजना (राजस्थान)'
    },
    level: 'STATE',
    state: 'Rajasthan',
    category: 'Health',
    icon: '🏥',
    color: '#6366F1',
    description: {
      en: 'Health and education welfare package providing ₹50,000 in 6 installments for girl children born in government hospitals across Rajasthan, from birth till passing Class 12.',
      hi: 'राजस्थान के सरकारी अस्पतालों में जन्मी बालिकाओं के स्वास्थ्य व 12वीं कक्षा तक की शिक्षा हेतु ₹50,000 की 6 चरणों में आर्थिक सहायता।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 18,
      maxIncomeLPA: 2.5,
      criteria: [
        { en: 'Girl child born in government hospital or accredited private clinic in Rajasthan', hi: 'राजस्थान के राजकीय चिकित्सालय में संस्थागत प्रसव द्वारा जन्मी बालिका' },
        { en: 'Family enrolled in Rajasthan Jan Aadhaar Card system', hi: 'परिवार का राजस्थान जन आधार कार्ड में नामांकन आवश्यक' },
        { en: 'All required childhood vaccinations completed on schedule', hi: 'सभी आवश्यक बाल टीकों का समय पर पूरा होना अनिवार्य' }
      ]
    },
    benefits: [
      { en: '₹2,500 at birth and ₹2,500 upon completing 1-year immunization', hi: 'जन्म पर ₹2,500 तथा 1 वर्ष का टीकाकरण पूरा होने पर ₹2,500' },
      { en: '₹4,000 on Class 1 admission and ₹5,000 on Class 6 admission', hi: 'कक्षा 1 में प्रवेश पर ₹4,000 तथा कक्षा 6 में प्रवेश पर ₹5,000' },
      { en: '₹11,000 on Class 10 admission and ₹25,000 upon passing Class 12', hi: 'कक्षा 10 में ₹11,000 तथा कक्षा 12 उत्तीर्ण करने पर ₹25,000' }
    ],
    documents: [
      { en: 'Rajasthan Jan Aadhaar Card (जन आधार कार्ड)', hi: 'राजस्थान जन आधार कार्ड' },
      { en: 'Mother and Child Protection (MCP) card with vaccine record', hi: 'मातृ एवं शिशु सुरक्षा (एमसीपी) कार्ड' },
      { en: 'Institutional Delivery discharge card and Birth Certificate', hi: 'अस्पताल डिस्चार्ज पर्ची व जन्म प्रमाण पत्र' },
      { en: 'School admission verification certificate for educational stages', hi: 'स्कूल प्रवेश प्रमाण पत्र (आगामी चरणों हेतु)' }
    ],
    applySteps: [
      { en: 'Hospital delivery automatically enrolls mother in Pregnancy Tracking System (PCTS)', hi: 'सरकारी अस्पताल में प्रसव होने पर पीसीटीएस (PCTS) में स्वतः पंजीकरण होता है' },
      { en: 'Submit Jan Aadhaar ID to hospital counter before discharge', hi: 'डिस्चार्ज होने से पहले अस्पताल में जन आधार कार्ड संख्या दर्ज कराएं' },
      { en: 'First two installments credited automatically via DBT', hi: 'पहले दो चरणों की राशि सीधे जन आधार लिंक बैंक खाते में आ जाती है' },
      { en: 'School Headmaster applies for subsequent class admission installments', hi: 'कक्षा प्रवेश पर स्कूल प्रधानाध्यापक द्वारा आगामी किस्तों का आवेदन होता है' }
    ],
    officialLink: 'https://wcd.rajasthan.gov.in/'
  },
  {
    _id: 'sch-11',
    name: {
      en: 'Majhi Kanya Bhagyashree Scheme (Maharashtra)',
      hi: 'माझी कन्या भाग्यश्री योजना (महाराष्ट्र)'
    },
    level: 'STATE',
    state: 'Maharashtra',
    category: 'Financial',
    icon: '🪙',
    color: '#84CC16',
    description: {
      en: 'Fixed financial security deposit of ₹50,000 in bank in the name of the girl child to encourage female child birth and female education across Maharashtra.',
      hi: 'महाराष्ट्र में बालिका जन्म को बढ़ावा देने हेतु बालिका के नाम पर ₹50,000 की बैंक सावधि जमा (FD) सुरक्षा योजना।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 18,
      maxIncomeLPA: 7.5,
      criteria: [
        { en: 'Permanent domicile resident of Maharashtra', hi: 'महाराष्ट्र का स्थायी निवासी होना आवश्यक' },
        { en: 'Family planning certificate after birth of one or two girl children', hi: 'एक या दो बालिकाओं के जन्म उपरांत माता-पिता द्वारा परिवार नियोजन' },
        { en: 'Family annual income under ₹7.5 Lakh', hi: 'पारिवारिक वार्षिक आय ₹7.5 लाख से कम' }
      ]
    },
    benefits: [
      { en: '₹50,000 bank fixed deposit for single girl child in her name', hi: 'एकल बालिका होने पर उसके नाम पर ₹50,000 की बैंक फिक्स्ड डिपॉजिट' },
      { en: '₹25,000 each deposited if two girl children in the family', hi: 'दो बालिकाएं होने पर प्रत्येक के नाम ₹25,000 की सावधि जमा' },
      { en: 'Interest yield can be withdrawn at age 6 and 12 for school fees', hi: 'कक्षा शिक्षा हेतु 6 और 12 वर्ष की आयु में ब्याज राशि निकालने की छूट' }
    ],
    documents: [
      { en: 'Maharashtra Domicile Certificate (अधिवास प्रमाणपत्र)', hi: 'महाराष्ट्र अधिवास (Domicile) प्रमाणपत्र' },
      { en: "Girl Child Birth Certificate", hi: 'बालिका का जन्म प्रमाणपत्र' },
      { en: 'Family Income Certificate under 7.5 LPA', hi: 'तहसीलदार द्वारा जारी आय प्रमाणपत्र' },
      { en: 'Hospital Family Planning surgery certificate of parent', hi: 'अस्पताल द्वारा जारी परिवार नियोजन प्रमाणपत्र' }
    ],
    applySteps: [
      { en: 'Contact your local Anganwadi Sevika or Taluka Women & Child Development Officer', hi: 'अपनी स्थानीय आंगनवाड़ी सेविका या तालुका महिला व बाल विकास अधिकारी से मिलें' },
      { en: 'Submit application along with birth certificate and family planning proof', hi: 'बालिका के जन्म प्रमाण और नसबंदी प्रमाण पत्र के साथ फॉर्म जमा करें' },
      { en: 'WCD approves and deposits funds directly into designated nationalized bank', hi: 'महिला व बाल विकास विभाग द्वारा सरकारी बैंक में बालिका के नाम FD कराई जाती है' },
      { en: 'Receive official Bank FD Bond Certificate in child name', hi: 'बालिका के नाम आधिकारिक बैंक एफडी बॉन्ड प्राप्त करें' }
    ],
    officialLink: 'https://womenchild.maharashtra.gov.in/'
  },
  {
    _id: 'sch-12',
    name: {
      en: 'Vahli Dikri Yojana (Gujarat)',
      hi: 'વ્હાલી દીકરી યોજના / मुख्यमंत्री व्हाली डिकरी योजना (गुजरात)'
    },
    level: 'STATE',
    state: 'Gujarat',
    category: 'Financial',
    icon: '🌼',
    color: '#14B8A6',
    description: {
      en: 'Comprehensive financial incentive of ₹1,10,000 provided across three stages (Class 1, Class 9, and at age 18) for first two girl children in Gujarat families to eradicate sex-ratio imbalance.',
      hi: 'गुजरात में बालिकाओं के सशक्तिकरण हेतु 3 चरणों (कक्षा 1, कक्षा 9 और 18 वर्ष आयु) में कुल ₹1,10,000 की समग्र आर्थिक सहायता।'
    },
    eligibility: {
      minAge: 0,
      maxAge: 18,
      maxIncomeLPA: 2.0,
      criteria: [
        { en: 'Permanent resident family of Gujarat state', hi: 'गुजरात राज्य का स्थायी निवासी परिवार' },
        { en: 'Family annual income under ₹2 Lakh', hi: 'परिवार की वार्षिक आय ₹2 लाख से कम हो' },
        { en: 'Application submitted within 1 year of girl child birth', hi: 'बालिका के जन्म के 1 वर्ष के भीतर आवेदन किया गया हो' }
      ]
    },
    benefits: [
      { en: 'First Stage: ₹4,000 cash grant upon admission into Class 1', hi: 'प्रथम चरण: कक्षा 1 में प्रवेश पर ₹4,000 की सहायता' },
      { en: 'Second Stage: ₹6,000 cash grant upon admission into Class 9', hi: 'द्वितीय चरण: कक्षा 9 में प्रवेश पर ₹6,000 की सहायता' },
      { en: 'Final Stage: ₹1,00,000 lump-sum at age 18 for college degree or marriage', hi: 'अंतिम चरण: 18 वर्ष की आयु पूरी होने पर उच्च शिक्षा हेतु ₹1,00,000 एकमुश्त' }
    ],
    documents: [
      { en: 'Gujarat Domicile Proof or Ration Card', hi: 'गुजरात का निवास प्रमाण पत्र या राशन कार्ड' },
      { en: 'Income Certificate under ₹2 Lakh from Talati / Mamlatdar', hi: 'मामलतदार या तलाटी द्वारा जारी ₹2 लाख से कम का आय प्रमाण पत्र' },
      { en: 'Birth Certificate of girl child', hi: 'बालिका का जन्म प्रमाण पत्र' },
      { en: 'Parents Aadhaar Card and active Bank Passbook', hi: 'माता-पिता का आधार कार्ड और बैंक पासबुक' }
    ],
    applySteps: [
      { en: 'Visit nearest Anganwadi Centre, Taluka Panchayat office or Gram Seva Kendra', hi: 'नजदीकी आंगनवाड़ी केंद्र, तालुका पंचायत या ग्राम सेवा केंद्र पर जाएं' },
      { en: 'Fill out Vahli Dikri Yojana Application within 1 year of child birth', hi: 'बच्ची के जन्म के 1 वर्ष के भीतर व्हाली डिकरी योजना का फॉर्म भरें' },
      { en: 'CDPO (Child Development Project Officer) verifies all attached certificates', hi: 'सीडीपीओ (CDPO) द्वारा दस्तावेजों का भौतिक सत्यापन किया जाता है' },
      { en: 'Receive official sanction certificate for all 3 phased installments', hi: 'तीनों चरणों के लाभ हेतु आधिकारिक स्वीकृति पत्र प्राप्त करें' }
    ],
    officialLink: 'https://wcd.gujarat.gov.in/'
  }
];

export default function SchemesTab() {
  // ─── App Context ───────────────────────────────────────────────────────────
  let appCtx = { language: 'hi', t: (k, fb) => fb || k };
  try {
    appCtx = useApp();
  } catch (err) {}
  const { language = 'hi', t } = appCtx || {};

  // ─── Filter States ────────────────────────────────────────────────────────
  const [filterLevel, setFilterLevel] = useState('All'); // 'All' | 'CENTRAL' | 'STATE'
  const [filterState, setFilterState] = useState('All'); // 'All' | 'All India' | 'Madhya Pradesh' | ...
  const [filterCategory, setFilterCategory] = useState('All'); // 'All' | 'Health' | 'Financial' | 'Education' | 'Employment'
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Eligibility Checker States ───────────────────────────────────────────
  const [userAge, setUserAge] = useState('');
  const [userIncome, setUserIncome] = useState('');
  const [isEligibilityActive, setIsEligibilityActive] = useState(false);

  // ─── Data & Loading States ────────────────────────────────────────────────
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalScheme, setActiveModalScheme] = useState(null);

  // States List as requested
  const stateOptions = [
    { value: 'All', labelEn: 'All States / Pan-India', labelHi: 'सभी राज्य / संपूर्ण भारत' },
    { value: 'All India', labelEn: 'Central / All India', labelHi: 'केंद्र सरकार / अखिल भारतीय' },
    { value: 'Madhya Pradesh', labelEn: 'Madhya Pradesh', labelHi: 'मध्य प्रदेश' },
    { value: 'Uttar Pradesh', labelEn: 'Uttar Pradesh', labelHi: 'उत्तर प्रदेश' },
    { value: 'Bihar', labelEn: 'Bihar', labelHi: 'बिहार' },
    { value: 'Rajasthan', labelEn: 'Rajasthan', labelHi: 'राजस्थान' },
    { value: 'Maharashtra', labelEn: 'Maharashtra', labelHi: 'महाराष्ट्र' },
    { value: 'Gujarat', labelEn: 'Gujarat', labelHi: 'गुजरात' }
  ];

  // Categories List
  const categoryOptions = [
    { value: 'All', labelEn: 'All Categories', labelHi: 'सभी श्रेणियां', icon: '✨' },
    { value: 'Health', labelEn: 'Health & Nutrition', labelHi: 'स्वास्थ्य एवं पोषण', icon: '🩺' },
    { value: 'Financial', labelEn: 'Financial Assistance', labelHi: 'वित्तीय सहायता व बचत', icon: '💰' },
    { value: 'Education', labelEn: 'Girls Education', labelHi: 'बालिका शिक्षा व छात्रवृत्ति', icon: '🎓' },
    { value: 'Employment', labelEn: 'Employment & SHG', labelHi: 'रोजगार व स्वयं सहायता', icon: '💼' }
  ];

  // ─── Fetch Schemes from Backend ───────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    async function loadSchemes() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterLevel !== 'All') params.append('level', filterLevel);
        if (filterState !== 'All') params.append('state', filterState);
        if (filterCategory !== 'All') params.append('category', filterCategory);
        if (isEligibilityActive && userAge) params.append('minAge', userAge);
        if (isEligibilityActive && userIncome) params.append('maxIncome', userIncome);

        const url = `/api/schemes?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch schemes');
        const data = await res.json();

        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setSchemes(data);
          } else {
            // Apply filtering over comprehensive fallback data
            applyFallbackFiltering();
          }
        }
      } catch (err) {
        if (isMounted) {
          applyFallbackFiltering();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    function applyFallbackFiltering() {
      let filtered = [...FALLBACK_SCHEMES];

      if (filterLevel !== 'All') {
        filtered = filtered.filter(s => s.level === filterLevel);
      }

      if (filterState !== 'All') {
        filtered = filtered.filter(s => s.state === filterState || s.state === 'All India');
      }

      if (filterCategory !== 'All') {
        filtered = filtered.filter(s => s.category === filterCategory);
      }

      if (isEligibilityActive) {
        const ageNum = parseFloat(userAge);
        const incomeNum = parseFloat(userIncome);

        if (!isNaN(ageNum)) {
          filtered = filtered.filter(s => {
            const min = s.eligibility?.minAge ?? 0;
            const max = s.eligibility?.maxAge ?? 100;
            return ageNum >= min && ageNum <= max;
          });
        }

        if (!isNaN(incomeNum)) {
          filtered = filtered.filter(s => {
            const maxInc = s.eligibility?.maxIncomeLPA ?? 99;
            return incomeNum <= maxInc;
          });
        }
      }

      setSchemes(filtered);
    }

    loadSchemes();
    return () => {
      isMounted = false;
    };
  }, [filterLevel, filterState, filterCategory, isEligibilityActive, userAge, userIncome]);

  // ─── Search Query & Sorting: CENTRAL first, then STATE-wise ──────────────
  const displayedSchemes = useMemo(() => {
    let list = [...schemes];

    // Search query filter (search across English and Hindi titles & descriptions)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s => {
        const nameEn = s.name?.en?.toLowerCase() || '';
        const nameHi = s.name?.hi?.toLowerCase() || '';
        const descEn = s.description?.en?.toLowerCase() || '';
        const descHi = s.description?.hi?.toLowerCase() || '';
        const state = s.state?.toLowerCase() || '';
        return (
          nameEn.includes(q) ||
          nameHi.includes(q) ||
          descEn.includes(q) ||
          descHi.includes(q) ||
          state.includes(q)
        );
      });
    }

    // Sort: CENTRAL schemes first, then state-wise
    list.sort((a, b) => {
      if (a.level === 'CENTRAL' && b.level !== 'CENTRAL') return -1;
      if (a.level !== 'CENTRAL' && b.level === 'CENTRAL') return 1;
      // Secondary sort: State name
      return (a.state || '').localeCompare(b.state || '');
    });

    return list;
  }, [schemes, searchQuery]);

  // ─── Reset All Filters ────────────────────────────────────────────────────
  const handleResetFilters = () => {
    setFilterLevel('All');
    setFilterState('All');
    setFilterCategory('All');
    setSearchQuery('');
    setUserAge('');
    setUserIncome('');
    setIsEligibilityActive(false);
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModalScheme(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* ─── Hero Banner & Heading ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute right-32 -bottom-10 w-36 h-36 rounded-full bg-rose-400/20 blur-lg pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white">
            <Landmark className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सरकारी महिला कल्याण योजनाएं' : 'Government Welfare Portal'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            {language === 'hi'
              ? 'नारी सशक्तिकरण एवं सरकारी योजनाएं'
              : 'Empowerment & Government Schemes for Women'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
            {language === 'hi'
              ? 'केंद्र और राज्य सरकारों द्वारा बालिकाओं, माताओं एवं ग्रामीण महिलाओं के लिए चलाई जा रही प्रमुख योजनाओं की संपूर्ण जानकारी, पात्रता जांच, आवश्यक दस्तावेज एवं आवेदन प्रक्रिया।'
              : 'Comprehensive verified portal for central and state welfare programs, direct benefit transfer (DBT) guidelines, eligibility checking, and step-by-step application walkthroughs.'}
          </p>
        </div>
      </div>

      {/* ─── Eligibility Checker & Filter Bar Section ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Eligibility Checker Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-750 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                {language === 'hi' ? 'पात्रता जांचक (Eligibility)' : 'Eligibility Checker'}
              </h2>
            </div>
            {isEligibilityActive && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 animate-pulse">
                Active
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'hi'
              ? 'अपनी उम्र और पारिवारिक वार्षिक आय दर्ज कर अपने लिए उपयुक्त योजनाएं खोजें।'
              : 'Enter your age and annual household income to filter schemes you qualify for.'}
          </p>

          <div className="space-y-3.5">
            {/* Age Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{language === 'hi' ? 'आपकी आयु (Age in Years)' : 'Your Age (Years)'}</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder={language === 'hi' ? 'उदा. 24' : 'e.g. 24'}
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Income Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                <span>{language === 'hi' ? 'वार्षिक पारिवारिक आय (LPA)' : 'Annual Household Income (LPA)'}</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                placeholder={language === 'hi' ? 'उदा. 2.0 (लाख में)' : 'e.g. 2.5 (in Lakhs)'}
                value={userIncome}
                onChange={(e) => setUserIncome(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEligibilityActive(true)}
                className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
              </button>

              {(isEligibilityActive || userAge || userIncome) && (
                <button
                  type="button"
                  onClick={() => {
                    setUserAge('');
                    setUserIncome('');
                    setIsEligibilityActive(false);
                  }}
                  className="py-2.5 px-3 rounded-xl font-semibold text-xs text-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-750 dark:hover:bg-gray-700 transition"
                  title={language === 'hi' ? 'रीसेट करें' : 'Reset'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: 3 Filter Dropdowns & Live Search (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 dark:border-gray-750 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                {language === 'hi' ? 'योजना खोज एवं फ़िल्टर' : 'Filter Schemes'}
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={language === 'hi' ? 'नाम या कीवर्ड से खोजें...' : 'Search scheme by name...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 3 Dropdowns Bar in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Level Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                {language === 'hi' ? 'स्तर (Level):' : 'Level:'}
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="All">{language === 'hi' ? 'सभी स्तर (All Levels)' : 'All / Central & State'}</option>
                <option value="CENTRAL">{language === 'hi' ? 'केंद्रीय योजनाएं (Central)' : 'Central Schemes'}</option>
                <option value="STATE">{language === 'hi' ? 'राज्य योजनाएं (State)' : 'State Schemes'}</option>
              </select>
            </div>

            {/* 2. State Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                {language === 'hi' ? 'राज्य (State):' : 'State:'}
              </label>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {stateOptions.map(st => (
                  <option key={st.value} value={st.value}>
                    {language === 'hi' ? st.labelHi : st.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Category Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                {language === 'hi' ? 'श्रेणी (Category):' : 'Category:'}
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {categoryOptions.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {language === 'hi' ? cat.labelHi : cat.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Badges & Reset Link */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-gray-500 dark:text-gray-400">
              {language === 'hi' ? 'उपलब्ध योजनाएं:' : 'Showing:'}{' '}
              <span className="font-bold text-gray-900 dark:text-white">{displayedSchemes.length}</span>{' '}
              {language === 'hi' ? 'कल्याणकारी योजनाएं' : 'Schemes'}
            </span>

            {(filterLevel !== 'All' || filterState !== 'All' || filterCategory !== 'All' || searchQuery || isEligibilityActive) && (
              <button
                onClick={handleResetFilters}
                className="text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'hi' ? 'सभी फ़िल्टर साफ़ करें' : 'Clear All Filters'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Scheme Cards Grid ────────────────────────────────────────────── */}
      <div>
        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-750 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-gray-100 dark:bg-gray-750 rounded w-full" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-750 rounded w-4/5" />
                </div>
                <div className="h-8 bg-gray-100 dark:bg-gray-750 rounded-xl w-full pt-3" />
              </div>
            ))}
          </div>
        ) : displayedSchemes.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700 space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center text-3xl">
              🔍
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {language === 'hi' ? 'कोई योजना नहीं मिली' : 'No Schemes Matched Your Filters'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {language === 'hi'
                ? 'आपके द्वारा चुने गए फ़िल्टर (राज्य, स्तर या पात्रता) के अनुसार कोई परिणाम नहीं मिला। कृपया फ़िल्टर रीसेट करें।'
                : 'No welfare programs matched your current criteria. Try adjusting the level, state, or eligibility parameters.'}
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset All Filters'}</span>
            </button>
          </div>
        ) : (
          /* Scheme Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedSchemes.map((scheme) => {
              const nameText = language === 'hi' ? scheme.name?.hi || scheme.name?.en : scheme.name?.en || scheme.name?.hi;
              const subName = language === 'hi' ? scheme.name?.en : scheme.name?.hi;
              const descText = language === 'hi' ? scheme.description?.hi || scheme.description?.en : scheme.description?.en || scheme.description?.hi;
              const isCentral = scheme.level === 'CENTRAL';

              // Category color mapping
              let catBadgeClass = 'bg-gray-100 text-gray-800 dark:bg-gray-750 dark:text-gray-300';
              if (scheme.category === 'Health') catBadgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
              else if (scheme.category === 'Financial') catBadgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300';
              else if (scheme.category === 'Education') catBadgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
              else if (scheme.category === 'Employment') catBadgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';

              return (
                <div
                  key={scheme._id}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-200/90 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  {/* Top: Icon + Badges */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-750 flex items-center justify-center text-2xl border border-gray-100 dark:border-gray-700 shrink-0 shadow-inner">
                        {scheme.icon || '🏛️'}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {/* Level Badge: CENTRAL = blue, STATE = orange */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            isCentral
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                          }`}
                        >
                          {isCentral
                            ? language === 'hi' ? 'केंद्रीय (CENTRAL)' : 'CENTRAL'
                            : language === 'hi' ? 'राज्य (STATE)' : 'STATE'}
                        </span>

                        {/* Category Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${catBadgeClass}`}>
                          {scheme.category || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                        {nameText}
                      </h3>
                      {subName && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {subName}
                        </p>
                      )}
                    </div>

                    {/* State Tag if State-level */}
                    {!isCentral && scheme.state && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-md">
                        <Building2 className="w-3 h-3" />
                        <span>{scheme.state}</span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {descText}
                    </p>
                  </div>

                  {/* Eligibility Criteria Preview */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-750 space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-750/70 p-2.5 rounded-xl text-[11px] text-gray-700 dark:text-gray-300 space-y-1">
                      <span className="font-bold text-gray-900 dark:text-white block text-[10px] uppercase tracking-wider">
                        {language === 'hi' ? 'पात्रता सारांश:' : 'Eligibility Preview:'}
                      </span>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-gray-600 dark:text-gray-400">
                        {scheme.eligibility?.minAge !== undefined && (
                          <span>
                            {language === 'hi' ? 'आयु:' : 'Age:'} {scheme.eligibility.minAge}–{scheme.eligibility.maxAge || '65'}{' '}
                            {language === 'hi' ? 'वर्ष' : 'Yrs'}
                          </span>
                        )}
                        {scheme.eligibility?.maxIncomeLPA && scheme.eligibility.maxIncomeLPA < 50 && (
                          <span>
                            {language === 'hi' ? 'आय:' : 'Income:'} &lt; ₹{scheme.eligibility.maxIncomeLPA} LPA
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => setActiveModalScheme(scheme)}
                      className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-indigo-600 hover:text-white dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-600 dark:bg-indigo-950/50 dark:hover:bg-indigo-600 border border-indigo-200 dark:border-indigo-900/60 transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>{language === 'hi' ? 'संपूर्ण विवरण देखें' : 'View Full Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCHEME DETAIL MODAL                                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeModalScheme && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          {/* Backdrop Click */}
          <div
            className="fixed inset-0"
            onClick={() => setActiveModalScheme(null)}
          />

          {/* Modal Container */}
          <div className="relative bg-white dark:bg-gray-850 rounded-3xl max-w-3xl w-full border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-rose-700 text-white flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {activeModalScheme.icon || '🏛️'}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white">
                      {activeModalScheme.level === 'CENTRAL' ? 'CENTRAL SCHEME' : `STATE SCHEME (${activeModalScheme.state})`}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                      {activeModalScheme.category}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold leading-snug">
                    {language === 'hi'
                      ? activeModalScheme.name?.hi || activeModalScheme.name?.en
                      : activeModalScheme.name?.en || activeModalScheme.name?.hi}
                  </h2>
                  <p className="text-xs text-blue-100 mt-0.5">
                    {language === 'hi' ? activeModalScheme.name?.en : activeModalScheme.name?.hi}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveModalScheme(null)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700 dark:text-gray-300">
              {/* Detailed Description */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{language === 'hi' ? 'योजना का उद्देश्य एवं विवरण' : 'Scheme Overview'}</span>
                </h4>
                <p className="leading-relaxed bg-gray-50 dark:bg-gray-800 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700">
                  {language === 'hi'
                    ? activeModalScheme.description?.hi || activeModalScheme.description?.en
                    : activeModalScheme.description?.en || activeModalScheme.description?.hi}
                </p>
              </div>

              {/* Key Benefits with Tick Icons (✓) */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{language === 'hi' ? 'प्रमुख वित्तीय एवं सामाजिक लाभ (Benefits)' : 'Key Benefits'}</span>
                </h4>
                <div className="space-y-2">
                  {(activeModalScheme.benefits || []).map((ben, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span className="font-medium text-emerald-950 dark:text-emerald-200 leading-snug">
                        {typeof ben === 'string' ? ben : language === 'hi' ? ben.hi : ben.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-indigo-700 dark:text-indigo-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{language === 'hi' ? 'पात्रता की शर्तें (Eligibility Criteria)' : 'Eligibility Criteria'}</span>
                </h4>
                <div className="space-y-1.5">
                  {(activeModalScheme.eligibility?.criteria || []).map((crit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                    >
                      <span className="text-indigo-500 font-bold mt-0.5">•</span>
                      <span>{typeof crit === 'string' ? crit : language === 'hi' ? crit.hi : crit.en}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-blue-700 dark:text-blue-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{language === 'hi' ? 'आवश्यक दस्तावेज (Documents Required)' : 'Required Documents'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(activeModalScheme.documents || []).map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-blue-950 dark:text-blue-200"
                    >
                      <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span className="font-medium text-[11px] leading-snug">
                        {typeof doc === 'string' ? doc : language === 'hi' ? doc.hi : doc.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Application Guide */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-rose-700 dark:text-rose-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>{language === 'hi' ? 'आवेदन करने की चरणबद्ध प्रक्रिया (Step-by-Step Guide)' : 'Step-by-Step Application Guide'}</span>
                </h4>
                <div className="space-y-2">
                  {(activeModalScheme.applySteps || []).map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200 leading-snug pt-0.5">
                        {typeof step === 'string' ? step : language === 'hi' ? step.hi : step.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setActiveModalScheme(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-650 transition"
              >
                {language === 'hi' ? 'बंद करें (Close)' : 'Close'}
              </button>

              {activeModalScheme.officialLink && (
                <a
                  href={activeModalScheme.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === 'hi' ? 'आधिकारिक पोर्टल पर जाएं' : 'Official Website Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
