import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Mic, MicOff, MapPin, Download, RefreshCw, User, Activity, CheckCircle, HelpCircle, Globe, ChevronRight, Info, Home as HomeIcon, Clock, Users, Shield, Heart, Upload, Menu, X } from 'lucide-react';
import axios from 'axios';
import Model from 'react-body-highlighter';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const translations = {
  English: {
    navHome: "Home",
    navAbout: "About",
    navInterview: "Interview",
    heroTitle: "AI Health Predictor",
    heroStatic: "The symptom checker made by doctors for",
    heroWords: ["women", "men", "adults", "parents"],
    heroDesc: "Experience the future of healthcare. Analyze your symptoms instantly using advanced Gemini AI models to get accurate predictions and localized care recommendations.",
    startButton: "Start Interview Now",
    howItWorks: "How it works",
    howItWorksDesc: "A simple, 6-step process to understand your health better.",
    steps: [
      { title: "1. Start", desc: "Open the app when you start feeling unwell." },
      { title: "2. Patient Info", desc: "Provide basic demographic information." },
      { title: "3. Initial Symptoms", desc: "Use the body mapper to indicate your pain points." },
      { title: "4. AI Interview", desc: "Answer intelligent complementary questions." },
      { title: "5. Get Conditions", desc: "See the most probable medical conditions." },
      { title: "6. Analyze Results", desc: "Receive immediate actionable care recommendations." }
    ],
    whoIsThisFor: "Who is this for?",
    individuals: "Individuals",
    parents: "Parents",
    familyMembers: "Family members",
    aboutTitle: "About AI Health Predictor",
    aboutDesc1: "Our platform bridges the gap between raw symptoms and professional medical care using the power of Google's Gemini Large Language Models.",
    aboutDesc2: "Unlike static symptom checkers, our AI conducts dynamic clinical interviews. It asks contextual follow-up questions to significantly narrow down possible conditions based on your specific answers.",
    termsTitle: "Terms of Assessment",
    termsDesc: "This tool will ask you a few questions about how you are feeling, generate a dynamic clinical interview, and provide a preliminary assessment.",
    disclaimer: "Disclaimer: This is an AI-powered academic project. It is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a medical emergency, please call your local emergency services immediately.",
    agreeTerms: "I have read the disclaimer and agree to the terms of service. I understand this is not a medical diagnosis.",
    patientDetails: "Patient Details",
    fullName: "Full Name",
    age: "Age",
    gender: "Gender",
    weight: "Weight (kg)",
    temp: "Temp (°F/°C)",
    bp: "Blood Pressure (Optional)",
    selectGender: "Select Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    reportSymptoms: "Report Symptoms",
    bodyMap: "Interactive Body Map",
    viewFront: "View Front",
    viewBack: "View Back",
    bodyMapDesc: "Click major muscles to select. Currently viewing",
    detailedParts: "Detailed Parts (Not on map)",
    selectedSymptoms: "Selected Symptoms",
    noSymptoms: "No specific body parts selected yet.",
    detailedDesc: "Detailed Description",
    descPlaceholder: "Describe how you are feeling in detail... e.g., 'I have had a severe headache for two days and feel slightly nauseous.'",
    uploadVisual: "Upload Visual Evidence",
    uploadDesc: "Drag and drop or select a clear photo of your skin condition, injury, or allergy. Our multimodal AI will scan it securely.",
    yourLocation: "Your Location",
    locationDesc: "Please provide your region or address in India. This information helps us tailor recommendations and find nearby healthcare professionals if needed.",
    useCurrentLocation: "Use Current Location",
    clinicalInterview: "Clinical Interview",
    interviewDesc: "Our AI has analyzed your initial symptoms and generated a few specific questions to narrow down the possibilities.",
    downloadReport: "Download Full AI Medical Report",
    printQuickView: "Print Quick View",
    newAssessment: "New Assessment",
    back: "Back",
    continue: "Continue",
    analyzeResults: "Analyze Results",
    loadingAI: "AI is analyzing your data...",
    loadingClinical: "Performing clinical diagnosis...",
    loadingReport: "AI is generating your medical report, this may take a minute...",
  },
  Hindi: {
    navHome: "होम",
    navAbout: "हमारे बारे में",
    navInterview: "साक्षात्कार",
    heroTitle: "AI हेल्थ प्रिडिक्टर",
    heroStatic: "डॉक्टरों द्वारा विशेष रूप से बनाया गया लक्षण चेकर",
    heroWords: ["महिलाओं", "पुरुषों", "वयस्कों", "अभिभावकों"],
    heroDesc: "स्वास्थ्य सेवा के भविष्य का अनुभव करें। सटीक भविष्यवाणियों और स्थानीय देखभाल अनुशंसाओं को प्राप्त करने के लिए उन्नत जेमिनी एआई मॉडल का उपयोग करके अपने लक्षणों का तुरंत विश्लेषण करें।",
    startButton: "अभी साक्षात्कार शुरू करें",
    howItWorks: "यह कैसे काम करता है",
    howItWorksDesc: "आपके स्वास्थ्य को बेहतर ढंग से समझने के लिए एक सरल, 6-चरणीय प्रक्रिया।",
    steps: [
      { title: "1. शुरू करें", desc: "जब आप अस्वस्थ महसूस करने लगें तो ऐप खोलें।" },
      { title: "2. रोगी की जानकारी", desc: "बुनियादी जनसांख्यिकीय जानकारी प्रदान करें।" },
      { title: "3. प्रारंभिक लक्षण", desc: "अपने दर्द बिंदुओं को इंगित करने के लिए बॉडी मैपर का उपयोग करें।" },
      { title: "4. एआई साक्षात्कार", desc: "बुद्धिमान पूरक प्रश्नों के उत्तर दें।" },
      { title: "5. स्थितियां प्राप्त करें", desc: "सबसे संभावित चिकित्सा स्थितियों को देखें।" },
      { title: "6. परिणामों का विश्लेषण", desc: "तत्काल कार्रवाई योग्य देखभाल अनुशंसाएं प्राप्त करें।" }
    ],
    whoIsThisFor: "यह किसके लिए है?",
    individuals: "व्यक्तिगत",
    parents: "अभिभावक",
    familyMembers: "परिवार के सदस्य",
    aboutTitle: "AI हेल्थ प्रिडिक्टर के बारे में",
    aboutDesc1: "हमारा प्लेटफ़ॉर्म Google के जेमिनी लार्ज लैंग्वेज मॉडल की शक्ति का उपयोग करके कच्चे लक्षणों और पेशेवर चिकित्सा देखभाल के बीच की खाई को पाटता है।",
    aboutDesc2: "स्थिर लक्षण परीक्षकों के विपरीत, हमारा एआई गतिशील नैदानिक साक्षात्कार आयोजित करता है। यह आपके विशिष्ट उत्तरों के आधार पर संभावित स्थितियों को महत्वपूर्ण रूप से कम करने के लिए प्रासंगिक अनुवर्ती प्रश्न पूछता है।",
    termsTitle: "आकलन की शर्तें",
    termsDesc: "यह टूल आपसे कुछ प्रश्न पूछेगा कि आप कैसा महसूस कर रहे हैं, एक गतिशील नैदानिक साक्षात्कार उत्पन्न करेगा, और एक प्रारंभिक मूल्यांकन प्रदान करेगा।",
    disclaimer: "अस्वीकरण: यह एक एआई-संचालित शैक्षणिक परियोजना है। यह पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है। यदि आप चिकित्सा आपात स्थिति का अनुभव कर रहे हैं, तो कृपया अपनी स्थानीय आपातकालीन सेवाओं को तुरंत कॉल करें।",
    agreeTerms: "मैंने अस्वीकरण पढ़ लिया है और सेवा की शर्तों से सहमत हूँ। मैं समझता हूँ कि यह एक चिकित्सा निदान नहीं है।",
    patientDetails: "रोगी विवरण",
    fullName: "पूरा नाम",
    age: "आयु",
    gender: "लिंग",
    weight: "वजन (किलो)",
    temp: "तापमान (°F/°C)",
    bp: "रक्तचाप (वैकल्पिक)",
    selectGender: "लिंग चुनें",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    reportSymptoms: "लक्षणों की रिपोर्ट करें",
    bodyMap: "इंटरैक्टिव बॉडी मैप",
    viewFront: "सामने का दृश्य",
    viewBack: "पीछे का दृश्य",
    bodyMapDesc: "चयन करने के लिए प्रमुख मांसपेशियों पर क्लिक करें। वर्तमान में देख रहे हैं",
    detailedParts: "विस्तृत अंग (मैप पर नहीं)",
    selectedSymptoms: "चयनित लक्षण",
    noSymptoms: "अभी तक कोई विशिष्ट शरीर के अंग नहीं चुने गए हैं।",
    detailedDesc: "विस्तृत विवरण",
    descPlaceholder: "विस्तार से बताएं कि आप कैसा महसूस कर रहे हैं... उदाहरण के लिए, 'मुझे दो दिनों से तेज़ सिरदर्द है और थोड़ी घबराहट महसूस हो रही है।'",
    uploadVisual: "दृश्य साक्ष्य अपलोड करें",
    uploadDesc: "अपनी त्वचा की स्थिति, चोट या एलर्जी की स्पष्ट तस्वीर खींचें या चुनें। हमारा मल्टीमॉडल एआई इसे सुरक्षित रूप से स्कैन करेगा।",
    yourLocation: "आपका स्थान",
    locationDesc: "कृपया भारत में अपना क्षेत्र या पता प्रदान करें। यह जानकारी हमें अनुशंसाओं को तैयार करने और यदि आवश्यक हो तो पास के स्वास्थ्य सेवा पेशेवरों को खोजने में मदद करती है।",
    useCurrentLocation: "वर्तमान स्थान का उपयोग करें",
    clinicalInterview: "नैदानिक साक्षात्कार",
    interviewDesc: "हमारे एआई ने आपके प्रारंभिक लक्षणों का विश्लेषण किया है और संभावनाओं को कम करने के लिए कुछ विशिष्ट प्रश्न तैयार किए हैं।",
    downloadReport: "पूर्ण एआई मेडिकल रिपोर्ट डाउनलोड करें",
    printQuickView: "त्वरित दृश्य प्रिंट करें",
    newAssessment: "नया आकलन",
    back: "पीछे",
    continue: "जारी रखें",
    analyzeResults: "परिणामों का विश्लेषण करें",
    loadingAI: "एआई आपके डेटा का विश्लेषण कर रहा है...",
    loadingClinical: "नैदानिक निदान किया जा रहा है...",
    loadingReport: "एआई आपकी मेडिकल रिपोर्ट तैयार कर रहा है, इसमें एक मिनट लग सकता है...",
  }
};

