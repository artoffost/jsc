// Set up audio context and analyzer
let audioContext;
let analyzer;
let microphone;

// Function to set up the audio context and analyzer
async function setupAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyzer = audioContext.createAnalyser();
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyzer);
    
    analyzer.fftSize = 256;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function checkAudioLevel() {
      analyzer.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      
      // Adjust this threshold value as needed
      if (average > 50) {
        const flame = document.querySelector('.flame');
        if (flame) {
          flame.style.display = 'none';

          alert('Happy 21st Birthday Appey!!!');
        }
      }
      
      requestAnimationFrame(checkAudioLevel);
    }
    
    checkAudioLevel();
  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
}

// Function to start listening when the page loads
function init() {
  const startButton = document.createElement('button');
  startButton.textContent = 'Click me and blow your cake!';
  startButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4';
  document.body.insertBefore(startButton, document.body.firstChild);
  
  startButton.addEventListener('click', () => {
    setupAudio();
    startButton.disabled = true;
    startButton.textContent = 'Listening...';
  });
}

// Call init when the page loads
window.addEventListener('load', init);