import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const GEMINI_API_KEY = 'AIzaSyDGvbB3ffm2CPVixJ7TxLcus62eWxPsbU4';
const OUTPUT_DIR = './public/images/landing';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateImage(prompt: string, filename: string) {
  console.log(`\n🎨 Generating: ${filename}`);
  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
  
  try {
    // Use Gemini 2.0 Flash for image generation
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseModalities: ['image', 'text'],
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Check for image in the response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const content = candidates[0].content;
      if (content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
            const imageData = part.inlineData.data;
            const buffer = Buffer.from(imageData, 'base64');
            const outputPath = path.join(OUTPUT_DIR, filename);
            fs.writeFileSync(outputPath, buffer);
            console.log(`✅ Saved: ${outputPath}`);
            return true;
          }
        }
      }
    }
    
    console.log(`⚠️ No image data in response for ${filename}`);
    console.log('Response:', JSON.stringify(response, null, 2).substring(0, 500));
    return false;
  } catch (error: any) {
    console.error(`❌ Error generating ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Gemini Image Generation...\n');
  
  const images = [
    {
      filename: 'hero.png',
      prompt: `Generate a stunning, photorealistic wide banner image for an educational technology platform. Show diverse university students studying together in a modern, bright library with glass walls. Students using laptops and tablets, books on tables, natural sunlight streaming through windows. Professional photography style, warm color grading.`
    },
    {
      filename: 'feature-planner.png',
      prompt: `Generate a professional UI mockup of a smart calendar and study planner application. Clean, modern interface with weekly view, colorful event blocks, task checkboxes. Soft shadows, rounded corners, gradient blue and purple accent colors. Glassmorphism effects.`
    },
    {
      filename: 'feature-tasks.png',
      prompt: `Generate professional product photography of a task management application on a smartphone. Clean UI showing to-do lists, progress bars, priority tags. Modern glassmorphism design, purple and blue gradient accents. Soft studio lighting, clean background.`
    },
    {
      filename: 'feature-courses.png',
      prompt: `Generate beautiful e-learning course library interface on a laptop screen. Course cards with thumbnails showing various subjects - programming, mathematics, science. Video play buttons, progress indicators, star ratings. Modern UI with vibrant accent colors.`
    },
    {
      filename: 'feature-quiz.png',
      prompt: `Generate a futuristic AI quiz generator concept. A glowing neural network brain made of light particles, floating above a tablet showing multiple choice questions. Warm orange and cool blue color palette. Holographic UI elements.`
    },
    {
      filename: 'feature-analytics.png',
      prompt: `Generate professional data analytics dashboard on a monitor showing student progress. Beautiful charts - line graphs trending upward, pie charts, bar graphs. Green and blue color scheme. Modern fintech-style UI.`
    },
    {
      filename: 'feature-assistant.png',
      prompt: `Generate friendly AI study assistant concept - a cute robot tutor with glowing eyes. Chat interface with conversation bubbles, knowledge icons. Warm cyan and blue colors, soft gradients. Holographic and translucent appearance.`
    },
    {
      filename: 'avatar-1.png',
      prompt: `Generate professional headshot portrait of a young Asian female university student, early 20s, friendly confident smile, wearing casual smart attire. Soft natural lighting, modern blurred background. Professional photography, shallow depth of field.`
    },
    {
      filename: 'avatar-2.png',
      prompt: `Generate professional headshot portrait of a young male university student with glasses, early 20s, warm genuine smile, wearing casual smart attire. Soft natural lighting, modern blurred library background. Professional photography.`
    },
    {
      filename: 'avatar-3.png',
      prompt: `Generate professional headshot portrait of a young female graduate student, mid 20s, confident warm smile, wearing casual professional attire. Soft natural lighting, golden hour lighting. Professional photography.`
    },
    {
      filename: 'success.png',
      prompt: `Generate joyful graduation celebration - diverse group of university students throwing graduation caps in the air against bright blue sky with clouds. Confetti falling, genuine happy expressions. Golden hour sunlight, cinematic composition.`
    }
  ];

  let successCount = 0;
  
  for (const image of images) {
    const success = await generateImage(image.prompt, image.filename);
    if (success) successCount++;
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log(`\n🎉 Generation complete! ${successCount}/${images.length} images generated.`);
}

main().catch(console.error);