function RotatingText({ words }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <span className="inline-flex relative h-[1.3em] min-w-[250px] overflow-hidden align-baseline ml-2">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center text-teal-300 whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const STEPS = ['Introduction', 'Patient', 'Symptoms', 'Regions', 'Interview', 'Results'];

function ClockWidget() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const formattedDate = time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const formattedTime = time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium bg-slate-100 dark:bg-slate-700 px-4 py-1.5 rounded-full shadow-inner">
      <Clock size={16} className="text-blue-500" />
      <span>{formattedDate}</span>
      <span className="mx-1 border-r border-slate-300 dark:border-slate-500 h-4"></span>
      <span className="font-bold text-slate-700 dark:text-slate-200">{formattedTime}</span>
    </div>
  );
}

export default function App() {
  const locationPath = useLocation();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'English');
  const [languageSet, setLanguageSet] = useState(!!localStorage.getItem('language'));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [patientData, setPatientData] = useState({ name: '', age: '', gender: '', weight: '', temperature: '', blood_pressure: '' });
  
  // Date Time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Symptoms state
  const [symptoms, setSymptoms] = useState([]);
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [bodyFacing, setBodyFacing] = useState('front');
  const [imageBase64, setImageBase64] = useState('');

  // Location
  const [userLocation, setUserLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [mapCoords, setMapCoords] = useState(null); // { lat, lon }

  // Interview state
  const [interviewData, setInterviewData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing with Gemini AI...');

  // Results state
  const [results, setResults] = useState(null);

  // Speech Recognition
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
           setDescription((prev) => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setLanguageSet(true);
    localStorage.setItem('language', lang);
  };

  const t = (key) => translations[language][key] || key;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBodyClick = (data) => {
    const partName = data?.muscle || data?.part || (typeof data === 'string' ? data : 'Unknown Region');
    const formattedName = partName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const defaultSymptom = `Pain/Issue in ${formattedName}`;
    if (!symptoms.includes(defaultSymptom)) {
      setSymptoms([...symptoms, defaultSymptom]);
    }
  };

  const removeSymptom = (symp) => {
    setSymptoms(symptoms.filter(s => s !== symp));
  };

  const handleLocationSearch = async (query) => {
    setUserLocation(query);
    if (query.length > 2) {
      setIsSearchingLocation(true);
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
      setIsSearchingLocation(false);
    } else {
      setSuggestions([]);
    }
  };

  const selectLocation = (place) => {
    setUserLocation(place.display_name);
    setMapCoords({ lat: place.lat, lon: place.lon });
    setSuggestions([]);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsSearchingLocation(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setMapCoords({ lat, lon });
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        if (res.data && res.data.display_name) {
          setUserLocation(res.data.display_name);
        }
      } catch (err) {
        console.error(err);
      }
      setIsSearchingLocation(false);
    }, () => {
      alert("Unable to retrieve your location");
      setIsSearchingLocation(false);
    });
  };

  const startDiagnosis = () => {
    navigate('/interview');
    setCurrentStep(0);
  };

  const nextStep = async () => {
    if (STEPS[currentStep] === 'Regions') {
      setLoading(true);
      setLoadingMessage('AI is analyzing your data...');
      
      const timer = setTimeout(() => {
        setLoadingMessage('AI is still processing, please wait a moment...');
      }, 30000);

      try {
        const payload = {
            symptoms: symptoms,
            description: description,
            patient_data: { ...patientData, location: userLocation },
            image_base64: imageBase64
        };
        const res = await axios.post('http://localhost:8000/api/generate-interview', payload, { timeout: 120000 });
        setInterviewData(res.data.questions || []);
        clearTimeout(timer);
      } catch (err) {
        clearTimeout(timer);
        console.error(err);
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
          alert('Request timed out. AI is taking longer than usual. If the limit hasn\'t been reached, please try again in a few minutes.');
        } else if (err.response?.status === 429 || (err.response?.data?.detail && err.response.data.detail.includes('exhausted'))) {
          alert('Today\'s AI limit has been reached. Please wait a few minutes for the quota to reset or try again later.');
        } else {
          alert('AI Interview generation failed. Please wait 1-2 minutes and try again.');
        }
      }
      setLoading(false);
    }
    
    if (STEPS[currentStep] === 'Interview') {
      setLoading(true);
      setLoadingMessage('Performing clinical diagnosis...');

      const timer = setTimeout(() => {
        setLoadingMessage('AI is generating your medical report, this may take a minute...');
      }, 30000);

      try {
        const payload = {
            symptoms: { symptoms, description, patient_data: { ...patientData, location: userLocation }, image_base64: imageBase64 },
            answers: { answers }
        };
        const res = await axios.post('http://localhost:8000/api/predict', payload, { timeout: 120000 });
        setResults(res.data);
        clearTimeout(timer);
      } catch (err) {
        clearTimeout(timer);
        console.error(err);
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
          alert('Request timed out. AI is still processing the data. If your limit hasn\'t been reached, please wait a few minutes and try again.');
        } else if (err.response?.status === 429 || (err.response?.data?.detail && err.response.data.detail.includes('exhausted'))) {
          alert('Today\'s AI limit has been reached. Please wait a few minutes for the quota to reset or try again later.');
        } else {
          alert('AI Prediction failed. Please check your connection and try again.');
        }
      }
      setLoading(false);
    }

    if (currentStep < STEPS.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const downloadDetailedReport = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // 1. Header
      doc.setFillColor(37, 99, 235); // Blue-600
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("AI Health Predictor", pageWidth / 2, 20, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: "center" });

      let currentY = 50;

      // 2. Patient Details
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(16);
      doc.text("Patient Profile", 14, currentY);
      currentY += 5;

      autoTable(doc, {
        startY: currentY,
        head: [['Field', 'Details']],
        body: [
          ['Name', patientData.name],
          ['Age / Gender', `${patientData.age} / ${patientData.gender}`],
          ['Location', userLocation || 'Not provided'],
          ['Weight', patientData.weight || 'N/A'],
          ['Temperature', patientData.temperature || 'N/A'],
          ['Blood Pressure', patientData.blood_pressure || 'N/A'],
        ],
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 14 },
      });
      
      currentY = doc.lastAutoTable.finalY + 15;

      // 3. Symptoms & Problems
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(16);
      doc.text("Reported Symptoms", 14, currentY);
      currentY += 8;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Initial Symptoms:", 14, currentY);
      doc.setFont("helvetica", "normal");
      const symptomsText = symptoms.length > 0 ? symptoms.join(", ") : "None specifically selected";
      const splitSymptoms = doc.splitTextToSize(symptomsText, pageWidth - 28);
      doc.text(splitSymptoms, 14, currentY + 6);
      currentY += (splitSymptoms.length * 5) + 12;

      {/* Loading Overlays */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center text-white"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <Activity className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={32} />
            </div>
            <p className="mt-8 text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent px-6 text-center">
              {currentStep === 4 ? t('loadingClinical') : t('loadingAI')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      if (description) {
        doc.setFont("helvetica", "bold");
        doc.text("Patient Description:", 14, currentY);
        doc.setFont("helvetica", "normal");
        const splitDesc = doc.splitTextToSize(description, pageWidth - 28);
        doc.text(splitDesc, 14, currentY + 6);
        currentY += (splitDesc.length * 5) + 12;
      }

      // 4. Interview Answers
      if (Object.keys(answers).length > 0) {
        if (currentY > 240) { doc.addPage(); currentY = 20; }
        doc.setTextColor(37, 99, 235);
        doc.setFontSize(16);
        doc.text("Clinical Interview Responses", 14, currentY);
        currentY += 5;

        const interviewBody = interviewData.map((q, idx) => [
          `${idx + 1}. ${q.question}`,
          answers[q.id] || "No answer provided"
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [['Question', 'Selected Answer']],
          body: interviewBody,
          theme: 'grid',
          headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
          columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 'auto' } },
          margin: { left: 14 },
        });
        currentY = doc.lastAutoTable.finalY + 15;
      }

      // 5. AI Prediction Results
      if (results) {
        if (currentY > 220) { doc.addPage(); currentY = 20; }
        
        doc.setFillColor(248, 250, 252);
        doc.rect(14, currentY, pageWidth - 28, 60, 'F');
        doc.setDrawColor(37, 99, 235);
        doc.rect(14, currentY, pageWidth - 28, 60, 'S');

        doc.setTextColor(37, 99, 235);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(`AI Diagnosis: ${results.disease}`, 20, currentY + 12);

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Confidence Score: ${results.confidence}%`, 20, currentY + 22);
        doc.text(`Danger Level: ${results.danger_level}/100`, 20, currentY + 28);

        doc.setFont("helvetica", "normal");
        const summaryText = results.summary || results.recommendation;
        const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 40);
        doc.text(splitSummary, 20, currentY + 36);

        currentY += 75;

        // 6. Care Methods & Precautions
        doc.setTextColor(37, 99, 235);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Recommended Care & Precautions", 14, currentY);
        currentY += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        
        results.cure_methods?.forEach((cure, idx) => {
          if (currentY > 270) { doc.addPage(); currentY = 20; }
          const splitCure = doc.splitTextToSize(`${idx + 1}. ${cure}`, pageWidth - 28);
          doc.text(splitCure, 14, currentY);
          currentY += (splitCure.length * 6);
        });
      }

      // Footer disclaimer
      const footerY = 285;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Disclaimer: This report is generated by an AI assistant for informational purposes and is not a substitute for professional medical advice.", pageWidth / 2, footerY, { align: "center" });

      doc.save("AI-Health-Predictor-Report.pdf");
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF report.");
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAgreed(false);
    setPatientData({ name: '', age: '', gender: '', weight: '', temperature: '', blood_pressure: '' });
    setSymptoms([]);
    setDescription('');
    setImageBase64('');
    setUserLocation('');
    setMapCoords(null);
    setSuggestions([]);
    setInterviewData([]);
    setAnswers({});
    setResults(null);
  };

  const handleAnswer = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const isNextDisabled = () => {
    const stepName = STEPS[currentStep];
    if (stepName === 'Introduction') return !agreed;
    if (stepName === 'Patient') return !patientData.name || !patientData.age || !patientData.gender;
    if (stepName === 'Symptoms') return symptoms.length === 0 && description.length === 0;
    if (stepName === 'Regions') return !userLocation;
    if (stepName === 'Interview') return Object.keys(answers).length !== interviewData.length;
    return false;
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const isInterviewRoute = locationPath.pathname === '/interview';

  const LanguageModal = () => (
    <AnimatePresence>
      {!languageSet && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="text-blue-600 dark:text-blue-400" size={40} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white mb-2">Choose Your Language</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Please select your preferred language to continue.</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleLanguageSelect('English')}
                className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all group"
              >
                <span className="block text-xl font-bold dark:text-white group-hover:text-blue-600">English</span>
              </button>
              <button 
                onClick={() => handleLanguageSelect('Hindi')}
                className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all group"
              >
                <span className="block text-xl font-bold dark:text-white group-hover:text-blue-600">हिंदी</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`relative px-3 py-2 font-semibold transition-colors duration-200 ${
        locationPath.pathname === to 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400'
      }`}
    >
      {children}
      {locationPath.pathname === to && (
        <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-blue-600 dark:bg-blue-400 rounded-full" />
      )}
    </Link>
  );

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-900 transition-colors duration-300`}>
      
      <LanguageModal />

      {/* Floating Hamburger Button for Mobile */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed bottom-6 left-6 z-[50] p-4 rounded-full bg-blue-600 text-white shadow-2xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center border-4 border-white dark:border-slate-800"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden"
            />
            {/* Menu Content */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate-800 shadow-2xl z-[70] md:hidden flex flex-col"
            >
              <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
                  <Activity /> {t('heroTitle')}
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 p-6 space-y-4">
                <Link 
                  to="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-bold text-lg"
                >
                  <HomeIcon size={20} /> {t('navHome')}
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-bold text-lg"
                >
                  <Info size={20} /> {t('navAbout')}
                </Link>
                <Link 
                  to="/interview" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-bold text-lg"
                >
                  <Activity size={20} /> {t('navInterview')}
                </Link>
              </nav>
              <div className="p-6 border-t dark:border-slate-700">
                <ClockWidget />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar - Only visible in Interview on Desktop */}
      {isInterviewRoute && (
        <aside className="w-64 bg-white dark:bg-slate-800 shadow-xl hidden md:flex flex-col border-r dark:border-slate-700 z-20 print:hidden">
          <div className="p-6 text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
            <Activity size={28} className="text-blue-600" />
            {t('heroTitle')}
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {STEPS.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              const translatedStep = t('steps')[idx]?.title || step;
              return (
                <div 
                  key={step} 
                  onClick={() => { if(isPast || isCurrent) setCurrentStep(idx) }}
                  className={`p-3 rounded-lg flex items-center gap-3 transition-all ${
                    isPast || isCurrent ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700' : 'cursor-not-allowed opacity-50'
                  } ${
                    isCurrent ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 border-l-4 border-blue-600 shadow-sm' : 
                    isPast ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isPast ? <CheckCircle size={18} /> : <div className="w-[18px]" />}
                  <span className="font-medium">{translatedStep}</span>
                </div>
              )
            })}
          </nav>
        </aside>
      )}

      <main className="flex-1 flex flex-col relative h-screen overflow-x-hidden">
        {/* Navbar */}
        <header className="h-16 flex justify-between items-center px-4 md:px-6 border-b bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm z-10 sticky top-0 shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-lg md:text-xl font-bold text-blue-600 min-w-[120px] md:min-w-[200px]">
            <Activity size={20} /> {t('heroTitle')}
          </div>
          
          {/* Main Navigation Tabs - Hidden on Mobile */}
          <nav className="hidden md:flex items-center gap-2 ml-8 flex-1">
             <NavLink to="/">{t('navHome')}</NavLink>
             <NavLink to="/about">{t('navAbout')}</NavLink>
             <NavLink to="/interview">{t('navInterview')}</NavLink>
          </nav>
          
          {/* Header Utilities - Optimized for Mobile */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <div className="hidden lg:flex items-center mr-2">
               <ClockWidget />
            </div>
            
            <div className="flex items-center gap-1 md:gap-2 border dark:border-slate-600 rounded-lg px-2 py-1 bg-slate-50 dark:bg-slate-700">
              <Globe size={14} className="text-slate-500" />
              <select 
                value={language} 
                onChange={(e) => handleLanguageSelect(e.target.value)}
                className="bg-transparent text-[12px] md:text-sm font-medium outline-none dark:text-white cursor-pointer"
              >
                <option value="English">EN</option>
                <option value="Hindi">हिं</option>
              </select>
            </div>
            <button onClick={toggleDarkMode} className="p-1.5 md:p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition flex items-center justify-center">
              {darkMode ? <Sun className="text-yellow-400" size={16} /> : <Moon className="text-slate-600" size={16} />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 relative">
          
          {loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mb-4"></div>
               <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 text-center px-6">{loadingMessage}</p>
            </div>
          )}

          <Routes>
            <Route path="/" element={
              <div className="space-y-20 pb-20">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-20 text-white relative overflow-hidden">
                  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="flex-1 space-y-8 text-center md:text-left">
                      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                        {language === 'English' ? (
                          <>
                            {t('heroStatic')}
                            <RotatingText words={t('heroWords')} />
                          </>
                        ) : (
                          <>
                            <RotatingText words={t('heroWords')} />
                            {t('heroStatic')}
                          </>
                        )}
                      </h1>
                      <p className="text-xl text-blue-100 max-w-lg mx-auto md:mx-0 leading-relaxed">
                        {t('heroDesc')}
                      </p>
                      <button onClick={startDiagnosis} className="bg-white text-blue-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-2xl flex items-center gap-3 mx-auto md:mx-0 group">
                        {t('startButton')} <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    <div className="flex-1 flex justify-center w-full">
                      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden bg-slate-200 aspect-video relative flex items-center justify-center">
                         <span className="absolute text-slate-500 font-medium">Hero Image (/images/home.png)</span>
                         <img src="/images/home.png" alt="AI Healthcare" className="w-full h-full object-cover relative z-10" onError={(e) => e.target.style.opacity = 0} />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 md:px-8">
                  <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t('howItWorks')}</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 hidden md:block">{t('howItWorksDesc')}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {t('steps').map((step, idx) => {
                      const icons = [Activity, User, Shield, HelpCircle, Heart, CheckCircle];
                      const Icon = icons[idx];
                      return (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition flex md:flex-col items-center md:items-start gap-4 md:gap-0">
                          <Icon className="text-blue-500 md:mb-6 shrink-0" size={32} />
                          <div>
                            <h3 className="text-lg md:text-xl font-bold dark:text-white md:mb-3">{step.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed hidden md:block">{step.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* Who is this for Section */}
                <section className="max-w-6xl mx-auto px-8 bg-slate-100 dark:bg-slate-800/50 py-16 rounded-3xl">
                  <div className="text-center space-y-4 mb-12">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white">{t('whoIsThisFor')}</h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Individuals */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full hover:border-blue-300 transition cursor-default">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600"><User /></div>
                        <h3 className="text-2xl font-bold dark:text-white">{t('individuals')}</h3>
                      </div>
                      <ul className="space-y-4 flex-1">
                        <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle className="text-blue-500 shrink-0" size={20} /> 5 levels of care recommendations</li>
                        <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle className="text-blue-500 shrink-0" size={20} /> Simple language and common names</li>
                        <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle className="text-blue-500 shrink-0" size={20} /> Educational resources and articles</li>
                      </ul>
                    </div>
                    {/* Parents */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full hover:border-teal-300 transition cursor-default">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-xl text-teal-600"><Users /></div>
                        <h3 className="text-2xl font-bold dark:text-white">{t('parents')}</h3>
                      </div>
                      <ul className="space-y-4 flex-1">
                        <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle className="text-teal-500 shrink-0" size={20} /> Pediatrics conditions</li>
                        <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle className="text-teal-500 shrink-0" size={20} /> Symptom pair analysis</li>
                        <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle className="text-teal-500 shrink-0" size={20} /> Body maps of children in different age groups</li>
                      </ul>
                    </div>
                    {/* Family Members */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full hover:border-indigo-300 transition cursor-default">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600"><Heart /></div>
                        <h3 className="text-2xl font-bold dark:text-white">{t('familyMembers')}</h3>
                      </div>
                      <ul className="space-y-4 flex-1">
                        <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle className="text-indigo-500 shrink-0" size={20} /> Third-person mode analysis</li>
                        <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle className="text-indigo-500 shrink-0" size={20} /> Clear instructions and explanations</li>
                        <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle className="text-indigo-500 shrink-0" size={20} /> Shareable PDF reports</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            } />

            <Route path="/about" element={
              <section className="max-w-6xl mx-auto px-8 py-20">
                <div className="flex flex-col-reverse md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="w-full rounded-3xl shadow-2xl overflow-hidden bg-slate-200 aspect-square md:aspect-auto md:h-[500px] flex items-center justify-center relative">
                       <span className="absolute text-slate-500 font-medium">About Image (/images/about.png)</span>
                       <img src="/images/about.png" alt="Medical Team" className="w-full h-full object-cover relative z-10" onError={(e) => e.target.style.opacity = 0} />
                    </div>
                  </div>
                  <div className="flex-1 space-y-8">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white">{t('aboutTitle')}</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                      {t('aboutDesc1')}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                      {t('aboutDesc2')}
                    </p>
                    <button onClick={startDiagnosis} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg inline-flex items-center gap-3">
                      {t('startButton')} <ChevronRight />
                    </button>
                  </div>
                </div>
              </section>
            } />

            <Route path="/interview" element={
              <div className="p-4 md:p-8">
                {/* Horizontal Stepper - Mobile Only */}
                <div className="max-w-4xl mx-auto mb-8 md:hidden print:hidden">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 dark:bg-slate-700 -z-10 transform -translate-y-1/2"></div>
                    {STEPS.map((step, idx) => {
                      const isPast = idx < currentStep;
                      const isCurrent = idx === currentStep;
                      return (
                        <div 
                          key={step} 
                          onClick={() => { if(isPast || isCurrent) setCurrentStep(idx) }}
                          className={`flex flex-col items-center gap-2 relative bg-slate-50 dark:bg-slate-900 px-2 ${isPast || isCurrent ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors shadow-sm ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50' : isPast ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'}`}>
                            {isPast ? <CheckCircle size={14} /> : idx + 1}
                          </div>
                          <span className={`text-[10px] font-bold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : isPast ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto"
                  >
                    
                    {/* Introduction Step */}
                    {STEPS[currentStep] === 'Introduction' && (
                      <div className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center rounded-2xl mb-6">
                          <Info size={32} />
                        </div>
                        <h1 className="text-3xl font-bold dark:text-white">{t('termsTitle')}</h1>
                        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                          {t('termsDesc')}
                        </p>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-100 dark:border-red-800 flex gap-4 items-start">
                          <div className="mt-1"><HelpCircle className="text-red-600 dark:text-red-400" /></div>
                          <p className="text-sm text-red-800 dark:text-red-300">
                            {t('disclaimer')}
                          </p>
                        </div>

                        <div className="pt-6 border-t dark:border-slate-700">
                          <label className="flex items-start gap-4 cursor-pointer p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition">
                            <input 
                              type="checkbox" 
                              checked={agreed}
                              onChange={(e) => setAgreed(e.target.checked)}
                              className="w-6 h-6 mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-600" 
                            />
                            <span className="dark:text-slate-200 text-lg font-medium">
                              {t('agreeTerms')}
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Patient Step */}
                    {STEPS[currentStep] === 'Patient' && (
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold dark:text-white flex items-center gap-3 mb-8">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-xl"><User size={24}/></div>
                          {t('patientDetails')}
                        </h2>
                        
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('fullName')}</label>
                            <input 
                              type="text" 
                              value={patientData.name}
                              onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                              placeholder="e.g. John Doe" 
                              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="col-span-2 md:col-span-1">
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('age')}</label>
                              <input 
                                type="number" 
                                value={patientData.age}
                                onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                                placeholder="e.g. 28" 
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                              />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('gender')}</label>
                              <select 
                                value={patientData.gender}
                                onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                              >
                                <option value="">{t('selectGender')}</option>
                                <option value="Male">{t('male')}</option>
                                <option value="Female">{t('female')}</option>
                                <option value="Other">{t('other')}</option>
                              </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('weight')}</label>
                              <input 
                                type="number" 
                                value={patientData.weight}
                                onChange={(e) => setPatientData({...patientData, weight: e.target.value})}
                                placeholder="e.g. 70" 
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                              />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('temp')}</label>
                              <input 
                                type="text" 
                                value={patientData.temperature}
                                onChange={(e) => setPatientData({...patientData, temperature: e.target.value})}
                                placeholder="98.6°F" 
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                              />
                            </div>
                          </div>
                          <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('bp')}</label>
                             <input 
                               type="text" 
                               value={patientData.blood_pressure}
                               onChange={(e) => setPatientData({...patientData, blood_pressure: e.target.value})}
                               placeholder="120/80" 
                               className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                             />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Symptoms Step */}
                    {STEPS[currentStep] === 'Symptoms' && (
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold dark:text-white flex items-center gap-3 mb-6">
                          <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-600 rounded-xl"><Activity size={24}/></div>
                          {t('reportSymptoms')}
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Body Mapper Column */}
                          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center relative">
                            <div className="w-full flex justify-between items-center mb-4">
                              <h3 className="font-semibold dark:text-white text-lg">{t('bodyMap')}</h3>
                              <button 
                                onClick={() => setBodyFacing(prev => prev === 'front' ? 'back' : 'front')}
                                className="text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 px-4 py-1.5 rounded-full font-bold hover:bg-blue-100 dark:hover:bg-blue-800 transition shadow-sm border border-blue-200 dark:border-blue-700"
                              >
                                {bodyFacing === 'front' ? t('viewBack') : t('viewFront')}
                              </button>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 text-center">{t('bodyMapDesc')} <strong>{bodyFacing === 'front' ? t('viewFront') : t('viewBack')}</strong>.</p>
                            <div className="w-full max-w-[250px] mx-auto opacity-90 hover:opacity-100 transition duration-300 bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                              <Model 
                                data={[]} 
                                style={{ width: '100%' }} 
                                onClick={handleBodyClick}
                                type={bodyFacing}
                              />
                            </div>
                            
                            <div className="mt-6 w-full pt-6 border-t dark:border-slate-700">
                              <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-3">{t('detailedParts')}</h4>
                              <div className="flex flex-wrap gap-2">
                                {['Face', 'Eyes', 'Ears', 'Nose', 'Mouth', 'Fingers', 'Hands', 'Feet', 'Toes', 'Internal'].map(part => (
                                  <button 
                                    key={part}
                                    onClick={() => handleBodyClick({ muscle: part })}
                                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm transition border border-slate-200 dark:border-slate-600"
                                  >
                                    + {part}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Text/Audio Input Column */}
                          <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                               <h3 className="font-semibold dark:text-white text-lg mb-4">{t('selectedSymptoms')}</h3>
                               <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                                 {symptoms.length === 0 ? (
                                   <span className="text-slate-400 text-sm">{t('noSymptoms')}</span>
                                 ) : (
                                   symptoms.map(s => (
                                     <span key={s} className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                       {s}
                                       <button onClick={() => removeSymptom(s)} className="hover:text-blue-900 dark:hover:text-white text-lg leading-none">&times;</button>
                                     </span>
                                   ))
                                 )}
                               </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                              <h3 className="font-semibold dark:text-white text-lg mb-4 flex items-center justify-between">
                                {t('detailedDesc')}
                                {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                                  <button 
                                    onClick={toggleRecording}
                                    className={`p-2 rounded-full transition-all ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                                    title="Click to speak"
                                  >
                                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                                  </button>
                                )}
                              </h3>
                              <textarea 
                                placeholder={t('descPlaceholder')}
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white h-40 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                              {isRecording && <p className="text-sm text-red-500 mt-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> Listening...</p>}
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border-2 border-dashed border-blue-300 dark:border-slate-600 mt-6 relative overflow-hidden group hover:border-blue-500 transition-colors">
                               <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                               <h3 className="font-semibold dark:text-white text-xl mb-2 flex items-center gap-2">
                                 <svg className="w-6 h-6 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                 {t('uploadVisual')}
                                 <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-1 rounded-full font-bold ml-auto">AI Vision</span>
                               </h3>
                               <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('uploadDesc')}</p>
                               <input 
                                 type="file" 
                                 accept="image/*" 
                                 onChange={handleImageUpload} 
                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                               />
                               
                               {!imageBase64 && (
                                 <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                                   <Upload size={32} className="text-slate-400 mb-2" />
                                   <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-200 transition">Click or Drag Image Here</span>
                                 </div>
                               )}
                               
                               {imageBase64 && (
                                 <div className="mt-4 relative z-20">
                                   <img src={imageBase64} alt="Medical Evidence" className="h-48 w-full object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition" />
                                   <button onClick={(e) => { e.stopPropagation(); setImageBase64(''); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-lg z-30">
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                   </button>
                                 </div>
                               )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Regions Step */}
                    {STEPS[currentStep] === 'Regions' && (
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold dark:text-white flex items-center gap-3 mb-6">
                          <div className="p-3 bg-teal-100 dark:bg-teal-900/50 text-teal-600 rounded-xl"><MapPin size={24}/></div>
                          {t('yourLocation')}
                        </h2>
                        
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                          <p className="text-slate-600 dark:text-slate-300 text-lg">
                            {t('locationDesc')}
                          </p>
                          
                          <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location / Address</label>
                            <div className="flex gap-3">
                              <input 
                                type="text" 
                                value={userLocation}
                                onChange={(e) => handleLocationSearch(e.target.value)}
                                placeholder="e.g. Varanasi, Uttar Pradesh" 
                                className="flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none transition" 
                              />
                              <button 
                                onClick={useCurrentLocation}
                                className="px-6 py-4 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-xl font-bold hover:bg-teal-100 dark:hover:bg-teal-900/50 transition border border-teal-200 dark:border-teal-800 flex items-center gap-2 whitespace-nowrap"
                              >
                                {isSearchingLocation ? <RefreshCw className="animate-spin" size={20} /> : <MapPin size={20} />}
                                {t('useCurrentLocation')}
                              </button>
                            </div>
                            
                            {/* Auto Suggestions */}
                            {suggestions.length > 0 && (
                              <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                                {suggestions.map((place, idx) => (
                                  <div 
                                    key={idx}
                                    onClick={() => selectLocation(place)}
                                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b last:border-0 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-start gap-2"
                                  >
                                    <MapPin size={16} className="mt-1 text-teal-500 shrink-0" />
                                    <span>{place.display_name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Map Embed */}
                          {mapCoords && (
                            <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner mt-6 bg-slate-100 dark:bg-slate-900 relative">
                              <iframe 
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no" 
                                marginHeight="0" 
                                marginWidth="0" 
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(mapCoords.lon)-0.02},${parseFloat(mapCoords.lat)-0.02},${parseFloat(mapCoords.lon)+0.02},${parseFloat(mapCoords.lat)+0.02}&layer=mapnik&marker=${mapCoords.lat},${mapCoords.lon}`}
                              ></iframe>
                              <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-xs px-2 py-1 rounded shadow text-slate-600 dark:text-slate-300 pointer-events-none">OpenStreetMap Data</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Interview Step */}
                    {STEPS[currentStep] === 'Interview' && (
                      <div className="space-y-6">
                        <div className="mb-8 border-b dark:border-slate-700 pb-6">
                          <h2 className="text-3xl font-bold dark:text-white flex items-center gap-3">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 rounded-xl"><HelpCircle size={24}/></div>
                            {t('clinicalInterview')}
                          </h2>
                          <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
                            {t('interviewDesc')}
                          </p>
                        </div>

                        <div className="space-y-6">
                          {interviewData.length === 0 && !loading && (
                            <p className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-100">Failed to load questions. Please go back and try again.</p>
                          )}
                          
                          {interviewData.map((q, i) => (
                            <motion.div 
                              key={q.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border transition-all duration-300 ${answers[q.id] ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-700'}`}
                            >
                              <h3 className="font-semibold text-lg mb-5 dark:text-white flex items-start gap-3">
                                <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 w-8 h-8 rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
                                <span className="mt-1">{q.question}</span>
                              </h3>
                              
                              <div className="grid sm:grid-cols-2 gap-3 pl-11">
                                {q.options.map(opt => {
                                  const isSelected = answers[q.id] === opt;
                                  return (
                                    <label 
                                      key={opt} 
                                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                        isSelected 
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-500 text-indigo-700 dark:text-indigo-200' 
                                        : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:text-slate-200'
                                      }`}
                                    >
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-indigo-600' : 'border-slate-300 dark:border-slate-500'}`}>
                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>}
                                      </div>
                                      <input 
                                        type="radio" 
                                        name={q.id} 
                                        className="hidden" 
                                        checked={isSelected}
                                        onChange={() => handleAnswer(q.id, opt)}
                                      />
                                      <span className="font-medium">{opt}</span>
                                    </label>
                                  )
                                })}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Results Step */}
                    {STEPS[currentStep] === 'Results' && results && (
                      <div className="space-y-6" id="printable-report">

                        {/* Header Banner - color graded by danger_level */}
                        <div 
                          className="p-8 rounded-3xl text-white shadow-xl"
                          style={{ background: `linear-gradient(135deg, hsl(${Math.max(0, 120 - ((results.danger_level || 0) * 1.2))}, 72%, 38%), #0f172a)` }}
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <p className="text-sm font-semibold uppercase tracking-widest opacity-70 mb-1">AI Diagnosis</p>
                              <h2 className="text-4xl font-extrabold">{results.disease}</h2>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm opacity-70">Danger Level</p>
                              <p className="text-3xl font-bold">{results.danger_level}<span className="text-lg">/100</span></p>
                            </div>
                          </div>
                          <p className="text-base opacity-90 leading-relaxed font-medium bg-white/10 rounded-xl p-4">
                            {results.summary || results.recommendation}
                          </p>
                          {results.emergency && (
                            <div className="mt-4 bg-red-600/40 border border-red-400 rounded-xl p-3 flex items-center gap-3">
                              <span className="text-2xl">🚨</span>
                              <span className="font-bold">EMERGENCY ALERT: Seek immediate medical attention or call emergency services.</span>
                            </div>
                          )}
                        </div>

                        {/* Two-column grid */}
                        <div className="grid md:grid-cols-2 gap-6">

                          {/* Left: Diagnosis + Confidence + Care Methods */}
                          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-6">
                            <div>
                              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Primary Prediction</h3>
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.disease}</div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{results.recommendation}</p>
                            </div>

                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">AI Confidence Score</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{results.confidence}%</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${results.confidence}%` }}
                                  transition={{ duration: 1.2, ease: 'easeOut' }}
                                  className="h-3 rounded-full"
                                  style={{ background: `linear-gradient(90deg, hsl(${results.confidence * 1.2}, 80%, 45%), hsl(${results.confidence * 1.2 + 20}, 80%, 55%))` }}
                                />
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                <CheckCircle size={18} className="text-emerald-500" /> Specific Care Methods
                              </h4>
                              <ul className="space-y-3">
                                {results.cure_methods && results.cure_methods.map((cure, idx) => (
                                  <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-sm">
                                    <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">{idx + 1}</span>
                                    {cure}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Right: Patient Profile + Resources + Maps */}
                          <div className="flex flex-col gap-6">

                            {/* Patient Profile */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Patient Profile</h3>
                              <div className="space-y-2 text-sm">
                                {[['Name', patientData.name], ['Age / Gender', `${patientData.age} / ${patientData.gender}`], ['Location', userLocation || 'Not provided'], ['Weight', patientData.weight || 'N/A'], ['Temperature', patientData.temperature || 'N/A'], ['Blood Pressure', patientData.blood_pressure || 'N/A']].map(([label, value]) => (
                                  <div key={label} className="flex justify-between border-b dark:border-slate-700 pb-2">
                                    <span className="text-slate-500">{label}</span>
                                    <span className="font-medium dark:text-white text-right max-w-[200px] truncate" title={value}>{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Useful Resources */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                <Globe size={18} className="text-blue-500" /> Useful Medical Resources
                              </h4>
                              <ul className="space-y-2">
                                {results.useful_resources && results.useful_resources.map((res, idx) => {
                                  const urlMatch = res.match(/(https?:\/\/[^\s]+)/);
                                  const label = res.replace(/(https?:\/\/[^\s]+)/, '').replace(/:\s*$/, '').trim();
                                  return (
                                    <li key={idx}>
                                      {urlMatch ? (
                                        <a href={urlMatch[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                                          <ChevronRight size={14} className="shrink-0" />
                                          {label || urlMatch[0]}
                                        </a>
                                      ) : (
                                        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">• {res}</span>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>

                            {/* Nearest Medical Help */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                <MapPin size={18} className="text-red-500" /> Find Nearest Medical Help
                              </h4>
                              <div className="space-y-2">
                                {results.clinic_link && (
                                  <a href={results.clinic_link} target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-center transition text-sm flex items-center justify-center gap-2">
                                    <MapPin size={16} /> Search Nearest Specialist
                                  </a>
                                )}
                                {results.nearby_specialists && results.nearby_specialists.map((spec, idx) => {
                                  const urlMatch = spec.match(/(https?:\/\/[^\s]+)/);
                                  const label = spec.replace(/(https?:\/\/[^\s]+)/, '').replace(/:\s*$/, '').trim();
                                  return urlMatch ? (
                                    <a key={idx} href={urlMatch[0]} target="_blank" rel="noopener noreferrer" className="block w-full py-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-center text-sm transition border border-slate-200 dark:border-slate-600 px-3">
                                      {label || urlMatch[0]}
                                    </a>
                                  ) : null;
                                })}
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 print:hidden">
                          <button onClick={downloadDetailedReport} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                            <Download size={20} /> {t('downloadReport')}
                          </button>
                          <button onClick={() => window.print()} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                            <Activity size={20} /> {t('printQuickView')}
                          </button>
                          <button onClick={restart} className="flex-1 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            <RefreshCw size={20} /> {t('newAssessment')}
                          </button>
                        </div>

                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                
                {/* Inline Navigation Buttons */}
                {isInterviewRoute && currentStep < STEPS.length - 1 && (
                  <div className="max-w-4xl mx-auto mt-8 flex items-center justify-between">
                     <button 
                        onClick={() => setCurrentStep(prev => prev - 1)} 
                        disabled={currentStep === 0}
                        className="px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2 disabled:opacity-50"
                      >
                        {t('back')}
                      </button>
                      <button 
                        onClick={nextStep} 
                        disabled={isNextDisabled() || loading}
                        className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition transform active:scale-95 flex items-center gap-2"
                      >
                        {loading ? 'Processing...' : (STEPS[currentStep] === 'Interview' ? t('analyzeResults') : t('continue'))}
                        {!loading && <ChevronRight size={18} />}
                      </button>
                  </div>
                )}
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}
