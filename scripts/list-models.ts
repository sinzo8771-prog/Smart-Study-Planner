import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyDGvbB3ffm2CPVixJ7TxLcus62eWxPsbU4';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    const data = await response.json();
    
    console.log('Available Models:\n');
    if (data.models) {
      for (const model of data.models) {
        console.log(`- ${model.name}`);
        console.log(`  Display: ${model.displayName}`);
        console.log(`  Methods: ${model.supportedGenerationMethods?.join(', ')}`);
        console.log('');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
