const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
    // 1. Handle API Request (Jab button dabega aur AI se baat karni hogi)
    if (req.method === 'POST' && req.url === '/run-agent') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const userPrompt = data.prompt || "Hello";
                const moduleType = data.module || "General";

                const apiKey = process.env.GEMINI_API_KEY;
                if (!apiKey) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ output: "Error: GEMINI_API_KEY is missing in Render Environment Variables!" }));
                    return;
                }

                const fullPrompt = `Act as an advanced AI content creation agent module: [${moduleType}]. Task: ${userPrompt}`;
                const payload = JSON.stringify({
                    contents: [{ parts: [{ text: fullPrompt }] }]
                });

                const apiReq = https.request({
                    hostname: 'generativelanguage.googleapis.com',
                    path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }, apiRes => {
                    let responseData = '';
                    apiRes.on('data', chunk => { responseData += chunk; });
                    apiRes.on('end', () => {
                        try {
                            const jsonRes = JSON.parse(responseData);
                            const aiText = jsonRes.candidates && jsonRes.candidates[0].content.parts[0].text 
                                           || "No response generated from AI.";
                            
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ output: aiText }));
                        } catch (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ output: "Parsing Error: " + responseData }));
                        }
                    });
                });

                apiReq.on('error', err => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ output: "Network Error: " + err.message }));
                });

                apiReq.write(payload);
                apiReq.end();

            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ output: "Invalid JSON Request" }));
            }
        });
        return;
    }

    // 2. Serve the Dashboard UI
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hermes Ultimate Workspace - Live AI Engine</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            body { background-color: #060913; color: #f3f4f6; display: flex; height: 100vh; overflow: hidden; }
            aside { width: 260px; background-color: #0b0f19; border-right: 1px solid #1f2937; display: flex; flex-direction: column; padding: 20px; }
            aside h2 { color: #f59e0b; font-size: 20px; margin-bottom: 30px; display: flex; align-items: center; gap: 10px; }
            aside nav a { color: #9ca3af; text-decoration: none; padding: 12px 15px; border-radius: 6px; margin-bottom: 8px; display: block; font-size: 14px; }
            aside nav a.active { background-color: #1f2937; color: #fff; }
            main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
            header { background-color: #0b0f19; border-bottom: 1px solid #1f2937; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
            .status { background: rgba(16, 185, 129, 0.1); color: #34d399; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; border: 1px solid rgba(52, 211, 153, 0.2); }
            .content { padding: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .card { background-color: #111827; border: 1px solid #1f2937; border-radius: 10px; padding: 25px; }
            .card h3 { margin-bottom: 15px; color: #f59e0b; font-size: 18px; }
            label { display: block; font-size: 13px; color: #9ca3af; margin-bottom: 6px; }
            select, textarea { width: 100%; background: #1f2937; border: 1px solid #374151; color: white; padding: 12px; border-radius: 6px; font-size: 14px; margin-bottom: 15px; }
            textarea { height: 120px; resize: none; }
            button { background-color: #f59e0b; color: #000; border: none; padding: 12px 20px; font-weight: bold; border-radius: 6px; cursor: pointer; width: 100%; font-size: 14px; }
            button:hover { background-color: #d97706; }
            .full-width { grid-column: span 2; }
            .terminal { background: #030712; border: 1px solid #1f2937; border-radius: 6px; padding: 15px; font-family: 'Courier New', Courier, monospace; color: #34d399; height: 250px; overflow-y: auto; font-size: 13px; white-space: pre-wrap; }
        </style>
    </head>
    <body>
        <aside>
            <h2>🛡️ Hermes Engine</h2>
            <nav>
                <a href="#" class="active">📊 Content Workspace</a>
                <a href="#">🤖 Multi-Agent Swarm</a>
                <a href="#">🎬 Script & Storyboard</a>
            </nav>
        </aside>
        <main>
            <header>
                <h1>Autonomous Content Factory (Live AI Connected)</h1>
                <div class="status">● Connected to Gemini API</div>
            </header>
            <div class="content">
                <div class="card">
                    <h3>🚀 Real Agent Task Dispatcher</h3>
                    <label>Select Agent Module:</label>
                    <select id="agentModule">
                        <option value="Topic Finder">Topic Finder & Competitor Spy</option>
                        <option value="Script Writer">AI Script Writer & Outline</option>
                        <option value="Researcher">Researcher & Evidence Collector</option>
                        <option value="Storyboarder">Storyboarder & Image Prompts</option>
                        <option value="Thumbnail Generator">Thumbnail Idea & Design</option>
                    </select>
                    <label>Mission Prompt:</label>
                    <textarea id="promptInput" placeholder="Type what you want the agent to do..."></textarea>
                    <button id="execBtn" onclick="dispatchAgent()">Execute Real AI Pipeline</button>
                </div>
                <div class="card">
                    <h3>📈 System Status</h3>
                    <p style="color: #9ca3af; font-size: 14px; margin-bottom: 15px;">
                        This environment is now directly hooked to your Gemini API key on Render. When you click execute, it sends a real request to the cloud AI brain.
                    </p>
                    <ul style="list-style: none; font-size: 14px; color: #d1d5db; line-height: 1.8;">
                        <li>✅ Backend Bridge: Active</li>
                        <li>✅ API Key Bridge: Linked</li>
                        <li>✅ Execution State: Live & Processing</li>
                    </ul>
                </div>
                <div class="card full-width">
                    <h3>💻 Real-Time Terminal Output & AI Results</h3>
                    <div id="terminalOutput" class="terminal">[System] Workspace initialized. Ready to execute real agent pipelines...</div>
                </div>
            </div>
        </main>
        <script>
            async function dispatchAgent() {
                const module = document.getElementById('agentModule').value;
                const prompt = document.getElementById('promptInput').value;
                const terminal = document.getElementById('terminalOutput');
                const btn = document.getElementById('execBtn');

                if(!prompt) {
                    alert('Please enter a prompt!');
                    return;
                }

                btn.innerText = "Processing with Gemini AI...";
                terminal.innerText += "\\n\\n[Dispatch] Sending request to cloud AI for [" + module + "]...\\n[Prompt]: " + prompt;

                try {
                    const response = await fetch('/run-agent', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ module: module, prompt: prompt })
                    });
                    const data = await response.json();
                    
                    terminal.innerText += "\\n\\n[AI Response]:\\n" + data.output;
                    terminal.scrollTop = terminal.scrollHeight;
                } catch (err) {
                    terminal.innerText += "\\n[Error] Failed to connect to server backend: " + err;
                } finally {
                    btn.innerText = "Execute Real AI Pipeline";
                }
            }
        </script>
    </body>
    </html>
    `);
});

server.listen(process.env.PORT || 10000, () => {
  console.log('Live Hermes Workspace Engine running on port 10000');
});
