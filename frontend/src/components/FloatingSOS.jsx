import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  PhoneCall,
  MessageSquare,
  AlertTriangle,
  X,
  MapPin,
  ExternalLink,
  Navigation,
  Check,
  Copy,
  Activity,
  HeartHandshake,
  Flame,
  Radio
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

// Custom Emergency Pin Icon for Leaflet
const emergencyIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function FloatingSOS() {
  const { language, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi
  const [hasLocation, setHasLocation] = useState(false);
  const [locating, setLocating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch real-time GPS coordinates
  const fetchLocation = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setHasLocation(true);
          setLocating(false);
        },
        (error) => {
          console.warn('FloatingSOS: Location access error:', error.message);
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLocation();
    }
  }, [isOpen]);

  // Construct emergency SMS text
  const emergencySmsText = language === 'hi'
    ? `आपातकालीन सहायता! मुझे तुरंत मदद चाहिए। मेरी वर्तमान जीपीएस स्थिति: https://maps.google.com/?q=${coords.lat},${coords.lng} (अक्षांश: ${coords.lat.toFixed(5)}, देशांतर: ${coords.lng.toFixed(5)}) - सखीशक्ति एसओएस द्वारा प्रेषित`
    : `EMERGENCY ALERT! I need immediate help. My current GPS Location: https://maps.google.com/?q=${coords.lat},${coords.lng} (Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)}) - Sent via SakhiShakti SOS`;

  // Standard SMS URL scheme
  const smsUrl = `sms:?&body=${encodeURIComponent(emergencySmsText)}`;

  const handleCopyLocation = () => {
    const textToCopy = `GPS: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} (https://maps.google.com/?q=${coords.lat},${coords.lng})`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* ─── Floating SOS Trigger Button ───────────────────────── */}
      <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40 select-none">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 sm:px-6 sm:py-4 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-base sm:text-lg shadow-2xl shadow-red-600/60 sos-pulse-animation border-2 border-white/50 dark:border-red-400/50 transition-all duration-300 active:scale-95 cursor-pointer"
          aria-label="Emergency SOS"
          title="Instant Emergency SOS"
        >
          {/* Animated radar rings inside button */}
          <span className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
            <ShieldAlert className="relative w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md group-hover:rotate-12 transition-transform" />
          </span>

          <span className="tracking-wider drop-shadow-md">
            SOS
          </span>

          <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider py-0.5 px-2 bg-white/20 rounded-full text-white/90">
            {language === 'hi' ? 'आपातकाल' : 'EMERGENCY'}
          </span>
        </button>
      </div>

      {/* ─── Emergency Modal / Drawer ─────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop dismiss */}
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-t-4 sm:border-2 border-red-600 dark:border-red-500 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">

            {/* Emergency Header Bar */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl animate-pulse">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                      {language === 'hi' ? 'आपातकालीन सहायता' : 'EMERGENCY SOS'}
                    </h2>
                  </div>
                  <p className="text-xs text-white/90 font-medium">
                    {language === 'hi'
                      ? 'एक टैप में सहायता प्राप्त करें · निःशुल्क हेल्पलाइन'
                      : 'Immediate 24x7 Assistance · Toll-Free Helplines'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Close Emergency Window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto no-scrollbar flex-1">

              {/* 3 Large Direct Calling Buttons */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {language === 'hi' ? 'तत्काल कॉल करने के लिए चुनें' : 'Tap to Call Immediately'}
                </p>

                {/* 112: National Emergency */}
                <a
                  href="tel:112"
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-600/30 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-2xl shadow-inner group-hover:scale-105 transition-transform">
                      📞
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight">112</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white/25">
                          {language === 'hi' ? 'राष्ट्रीय आपातकाल' : 'National SOS'}
                        </span>
                      </div>
                      <p className="text-xs text-white/90 font-medium">
                        {language === 'hi'
                          ? 'राष्ट्रीय आपदा · पुलिस · दमकल · आपात स्थिति'
                          : 'Police, Fire, Disaster Response (Pan-India)'}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/20 font-bold text-xs uppercase tracking-wider group-hover:bg-white/30 transition-colors">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'कॉल करें' : 'Call Now'}</span>
                  </div>
                </a>

                {/* 181: Women Helpline */}
                <a
                  href="tel:181"
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg shadow-pink-600/30 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-2xl shadow-inner group-hover:scale-105 transition-transform">
                      🛡️
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight">181</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white/25">
                          {language === 'hi' ? 'महिला हेल्पलाइन' : 'Women Helpline'}
                        </span>
                      </div>
                      <p className="text-xs text-white/90 font-medium">
                        {language === 'hi'
                          ? 'घरेलू हिंसा · उत्पीड़न · संकटकालीन महिला सहायता'
                          : 'Women in Distress & Domestic Abuse Rescue'}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/20 font-bold text-xs uppercase tracking-wider group-hover:bg-white/30 transition-colors">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'कॉल करें' : 'Call Now'}</span>
                  </div>
                </a>

                {/* 108: Ambulance */}
                <a
                  href="tel:108"
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-orange-600/30 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-2xl shadow-inner group-hover:scale-105 transition-transform">
                      🚑
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight">108</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white/25">
                          {language === 'hi' ? 'एम्बुलेंस सेवा' : 'Ambulance'}
                        </span>
                      </div>
                      <p className="text-xs text-white/90 font-medium">
                        {language === 'hi'
                          ? 'चिकित्सा आपात स्थिति · निःशुल्क अस्पताल परिवहन'
                          : 'Medical Emergency & Free Hospital Transit'}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/20 font-bold text-xs uppercase tracking-wider group-hover:bg-white/30 transition-colors">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'कॉल करें' : 'Call Now'}</span>
                  </div>
                </a>
              </div>

              {/* SMS Alert Button with GPS Coordinates */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {language === 'hi' ? 'एसएमएस अलर्ट (जीपीएस स्थिति के साथ)' : 'SMS Alert with Live GPS'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                    {hasLocation ? '✓ GPS Locked' : locating ? 'Locating...' : 'Ready'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <a
                    href={smsUrl}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition-all text-center"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'एसएमएस भेजें' : 'Send Emergency SMS'}</span>
                  </a>

                  <button
                    onClick={handleCopyLocation}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 text-xs font-semibold transition-all active:scale-95"
                    title="Copy coordinates"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'hi' ? 'कॉपी' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* Small Leaflet OpenStreetMap Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 px-1">
                  <span className="flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {language === 'hi' ? 'वर्तमान जीपीएस स्थान' : 'Your Detected GPS Location'}
                  </span>
                  <span className="font-mono text-[11px] text-gray-500">
                    {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner h-[160px] w-full">
                  <MapContainer
                    center={[coords.lat, coords.lng]}
                    zoom={14}
                    scrollWheelZoom={false}
                    dragging={true}
                    style={{ height: '160px', width: '100%' }}
                    className="z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[coords.lat, coords.lng]} icon={emergencyIcon}>
                      <Popup>
                        <div className="text-xs font-bold text-red-600">
                          {language === 'hi' ? 'आपकी वर्तमान स्थिति' : 'You are here'}
                          <div className="text-[10px] text-gray-600 font-normal">
                            Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>

                  <button
                    onClick={fetchLocation}
                    className="absolute top-2 right-2 z-[400] p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700 shadow text-[10px] font-bold flex items-center gap-1 hover:bg-white transition-colors"
                  >
                    <Navigation className={`w-3 h-3 text-pink-600 ${locating ? 'animate-spin' : ''}`} />
                    <span>{locating ? 'GPS...' : (language === 'hi' ? 'रिफ्रेश' : 'Refresh')}</span>
                  </button>
                </div>
              </div>

              {/* Security Advisory footer */}
              <div className="text-center pt-1 text-[11px] text-gray-500 dark:text-gray-400">
                {language === 'hi'
                  ? '⚠️ अपना फोन चालू रखें। राहत दल आपकी लोकेशन पर तुरंत संपर्क करेगा।'
                  : '⚠️ Keep your phone line free. Emergency responders will trace your location.'}
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
