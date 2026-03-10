import { useEffect, useState } from 'react';

export default function GenIcons() {
    const [status, setStatus] = useState('Initializing...');
    const [log, setLog] = useState([]);

    const addLog = (msg) => setLog(prev => [...prev, msg]);

    useEffect(() => {
        let mounted = true;
        const run = async () => {
            setStatus('Starting generation...');
            try {
                const sizes = [192, 512];
                // Append random query param to force reload of SVG
                const svgUrl = `/icons/icon.svg?v=${Date.now()}`;

                for (const size of sizes) {
                    addLog(`Generating ${size}x${size}...`);
                    await new Promise((resolve, reject) => {
                        const img = new Image();
                        img.crossOrigin = "Anonymous";
                        img.onload = () => {
                            try {
                                const canvas = document.createElement('canvas');
                                canvas.width = size;
                                canvas.height = size;
                                const ctx = canvas.getContext('2d');
                                // Clear
                                ctx.clearRect(0, 0, size, size);
                                // Draw
                                ctx.drawImage(img, 0, 0, size, size);

                                const dataUrl = canvas.toDataURL('image/png');

                                // Send
                                fetch('/api/save-temp-icon', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ name: `icon-${size}.png`, data: dataUrl })
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        addLog(`Saved icon-${size}.png: ${JSON.stringify(data)}`);
                                        resolve();
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        addLog(`Error saving ${size}: ${err.message}`);
                                        resolve(); // Continue anyway
                                    });
                            } catch (e) {
                                addLog(`Canvas error: ${e.message}`);
                                resolve();
                            }
                        };
                        img.onerror = (e) => {
                            addLog(`Error loading SVG: ${e}`);
                            resolve();
                        };
                        img.src = svgUrl;
                    });
                }
                setStatus('COMPLETED');
            } catch (e) {
                setStatus(`FAILED: ${e.message}`);
            }
        };

        run();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Icon Generator</h1>
            <h2>Status: <span id="status">{status}</span></h2>
            <pre>{log.join('\n')}</pre>
        </div>
    );
}
