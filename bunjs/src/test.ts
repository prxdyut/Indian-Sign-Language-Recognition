import {franc} from 'franc-min';
import natural from 'natural';
import say from 'say';

// Initialize tokenizer
const tokenizer = new natural.WordTokenizer();

// Function to detect language and adjust text
function normalizeText(text: string): string {
  // Detect language
  const lang = franc(text);
  let normalizedText = text;

  // Example: Adjust text based on detected language (simplified)
  if (lang === 'en') {
    // English text, no specific adjustments needed
  } else if (lang === 'hi') {
    // Handle Hindi text (not detailed here)
    normalizedText = convertHindiText(text); // Implement this function if needed
  } else {
    // Handle other languages or unknown cases
  }

  return normalizedText;
}

// Function to convert Hindi text (example placeholder)
function convertHindiText(text: string): string {
  // Implement text conversion or adjustments
  return text; // Modify as needed
}

// Function to speak text
function speakText(text: string) {
  const normalizedText = normalizeText(text);

  say.speak(normalizedText, 'en', 1.0, (err) => {
    if (err) {
      console.error('Error speaking text:', err);
    } else {
      console.log('Text spoken successfully');
    }
  });
}

// Example usage
const message = "ye hinglish text hai.";
speakText(message);
