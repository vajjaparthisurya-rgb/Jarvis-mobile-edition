// ===== 1. API KEY (Safe: browser లో మాతమ్ర ే) =====
let API_KEY = localStorage.getItem('jarvis_key');
if(!API_KEY){
API_KEY = prompt('Enter your Gemini API Key:');
if(API_KEY) localStorage.setItem('jarvis_key', API_KEY);
}
// ===== 2. SMART MODELS (ఒకటిfail అయితేnext auto try) =====
const MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];
const chat=document.getElementById('chat');
const input=document.getElementById('msg');
const micBtn=document.getElementById('mic-btn');
// ===== 3. GEMINI BRAIN (auto-fallback) =====
async function callGemini(p){ let lastErr;
for(const m of MODELS){
try{
const res=await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/"+m+":generateContent?key="
+API_KEY,
{method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({contents:[{parts:[{text:p}]}]})});
const data=await res.json();
if(data.error){
lastErr=new Error(data.error.message);
if(/high demand|temporar|quota|rate|unavailable|no longer
available|deprecated/i.test(data.error.message)) continue;
throw lastErr;
}
return data.candidates[0].content.parts[0].text;
}catch(e){ lastErr=e; }
}
throw lastErr;
}
async function askGemini(p){
add('J.A.R.V.I.S: Thinking...','ai');
try{
const reply=await callGemini(p);
chat.lastChild.innerText='J.A.R.V.I.S: '+reply;
speak(reply); // reply వచ్చి న వెంటనేVOICE
}catch(e){
chat.lastChild.innerText='J.A.R.V.I.S: ERROR - '+e.message;
}
}
// ===== 4. SPEECH RECOGNITION (వినడం) =====
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const rec=new SR(); rec.lang='en-US'; // Telugu కి'te-IN'
rec.onresult=(e)=>{const t=e.results[0][0].transcript;add('YOU: '+t,'user');askGemini(t);};
micBtn.onclick=()=>{rec.start();micBtn.innerText='LISTENING...';};
rec.onend=()=>{micBtn.innerText='🎙️';};
// ===== 5. TEXT-TO-SPEECH (మాట్లాడటం) =====
let voices=[];
function loadVoices(){ voices=speechSynthesis.getVoices(); }
loadVoices();
speechSynthesis.onvoiceschanged=loadVoices;
function speak(t){
const u=new SpeechSynthesisUtterance(t); u.rate=1.05; u.pitch=0.85;
const v=voices.find(v=>v.lang.startsWith('en'));
if(v) u.voice=v;
speechSynthesis.speak(u);
}
// ===== 6. TEXT SEND BUTTON =====
document.getElementById('send').onclick=()=>{
const t=input.value.trim(); if(!t)return;
add('YOU: '+t,'user'); input.value=''; askGemini(t);
};
function add(t,w){const d=document.createElement('div');d.className='msg
'+w;d.innerText=t;chat.appendChild(d);chat.scrollTop=chat.scrollHeight;}
{
  // Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  const micBtn = document.querySelector('.mic-btn');
  const inputField = document.querySelector('input');

  // Mic Button click chesinappudu
  micBtn.addEventListener('click', () => {
    recognition.start();
    speakJarvis("Listening, Sir.");
  });

  // Voice ni text ga marchinappudu
  recognition.onresult = (event) => {
    const userVoiceText = event.results[0][0].transcript;
    inputField.value = userVoiceText;
    processCommand(userVoiceText);
  };

  recognition.onerror = () => {
    speakJarvis("Sorry, I could not hear you properly.");
  };
}

// JARVIS Voice Reply (Text-to-Speech)
function speakJarvis(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  
  const voices = window.speechSynthesis.getVoices();
  const jarvisVoice = voices.find(v => v.name.includes('Google UK English Male') || v.lang === 'en-GB');
  if (jarvisVoice) utterance.voice = jarvisVoice;

  window.speechSynthesis.speak(utterance);
}

// Commands Process chesi Response ivvadam
function processCommand(command) {
  let reply = "I am processing your query, Sir.";
  const lowerCmd = command.toLowerCase();

  if (lowerCmd.includes('hello') || lowerCmd.includes('hi')) {
    reply = "Hello Sir, J.A.R.V.I.S is online and ready.";
  } else if (lowerCmd.includes('time')) {
    reply = `Current time is ${new Date().toLocaleTimeString()}`;
  } else if (lowerCmd.includes('who are you')) {
    reply = "I am JARVIS, your mobile artificial intelligence assistant.";
  }

  speakJarvis(reply);
}
