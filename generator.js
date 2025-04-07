import { CONFIG } from './config.js';
import { createNoiseCanvas, createArtifacts } from './effects.js';

const room = new WebsimSocket();

// Initialize effects
createNoiseCanvas(document.querySelector('.static'), true);
createNoiseCanvas(document.querySelector('.noise'), false);
createArtifacts();

// Display owner name
async function displayOwner() {
    const owner = await window.websim.getCreatedBy();
    document.getElementById('ownerName').textContent = owner.username;
}
displayOwner();

async function generateSingleFrame(enhancedPrompt, seed, retryCount = 0) {
    try {
        const result = await websim.imageGen({
            prompt: enhancedPrompt,
            aspect_ratio: "16:9",
            seed: seed
        });
        return result;
    } catch (error) {
        console.error(`Frame generation failed (attempt ${retryCount + 1}):`, error);
        if (retryCount < 3) { // Retry up to 3 times
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            return generateSingleFrame(enhancedPrompt, seed, retryCount + 1);
        }
        throw error;
    }
}

async function generateFrames(prompt, footageType, timeOfDay, atmosphere) {
    const enhancedPrompt = `${CONFIG.promptEnhancements[footageType]}, ${CONFIG.styleEnhancements[atmosphere]}, showing: ${prompt}`;
    
    const frames = [];
    for (let i = 0; i < CONFIG.frameCount; i++) {
        try {
            const frame = await generateSingleFrame(enhancedPrompt, i);
            frames.push(frame);
        } catch (error) {
            console.error(`Failed to generate frame ${i}:`, error);
            // If we have at least one frame, we can continue
            if (frames.length > 0) {
                // Duplicate the last successful frame as a fallback
                frames.push(frames[frames.length - 1]);
            } else if (i === 0) {
                // If the very first frame fails, we need to throw
                throw error;
            }
        }
    }
    return frames;
}

async function generate() {
    const prompt = document.getElementById('prompt').value;
    const timeOfDay = document.getElementById('timeOfDay').value;
    const footageType = document.getElementById('footageType').value;
    const atmosphere = document.getElementById('atmosphere').value;

    if (!prompt) {
        alert('Please enter a description first');
        return;
    }

    // Clear previous content and show loading state
    document.getElementById('result').classList.remove('visible');
    const frameContainer = document.querySelector('.frame-container');
    frameContainer.innerHTML = '';
    document.getElementById('description').textContent = 'Generating...';

    try {
        // Start both text and image generation in parallel
        const [textResult, frames] = await Promise.all([
            websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a paranormal investigator analyzing mysterious footage. Your task is to:
                        1. Write a brief, unsettling description (50-150 words)
                        2. Focus on specific, realistic details that would appear in ${footageType} footage
                        3. Describe the conditions: ${timeOfDay}, ${atmosphere}
                        4. Use technical, professional language
                        5. Include what makes this footage particularly disturbing or unexplainable
                        6. Maintain a serious, analytical tone as if writing an official report`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            }).catch(error => {
                console.error('Text generation failed:', error);
                return { content: 'Analysis unavailable due to system malfunction. Footage requires further investigation.' };
            }),
            generateFrames(prompt, footageType, timeOfDay, atmosphere)
        ]);

        // Add frames to container
        frames.forEach((result, i) => {
            const frame = document.createElement('img');
            frame.src = result.url;
            frame.className = `frame ${i === 0 ? 'active' : ''}`;
            frame.onerror = () => {
                console.error(`Frame ${i} failed to load`);
                frame.src = frames[0]?.url || ''; // Fallback to first frame
            };
            frameContainer.appendChild(frame);
        });

        // Setup frame animation
        let currentFrame = 0;
        setInterval(() => {
            const frames = document.querySelectorAll('.frame');
            if (frames.length > 0) {
                frames[currentFrame].classList.remove('active');
                currentFrame = (currentFrame + 1) % frames.length;
                frames[currentFrame].classList.add('active');
            }
        }, CONFIG.frameInterval);

        // Generate timestamp
        let timestamp;
        try {
            const timeMap = {
                'early morning': {min: 4, max: 6},
                'morning': {min: 6, max: 11},
                'noon': {min: 11, max: 14},
                'afternoon': {min: 14, max: 17},
                'evening': {min: 17, max: 20},
                'night': {min: 20, max: 4}
            };
            
            const timeRange = timeMap[timeOfDay] || {min: 0, max: 23};
            let randomHour = timeRange.min + Math.floor(Math.random() * (timeRange.max - timeRange.min + 1));
            if (randomHour > 23) randomHour = randomHour - 24;
            
            const randomMinute = Math.floor(Math.random() * 60);
            const randomSecond = Math.floor(Math.random() * 60);
            
            timestamp = moment()
                .subtract(Math.floor(Math.random() * 20), 'years')
                .hour(randomHour)
                .minute(randomMinute)
                .second(randomSecond);

            document.getElementById('timestamp').textContent = timestamp.format('DD/MM/YYYY HH:mm:ss');
        } catch (error) {
            console.error('Timestamp generation failed:', error);
            document.getElementById('timestamp').textContent = '[TIMESTAMP ERROR]';
        }

        // Generate metadata
        const lat = (Math.random() * 180 - 90).toFixed(6);
        const lng = (Math.random() * 360 - 180).toFixed(6);
        const caseNum = Math.floor(Math.random() * 9000) + 1000;
        
        document.getElementById('description').textContent = textResult.content;
        document.getElementById('location').textContent = `COORDINATES: ${lat}°, ${lng}°`;
        document.getElementById('caseNumber').textContent = `CASE #: ${caseNum}-X`;
        
        // Show result with animation
        setTimeout(() => {
            document.getElementById('result').classList.add('visible');
        }, 500);

    } catch (error) {
        console.error('Generation failed:', error);
        document.getElementById('description').textContent = 'ERROR: Generation failed. Please try again.';
        // Show error state
        document.getElementById('result').classList.add('visible');
    }
}

document.getElementById('prompt').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generate();
    }
});

window.generate = generate; // Make generate function available globally