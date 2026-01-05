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
      className="bg-blue-600 text-white px-3 py-2 rounded"
    >
      🎤
    </button>
  );
};

export default VoiceSearch;
