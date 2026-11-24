import React, { useState, useEffect, useMemo, useCallback } from 'react';
import QRCode from 'qrcode.react';
import {
  HandHeart,
  HeartHandshake,
  IndianRupee,
  QrCode,
  Shirt,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Send,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Filter,
  Copy,
  Check,
  PackageCheck,
  ShieldCheck,
  Calendar,
  Search,
  MessageSquare,
  Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function SupportTab() {
  const { t, language } = useApp();
  const { token } = useAuth();
  const isHindi = language === 'hi';

  // ─── Active Sub-section ──────────────────────────────────────────
  // 'requests' | 'money' | 'clothes'
  const [activeSection, setActiveSection] = useState('requests');

  // ─── State: Request Support ─────────────────────────────────────
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestCategoryFilter, setRequestCategoryFilter] = useState('ALL');
  const [requestSearch, setRequestSearch] = useState('');

  const [requestForm, setRequestForm] = useState({
    requesterName: '',
    village: '',
    district: '',
    state: 'Rajasthan',
    category: 'FINANCIAL',
    description: '',
    amountNeeded: '',
    contactPhone: ''
  });
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  // ─── State: Donate Money ────────────────────────────────────────
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [loadingMoney, setLoadingMoney] = useState(false);

  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('500');
  const recipientUpi = 'sakhishakti@upi';
  const [generatedUpiUrl, setGeneratedUpiUrl] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Confirm payment form
  const [confirmDonorName, setConfirmDonorName] = useState('');
  const [confirmAmount, setConfirmAmount] = useState('500');
  const [upiRef, setUpiRef] = useState('');
  const [moneyMessage, setMoneyMessage] = useState('');
  const [submittingMoney, setSubmittingMoney] = useState(false);
  const [moneySuccess, setMoneySuccess] = useState('');
  const [moneyError, setMoneyError] = useState('');

  // ─── State: Donate Clothes ──────────────────────────────────────
  const [clothesDonations, setClothesDonations] = useState([]);
  const [loadingClothes, setLoadingClothes] = useState(false);

  const [clothesForm, setClothesForm] = useState({
    donorName: '',
    pickupAddress: '',
    itemCount: '5',
    condition: 'GOOD',
    message: ''
  });
  const [submittingClothes, setSubmittingClothes] = useState(false);
  const [clothesSuccess, setClothesSuccess] = useState('');
  const [clothesError, setClothesError] = useState('');

  // ─── Fetch Support Requests ──────────────────────────────────────
  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const res = await fetch(`${API_BASE}/api/support-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Error fetching support requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  }, [token]);

  // ─── Fetch Donations (Money & Clothes) ───────────────────────────
  const fetchMoneyDonations = useCallback(async () => {
    setLoadingMoney(true);
    try {
      const res = await fetch(`${API_BASE}/api/donations?type=MONEY`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMoneyDonations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Error fetching money donations:', err);
    } finally {
      setLoadingMoney(false);
    }
  }, [token]);

  const fetchClothesDonations = useCallback(async () => {
    setLoadingClothes(true);
    try {
      const res = await fetch(`${API_BASE}/api/donations?type=CLOTHES`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setClothesDonations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Error fetching clothes donations:', err);
    } finally {
      setLoadingClothes(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequests();
    fetchMoneyDonations();
    fetchClothesDonations();
  }, [fetchRequests, fetchMoneyDonations, fetchClothesDonations]);

  // ─── Pre-fill initial QR Code URL ──────────────────────────────
  useEffect(() => {
    const validAmount = amount && !isNaN(amount) && Number(amount) > 0 ? amount : '500';
    const upiUrl = `upi://pay?pa=${recipientUpi}&pn=SakhiShakti&am=${validAmount}&cu=INR`;
    setGeneratedUpiUrl(upiUrl);
  }, [amount]);

  // ─── Submit Support Request ─────────────────────────────────────
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setRequestSuccess('');
    setRequestError('');

    if (!requestForm.requesterName.trim()) {
      setRequestError(isHindi ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
      return;
    }
    if (!requestForm.description.trim()) {
      setRequestError(isHindi ? 'कृपया अपनी आवश्यकता का विवरण दर्ज करें।' : 'Please describe your request.');
      return;
    }

    setSubmittingRequest(true);
    try {
      const payload = {
        requesterName: requestForm.requesterName.trim(),
        village: requestForm.village.trim(),
        district: requestForm.district.trim(),
        state: requestForm.state.trim(),
        category: requestForm.category,
        description: requestForm.description.trim(),
        amountNeeded: requestForm.amountNeeded ? Number(requestForm.amountNeeded) : undefined,
        contactPhone: requestForm.contactPhone.trim()
      };

      const res = await fetch(`${API_BASE}/api/support-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit request');
      }

      const created = await res.json();
      setRequests((prev) => [created, ...prev]);
      setRequestSuccess(
        isHindi
          ? 'आपका सहायता अनुरोध सफलतापूर्वक दर्ज कर लिया गया है। सखी वालंटियर आपसे जल्द संपर्क करेंगे।'
          : 'Your support request has been submitted successfully. A Sakhi volunteer will verify and assist soon.'
      );
      setRequestForm({
        requesterName: '',
        village: '',
        district: '',
        state: 'Rajasthan',
        category: 'FINANCIAL',
        description: '',
        amountNeeded: '',
        contactPhone: ''
      });
      setTimeout(() => setRequestSuccess(''), 7000);
    } catch (err) {
      setRequestError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  // ─── Handle Generate QR ─────────────────────────────────────────
  const handleGenerateQR = (e) => {
    if (e) e.preventDefault();
    const cleanAmount = amount && !isNaN(amount) && Number(amount) > 0 ? Number(amount) : 500;
    const url = `upi://pay?pa=${recipientUpi}&pn=SakhiShakti&am=${cleanAmount}&cu=INR`;
    setGeneratedUpiUrl(url);
    setConfirmAmount(cleanAmount.toString());
    if (donorName) setConfirmDonorName(donorName);
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(recipientUpi).then(() => {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }).catch(() => {});
  };

  // ─── Submit Money Donation ──────────────────────────────────────
  const handleConfirmMoneyDonation = async (e) => {
    e.preventDefault();
    setMoneySuccess('');
    setMoneyError('');

    const finalName = confirmDonorName.trim() || donorName.trim();
    if (!finalName) {
      setMoneyError(isHindi ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
      return;
    }
    if (!upiRef.trim()) {
      setMoneyError(
        isHindi
          ? 'कृपया 12 अंकों का यूपीआई संदर्भ संख्या (UTR / Ref Number) दर्ज करें।'
          : 'Please enter the UPI Reference / UTR Number for verification.'
      );
      return;
    }

    setSubmittingMoney(true);
    try {
      const payload = {
        donorName: finalName,
        type: 'MONEY',
        amount: Number(confirmAmount) || Number(amount) || 500,
        upiRef: upiRef.trim(),
        message: moneyMessage.trim()
      };

      const res = await fetch(`${API_BASE}/api/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit donation record');
      }

      const created = await res.json();
      setMoneyDonations((prev) => [created, ...prev]);
      setMoneySuccess(
        isHindi
          ? `धन्यवाद ${finalName}! आपका ₹${payload.amount} का योगदान दर्ज हो चुका है। संदर्भ: ${upiRef}`
          : `Thank you ${finalName}! Your donation of ₹${payload.amount} has been recorded. Reference: ${upiRef}`
      );
      setUpiRef('');
      setMoneyMessage('');
      setTimeout(() => setMoneySuccess(''), 7000);
    } catch (err) {
      setMoneyError(err.message || 'Error recording donation. Please retry.');
    } finally {
      setSubmittingMoney(false);
    }
  };

  // ─── Submit Clothes Donation ────────────────────────────────────
  const handleSubmitClothes = async (e) => {
    e.preventDefault();
    setClothesSuccess('');
    setClothesError('');

    if (!clothesForm.donorName.trim()) {
      setClothesError(isHindi ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter donor name.');
      return;
    }
    if (!clothesForm.pickupAddress.trim()) {
      setClothesError(isHindi ? 'कृपया पिकअप पता दर्ज करें।' : 'Please enter pickup address.');
      return;
    }

    setSubmittingClothes(true);
    try {
      const payload = {
        donorName: clothesForm.donorName.trim(),
        type: 'CLOTHES',
        pickupAddress: clothesForm.pickupAddress.trim(),
        itemCount: Number(clothesForm.itemCount) || 1,
        condition: clothesForm.condition,
        message: clothesForm.message.trim()
      };

      const res = await fetch(`${API_BASE}/api/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit clothes donation');
      }

      const created = await res.json();
      setClothesDonations((prev) => [created, ...prev]);
      setClothesSuccess(
        isHindi
          ? `धन्यवाद ${payload.donorName}! ${payload.itemCount} कपड़ों का पिकअप अनुरोध दर्ज हुआ। सखी वालंटियर आपसे जल्द संपर्क करेंगे।`
          : `Thank you ${payload.donorName}! Your request for ${payload.itemCount} clothes items has been logged. Volunteer will contact for pickup.`
      );
      setClothesForm({
        donorName: '',
        pickupAddress: '',
        itemCount: '5',
        condition: 'GOOD',
        message: ''
      });
      setTimeout(() => setClothesSuccess(''), 7000);
    } catch (err) {
      setClothesError(err.message || 'Error submitting clothes donation.');
    } finally {
      setSubmittingClothes(false);
    }
  };

  // ─── Filtered Support Requests ──────────────────────────────────
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesCategory =
        requestCategoryFilter === 'ALL' || req.category === requestCategoryFilter;
      const q = requestSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        req.requesterName?.toLowerCase().includes(q) ||
        req.village?.toLowerCase().includes(q) ||
        req.district?.toLowerCase().includes(q) ||
        req.description?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [requests, requestCategoryFilter, requestSearch]);

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            {isHindi ? 'प्रतीक्षारत (Pending)' : 'Pending'}
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {isHindi ? 'समीक्षाधीन (In Review)' : 'In Review'}
          </span>
        );
      case 'FULFILLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {isHindi ? 'पूर्ण (Fulfilled)' : 'Fulfilled'}
          </span>
        );
      case 'CLOSED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
            {isHindi ? 'समाप्त (Closed)' : 'Closed'}
          </span>
        );
    }
  };

  // Category Badge Helper
  const renderCategoryBadge = (category) => {
    switch (category) {
      case 'FINANCIAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <IndianRupee className="w-3 h-3" />
            {isHindi ? 'आर्थिक (Financial)' : 'Financial'}
          </span>
        );
      case 'EDUCATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            🎓 {isHindi ? 'शिक्षा (Education)' : 'Education'}
          </span>
        );
      case 'HEALTH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            ❤️ {isHindi ? 'स्वास्थ्य (Health)' : 'Health'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
            {category}
          </span>
        );
    }
  };

  // Indian States List for easy dropdown
  const indianStates = [
    'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Bihar', 'Maharashtra',
    'Gujarat', 'Haryana', 'Punjab', 'West Bengal', 'Odisha', 'Jharkhand',
    'Chhattisgarh', 'Assam', 'Himachal Pradesh', 'Uttarakhand', 'Delhi'
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-8 animate-fadeIn">
      {/* ─── Hero Header Banner ──────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl shadow-teal-500/10">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 opacity-15 pointer-events-none hidden md:block">
          <HeartHandshake className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {isHindi ? 'सखी शक्ति समुदाय' : 'Sakhi Shakti Community'}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isHindi
              ? 'सामुदायिक सहयोग एवं सशक्तिकरण'
              : 'Support, Share & Empower'}
          </h1>

          <p className="text-emerald-50 text-sm sm:text-base leading-relaxed">
            {isHindi
              ? 'ग्रामीण बहनों की सहायता हेतु मंच। शिक्षा, स्वास्थ्य या आर्थिक संकट में सहायता मांगें, या यूपीआई व वस्त्र दान कर किसी के जीवन में आशा का दीप जलाएं।'
              : 'Stand shoulder to shoulder with rural sisters. Request urgent help in health, education or financial hardship, or donate funds via UPI and clothes to create lasting change.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 pt-sm-4 border-t border-white/20">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3">
              <p className="text-xs text-emerald-100 font-medium">
                {isHindi ? 'सक्रिय अनुरोध' : 'Open Requests'}
              </p>
              <p className="text-lg sm:text-2xl font-bold">{requests.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3">
              <p className="text-xs text-emerald-100 font-medium">
                {isHindi ? 'आर्थिक दान' : 'UPI Donations'}
              </p>
              <p className="text-lg sm:text-2xl font-bold">{moneyDonations.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3">
              <p className="text-xs text-emerald-100 font-medium">
                {isHindi ? 'वस्त्र दान' : 'Clothes Donated'}
              </p>
              <p className="text-lg sm:text-2xl font-bold">{clothesDonations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3 Sub-Section Switcher Tabs ─────────────────────────── */}
      <div className="flex p-1.5 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-inner">
        {/* Tab 1: Request Support */}
        <button
          onClick={() => setActiveSection('requests')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 ${
            activeSection === 'requests'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 scale-[1.01]'
              : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
          }`}
        >
          <HandHeart className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{isHindi ? 'सहायता अनुरोध' : 'Request Support'}</span>
        </button>

        {/* Tab 2: Donate Money */}
        <button
          onClick={() => setActiveSection('money')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 ${
            activeSection === 'money'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 scale-[1.01]'
              : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
          }`}
        >
          <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{isHindi ? 'आर्थिक दान (UPI)' : 'Donate Money'}</span>
        </button>

        {/* Tab 3: Donate Clothes */}
        <button
          onClick={() => setActiveSection('clothes')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 ${
            activeSection === 'clothes'
              ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-md shadow-rose-500/25 scale-[1.01]'
              : 'text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400'
          }`}
        >
          <Shirt className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{isHindi ? 'वस्त्र दान' : 'Donate Clothes'}</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SUB-SECTION 1: REQUEST SUPPORT (Emerald / Teal Theme)
          ═══════════════════════════════════════════════════════════════ */}
      {activeSection === 'requests' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Support Request Form Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-900/40 shadow-xl shadow-emerald-500/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                <HandHeart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {isHindi ? 'सहायता का नया अनुरोध दर्ज करें' : 'Submit a Support Request'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {isHindi
                    ? 'अपनी अथवा किसी अन्य ग्रामीण महिला की समस्या बताएं। सखी वालंटियर सत्यापन कर सहायता पहुंचाएंगे।'
                    : 'Submit your request for education, financial aid, or healthcare. Sakhi volunteers verify all requests.'}
                </p>
              </div>
            </div>

            {/* Success / Error Alerts */}
            {requestSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{requestSuccess}</p>
              </div>
            )}
            {requestError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{requestError}</p>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Requester Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {isHindi ? 'आवेदक का पूरा नाम *' : 'Requester Name *'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={requestForm.requesterName}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, requesterName: e.target.value })
                      }
                      placeholder={isHindi ? 'उदा. सुमित्रा देवी' : 'e.g. Sumitra Devi'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Contact Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {isHindi ? 'संपर्क फ़ोन नंबर' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={requestForm.contactPhone}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, contactPhone: e.target.value })
                      }
                      placeholder={isHindi ? 'उदा. 9876543210' : 'e.g. 9876543210'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Village / Locality */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {isHindi ? 'गाँव / मोहल्ला' : 'Village / Locality'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={requestForm.village}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, village: e.target.value })
                      }
                      placeholder={isHindi ? 'उदा. रामपुर कलां' : 'e.g. Rampur Kalan'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                {/* District */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {isHindi ? 'ज़िला' : 'District'}
                  </label>
                  <input
                    type="text"
                    value={requestForm.district}
                    onChange={(e) =>
                      setRequestForm({ ...requestForm, district: e.target.value })
                    }
                    placeholder={isHindi ? 'उदा. सीकर / झाँसी' : 'e.g. Sikar / Jhansi'}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  />
                </div>

                {/* State Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {isHindi ? 'राज्य' : 'State'}
                  </label>
                  <select
                    value={requestForm.state}
                    onChange={(e) =>
                      setRequestForm({ ...requestForm, state: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {isHindi ? 'सहायता की श्रेणी *' : 'Support Category *'}
                  </label>
                  <select
                    value={requestForm.category}
                    onChange={(e) =>
                      setRequestForm({ ...requestForm, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm font-semibold text-emerald-700 dark:text-emerald-400"
                  >
                    <option value="FINANCIAL">
                      {isHindi ? '💰 आर्थिक सहायता (Financial Aid)' : '💰 Financial Support'}
                    </option>
                    <option value="EDUCATION">
                      {isHindi ? '🎓 शिक्षा एवं कौशल (Education / Skilling)' : '🎓 Education'}
                    </option>
                    <option value="HEALTH">
                      {isHindi ? '🏥 स्वास्थ्य एवं उपचार (Health & Medical)' : '🏥 Health'}
                    </option>
                  </select>
                </div>
              </div>

              {/* Amount Needed (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  {isHindi ? 'आवश्यक धनराशि (₹ - यदि लागू हो)' : 'Amount Needed in ₹ (Optional)'}
                </label>
                <div className="relative max-w-sm">
                  <span className="absolute left-3.5 top-2.5 font-bold text-gray-500 dark:text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={requestForm.amountNeeded}
                    onChange={(e) =>
                      setRequestForm({ ...requestForm, amountNeeded: e.target.value })
                    }
                    placeholder="e.g. 5000"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  {isHindi ? 'समस्या अथवा आवश्यकता का संपूर्ण विवरण *' : 'Description of Need *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={requestForm.description}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, description: e.target.value })
                  }
                  placeholder={
                    isHindi
                      ? 'अपनी आवश्यकता के बारे में विस्तार से लिखें (उदा. बेटी की पढ़ाई हेतु किताबें व फीस, माताजी के उपचार के लिए दवाइयों का खर्च...)'
                      : 'Provide details about what assistance is needed and how funds/supplies will be utilized...'
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all text-sm disabled:opacity-50"
                >
                  {submittingRequest ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isHindi ? 'जमा हो रहा है...' : 'Submitting...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isHindi ? 'अनुरोध जमा करें' : 'Submit Support Request'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ─── List of Existing Support Requests ──────────────────── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>{isHindi ? 'सामुदायिक सहायता अनुरोध सूची' : 'Community Support Requests'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                    {filteredRequests.length}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isHindi
                    ? 'ग्रामीण महिलाओं द्वारा दर्ज किए गए सत्यापित सहायता अनुरोध।'
                    : 'Requests submitted by women from various districts across India.'}
                </p>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchRequests}
                disabled={loadingRequests}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 transition-colors self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingRequests ? 'animate-spin' : ''}`} />
                <span>{isHindi ? 'ताज़ा करें' : 'Refresh'}</span>
              </button>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  placeholder={isHindi ? 'नाम, गाँव या विवरण खोजें...' : 'Search by name, village, or keywords...'}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-4 h-4 text-gray-400 hidden sm:block mr-1" />
                {['ALL', 'FINANCIAL', 'EDUCATION', 'HEALTH'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setRequestCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      requestCategoryFilter === cat
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat === 'ALL'
                      ? isHindi
                        ? 'सभी'
                        : 'All'
                      : cat === 'FINANCIAL'
                      ? isHindi
                        ? 'आर्थिक'
                        : 'Financial'
                      : cat === 'EDUCATION'
                      ? isHindi
                        ? 'शिक्षा'
                        : 'Education'
                      : isHindi
                      ? 'स्वास्थ्य'
                      : 'Health'}
                  </button>
                ))}
              </div>
            </div>

            {/* Requests Cards Grid */}
            {loadingRequests && requests.length === 0 ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                <p className="text-sm">{isHindi ? 'अनुरोध लोड हो रहे हैं...' : 'Loading support requests...'}</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-800 space-y-2">
                <HandHeart className="w-10 h-10 text-emerald-400 mx-auto opacity-60" />
                <h4 className="font-bold text-gray-800 dark:text-gray-200">
                  {isHindi ? 'कोई अनुरोध नहीं मिला' : 'No Support Requests Found'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {isHindi
                    ? 'इस श्रेणी में अभी कोई सहायता अनुरोध उपलब्ध नहीं है। ऊपर दिए गए फॉर्म से नया अनुरोध जोड़ें।'
                    : 'There are no requests matching your criteria. Submit a new request using the form above.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRequests.map((req) => (
                  <div
                    key={req._id || req.id}
                    className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-sm hover:shadow-md space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Header Row */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <span>{req.requesterName}</span>
                          </h4>
                          {(req.village || req.district || req.state) && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-emerald-500" />
                              {[req.village, req.district, req.state].filter(Boolean).join(', ')}
                            </p>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div>{renderStatusBadge(req.status)}</div>
                      </div>

                      {/* Category & Amount Pill */}
                      <div className="flex flex-wrap items-center gap-2">
                        {renderCategoryBadge(req.category)}

                        {req.amountNeeded && Number(req.amountNeeded) > 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {isHindi ? 'आवश्यक:' : 'Goal:'} ₹{Number(req.amountNeeded).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                        {req.description}
                      </p>
                    </div>

                    {/* Bottom Metadata & Quick Action */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        {req.contactPhone && (
                          <a
                            href={`tel:${req.contactPhone}`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:underline font-medium"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{req.contactPhone}</span>
                          </a>
                        )}
                        {req.createdAt && (
                          <span className="text-[11px] text-gray-400">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Quick Help Button */}
                      <button
                        onClick={() => {
                          setActiveSection('money');
                          if (req.amountNeeded) setAmount(req.amountNeeded.toString());
                          setMoneyMessage(`Support for ${req.requesterName} (${req.category})`);
                        }}
                        className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <span>{isHindi ? 'मदद भेजें' : 'Help Sister'}</span>
                        <IndianRupee className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-SECTION 2: DONATE MONEY (UPI / QR Code) (Purple / Indigo)
          ═══════════════════════════════════════════════════════════════ */}
      {activeSection === 'money' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: UPI Generation Form & QR Code Display */}
            <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-500/5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {isHindi ? 'यूपीआई भुगतान एवं क्यूआर कोड' : 'UPI Payment & QR Code'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {isHindi
                      ? 'शून्य कमीशन, 100% प्रत्यक्ष सहायता। किसी भी यूपीआई ऐप से तुरंत दान करें।'
                      : 'Zero platform fees, 100% direct impact. Pay via PhonePe, GPay, Paytm, or BHIM.'}
                  </p>
                </div>
              </div>

              {/* UPI Inputs Form */}
              <form onSubmit={handleGenerateQR} className="space-y-4">
                {/* Donor Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {isHindi ? 'दानकर्ता का नाम' : 'Donor Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => {
                        setDonorName(e.target.value);
                        setConfirmDonorName(e.target.value);
                      }}
                      placeholder={isHindi ? 'उदा. अनीता शर्मा' : 'e.g. Anita Sharma (or Anonymous)'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Recipient UPI ID (Pre-filled) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {isHindi ? 'प्राप्तकर्ता यूपीआई आईडी (पूर्व-निर्धारित)' : 'Recipient UPI ID (Verified)'}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      readOnly
                      value={recipientUpi}
                      className="w-full pl-4 pr-24 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 font-mono text-sm font-bold cursor-default outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="absolute right-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{isHindi ? 'कॉपी हुआ' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isHindi ? 'कॉपी' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Amount in INR */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {isHindi ? 'दान राशि (₹)' : 'Donation Amount (INR)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 font-bold text-gray-500 dark:text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setConfirmAmount(e.target.value);
                      }}
                      placeholder="500"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 font-bold text-base outline-none"
                    />
                  </div>

                  {/* Preset Quick Chips */}
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {['100', '250', '500', '1000', '2500', '5000'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setAmount(val);
                          setConfirmAmount(val);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          amount === val
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/50'
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-600/30 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{isHindi ? 'क्यूआर कोड बनाएं एवं भुगतान करें' : 'Generate QR & Pay'}</span>
                </button>
              </form>

              {/* QR Code Presentation Box */}
              {generatedUpiUrl && (
                <div className="mt-6 p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 flex flex-col items-center text-center space-y-4">
                  <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200">
                    <QRCode
                      value={generatedUpiUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs uppercase font-extrabold tracking-widest text-purple-600 dark:text-purple-400">
                      {isHindi ? 'स्कैन करें एवं भुगतान करें' : 'Scan to Pay'}
                    </p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">
                      ₹{Number(amount || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {recipientUpi}
                    </p>
                  </div>

                  {/* Clickable UPI Deep Link Button */}
                  <a
                    href={generatedUpiUrl}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all w-full max-w-xs"
                  >
                    <span>{isHindi ? 'सीधे यूपीआई ऐप से खोलें' : 'Open in PhonePe / GPay / Paytm'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <p className="text-[11px] text-gray-400 dark:text-gray-500">
                    {isHindi
                      ? 'भुगतान करने के बाद कृपया दाईं ओर दी गई पावती में संदर्भ संख्या अवश्य दर्ज करें।'
                      : 'After paying, please enter your UPI Reference / UTR number in the form alongside.'}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Confirm Payment Form & Recent Donations */}
            <div className="lg:col-span-5 space-y-6">
              {/* Payment Confirmation Card */}
              <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900/40 shadow-xl shadow-indigo-500/5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {isHindi ? 'भुगतान की पुष्टि करें' : 'Confirm Your Payment'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isHindi ? 'दान की पावती व रसीद प्राप्त करें' : 'Record donation & receive receipt'}
                    </p>
                  </div>
                </div>

                {/* Success / Error Alerts */}
                {moneySuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold">{moneySuccess}</p>
                  </div>
                )}
                {moneyError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold">{moneyError}</p>
                  </div>
                )}

                <form onSubmit={handleConfirmMoneyDonation} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      {isHindi ? 'दानकर्ता का नाम *' : 'Donor Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={confirmDonorName}
                      onChange={(e) => setConfirmDonorName(e.target.value)}
                      placeholder={isHindi ? 'उदा. पूजा शर्मा' : 'e.g. Pooja Sharma'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      {isHindi ? 'भुगतान राशि (₹) *' : 'Paid Amount (₹) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={confirmAmount}
                      onChange={(e) => setConfirmAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      {isHindi ? 'यूपीआई संदर्भ संख्या (UTR / Ref Number) *' : 'UPI Ref / UTR Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={upiRef}
                      onChange={(e) => setUpiRef(e.target.value)}
                      placeholder="e.g. 423456789012"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      {isHindi ? 'शुभकामना संदेश (वैकल्पिक)' : 'Message / Note (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={moneyMessage}
                      onChange={(e) => setMoneyMessage(e.target.value)}
                      placeholder={isHindi ? 'उदा. ग्रामीण बहनों की शिक्षा हेतु' : 'e.g. For girls education'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingMoney}
                    className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submittingMoney ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{isHindi ? 'पुष्टि हो रही है...' : 'Confirming...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isHindi ? 'भुगतान पूर्ण दर्ज करें' : 'Confirm & Save Donation'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Recent Money Donations List */}
              <div className="rounded-3xl p-6 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-purple-600" />
                    <span>{isHindi ? 'हाल के आर्थिक योगदान' : 'Recent Money Donations'}</span>
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-semibold">
                    {moneyDonations.length}
                  </span>
                </div>

                {loadingMoney && moneyDonations.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    {isHindi ? 'लोड हो रहा है...' : 'Loading donations...'}
                  </p>
                ) : moneyDonations.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    {isHindi ? 'अभी कोई दान रिकॉर्ड नहीं है।' : 'No donation records yet.'}
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {moneyDonations.slice(0, 10).map((d) => (
                      <div
                        key={d._id || d.id}
                        className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-900 dark:text-white">
                            {d.donorName}
                          </p>
                          {d.upiRef && (
                            <p className="text-[11px] font-mono text-gray-400">
                              Ref: {d.upiRef}
                            </p>
                          )}
                          {d.message && (
                            <p className="text-[11px] text-gray-500 italic">
                              "{d.message}"
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-purple-600 dark:text-purple-400">
                            ₹{Number(d.amount || 0).toLocaleString('en-IN')}
                          </span>
                          {d.createdAt && (
                            <p className="text-[10px] text-gray-400">
                              {new Date(d.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-SECTION 3: DONATE CLOTHES (Rose / Orange Theme)
          ═══════════════════════════════════════════════════════════════ */}
      {activeSection === 'clothes' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Clothes Donation Form Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-gray-900 border border-rose-100 dark:border-rose-900/40 shadow-xl shadow-rose-500/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400">
                <Shirt className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {isHindi ? 'वस्त्र दान करें — घर से निःशुल्क पिकअप' : 'Donate Clothes — Free Doorstep Pickup'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {isHindi
                    ? 'अपनी अलमारी से साड़ियां, गर्म कपड़े व बच्चों के वस्त्र दान करें। सखी स्वयंसेवक आपके घर आकर एकत्र करेंगे।'
                    : 'Donate wearable sarees, shawls, winter wear, and children clothes. Verified Sakhi volunteers collect from your doorstep.'}
                </p>
              </div>
            </div>

            {/* Success / Error Alerts */}
            {clothesSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{clothesSuccess}</p>
              </div>
            )}
            {clothesError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{clothesError}</p>
              </div>
            )}

            <form onSubmit={handleSubmitClothes} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Donor Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {isHindi ? 'दानकर्ता का नाम *' : 'Donor Name *'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={clothesForm.donorName}
                      onChange={(e) =>
                        setClothesForm({ ...clothesForm, donorName: e.target.value })
                      }
                      placeholder={isHindi ? 'उदा. मीरा बाई' : 'e.g. Meera Bai'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Item Count */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {isHindi ? 'कपड़ों की संख्या (नग) *' : 'Number of Items *'}
                  </label>
                  <div className="relative">
                    <PackageCheck className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      required
                      value={clothesForm.itemCount}
                      onChange={(e) =>
                        setClothesForm({ ...clothesForm, itemCount: e.target.value })
                      }
                      placeholder="5"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Clothes Condition (Radio Buttons) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  {isHindi ? 'कपड़ों की स्थिति (Condition) *' : 'Clothes Condition *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      val: 'NEW',
                      title: isHindi ? 'बिल्कुल नए (New)' : 'Brand New',
                      desc: isHindi ? 'अप्रयुक्त अथवा नए वस्त्र' : 'Unused with or without tags'
                    },
                    {
                      val: 'GOOD',
                      title: isHindi ? 'अच्छी स्थिति (Good)' : 'Gently Used (Good)',
                      desc: isHindi ? 'धुले हुए, कोई फटाव नहीं' : 'Washed, wearable, great condition'
                    },
                    {
                      val: 'FAIR',
                      title: isHindi ? 'पहनने योग्य (Fair)' : 'Fair / Clean Wearable',
                      desc: isHindi ? 'स्वच्छ रोजमर्रा के कपड़े' : 'Clean everyday clothes'
                    }
                  ].map((cond) => (
                    <label
                      key={cond.val}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        clothesForm.condition === cond.val
                          ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 ring-2 ring-rose-400/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-rose-200 dark:hover:border-rose-900 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm">{cond.title}</span>
                        <input
                          type="radio"
                          name="condition"
                          value={cond.val}
                          checked={clothesForm.condition === cond.val}
                          onChange={(e) =>
                            setClothesForm({ ...clothesForm, condition: e.target.value })
                          }
                          className="text-rose-600 focus:ring-rose-500"
                        />
                      </div>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        {cond.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pickup Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  {isHindi ? 'पिकअप पता एवं लैंडमार्क *' : 'Pickup Address & Landmark *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={clothesForm.pickupAddress}
                  onChange={(e) =>
                    setClothesForm({ ...clothesForm, pickupAddress: e.target.value })
                  }
                  placeholder={
                    isHindi
                      ? 'मकान सं., गली/मोहल्ला, गाँव/कस्बा, नज़दीकी प्राथमिक विद्यालय/पंचायत भवन, ज़िला, पिनकोड...'
                      : 'House no., street, village/colony, landmark (e.g. near temple/school), district, pin code...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm resize-y"
                />
              </div>

              {/* Optional Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  {isHindi ? 'कपड़ों का विवरण / संदेश (वैकल्पिक)' : 'Message / Details (Optional)'}
                </label>
                <input
                  type="text"
                  value={clothesForm.message}
                  onChange={(e) =>
                    setClothesForm({ ...clothesForm, message: e.target.value })
                  }
                  placeholder={
                    isHindi
                      ? 'उदा. 3 साड़ियां, 2 ऊनी शॉल, 5 वर्ष के बच्चे के कपड़े'
                      : 'e.g. 3 sarees, 2 winter shawls, warm jackets for toddlers'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingClothes}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 shadow-lg shadow-rose-600/30 active:scale-95 transition-all text-sm disabled:opacity-50"
                >
                  {submittingClothes ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isHindi ? 'जमा हो रहा है...' : 'Booking Pickup...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isHindi ? 'वस्त्र दान पिकअप बुक करें' : 'Schedule Clothes Pickup'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Submitted Clothes Donations List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>{isHindi ? 'दर्ज वस्त्र दान अनुरोध' : 'Submitted Clothes Donations'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-semibold">
                    {clothesDonations.length}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isHindi
                    ? 'स्वयंसेवकों द्वारा संग्रहण हेतु सूचीबद्ध वस्त्र दान।'
                    : 'List of clothes ready for pickup by Sakhi volunteers.'}
                </p>
              </div>

              <button
                onClick={fetchClothesDonations}
                disabled={loadingClothes}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingClothes ? 'animate-spin' : ''}`} />
                <span>{isHindi ? 'ताज़ा करें' : 'Refresh'}</span>
              </button>
            </div>

            {loadingClothes && clothesDonations.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
                <p className="text-sm">{isHindi ? 'लोड हो रहा है...' : 'Loading...'}</p>
              </div>
            ) : clothesDonations.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-800 space-y-2">
                <Shirt className="w-10 h-10 text-rose-400 mx-auto opacity-60" />
                <h4 className="font-bold text-gray-800 dark:text-gray-200">
                  {isHindi ? 'अभी कोई वस्त्र दान नहीं मिला' : 'No Clothes Donations Logged Yet'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {isHindi
                    ? 'ऊपर दिए गए फॉर्म से अपने अप्रयुक्त अथवा स्वच्छ वस्त्र दान कर किसी बहन की सहायता करें।'
                    : 'Be the first to schedule a clothes donation pickup from your home.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clothesDonations.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 transition-all shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                          {item.donorName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0" />
                          <span className="truncate max-w-xs">{item.pickupAddress}</span>
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        <PackageCheck className="w-3.5 h-3.5" />
                        {item.itemCount || 1} {isHindi ? 'कपड़े' : 'Items'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {isHindi ? 'स्थिति:' : 'Condition:'} {item.condition || 'GOOD'}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        {isHindi ? 'पिकअप शेड्यूल' : 'Pickup Scheduled'}
                      </span>
                    </div>

                    {item.message && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 italic">
                        "{item.message}"
                      </p>
                    )}

                    {item.createdAt && (
                      <div className="pt-1 text-[11px] text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
