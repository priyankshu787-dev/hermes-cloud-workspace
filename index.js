const http = require('http');

const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hermes Ultimate Workspace - Autonomous Engine</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background-color: #060913; color: #f3f4f6; display: flex; height: 100vh; overflow: hidden; }
        
        /* Sidebar */
        aside { width: 260px; background-color: #0b0f19; border-right: 1px solid #1f2937; display: flex; flex-direction: column; padding: 20px; }
        aside h2 { color: #f59e0b; font-size: 20px; margin-bottom: 30px; display: flex; align-items: center; gap: 10px; }
        aside nav a { color: #9ca3af; text-decoration: none; padding: 12px 15px; border-radius: 6px; margin-bottom: 8px; display: block; font-size: 14px; transition: 0.2s; }
        aside nav a:hover, aside nav a.active { background-color: #1f2937; color: #fff; }

        /* Main Workspace */
        main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
        header { background-color: #0b0f19; border-bottom: 1px solid #1f2937; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
        .status { background: rgba(16, 185, 129, 0.1); color: #34d399; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; border: 1px solid rgba(52, 211, 153, 0.2); }

        /* Content Grid */
        .content { padding: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background-color: #111827; border: 1px solid #1f2937; border-radius: 10px; padding: 25px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5); }
        .card h3 { margin-bottom: 15px; color: #f59e0b; font-size: 18px; }
        
        label { display: block; font-size: 13px; color: #9ca3af; margin-bottom: 6px; }
        select, textarea, input { width: 100%; background: #1f2937; border: 1px solid #374151; color: white; padding: 12px; border-radius: 6px; font-size: 14px; margin-bottom: 15px; }
        textarea { height: 120px; resize: none; }
        
        button { background-color: #f59e0b; color: #000; border: none; padding: 12px 20px; font-weight: bold; border-radius: 6px; cursor: pointer; width: 100%; font-size: 14px; transition: 0.2s; }
        button:hover { background-color: #d97706; }

        /* Terminal Output */
        .full-width { grid-column: span 2; }
        .terminal { background: #030712; border: 1px solid #1f2937; border-radius: 6px; padding: 15px; font-family: 'Courier New', Courier, monospace; color: #34d399; height: 200px; overflow-y: auto; font-size: 13px; white-space: pre-wrap; }
    </style>
</head>
<body>

    <aside>
        <h2>🛡️ Hermes Engine</h2>
        <nav>
            <a href="#" class="active">📊 Content Workspace</a>
            <a href="#">🤖 Multi-Agent Swarm</a>
            <a href="#">🔍 Research & Evidence</a>
            <a href="#">🎬 Storyboarder & Images</a>
            <a href="#">⚙️ System Settings</a>
        </nav>
    </aside>

    <main>
        <header>
            <h1>Autonomous Content Factory Control Center</h1>
            <div class="status">● System Online (Zero Cost Cloud)</div>
        </header>

        <div class="content">
            <!-- Task Dispatcher -->
            <div class="card">
                <h3>🚀 Agent Task Dispatcher</h3>
                <label>Select Agent Module:</label>
                <select id="agentModule">
                    <option value="topic">Topic Finder & Competitor Spy</option>
                    <option value="script">AI Script Writer & Structured Outline</option>
                    <option value="research">Researcher (Source & Evidence Collector)</option>
                    <option value="storyboard">Storyboarder & Image Prompt Generator</option>
                    <option value="thumbnail">Thumbnail Idea & Visual Designer</option>
                </select>

                <label>Mission Prompt / Parameters:</label>
                <textarea id="promptInput" placeholder="Enter your instructions here (e.g., Find top 5 viral angles for AI automation tools)..."></textarea>
                
                <button onclick="dispatchAgent()">Execute Agent Pipeline</button>
            </div>

            <!-- System Metrics & Quick Status -->
            <div class="card">
                <h3>📈 Environment Overview</h3>
                <p style="color: #9ca3af; font-size: 14px; margin-bottom: 15px;">
                    This workspace environment is fully isolated on cloud infrastructure. You have full liberty to structure, scale, and build your content automation pipelines directly from here.
                </p>
                <ul style="list-style: none; font-size: 14px; color: #d1d5db; line-height: 1.8;">
                    <li>✅ Core Engine: Node.js / Cloud Runtime</li>
                    <li>✅ API Integration Ready: Gemini / LLM Bridge</li>
                    <li>✅ Execution State: Active & Listening</li>
                </ul>
            </div>

            <!-- Terminal / Logs -->
            <div class="card full-width">
                <h3>💻 Execution Logs & Terminal Output</h3>
                <div id="terminalOutput" class="terminal">[System] Workspace initialized successfully. Waiting for agent dispatch...</div>
            </div>
        </div>
    </main>

    <script>
        function dispatchAgent() {
            const module = document.getElementById('agentModule').value;
            const prompt = document.getElementById('promptInput').value;
            const terminal = document.getElementById('terminalOutput');

            if(!prompt) {
                alert('Please enter a mission prompt or instructions!');
                return;
            }

            terminal.innerText += "\\n\\n[Dispatch] Initializing " + module.toUpperCase() + " agent...\\n[Payload] " + prompt + "\\n[Status] Processing request via cloud environment...";
            
            // Simulation of execution feedback
            setTimeout(() => {
                terminal.innerText += "\\n[Success] Agent task sequence completed successfully. Ready for next pipeline instruction.";
                terminal.scrollTop = terminal.scrollHeight;
            }, 1500);
        }
    </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.end(dashboardHTML);
});

server.listen(process.env.PORT || 10000, () => {
  console.log('Hermes Workspace Dashboard is running live!');
});
