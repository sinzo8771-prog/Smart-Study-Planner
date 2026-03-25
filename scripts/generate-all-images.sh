#!/bin/bash

# Generate realistic, professional images for the Smart Study Planner website

OUTPUT_DIR="./public/images/landing"

echo "🚀 Starting image generation with enhanced prompts..."
echo "📁 Output directory: $OUTPUT_DIR"
echo ""

# Hero Image - Photorealistic education scene
echo "🎨 Generating hero image..."
z-ai image -p "Professional photograph of diverse university students studying in a modern library with floor-to-ceiling windows, natural sunlight streaming in, using laptops and tablets, books on oak tables, plants in background, warm and inspiring atmosphere, shot on Canon EOS R5, 85mm lens, f/2.8, cinematic color grading, high quality, photorealistic, 16:9 aspect ratio" -o "$OUTPUT_DIR/hero.png" -s 1344x768
echo "✅ Hero image complete"
echo ""

# Feature Planner
echo "🎨 Generating planner feature image..."
z-ai image -p "Professional product photography of a digital calendar app on iPad Pro, showing weekly schedule with colorful events and study blocks, clean modern UI design, soft shadows, floating UI elements, gradient blue and purple accents, minimalist desk setup with coffee cup, studio lighting, commercial product shot, high quality, photorealistic" -o "$OUTPUT_DIR/feature-planner.png" -s 1024x1024
echo "✅ Planner image complete"
echo ""

# Feature Tasks
echo "🎨 Generating tasks feature image..."
z-ai image -p "Professional mockup of task management app on smartphone, showing to-do list with checkboxes and progress indicators, dark mode UI with purple gradient accents, floating task cards, glassmorphism design, clean white desk with plant, soft studio lighting, product photography style, high quality, photorealistic" -o "$OUTPUT_DIR/feature-tasks.png" -s 1024x1024
echo "✅ Tasks image complete"
echo ""

# Feature Courses
echo "🎨 generating courses feature image..."
z-ai image -p "Professional e-learning platform interface on laptop screen, showing course library with video thumbnails, progress bars, ratings stars, diverse course topics like programming and design, modern dark UI with vibrant accent colors, shallow depth of field, warm ambient lighting, high quality, photorealistic" -o "$OUTPUT_DIR/feature-courses.png" -s 1024x1024
echo "✅ Courses image complete"
echo ""

# Feature Quiz
echo "🎨 Generating quiz feature image..."
z-ai image -p "Conceptual illustration of AI quiz generator, glowing neural network visualization with interconnected nodes, floating question cards with multiple choice options, holographic display effect, deep blue and warm orange color scheme, futuristic educational technology, 3D render style, cinematic lighting, high quality" -o "$OUTPUT_DIR/feature-quiz.png" -s 1024x1024
echo "✅ Quiz image complete"
echo ""

# Feature Analytics
echo "🎨 Generating analytics feature image..."
z-ai image -p "Professional data analytics dashboard on large monitor, showing beautiful charts and graphs, line graphs trending upward, pie charts, bar graphs with green and blue gradients, statistics cards showing growth metrics, modern fintech UI style, clean desk setup, product photography, high quality, photorealistic" -o "$OUTPUT_DIR/feature-analytics.png" -s 1024x1024
echo "✅ Analytics image complete"
echo ""

# Feature Assistant
echo "🎨 Generating assistant feature image..."
z-ai image -p "Friendly AI assistant concept, cute robot character with glowing blue eyes helping with studies, chat interface with conversation bubbles, knowledge icons floating around, warm cyan and blue gradient background, approachable and helpful appearance, 3D character render style, soft lighting, high quality" -o "$OUTPUT_DIR/feature-assistant.png" -s 1024x1024
echo "✅ Assistant image complete"
echo ""

# Avatar 1
echo "🎨 Generating avatar 1..."
z-ai image -p "Professional headshot portrait of young Asian female university student, early 20s, friendly confident smile, wearing navy blue blouse, soft natural window lighting, modern campus background with bokeh, professional photography, Canon 85mm f/1.8, warm color grading, high quality, photorealistic" -o "$OUTPUT_DIR/avatar-1.png" -s 1024x1024
echo "✅ Avatar 1 complete"
echo ""

# Avatar 2
echo "🎨 Generating avatar 2..."
z-ai image -p "Professional headshot portrait of young male college student with black frame glasses, early 20s, genuine warm smile, wearing casual polo shirt, soft natural lighting, library background with bookshelves bokeh, professional photography, shallow depth of field, neutral color grading, high quality, photorealistic" -o "$OUTPUT_DIR/avatar-2.png" -s 1024x1024
echo "✅ Avatar 2 complete"
echo ""

# Avatar 3
echo "🎨 Generating avatar 3..."
z-ai image -p "Professional headshot portrait of young female graduate student, mid 20s, confident smile showing teeth, wearing professional blazer, golden hour sunlight, university campus background with trees bokeh, professional photography, warm natural tones, shallow depth of field, high quality, photorealistic" -o "$OUTPUT_DIR/avatar-3.png" -s 1024x1024
echo "✅ Avatar 3 complete"
echo ""

# Success Image
echo "🎨 Generating success image..."
z-ai image -p "Joyful graduation celebration photograph, diverse group of happy university students throwing graduation caps in the air, bright blue sky with fluffy white clouds, confetti falling, genuine expressions of joy and achievement, golden hour sunlight, cinematic composition, professional event photography, high quality, photorealistic, 16:9 aspect ratio" -o "$OUTPUT_DIR/success.png" -s 1344x768
echo "✅ Success image complete"
echo ""

echo "🎉 All images generated successfully!"
echo "📁 Check $OUTPUT_DIR for the generated images"
