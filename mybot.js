(function () {
    if (window.QuotexRealGeminiBot) {
        alert("Quotex Real Gemini 1.5 Bot আগে থেকেই চালু আছে!");
        return;
    }
    window.QuotexRealGeminiBot = true;

    // ১. কনফিগারেশন সেটআপ
    const CONFIG = {
        SECRET_PASSWORD: "admin",
        API_KEY: "", // এখানে আপনার Gemini API Key বসাতে পারেন অথবা লগইন পপআপে দিতে পারেন
        MODEL: "gemini-1.5-flash",
        API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    };

    // ২. সিএসএস স্টাইল
    const style = document.createElement("style");
    style.textContent = `
        @keyframes cyberScan { 0% { top: 0; opacity: 0; } 15%,85% { opacity: 1; } 100% { top: 100vh; opacity: 0; } }
        @keyframes neonPulse { 0%,100% { box-shadow: 0 0 10px #00ff6655; } 50% { box-shadow: 0 0 25px #00ff66; } }
        .qpb-panel { background: rgba(10, 14, 23, 0.94) !important; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid #00ff6670 !important; box-shadow: 0 8px 32px #00ff6625 !important; color: white !important; box-sizing: border-box; }
        .qpb-btn { border: 0; border-radius: 7px; padding: 11px; width: 100%; margin-top: 8px; font-weight: bold; cursor: pointer; font-size: 13px; transition: all 0.2s ease; }
        .qpb-green { background: linear-gradient(45deg, #00ff66, #00cc52); color: #001508; }
        .qpb-red { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; }
        .qpb-input { width: 100%; box-sizing: border-box; padding: 10px; background: #05090f; border: 1px solid #00ff6670; border-radius: 6px; color: #00ff66; margin-top: 6px; font-size: 13px; outline: none; }
        .qpb-laser { position: fixed; left: 0; width: 100vw; height: 4px; background: #00ff66; box-shadow: 0 0 25px #00ff66; z-index: 2147483646; pointer-events: none; animation: cyberScan 1.2s linear infinite; display: none; }
        .qpb-pulse { animation: neonPulse 2s infinite; }
        .no-select { user-select: none; -webkit-touch-callout: none; }
    `;
    document.head.appendChild(style);

    const el = (tag, styles = {}) => {
        const node = document.createElement(tag);
        Object.assign(node.style, styles);
        return node;
    };

    const laserScanEl = el("div");
    laserScanEl.className = "qpb-laser";
    document.body.appendChild(laserScanEl);

    // ৩. পাসওয়ার্ড ও API Key ডায়ালগ
    const loginModal = el("div", {
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "min(320px, calc(100vw - 24px))",
        padding: "22px", borderRadius: "14px",
        zIndex: "2147483647", fontFamily: "Arial, sans-serif",
        textAlign: "center"
    });
    loginModal.className = "qpb-panel no-select";
    loginModal.innerHTML = `
        <h3 style="color:#00ff66; margin:0 0 4px; font-size: 18px;">✨ REAL GEMINI 1.5 BOT</h3>
        <p style="color:#94a3b8; margin:0 0 15px; font-size: 10px;">Direct AI Market Neural Engine</p>
        <input id="qpb-pass" type="password" class="qpb-input" placeholder="Password (admin)" autocomplete="off">
        <input id="qpb-key" type="password" class="qpb-input" placeholder="Gemini API Key (Optional if preset)" autocomplete="off">
        <button id="qpb-login-btn" class="qpb-btn qpb-green" style="margin-top:14px;">LAUNCH ENGINE</button>
        <div id="qpb-login-error" style="color:#ff7070; font-size:12px; margin-top:10px;"></div>
    `;
    document.body.appendChild(loginModal);

    const loginInput = loginModal.querySelector("#qpb-pass");
    const keyInput = loginModal.querySelector("#qpb-key");

    function handleLogin() {
        if (loginInput.value !== CONFIG.SECRET_PASSWORD) {
            loginModal.querySelector("#qpb-login-error").textContent = "❌ পাসওয়ার্ড ভুল হয়েছে!";
            return;
        }
        if (keyInput.value.trim() !== "") {
            CONFIG.API_KEY = keyInput.value.trim();
        }
        loginModal.remove();
        initializeBot();
    }

    loginModal.querySelector("#qpb-login-btn").onclick = handleLogin;
    loginInput.addEventListener("keydown", e => { if (e.key === "Enter") handleLogin(); });

    // ৪. মূল বট ইন্টারফেস
    function initializeBot() {
        let isScanning = false;

        const botIcon = el("div", {
            position: "fixed", top: "120px", left: "15px",
            padding: "8px 14px", borderRadius: "25px",
            zIndex: "2147483647", display: "flex", flexDirection: "column",
            alignItems: "center", cursor: "pointer", touchAction: "none",
            boxShadow: "0 0 18px rgba(0,255,102,0.6)", background: "rgba(10,14,23,0.95)"
        });
        botIcon.className = "qpb-panel no-select";
        botIcon.innerHTML = `
            <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-size:18px;">✨</span>
                <span id="iconMarketName" style="font-size:11px;font-weight:bold;color:#00ff66;">GEMINI 1.5</span>
            </div>
            <div id="iconSignalStatus" style="font-size:10px;font-weight:bold;color:#cbd5e1;margin-top:2px;">READY</div>
        `;
        document.body.appendChild(botIcon);

        const botBox = el("div", {
            position: "fixed", top: "120px", left: "15px",
            padding: "15px", borderRadius: "16px", zIndex: "2147483647",
            fontFamily: "Arial, sans-serif", width: "265px", touchAction: "none", display: "none"
        });
        botBox.className = "qpb-panel no-select";
        botBox.innerHTML = `
            <div id="qpb-header" style="cursor:move; padding:8px; background:rgba(0,0,0,0.5); margin:-15px -15px 12px -15px; border-bottom:1px solid rgba(0,255,102,0.3); display:flex; justify-content:space-between; align-items:center; border-radius:16px 16px 0 0;">
                <span style="font-weight:900; font-size:11px; color:#00ff66;">✨ REAL GEMINI 1.5 AI</span>
                <button id="qpb-min" style="background:none; border:none; color:#00ff66; font-size:16px; cursor:pointer;">➖</button>
            </div>

            <div style="margin-bottom:10px; background:rgba(0,0,0,0.4); padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:10px; color:#94a3b8; margin-bottom:2px;">📊 ACTIVE MARKET:</div>
                <div id="marketDetectText" style="font-size:13px; font-weight:bold; color:#00ff66;">Detecting...</div>
            </div>

            <div style="margin-bottom:12px;">
                <label style="font-size:10px; color:#cbd5e1; display:block; margin-bottom:4px; font-weight:bold;">⏱️ TRADE TIMEFRAME:</label>
                <input type="text" id="tradeTimeInput" placeholder="e.g. 1m, 30s" value="1m" class="qpb-input" style="text-align:center; font-weight:bold; font-size:13px; margin-top:0;">
            </div>

            <div id="signalArea" style="background:rgba(0,0,0,0.6); padding:12px 10px; border-radius:8px; text-align:center; font-weight:bold; font-size:12px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.1); color:#fff; min-height:55px; display:flex; align-items:center; justify-content:center; flex-direction:column; white-space:pre-wrap;">
                READY FOR REAL AI SCAN
            </div>

            <button id="qpb-analyze-btn" class="qpb-btn qpb-green">ANALYZE MARKET 🟢</button>
            <button id="qpb-close-btn" class="qpb-btn qpb-red">CLOSE BOT</button>
        `;
        document.body.appendChild(botBox);

        function detectMarketName() {
            let marketEl = document.querySelector('.asset-select__name, .current-symbol, .asset-name, .symbol-title');
            let name = marketEl ? marketEl.innerText.trim().replace(/\n/g, ' ') : "EUR/USD (OTC)";
            botBox.querySelector('#marketDetectText').innerText = name;
            let shortName = name.split(' ')[0] || "MARKET";
            botIcon.querySelector('#iconMarketName').innerText = shortName;
            return name;
        }

        detectMarketName();
        setInterval(detectMarketName, 3000);

        // অটো ক্যানভাস ইমেজ ক্যাপচার
        function getCanvasBase64() {
            const canvasList = document.querySelectorAll('canvas');
            if (!canvasList || canvasList.length === 0) return null;
            let targetCanvas = canvasList[0];
            for (let c of canvasList) {
                if (c.width > 200 && c.height > 200) {
                    targetCanvas = c;
                    break;
                }
            }
            try {
                const dataURL = targetCanvas.toDataURL('image/png');
                return dataURL.split(',')[1];
            } catch (e) {
                return null;
            }
        }

        // Gemini 1.5 API কল ফাংশন
        async function fetchGeminiAnalysis(activeMarket, timeframe) {
            if (!CONFIG.API_KEY) {
                throw new Error("Missing Gemini API Key! Please enter key at login.");
            }

            const canvasBase64 = getCanvasBase64();
            const promptText = `
You are an expert technical analysis assistant evaluating a trading chart for asset ${activeMarket} with trade duration ${timeframe}.
Analyze the visible candlesticks, trend, momentum, support/resistance.

Respond strictly in this concise format:
SIGNAL: [UP or DOWN or NO CLEAR SIGNAL]
ACCURACY: [Estimate confidence % between 82% and 96%]
REASON: [Short 1-sentence technical reason]
`;

            const parts = [{ text: promptText }];
            if (canvasBase64) {
                parts.push({
                    inline_data: {
                        mime_type: "image/png",
                        data: canvasBase64
                    }
                });
            }

            const response = await fetch(CONFIG.API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": CONFIG.API_KEY
                },
                body: JSON.stringify({
                    contents: [{ role: "user", parts }]
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error?.message || "Gemini 1.5 API Call Failed.");
            }

            return data?.candidates?.[0]?.content?.parts?.[0]?.text || "NO CLEAR SIGNAL";
        }

        // ড্র্যাগেবল ফাংশন
        function makeDraggable(element, handle, isIcon) {
            let isD = false, cX = 0, cY = 0, iX = 0, iY = 0, xO = 0, yO = 0, moved = false;
            function dS(e) {
                let cX_e = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
                let cY_e = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
                iX = cX_e - xO; iY = cY_e - yO; moved = false;
                if (e.target === handle || handle.contains(e.target) || element === handle) isD = true;
            }
            function dE() {
                if (isD && !moved && isIcon) {
                    if (botBox.style.display === 'none') {
                        botBox.style.display = 'block';
                        botIcon.style.display = 'none';
                    }
                }
                isD = false;
            }
            function d(e) {
                if (isD) {
                    e.preventDefault(); moved = true;
                    let cX_e = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
                    let cY_e = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
                    cX = cX_e - iX; cY = cY_e - iY; xO = cX; yO = cY;
                    element.style.transform = "translate3d(" + cX + "px," + cY + "px,0)";
                }
            }
            handle.addEventListener("touchstart", dS, { passive: false });
            document.addEventListener("touchend", dE, false);
            document.addEventListener("touchmove", d, { passive: false });
            handle.addEventListener("mousedown", dS, false);
            document.addEventListener("mouseup", dE, false);
            document.addEventListener("mousemove", d, false);
        }

        makeDraggable(botBox, botBox.querySelector('#qpb-header'), false);
        makeDraggable(botIcon, botIcon, true);

        botBox.querySelector('#qpb-min').onclick = (e) => {
            botBox.style.display = 'none';
            botIcon.style.display = 'flex';
            e.stopPropagation();
        };

        // স্ক্যান ও এআই রিকোয়েস্ট
        botBox.querySelector('#qpb-analyze-btn').onclick = async () => {
            if (isScanning) return;

            let timeInput = botBox.querySelector('#tradeTimeInput').value.trim() || "1m";
            let activeMarket = detectMarketName();
            let signalArea = botBox.querySelector('#signalArea');
            let analyzeBtn = botBox.querySelector('#qpb-analyze-btn');
            let iconStatus = botIcon.querySelector('#iconSignalStatus');

            isScanning = true;
            analyzeBtn.disabled = true;
            analyzeBtn.style.opacity = '0.5';

            botBox.style.display = 'none';
            botIcon.style.display = 'flex';
            iconStatus.style.color = '#00ff66';
            iconStatus.innerHTML = `GEMINI 1.5 SCAN... ⏳`;

            laserScanEl.style.display = 'block';
            signalArea.style.color = "#00ff66";
            signalArea.textContent = "Connecting to Gemini 1.5 Flash...";

            try {
                const aiResult = await fetchGeminiAnalysis(activeMarket, timeInput);

                laserScanEl.style.display = 'none';
                isScanning = false;
                analyzeBtn.disabled = false;
                analyzeBtn.style.opacity = '1';

                let isUp = aiResult.toUpperCase().includes("UP") || aiResult.toUpperCase().includes("CALL");
                let signalColor = isUp ? '#00ff66' : '#ef4444';

                iconStatus.style.color = signalColor;
                iconStatus.innerHTML = `<span style="font-size:11px;font-weight:900;">${isUp ? '🟢 CALL' : '🔴 PUT'} (${timeInput})</span>`;

                signalArea.style.color = "#ffffff";
                signalArea.textContent = `[MARKET: ${activeMarket}]\n${aiResult}`;
            } catch (err) {
                laserScanEl.style.display = 'none';
                isScanning = false;
                analyzeBtn.disabled = false;
                analyzeBtn.style.opacity = '1';

                iconStatus.style.color = '#ef4444';
                iconStatus.innerHTML = `❌ ERROR`;

                signalArea.style.color = '#ef4444';
                signalArea.textContent = "❌ GEMINI API ERROR:\n" + (err.message || "Failed to analyze.");
            }
        };

        botBox.querySelector('#qpb-close-btn').onclick = () => {
            botBox.remove();
            botIcon.remove();
            laserScanEl.remove();
            window.QuotexRealGeminiBot = false;
        };
    }
})();
