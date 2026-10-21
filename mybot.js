(function () {
    if (window.QuotexProBot) {
        alert("Quotex Pro Bot is already running!");
        return;
    }
    window.QuotexProBot = true;

    const SECRET_PASSWORD = "admin";
    // আপনার Gemini API Key বসান
    const API_KEY = "AQ.Ab8RN6KCuyAsFwGpEMZ4EumK6bHKG_fpu9CvDPTaVWYFYKn3Bg"; 
    const MODEL = "gemini-1.5-flash"; 
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent";

    let selectedImage = null;
    let busy = false;
    let closed = false;

    const style = document.createElement("style");
    style.textContent = `
        @keyframes cyberScan { 0% { top: 0; opacity: 0; } 15%,85% { opacity: 1; } 100% { top: 100vh; opacity: 0; } }
        @keyframes neonPulse { 0%,100% { box-shadow: 0 0 10px #00ff6655; } 50% { box-shadow: 0 0 24px #00ff66; } }
        .qpb-panel { background: rgba(11,15,25,.94) !important; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid #00ff6670 !important; box-shadow: 0 8px 32px #00ff6625 !important; color: white !important; box-sizing: border-box; }
        .qpb-btn { border: 0; border-radius: 7px; padding: 10px; width: 100%; margin-top: 8px; font-weight: bold; cursor: pointer; font-size: 12px; }
        .qpb-green { background:#00ff66; color:#001508; }
        .qpb-dark { background:#16202b; color:#00ff66; border:1px solid #00ff6666; }
        .qpb-red { background:#b91c1c; color:white; }
        .qpb-input { width:100%; box-sizing:border-box; padding:10px; background:#05090f; border:1px solid #00ff6670; border-radius:6px; color:#00ff66; margin-top:5px; }
        .qpb-laser { position:fixed; left:0; width:100vw; height:3px; background:#00ff66; box-shadow:0 0 20px #00ff66; z-index:2147483646; pointer-events:none; animation:cyberScan 1.2s linear infinite; }
        .qpb-pulse { animation:neonPulse 2s infinite; }
    `;
    document.head.appendChild(style);

    const el = (tag, styles = {}) => {
        const node = document.createElement(tag);
        Object.assign(node.style, styles);
        return node;
    };

    const panel = el("div", {
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "min(310px, calc(100vw - 24px))",
        padding: "20px", borderRadius: "14px",
        zIndex: "2147483647", fontFamily: "Arial,sans-serif",
        textAlign: "center"
    });
    panel.className = "qpb-panel";
    panel.innerHTML = `
        <h3 style="color:#00ff66;margin:0 0 15px"> 🔒 SYSTEM LOGIN </h3> 
        <input id="qpb-pass" type="password" class="qpb-input" placeholder="Enter password" autocomplete="off"> 
        <button id="qpb-login" class="qpb-btn qpb-green"> ACCESS BOT </button> 
        <div id="qpb-login-error" style="color:#ff7070;font-size:12px;margin-top:8px"></div>
    `;
    document.body.appendChild(panel);

    const loginInput = panel.querySelector("#qpb-pass");

    function login() {
        if (loginInput.value !== SECRET_PASSWORD) {
            panel.querySelector("#qpb-login-error").textContent = "Access denied. Wrong password.";
            return;
        }
        panel.remove();
        initializeBot();
    }

    panel.querySelector("#qpb-login").onclick = login;
    loginInput.addEventListener("keydown", e => {
        if (e.key === "Enter") login();
    });

    function initializeBot() {
        const icon = el("div", {
            position: "fixed", top: "100px", left: "20px",
            width: "55px", height: "55px", borderRadius: "50%",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "25px",
            cursor: "pointer", touchAction: "none",
            zIndex: "2147483647"
        });
        icon.className = "qpb-panel qpb-pulse";
        icon.textContent = "🤖";
        document.body.appendChild(icon);

        const box = el("div", { 
            position: "fixed", top: "85px", left: "12px", 
            width: "min(290px, calc(100vw - 24px))", maxHeight: "82vh", 
            overflowY: "auto", padding: "13px", borderRadius: "14px", 
            zIndex: "2147483647", display: "none", fontFamily: "Arial,sans-serif", 
            touchAction: "pan-y" 
        }); 
        box.className = "qpb-panel"; 
        box.innerHTML = `
            <div id="qpb-header" style="display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:move;touch-action:none;padding:7px;margin:-13px -13px 12px;background:#05090f;border-radius:13px 13px 0 0;border-bottom:1px solid #00ff6644;user-select:none"> 
                <b style="color:#00ff66;font-size:12px"> 🤖 GEMINI CHART AI </b> 
                <button id="qpb-min" style="color:#00ff66;background:none;border:0;font-size:19px;cursor:pointer">−</button> 
            </div> 
            <div style="font-size:11px;color:#a8b5c8"> MODEL: <span style="color:#00ff66">Gemini Flash AI</span> </div> 
            <label style="display:block;font-size:12px;margin-top:13px"> Trade duration 
                <input id="qpb-time" class="qpb-input" value="1m" placeholder="Example: 1m"> 
            </label> 
            <input id="qpb-file" type="file" accept="image/png,image/jpeg,image/webp" style="display:none"> 
            <button id="qpb-choose" class="qpb-btn qpb-dark"> 📷 CHOOSE CHART SCREENSHOT </button> 
            <div id="qpb-preview-wrap" style="display:none;margin-top:9px"> 
                <img id="qpb-preview" alt="Selected chart" style="width:100%;max-height:180px;object-fit:contain;border-radius:7px;background:#05090f"> 
                <div id="qpb-filename" style="font-size:10px;color:#9ca3af;overflow-wrap:anywhere"></div> 
            </div> 
            <div id="qpb-result" style="background:#05090f;border:1px solid #ffffff20;border-radius:8px;padding:12px;margin-top:12px;min-height:65px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px;line-height:1.5;color:white"> SYSTEM READY Choose a chart screenshot to begin. </div> 
            <button id="qpb-analyze" class="qpb-btn qpb-green"> ANALYZE WITH GEMINI </button> 
            <button id="close-system-btn" class="qpb-btn qpb-red"> CLOSE SYSTEM </button> 
            <div style="font-size:10px;color:#94a3b8;margin-top:10px"> AI analysis is uncertain. Not financial advice. No automatic trades are placed. </div>
        `; 
        document.body.appendChild(box); 

        const $ = selector => box.querySelector(selector); 
        const result = $("#qpb-result"); 
        const fileInput = $("#qpb-file"); 
        const analyzeBtn = $("#qpb-analyze"); 
        let laser = null; 
        let previewURL = null; 

        $("#qpb-choose").onclick = () => fileInput.click(); 
        fileInput.onchange = () => { 
            const file = fileInput.files && fileInput.files[0]; 
            if (!file) return; 
            if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) { 
                result.textContent = "Please select a PNG, JPEG or WebP image."; 
                return; 
            } 
            if (file.size > 10 * 1024 * 1024) { 
                result.textContent = "Image is too large. Choose an image under 10 MB."; 
                fileInput.value = ""; 
                return; 
            } 
            selectedImage = file; 
            if (previewURL) URL.revokeObjectURL(previewURL); 
            previewURL = URL.createObjectURL(file); 
            $("#qpb-preview").src = previewURL; 
            $("#qpb-preview-wrap").style.display = "block"; 
            $("#qpb-filename").textContent = file.name; 
            result.textContent = "Chart selected. Ready for Gemini analysis."; 
        }; 

        async function analyzeWithGemini(file, duration) { 
            const base64 = await new Promise((resolve, reject) => { 
                const reader = new FileReader(); 
                reader.onload = () => { 
                    const dataURL = String(reader.result || ""); 
                    const comma = dataURL.indexOf(","); 
                    if (comma < 0) { 
                        reject(new Error("Could not read image data.")); 
                        return; 
                    } 
                    resolve(dataURL.slice(comma + 1)); 
                }; 
                reader.onerror = () => reject(new Error("Could not read image.")); 
                reader.readAsDataURL(file); 
            }); 

            const prompt = `You are an image-based technical chart analysis assistant. Analyze only the attached screenshot. Do not claim to see live market data or hidden indicators. The requested trade duration is: ${duration}. Inspect visible candles, apparent trend, support/resistance if identifiable, and any readable indicators. If the screenshot is unclear, lacks sufficient candles, or does not support a directional view, choose NO CLEAR SIGNAL. Return: Signal: UP, DOWN, or NO CLEAR SIGNAL. Observation: brief explanation of what is visibly present. Reason: evidence from the screenshot. Limitations: important uncertainty. Do not invent indicator values, market prices, backtest results, or win-rate/accuracy percentages. A directional view is not a guarantee of the next price movement. Do not instruct automatic execution of a trade.`;

            const response = await fetch(API_URL, { 
                method: "POST", 
                headers: { 
                    "Content-Type": "application/json", 
                    "x-goog-api-key": API_KEY 
                }, 
                body: JSON.stringify({ 
                    contents: [{ 
                        role: "user", 
                        parts: [ 
                            { text: prompt }, 
                            { inline_data: { mime_type: file.type, data: base64 } } 
                        ] 
                    }] 
                }) 
            }); 

            const data = await response.json().catch(() => ({})); 
            if (!response.ok) { 
                const message = data?.error?.message || "Unknown API error"; 
                if (response.status === 400 || response.status === 404) { 
                    throw new Error("Request/model error. Check model ID, image and API settings. " + message); 
                } 
                if (response.status === 401 || response.status === 403) { 
                    throw new Error("API key rejected or access denied. Check your key and permissions. " + message); 
                } 
                if (response.status === 429) { 
                    throw new Error("API quota or rate limit reached. Check your AI Studio usage. " + message); 
                } 
                throw new Error("Gemini API error (" + response.status + "): " + message); 
            } 

            const parts = data?.candidates?.[0]?.content?.parts || []; 
            const answer = parts 
                .filter(part => typeof part.text === "string") 
                .map(part => part.text) 
                .join("\n") 
                .trim(); 

            if (!answer) { 
                throw new Error("Gemini returned no readable text. Check API response and safety settings."); 
            } 
            return answer; 
        } 

        analyzeBtn.onclick = async () => { 
            if (busy) return; 
            if (!API_KEY || API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE") { 
                result.textContent = "Setup required: add your Gemini API key in the API_KEY constant."; 
                return; 
            } 
            if (!selectedImage) { 
                result.textContent = "Choose a chart screenshot first. This bookmarklet cannot capture another app's screen by itself."; 
                return; 
            } 
            const duration = $("#qpb-time").value.trim(); 
            if (!duration) { 
                result.textContent = "Enter a trade duration, e.g. 1m."; 
                return; 
            } 

            busy = true; 
            analyzeBtn.disabled = true; 
            analyzeBtn.style.opacity = "0.55"; 
            result.style.color = "#00ff66"; 
            result.textContent = "Sending chart image to Gemini...\nPlease wait."; 
            laser = el("div"); 
            laser.className = "qpb-laser"; 
            document.body.appendChild(laser); 

            try { 
                const answer = await analyzeWithGemini(selectedImage, duration); 
                result.style.color = "#ffffff"; 
                result.textContent = answer; 
            } catch (error) { 
                result.style.color = "#ff8585"; 
                result.textContent = "ANALYSIS FAILED\n" + (error?.message || "Unexpected error."); 
            } finally { 
                busy = false; 
                analyzeBtn.disabled = false; 
                analyzeBtn.style.opacity = "1"; 
                if (laser) { 
                    laser.remove(); 
                    laser = null; 
                } 
            } 
        }; 

        function makeDraggable(element, handle) { 
            let dragging = false; 
            let startX = 0, startY = 0, originX = 0, originY = 0; 
            let posX = 0, posY = 0; 
            handle.addEventListener("pointerdown", e => { 
                if (e.target.closest("button,input")) return; 
                dragging = true; 
                const rect = element.getBoundingClientRect(); 
                startX = e.clientX; startY = e.clientY; 
                originX = rect.left; originY = rect.top; 
                element.style.left = originX + "px"; 
                element.style.top = originY + "px"; 
                element.style.right = "auto"; element.style.bottom = "auto"; 
                element.style.transform = "none"; 
                try { handle.setPointerCapture(e.pointerId); } catch (_) {} 
                e.preventDefault(); 
            }); 

            handle.addEventListener("pointermove", e => { 
                if (!dragging) return; 
                posX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, originX + e.clientX - startX)); 
                posY = Math.max(0, Math.min(window.innerHeight - 45, originY + e.clientY - startY)); 
                element.style.left = posX + "px"; 
                element.style.top = posY + "px"; 
            }); 

            const stop = () => { dragging = false; }; 
            handle.addEventListener("pointerup", stop); 
            handle.addEventListener("pointercancel", stop); 
        } 

        makeDraggable(box, $("#qpb-header")); 
        makeDraggable(icon, icon); 

        function showIcon() { box.style.display = "none"; icon.style.display = "flex"; } 
        function showPanel() { box.style.display = "block"; icon.style.display = "none"; } 

        icon.addEventListener("click", showPanel); 
        $("#qpb-min").onclick = showIcon; 
        $("#close-system-btn").onclick = () => { 
            if (busy) { 
                result.textContent = "Please wait for the current API request to finish before closing."; 
                return; 
            } 
            closed = true; 
            if (previewURL) URL.revokeObjectURL(previewURL); 
            if (laser) laser.remove(); 
            box.remove(); 
            icon.remove(); 
            style.remove(); 
            window.QuotexProBot = false; 
        }; 
    }
})();
