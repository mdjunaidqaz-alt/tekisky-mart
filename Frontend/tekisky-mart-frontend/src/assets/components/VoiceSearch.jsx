import { useNavigate } from "react-router-dom";

const VoiceSearch = () => {
  const navigate = useNavigate();

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice search not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      navigate(`/products?keyword=${text}`);
    };
  };

  return (
<button
  onClick={startListening}
  aria-label="Voice Search"
  className="
    h-8 w-8
    flex items-center justify-center
    bg-transparent
    text-gray-500
    hover:text-blue-600
    focus:outline-none
    focus:ring-0
    focus:border-none
    active:scale-95
    transition
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <rect x="9" y="2" width="6" height="10" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="9" y1="22" x2="15" y2="22" />
  </svg>
</button>

  );
};

export default VoiceSearch;
