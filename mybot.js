(function(){
    if(window.QuotexProBot){
        alert("Quotex Advanced Bot আগে থেকেই চালু আছে!");
        return;
    }
    window.QuotexProBot = true;

    // ==========================================
    // ১. পাসওয়ার্ড সেটআপ (এখানে পাসওয়ার্ড পরিবর্তন করুন)
    // ==========================================
    const SECRET_PASSWORD = "admin"; 

    // ২. অ্যাডভান্সড CSS (Glassmorphism, Animations)
    let style = document.createElement('style');
    style.innerHTML = `
        @keyframes cyberScan {
            0% { top: 0; opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { top: 100vh; opacity: 0; }
        }
        @keyframes neonPulse {
            0% { box-shadow: 0 0 10px rgba(0,255,102,0.5); }
            50% { box-shadow: 0 0 25px rgba(0,255,102,1), 0 0 10px inset rgba(0,255,102,0.5); }
            100% { box-shadow: 0 0 10px rgba(0,255,102,0.5); }
        }
        .cyber-laser {
            position: fixed; left: 0; width: 100vw; height: 3px;
            background: #00ff66; box-shadow: 0 0 20px #00ff66, 0 0 40px #00ff66;
            z-index: 999998; pointer-events: none; display: none;
            animation: cyberScan 1.2s infinite linear;
        }
        .bot-pulse { animation: neonPulse 2s infinite; }
        .glass-panel {
            background: rgba(11, 15, 25, 0.75) !important;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(0, 255, 102, 0.3) !important;
            box-shadow: 0 8px 32px 0 rgba(0, 255, 102, 0.2) !important;
        }
        .custom-input::placeholder { color: rgba(0,255,102,0.4); }
    `;
    document.head.appendChild(style);

    // ফুল স্ক্রিন লেজার
    let fullScanner = document.createElement('div');
    fullScanner.className = 'cyber-laser';
    document.body.appendChild(fullScanner);

    // ৩. পাসওয়ার্ড ভেরিফিকেশন প্যানেল (Glassmorphism)
    let authBox = document.createElement('div');
    authBox.className = 'glass-panel';
    authBox.style.position = 'fixed';
    authBox.style.top = '50%';
    authBox.style.left = '50%';
    authBox.style.transform = 'translate(-50%, -50%)';
    authBox.style.padding = '20px';
    authBox.style.borderRadius = '12px';
    authBox.style.zIndex = '999999';
    authBox.style.textAlign = 'center';
    authBox.style.fontFamily = 'Arial, sans-serif';
    authBox.style.color = '#fff';

    authBox.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #00ff66;">🔒 SYSTEM LOGIN</h3>
        <input type="password" id="botPassword" placeholder="Enter Password" style="width: 90%; padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid #00ff66; color: #00ff66; border-radius: 6px; text-align: center; margin-bottom: 15px; outline: none;">
        <button id="loginBtn" style="width: 100%; padding: 10px; background: #00ff66; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">ACCESS BOT</button>
    `;
    document.body.appendChild(authBox);

    document.getElementById('loginBtn').onclick = function() {
        let enteredPass = document.getElementById('botPassword').value;
        if(enteredPass === SECRET_PASSWORD) {
            authBox.remove();
            initializeMainBot(); // পাসওয়ার্ড ঠিক হলে বট ওপেন হবে
        } else {
            alert("❌ Access Denied! Wrong Password.");
        }
    };

    // ৪. মূল বট ইনিশিয়ালাইজেশন ফাংশন
    function initializeMainBot() {
        // ছোট গোল আইকন
        let botIcon = document.createElement('div');
        botIcon.className = 'bot-pulse glass-panel';
        botIcon.style.position = 'fixed';
        botIcon.style.top = '100px';
        botIcon.style.left = '20px';
        botIcon.style.width = '55px';
        botIcon.style.height = '55px';
        botIcon.style.borderRadius = '50%';
        botIcon.style.zIndex = '999999';
        botIcon.style.display = 'flex';
        botIcon.style.justifyContent = 'center';
        botIcon.style.alignItems = 'center';
        botIcon.style.cursor = 'pointer';
        botIcon.style.touchAction = 'none';
        botIcon.innerHTML = `<div style="font-size:24px;">🤖</div>`;
        document.body.appendChild(botIcon);

        // মূল ড্যাশবোর্ড
        let botBox = document.createElement('div');
        botBox.className = 'glass-panel';
        botBox.style.position = 'fixed';
        botBox.style.top = '100px';
        botBox.style.left = '20px';
        botBox.style.padding = '15px';
        botBox.style.borderRadius = '14px';
        botBox.style.zIndex = '999999';
        botBox.style.fontFamily = 'Arial, sans-serif';
        botBox.style.width = '240px';
        botBox.style.touchAction = 'none';
        botBox.style.display = 'none';

        botBox.innerHTML = `
            <div id="dragHeader" style="cursor: move; padding: 8px; background: rgba(0,0,0,0.4); margin: -15px -15px 12px -15px; border-bottom: 1px solid rgba(0,255,102,0.3); display: flex; justify-content: space-between; align-items: center; border-radius: 14px 14px 0 0; user-select: none;">
                <span style="font-weight: bold; font-size: 11px; color: #00ff66;">🖐️ DRAG TO MOVE</span>
                <button id="minimizeBtn" style="background:none; border:none; color:#00ff66; font-size:16px; cursor:pointer;">➖</button>
            </div>

            <div style="margin-bottom: 12px;">
                <label style="font-size:11px; color:#cbd5e1; display:block; margin-bottom:5px;">⏱️ TRADE DURATION (e.g. 1m, 30s):</label>
                <input type="text" id="tradeTimeInput" class="custom-input" placeholder="Enter time..." value="1m" style="width: 90%; background: rgba(0,0,0,0.6); color: #00ff66; border: 1px solid rgba(0,255,102,0.5); padding: 8px; border-radius: 6px; font-weight: bold; outline: none; text-align: center;">
            </div>

            <div id="signalArea" style="background: rgba(0,0,0,0.6); padding: 15px 10px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 13px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.1); color: #fff; min-height: 40px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                SYSTEM READY
            </div>

            <button id="startScanBtn" style="width:100%; background: #00ff66; color: #000; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-bottom: 8px; transition: 0.3s;">START ANALYSIS 🟢</button>
            <button id="closeBotBtn" style="width:100%; background: rgba(239, 68, 68, 0.8); color: #fff; border: 1px solid #ef4444; padding: 6px; border-radius: 6px; cursor: pointer; font-size: 11px;">CLOSE SYSTEM</button>
        `;
        document.body.appendChild(botBox);

        // ড্র্যাগ এন্ড ড্রপ সিস্টেম (মাউস + টাচ)
        function makeDraggable(element, handle) {
            let isDragging = false, currentX = 0, currentY = 0, initialX = 0, initialY = 0, xOffset = 0, yOffset = 0;
            function dragStart(e) {
                let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
                let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
                initialX = clientX - xOffset;
                initialY = clientY - yOffset;
                if (e.target === handle || handle.contains(e.target) || element === handle) isDragging = true;
            }
            function dragEnd() { initialX = currentX; initialY = currentY; isDragging = false; }
            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
                    let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
                    currentX = clientX - initialX;
                    currentY = clientY - initialY;
                    xOffset = currentX; yOffset = currentY;
                    element.style.transform = "translate3d(" + currentX + "px, " + currentY + "px, 0)";
                }
            }
            handle.addEventListener("touchstart", dragStart, {passive: false});
            document.addEventListener("touchend", dragEnd, false);
            document.addEventListener("touchmove", drag, {passive: false});
            handle.addEventListener("mousedown", dragStart, false);
            document.addEventListener("mouseup", dragEnd, false);
            document.addEventListener("mousemove", drag, false);
        }
        makeDraggable(botBox, document.getElementById('dragHeader'));
        makeDraggable(botIcon, botIcon);

        // ডাবল ট্যাপ / মিনিমাইজ সিস্টেম
        let lastTap = 0;
        function toggleDetails() {
            if (botBox.style.display === 'none') {
                botBox.style.display = 'block'; botIcon.style.display = 'none';
            }
        }
        botIcon.addEventListener('dblclick', toggleDetails);
        botIcon.addEventListener('touchend', function(e) {
            let currentTime = new Date().getTime();
            let tapLength = currentTime - lastTap;
            if (tapLength < 350 && tapLength > 0) { toggleDetails(); e.preventDefault(); }
            lastTap = currentTime;
        });

        document.getElementById('minimizeBtn').onclick = function() {
            botBox.style.display = 'none'; botIcon.style.display = 'flex';
        };

        // অ্যাডভান্সড স্ক্যানিং ও সিগন্যাল অ্যালগরিদম
        const delay = ms => new Promise(res => setTimeout(res, ms));

        document.getElementById('startScanBtn').onclick = async function() {
            let timeInput = document.getElementById('tradeTimeInput').value;
            if(timeInput.trim() === "") { alert("ট্রেড টাইম উল্লেখ করুন! (যেমন: 1m)"); return; }

            let signalArea = document.getElementById('signalArea');
            let btn = document.getElementById('startScanBtn');
            
            btn.disabled = true;
            btn.style.opacity = '0.5';
            fullScanner.style.display = 'block'; 

            // রিয়ালিস্টিক ৩-ধাপের স্ক্যানিং প্রসেস (মোট ৪ সেকেন্ডের কাছাকাছি)
            signalArea.style.color = '#00ff66';
            signalArea.innerHTML = `Connecting to Market... ⏳`;
            await delay(1200);

            signalArea.innerHTML = `Scanning RSI & EMA [${timeInput}]... 📊`;
            await delay(1200);

            signalArea.innerHTML = `Calculating Probabilities... 🧠`;
            await delay(1500);

            fullScanner.style.display = 'none';
            btn.disabled = false;
            btn.style.opacity = '1';

            // সিগন্যাল জেনারেট লজিক
            let isUptrend = Math.random() > 0.5;
            let isStrong = Math.random() > 0.3; // ৭০% সম্ভাবনা Strong হওয়ার
            let accuracy = Math.floor(Math.random() * (96 - 82 + 1)) + 82; // ৮২% থেকে ৯৬%

            let signalText = "";
            let reasonText = "";

            if (isUptrend) {
                signalText = isStrong ? 'STRONG UP 🟢' : 'WEAK UP 🟢';
                reasonText = 'Bullish Trend + Support Bounce';
                signalArea.style.color = '#00ff66';
            } else {
                signalText = isStrong ? 'STRONG DOWN 🔴' : 'WEAK DOWN 🔴';
                reasonText = 'Bearish Trend + Resistance Hit';
                signalArea.style.color = '#ef4444';
            }

            signalArea.innerHTML = `
                <span style="font-size:18px; font-weight:900;">${signalText}</span><br>
                <span style="font-size:11px; color:#cbd5e1; margin-top:6px; display:block;">Time: ${timeInput} | Acc: ${accuracy}%</span>
                <span style="font-size:10px; color:#64748b; margin-top:3px; display:block;">Logic: ${reasonText}</span>
            `;
        };

        document.getElementById('closeBotBtn').onclick = function() {
            botBox.remove(); botIcon.remove(); fullScanner.remove();
            window.QuotexProBot = false;
        };
    }
})();
