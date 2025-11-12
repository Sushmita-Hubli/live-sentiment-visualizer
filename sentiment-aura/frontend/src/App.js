import React, { useState, useRef } from 'react';
import axios from 'axios';
import AuraVisualization from './components/AuraVisualization';
import TranscriptDisplay from './components/TranscriptDisplay';
import KeywordsDisplay from './components/KeywordsDisplay';
import Controls from './components/Controls';
import './App.css';

const DEEPGRAM_API_KEY = process.env.REACT_APP_DEEPGRAM_API_KEY;
const BACKEND_URL = 'http://localhost:8000';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [sentiment, setSentiment] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [emotion, setEmotion] = useState('neutral');
  
  const mediaRecorderRef = useRef(null);
  const websocketRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      streamRef.current = stream;
      console.log('Microphone access granted');

      // Connect to Deepgram WebSocket
      const wsUrl = `wss://api.deepgram.com/v1/listen?model=nova-2&language=en-US&smart_format=true`;
      const ws = new WebSocket(wsUrl, ['token', DEEPGRAM_API_KEY]);
      
      websocketRef.current = ws;

      ws.onopen = () => {
        console.log('Deepgram connection opened');
        
        // Create MediaRecorder
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm'
        });
        
        mediaRecorderRef.current = mediaRecorder;

        // Send audio data to Deepgram
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
            console.log('Sent audio chunk to Deepgram');
          }
        };

        mediaRecorder.start(250); // Send data every 250ms
        console.log('MediaRecorder started');
      };

      ws.onmessage = async (message) => {
        const data = JSON.parse(message.data);
        console.log('Deepgram response:', data);
        
        if (data.channel && data.channel.alternatives && data.channel.alternatives[0]) {
          const transcriptText = data.channel.alternatives[0].transcript;
          
          if (transcriptText && transcriptText.trim() !== '') {
            console.log('Transcript:', transcriptText, 'Is final:', data.is_final);
            
            // Update transcript display with all text (interim and final)
            if (data.is_final) {
              setTranscript(prev => prev + ' ' + transcriptText);
              
              // Send to backend for sentiment analysis
              try {
                console.log('Sending to backend:', transcriptText);
                const response = await axios.post(`${BACKEND_URL}/process_text`, {
                  text: transcriptText
                });
                
                console.log('Sentiment response:', response.data);
                setSentiment(response.data.sentiment);
                setKeywords(response.data.keywords);
                setEmotion(response.data.emotion);
              } catch (error) {
                console.error('Error processing text:', error);
              }
            }
          }
        }
      };

      ws.onerror = (error) => {
        console.error('Deepgram WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('Deepgram connection closed');
      };
      
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...');
    
    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      console.log('MediaRecorder stopped');
    }
    
    // Stop all audio tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Audio track stopped');
      });
    }
    
    // Close WebSocket
    if (websocketRef.current) {
      websocketRef.current.close();
      console.log('WebSocket closed');
    }
    
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="App">
      <AuraVisualization sentiment={sentiment} emotion={emotion} />
      <TranscriptDisplay transcript={transcript} />
      <KeywordsDisplay keywords={keywords} />
      <Controls isRecording={isRecording} onToggle={toggleRecording} />
    </div>
  );
}

export default App;