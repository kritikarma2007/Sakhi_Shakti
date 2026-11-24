import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  ShieldAlert,
  PhoneCall,
  MapPin,
  Navigation,
  MessageSquare,
  AlertTriangle,
  Copy,
  Check,
  Share2,
  ExternalLink,
  LifeBuoy,
  Activity,
  HeartHandshake,
  Compass,
  LocateFixed,
  Car,
  Home,
  Lock,
  Info,
  Flame,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default marker icons for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to dynamically recenter map view when coordinates update
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function SafetyTab() {
  const { language, t } = useApp();

  // ─── GPS State ──────────────────────────────────────────────────
  const [coords, setCoords] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle' | 'locating' | 'success' | 'error'
  const [trustedPhone, setTrustedPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Request high-accuracy GPS coordinates
  const fetchLocation = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setGpsStatus('locating');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGpsAccuracy(Math.round(position.coords.accuracy));
          setGpsStatus('success');
        },
        (error) => {
          console.warn('SafetyTab: Geolocation error:', error.message);
          setGpsStatus('error');
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
      );
    } else {
      setGpsStatus('error');
    }
  };

  useEffect(() => {
    fetchLocation();
    setMapReady(true);
  }, []);

  // ─── Nearby Simulated Emergency Services ────────────────────────
  const nearbyServices = useMemo(() => {
    return [
      {
        id: 'police_1',
        name: 'Mahila Thana / Women Police Station',
        hindiName: 'महिला थाना (विशेष महिला सुरक्षा)',
        type: 'police',
        distance: '1.2 km',
        lat: coords.lat + 0.0062,
        lng: coords.lng + 0.0051,
        phone: '112',
        address: 'District Police Lines, Main Road',
        icon: '👮‍♀️'
      },
      {
        id: 'hospital_1',
        name: 'Community Health Centre & 24x7 Emergency',
        hindiName: 'सामुदायिक स्वास्थ्य केंद्र एवं आपातकाल',
        type: 'hospital',
        distance: '2.4 km',
        lat: coords.lat - 0.0075,
        lng: coords.lng + 0.0068,
        phone: '108',
        address: 'Civil Hospital Campus, Ward 4',
        icon: '🏥'
      },
      {
        id: 'sakhi_kendra',
        name: 'Sakhi One Stop Centre (OSC)',
        hindiName: 'सखी वन स्टॉप क्राइसिस सेंटर',
        type: 'sakhi',
        distance: '3.1 km',
        lat: coords.lat + 0.0041,
        lng: coords.lng - 0.0084,
        phone: '181',
        address: 'Mahila Kalyan Bhavan, Near Collectorate',
        icon: '🌸'
      },
      {
        id: 'pink_booth',
        name: 'Pink Police Patrol Booth',
        hindiName: 'पिंक पुलिस पेट्रोल बूथ',
        type: 'police',
        distance: '0.8 km',
        lat: coords.lat - 0.0045,
        lng: coords.lng - 0.0038,
        phone: '1090',
        address: 'Central Market & Bus Terminal Junction',
        icon: '🚔'
      }
    ];
  }, [coords.lat, coords.lng]);

  // ─── Emergency Helplines Data ───────────────────────────────────
  const helplines = [
    {
      number: '112',
      badge: 'Pan-India 24x7',
      titleEn: 'National Emergency Helpline',
      titleHi: 'राष्ट्रीय आपातकालीन सेवा (112)',
      descEn: 'Police, Fire, Disaster & Immediate Response. Zero cost, all networks.',
      descHi: 'पुलिस, दमकल एवं आपदा राहत। सभी मोबाइल नेटवर्क पर 24 घंटे निःशुल्क।',
      color: 'from-red-600 to-rose-600',
      shadowColor: 'shadow-red-600/25',
      borderColor: 'border-red-500/30 dark:border-red-500/20',
      icon: ShieldAlert,
      tag: 'Police & Crisis'
    },
    {
      number: '181',
      badge: 'Women Only 24x7',
      titleEn: 'Women Helpline (Mahila Suraksha)',
      titleHi: 'महिला हेल्पलाइन (181)',
      descEn: 'Domestic abuse, harassment, psychological rescue & legal aid.',
      descHi: 'घरेलू हिंसा, छेड़छाड़, उत्पीड़न व संकट में तत्काल महिला सुरक्षा व परामर्श।',
      color: 'from-pink-600 to-purple-600',
      shadowColor: 'shadow-pink-600/25',
      borderColor: 'border-pink-500/30 dark:border-pink-500/20',
      icon: HeartHandshake,
      tag: 'Women Rescue'
    },
    {
      number: '108',
      badge: 'Medical 24x7',
      titleEn: 'Emergency Ambulance Service',
      titleHi: '108 एम्बुलेंस आपातकालीन सेवा',
      descEn: 'Free ambulance dispatch, maternal delivery transit & trauma care.',
      descHi: 'निःशुल्क आपातकालीन एम्बुलेंस, प्रसव सुरक्षा एवं प्राथमिक चिकित्सा।',
      color: 'from-amber-600 to-orange-600',
      shadowColor: 'shadow-amber-600/25',
      borderColor: 'border-amber-500/30 dark:border-amber-500/20',
      icon: Activity,
      tag: 'Ambulance'
    },
    {
      number: '9152987821',
      displayNumber: 'iCall (9152987821)',
      badge: 'Psychosocial Support',
      titleEn: 'iCall Psychosocial Helpline',
      titleHi: 'आईकॉल मानसिक स्वास्थ्य परामर्श',
      descEn: 'Free, confidential psychosocial counseling by TISS experts.',
      descHi: 'मानसिक तनाव, चिंता एवं भावनात्मक संकट पर विशेषज्ञों द्वारा निःशुल्क परामर्श।',
      color: 'from-teal-600 to-emerald-600',
      shadowColor: 'shadow-teal-600/25',
      borderColor: 'border-teal-500/30 dark:border-teal-500/20',
      icon: LifeBuoy,
      tag: 'Mental Health'
    }
  ];

  const secondaryHelplines = [
    { number: '1090', nameEn: 'Women Power Line', nameHi: 'महिला पावर लाइन', desc: 'UP/State Anti-Harassment' },
    { number: '1098', nameEn: 'Childline Helpline', nameHi: 'चाइल्डलाइन', desc: 'Child Protection & Aid' },
    { number: '1930', nameEn: 'National Cyber Crime', nameHi: 'साइबर अपराध हेल्पलाइन', desc: 'Online Fraud & Blackmail' },
    { number: '100', nameEn: 'Police Control Room', nameHi: 'पुलिस कंट्रोल रूम', desc: 'Direct Police Patrol' }
  ];

  // ─── SMS Alert Generation ───────────────────────────────────────
  const smsMessage = language === 'hi'
    ? `आपातकाल! मुझे तुरंत सहायता चाहिए। मेरी वर्तमान जीपीएस स्थिति: https://maps.google.com/?q=${coords.lat},${coords.lng} (अक्षांश: ${coords.lat.toFixed(5)}, देशांतर: ${coords.lng.toFixed(5)}) - सखीशक्ति सुरक्षा द्वारा प्रेषित`
    : `EMERGENCY! I need immediate help. My current GPS Location: https://maps.google.com/?q=${coords.lat},${coords.lng} (Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)}) - Sent via SakhiShakti`;

  const smsDeepLink = trustedPhone
    ? `sms:${trustedPhone.trim()}?&body=${encodeURIComponent(smsMessage)}`
    : `sms:?&body=${encodeURIComponent(smsMessage)}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(smsMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ─── Safety Tips Content ────────────────────────────────────────
  const safetyTips = [
    {
      category: language === 'hi' ? 'यात्रा एवं आवागमन सुरक्षा' : 'Travel & Transit Safety',
      icon: Car,
      color: 'from-pink-500 to-rose-500',
      tips: [
        language === 'hi'
          ? 'सवारी करने से पहले ऑटो या कैब का नंबर नोट करें और परिवार के साथ लाइव लोकेशन साझा करें।'
          : 'Share your live route with a family member before boarding any cab, auto, or shared taxi.',
        language === 'hi'
          ? 'सुनसान रास्तों से बचें और हमेशा अच्छी रोशनी वाले बस स्टॉप और रेलवे प्लेटफॉर्म पर रुकें।'
          : 'Prefer well-lit boarding points and avoid poorly illuminated shortcuts after dark.',
        language === 'hi'
          ? 'फोन में 112 और 181 को स्पीड डायल बटन 1 या 2 पर सेट करके रखें।'
          : 'Keep emergency helplines 112 and 181 saved on single-touch speed dial.'
      ]
    },
    {
      category: language === 'hi' ? 'घरेलू एवं आवासीय सुरक्षा' : 'Home & Neighbourhood Safety',
      icon: Home,
      color: 'from-purple-500 to-indigo-500',
      tips: [
        language === 'hi'
          ? 'अपरिचित डिलीवरी या मरम्मत कर्मियों का पहचान पत्र खिड़की या दरवाजे से पहले सत्यापित करें।'
          : 'Verify identity of unfamiliar delivery agents or technicians before opening entry doors.',
        language === 'hi'
          ? 'स्थानीय आशा (ASHA), आंगनवाड़ी या सखी सहेलियों के नंबर घर की दीवार पर लिखकर रखें।'
          : 'Keep local ASHA workers and Mahila Panchayat contact numbers written clearly near home entrance.',
        language === 'hi'
          ? 'पड़ोसियों के साथ एक आपातकालीन संकेत या सीटी का कोड तय करें।'
          : 'Agree upon an emergency whistle signal or call-word with trusted neighbours.'
      ]
    },
    {
      category: language === 'hi' ? 'डिजिटल एवं साइबर सुरक्षा' : 'Online & Digital Safety',
      icon: Lock,
      color: 'from-teal-500 to-emerald-500',
      tips: [
        language === 'hi'
          ? 'बैंक खाता, यूपीआई पिन या ओटीपी (OTP) किसी भी फोन कॉल पर कभी साझा न करें।'
          : 'Never disclose bank PIN, OTP, or identity details to callers claiming to be officials.',
        language === 'hi'
          ? 'ऑनलाइन उत्पीड़न, ब्लैकमेल या फर्जी फोटो की तुरंत शिकायत राष्ट्रीय साइबर पोर्टल (1930) पर करें।'
          : 'Report online stalking or harassment directly on National Cyber Helpline 1930 or cybercrime.gov.in.',
        language === 'hi'
          ? 'व्हाट्सएप और सोशल मीडिया पर टू-स्टेप वेरिफिकेशन (Two-Step Verification) सक्रिय रखें।'
          : 'Turn on Two-Factor Authentication on WhatsApp and all social media profiles.'
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-24 lg:pb-12 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">

      {/* ─── Hero Section ───────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-rose-500/10 dark:from-pink-950/30 dark:via-purple-950/30 dark:to-slate-900/40 border border-pink-200/60 dark:border-slate-800 p-6 sm:p-10 shadow-lg backdrop-blur-md">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-pink-600 animate-pulse" />
            <span>{language === 'hi' ? '24x7 महिला सुरक्षा एवं सहायता' : "24x7 Women's Safety Protection"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 dark:from-pink-400 dark:via-rose-300 dark:to-purple-300 bg-clip-text text-transparent leading-tight">
            {language === 'hi' ? 'आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है' : 'Your Safety is Our Priority'}
          </h1>

          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
            {language === 'hi'
              ? 'एक टैप में लाइव जीपीएस लोकेशन ट्रैक करें, बिना इंटरनेट के आपातकालीन एसएमएस भेजें और भारत की सत्यापित निःशुल्क 24x7 आपातकालीन नंबरों से तुरंत जुड़ें।'
              : 'One-tap emergency call connect, live GPS tracking, offline SMS alert with coordinates, and 24x7 toll-free government safety hotlines across India.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{language === 'hi' ? 'कॉल 112 (राष्ट्रीय आपातकाल)' : 'Call 112 (Emergency)'}</span>
            </a>

            <a
              href="tel:181"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-slate-700 border border-pink-200 dark:border-slate-700 font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{language === 'hi' ? 'कॉल 181 (महिला हेल्पलाइन)' : 'Call 181 (Women Helpline)'}</span>
            </a>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ─── Interactive Leaflet Map & GPS Section ────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {language === 'hi' ? 'लाइव जीपीएस एवं निकटवर्ती सुरक्षा केंद्र' : 'Live GPS & Nearby Safety Services'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {language === 'hi'
                ? 'ओपनस्ट्रीटमैप पर आपकी सटीक स्थिति और निकटतम पुलिस व स्वास्थ्य केंद्र'
                : 'OpenStreetMap showing your verified coordinates and simulated emergency facilities'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLocation}
              disabled={gpsStatus === 'locating'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-pink-50 dark:hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50"
            >
              <LocateFixed className={`w-3.5 h-3.5 text-pink-600 ${gpsStatus === 'locating' ? 'animate-spin' : ''}`} />
              <span>
                {gpsStatus === 'locating'
                  ? (language === 'hi' ? 'खोज रहे हैं...' : 'Acquiring GPS...')
                  : (language === 'hi' ? 'स्थान रिफ्रेश करें' : 'Refresh Location')}
              </span>
            </button>

            <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-semibold">
              {gpsAccuracy ? `±${gpsAccuracy}m GPS` : 'GPS Ready'}
            </div>
          </div>
        </div>

        {/* Map Container (350px mobile, 450px desktop) */}
        <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-xl bg-gray-100 dark:bg-slate-800">
          {mapReady && (
            <div className="h-[350px] md:h-[450px] w-full">
              <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <RecenterMap center={[coords.lat, coords.lng]} />

                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Location Marker & Accuracy Circle */}
                <Circle
                  center={[coords.lat, coords.lng]}
                  radius={gpsAccuracy || 200}
                  pathOptions={{
                    fillColor: '#ec4899',
                    fillOpacity: 0.15,
                    color: '#be185d',
                    weight: 1.5
                  }}
                />

                <Marker position={[coords.lat, coords.lng]}>
                  <Popup>
                    <div className="p-1 space-y-1 text-center">
                      <div className="text-sm font-black text-pink-600">
                        {language === 'hi' ? '📍 आपकी वर्तमान स्थिति' : '📍 You Are Here'}
                      </div>
                      <p className="text-xs text-gray-700">
                        Lat: {coords.lat.toFixed(5)}<br />
                        Lng: {coords.lng.toFixed(5)}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-700">
                        Accuracy: {gpsAccuracy ? `±${gpsAccuracy}m` : 'Normal'}
                      </span>
                    </div>
                  </Popup>
                </Marker>

                {/* Nearby Simulated Markers */}
                {nearbyServices.map((service) => (
                  <Marker
                    key={service.id}
                    position={[service.lat, service.lng]}
                  >
                    <Popup>
                      <div className="p-1 space-y-1.5 min-w-[180px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{service.icon}</span>
                          <span className="text-xs font-bold text-gray-900">
                            {language === 'hi' ? service.hindiName : service.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          {service.address}
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                          <span className="text-[10px] font-bold text-emerald-600">
                            {service.distance}
                          </span>
                          <a
                            href={`tel:${service.phone}`}
                            className="px-2 py-1 rounded bg-pink-600 text-white text-[10px] font-bold flex items-center gap-1"
                          >
                            <PhoneCall className="w-2.5 h-2.5" />
                            <span>{service.phone}</span>
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}

          {/* Location Badge Overlay on Map */}
          <div className="absolute bottom-3 left-3 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 shadow-md text-xs">
            <p className="font-bold text-gray-800 dark:text-gray-200">
              {language === 'hi' ? 'सक्रिय जीपीएस निर्देशांक' : 'Active GPS Coordinates'}
            </p>
            <p className="font-mono text-[11px] text-pink-600 dark:text-pink-400">
              {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E
            </p>
          </div>
        </div>

        {/* Nearby Services Quick Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {nearbyServices.map((service) => (
            <div
              key={service.id}
              className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-gray-200/60 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl flex-shrink-0">{service.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                    {language === 'hi' ? service.hindiName : service.name}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {service.distance} · {service.phone}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${service.phone}`}
                className="p-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 hover:bg-pink-100 transition-colors flex-shrink-0"
                title={`Call ${service.phone}`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Emergency Contacts Grid ────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-pink-600" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {language === 'hi' ? '24x7 आपातकालीन हेल्पलाइन संपर्क' : '24x7 Emergency Hotlines'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {language === 'hi'
              ? 'बिना बैलेंस या इंटरनेट के किसी भी मोबाइल फोन से एक टैप में कॉल करें'
              : 'Tap to call directly from any phone. Works without mobile data or balance.'}
          </p>
        </div>

        {/* 4 Main Large Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {helplines.map((item) => {
            const Icon = item.icon;
            const title = language === 'hi' ? item.titleHi : item.titleEn;
            const desc = language === 'hi' ? item.descHi : item.descEn;

            return (
              <div
                key={item.number}
                className={`group relative rounded-3xl bg-white dark:bg-slate-900 border ${item.borderColor} p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300">
                      {item.badge}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      {item.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md ${item.shadowColor} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                        {item.displayNumber || item.number}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">
                    {title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {desc}
                  </p>
                </div>

                <a
                  href={`tel:${item.number}`}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r ${item.color} text-white font-bold text-xs uppercase tracking-wider shadow-md ${item.shadowColor} active:scale-95 transition-all text-center`}
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>{language === 'hi' ? `तुरंत कॉल करें (${item.number})` : `Call ${item.number} Free`}</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Secondary Helplines Row */}
        <div className="p-4 rounded-3xl bg-gray-50/80 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-800 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {language === 'hi' ? 'अतिरिक्त उपयोगी सुरक्षा हेल्पलाइन' : 'Additional Dedicated Helplines'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {secondaryHelplines.map((sec) => (
              <a
                key={sec.number}
                href={`tel:${sec.number}`}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-800 flex items-center justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">
                      {sec.number}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                    {language === 'hi' ? sec.nameHi : sec.nameEn}
                  </p>
                  <p className="text-[9px] text-gray-400 truncate">
                    {sec.desc}
                  </p>
                </div>
                <div className="p-1.5 rounded-xl bg-gray-100 dark:bg-slate-700 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/40 text-gray-600 group-hover:text-pink-600 transition-colors">
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SMS Alert with GPS Section ─────────────────────────── */}
      <section className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-slate-900/10 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-300/40 dark:border-emerald-800/40 p-6 sm:p-8 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{language === 'hi' ? 'बिना इंटरनेट एसएमएस अलर्ट' : 'Zero-Internet SMS Alert'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {language === 'hi' ? 'जीपीएस लोकेशन के साथ आपातकालीन एसएमएस भेजें' : 'Send Emergency SMS with Coordinates'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              {language === 'hi'
                ? 'यदि इंटरनेट धीमा या अनुपलब्ध हो, तो यह सुविधा सीधे सामान्य सेलुलर नेटवर्क से आपके परिजनों या पुलिस को गूगल मैप्स लिंक भेजती है।'
                : 'Works even without mobile data or Wi-Fi. Pre-fills an instant SMS with your precise Google Maps coordinates.'}
            </p>
          </div>
        </div>

        {/* Input & Action Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {language === 'hi' ? 'विश्वसनीय संपर्क फोन नंबर (वैकल्पिक)' : 'Trusted Contact Number (Optional)'}
            </label>
            <input
              type="tel"
              value={trustedPhone}
              onChange={(e) => setTrustedPhone(e.target.value)}
              placeholder={language === 'hi' ? 'जैसे: 9876543210 या खाली छोड़ें' : 'e.g. 9876543210 or leave blank'}
              className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {language === 'hi' ? 'भेजे जाने वाले संदेश का पूर्वावलोकन' : 'Pre-Composed SMS Preview'}
            </label>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700 font-mono text-xs text-gray-700 dark:text-gray-300 break-all select-all">
              {smsMessage}
            </div>
          </div>
        </div>

        {/* Actions Button Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={smsDeepLink}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all text-center"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{language === 'hi' ? 'तुरंत एसएमएस भेजें' : 'Open SMS App & Send Alert'}</span>
          </a>

          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (language === 'hi' ? 'कॉपी हो गया!' : 'Coordinates Copied!') : (language === 'hi' ? 'संदेश कॉपी करें' : 'Copy Text')}</span>
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(smsMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs sm:text-sm hover:bg-emerald-100 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </section>

      {/* ─── Safety Tips Cards ──────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {language === 'hi' ? 'महत्वपूर्ण सुरक्षा मार्गदर्शिका एवं उपाय' : 'Essential Safety Guidelines & Best Practices'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {language === 'hi'
              ? 'यात्रा, घरेलू एवं डिजिटल परिवेश में सतर्कता और सुरक्षा के लिए व्यावहारिक दिशा-निर्देश'
              : 'Practical proactive guidelines for transit, neighbourhood, and cyber security'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {safetyTips.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${group.color} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {group.category}
                    </h3>
                  </div>

                  <ul className="space-y-2.5">
                    {group.tips.map((tip, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px] font-semibold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सखी सुरक्षा सलाह' : 'Sakhi Verified Tip'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
