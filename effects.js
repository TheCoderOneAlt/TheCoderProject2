import { CONFIG } from './config.js';

export function createNoiseCanvas(element, isStatic) {
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    element.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function noise() {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const value = isStatic ? Math.random() < 0.5 ? 0 : 255 : Math.random() * 255;
            data[i] = data[i + 1] = data[i + 2] = value;
            data[i + 3] = 255;
        }
        
        ctx.putImageData(imageData, 0, 0);
        requestAnimationFrame(noise);
    }
    noise();
}

export function createArtifacts() {
    const artifactsElement = document.querySelector('.artifacts');
    if (!artifactsElement) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    function resize() {
        const rect = artifactsElement.getBoundingClientRect();
        if (rect.width && rect.height) {
            canvas.width = rect.width;
            canvas.height = rect.height;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            artifactsElement.appendChild(canvas);
        }
    }
    
    resize();
    window.addEventListener('resize', resize);

    function drawArtifacts() {
        if (!canvas.width || !canvas.height) {
            resize();
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Enhanced VHS-style artifacts
        for (let i = 0; i < 5; i++) {
            const y = Math.random() * canvas.height;
            const opacity = Math.random() * 0.5;
            const height = Math.random() * 8;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fillRect(0, y, canvas.width, height);
            
            // Add color shifting
            if (Math.random() > 0.7) {
                ctx.fillStyle = `rgba(255, 0, 0, ${opacity * 0.5})`;
                ctx.fillRect(Math.random() * 10 - 5, y, canvas.width, height);
                
                ctx.fillStyle = `rgba(0, 0, 255, ${opacity * 0.5})`;
                ctx.fillRect(Math.random() * 10 - 5, y + height/2, canvas.width, height/2);
            }
        }
        
        requestAnimationFrame(drawArtifacts);
    }
    
    drawArtifacts();
}