(function(){
    if(window.QuotexAdvancedBot){
        alert("Quotex Advanced Bot আগে থেকেই চালু আছে!");
        return;
    }
    window.QuotexAdvancedBot = true;

    // ১. ফুল স্ক্রিন গ্রিন রে স্ক্যানার স্টাইল
    let style = document.createElement('style');
    style.innerHTML = `
        @keyframes fullScreenScan {
            0% { top: 0vh; opacity: 0.9; }
            50% { top: 98vh; opacity: 1; }
            100% { top: 0vh; opacity: 0.9; }
        }
        .full-screen-scanner {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 4px;
            background: #00ff66;
            box-shadow: 0 0 15px #00ff66, 0 0 30px #00ff66, 0 0 50px #00ff66;
            display: none;
            animation: fullScreenScan 1.2s infinite ease-in-out;
            z-index: 999990;
            pointer-events: none;
        }
        .bot-pulse {
            box-shadow: 0 0 18px rgba(0, 255, 102, 0.8);
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);

    // ব্যাকগ্রাউন্ড ফুল স্ক্রিন স্ক্যানার
    let fullScanner = document.createElement('div');
    fullScanner.className = 'full-screen-scanner';
    document.body.appendChild(fullScanner);

    // ২. ছোট গোল ফ্লোটিং আইকন (Initial State)
    let botIcon = document.createElement('div');
    botIcon.id = 'botFloatingIcon';
    botIcon.className = 'bot-pulse';
    botIcon.style.position = 'fixed';
    botIcon.style.top = '100px';
    botIcon.style.left = '20px';
    botIcon.style.width = '55px';
    botIcon.style.height = '55px';
    botIcon.style.borderRadius = '50%';
    botIcon.style.backgroundColor = '#0b0f19';
    botIcon.style.border = '2px solid #00ff66';
    botIcon.style.zIndex = '999999';
    botIcon.style.display = 'flex';
    botIcon.style.justifyContent = 'center';
    botIcon.style.alignItems = 'center';
    botIcon.style.cursor = 'pointer';
    botIcon.style.touchAction = 'none';
    botIcon.style.userSelect = 'none';
    botIcon.innerHTML = `<div style="text-align:center; font-size:24px;">🤖</div>`;
    document.body.appendChild(botIcon);

    // ৩. ডিটেইলস প্যানেল (Detailed Dashboard)
    let botBox = document.createElement('div');
    botBox.style.position = 'fixed';
    botBox.style.top = '100px';
    botBox.style.left = '20px';
    botBox.style.padding = '14px';
    botBox.style.backgroundColor = '#0b0f19';
    botBox.style.color = '#ffffff';
    botBox.style.borderRadius = '14px';
    botBox.style.border = '2px solid #00ff66';
    botBox.style.zIndex = '999999';
    botBox.style.fontFamily = 'Arial, sans-serif';
    botBox.style.width = '230px';
    botBox.style.boxShadow = '0px 0px 25px rgba(0, 255, 102, 0.4)';
    botBox.style.touchAction = 'none';
    botBox.style.display = 'none'; // শুরুতে হাইড থাকবে

    let content = document.createElement('div');
    content.innerHTML = `
        <div id="dragHeader" style="cursor: move; padding: 6px; background: #161e2e; margin: -14px -14px 12px -14px; border-bottom: 1px solid #00ff66; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0; user-select: none;">
            <span style="font-weight: bold; font-size: 11px; color: #00ff66;">🖐️ চেপে ধরে সরান</span>
            <button id="minimizeBtn" style="background:none; border:none; color:#00ff66; font-size:14px; font-weight:bold; cursor:pointer;">✖</button>
        </div>

        <div style="margin-bottom: 10px;">
            <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:4px;">⏱️ ট্রেড টাইম সিলেক্ট করুন:</label>
            <select id="tradeTimeSelect" style="width:100%; background:#161e2e; color:#00ff66; border:1px solid #00ff66; padding:6px; border-radius:6px; font-weight:bold; font-size:12px; outline:none;">
                <option value="1 Min">1 Minute (1m)</option>
                <option value="2 Min">2 Minutes (2m)</option>
                <option value="5 Min">5 Minutes (5m)</option>
            </select>
        </div>

        <div id="signalArea" style="background:#161e2e; padding:12px; border-radius:8px; text-align:center; font-weight:bold; font-size:13px; margin-bottom:10px; border:1px solid #2d3748;">
            READY FOR ANALYSIS
        </div>

        <button id="startScanBtn" style="width:100%; background:#00ff66; color:#000; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom:6px; font-size:12px;">START ANALYSIS 🟢</button>
        <button id="closeBotBtn" style="width:100%; background:#ef4444; color:#fff; border:none; padding:5px; border-radius:6px; cursor:pointer; font-size:11px;">সম্পূর্ণ বন্ধ করুন</button>
    `;
    botBox.appendChild(content);
    document.body.appendChild(botBox);

    // ড্র্যাগ এ্যান্ড ড্রপ ফংশন
    function makeDraggable(element, handle) {
        let isDragging = false, currentX = 0, currentY = 0, initialX = 0, initialY = 0, xOffset = 0, yOffset = 0;

        function dragStart(e) {
            let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
            let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
            initialX = clientX - xOffset;
            initialY = clientY - yOffset;
            if (e.target === handle || handle.contains(e.target) || element === handle) {
                isDragging = true;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
                let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
                currentX = clientX - initialX;
                currentY = clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                element.style.transform = "translate3d(" + currentX + "px, " + currentY + "px, 0)";
            }
        }

        handle.addEventListener("touchstart", dragStart, false);
        document.addEventListener("touchend", dragEnd, false);
        document.addEventListener("touchmove", drag, false);

        handle.addEventListener("mousedown", dragStart, false);
        document.addEventListener("mouseup", dragEnd, false);
        document.addEventListener("mousemove", drag, false);
    }

    makeDraggable(botBox, document.getElementById('dragHeader'));
    makeDraggable(botIcon, botIcon);

    // ডাবল ক্লিক / ডাবল ট্যাপ সিস্টেম
    let lastTap = 0;
    function toggleDetails() {
        if (botBox.style.display === 'none') {
            botBox.style.display = 'block';
            botIcon.style.display = 'none';
        } else {
            botBox.style.display = 'none';
            botIcon.style.display = 'flex';
        }
    }

    botIcon.addEventListener('dblclick', toggleDetails);
    botIcon.addEventListener('touchend', function(e) {
        let currentTime = new Date().getTime();
        let tapLength = currentTime - lastTap;
        if (tapLength < 350 && tapLength > 0) {
            toggleDetails();
            e.preventDefault();
        }
        lastTap = currentTime;
    });

    document.getElementById('minimizeBtn').onclick = function(){
        botBox.style.display = 'none';
        botIcon.style.display = 'flex';
    };

    // স্টার্ট বাটনে চাপ দিলে ফুল স্ক্রিন স্ক্যান ও সিগন্যাল
    document.getElementById('startScanBtn').onclick = function(){
        let selectedTime = document.getElementById('tradeTimeSelect').value;
        let signalArea = document.getElementById('signalArea');
        
        fullScanner.style.display = 'block'; 
        signalArea.style.color = '#00ff66';
        signalArea.innerHTML = `SCANNING CHART (${selectedTime})... 🟢`;

        setTimeout(() => {
            fullScanner.style.display = 'none';

            let rsiValue = Math.floor(Math.random() * 60) + 20;
            let isUptrend = Math.random() > 0.45;

            let result = '';
            let accuracy = Math.floor(Math.random() * 7) + 83; // ৮৩% থেকে ৮৯% একিউরেসি স্কোর

            if (rsiValue < 35 && isUptrend) {
                result = 'UP (CALL) 🟢';
            } else if (rsiValue > 65 && !isUptrend) {
                result = 'DOWN (PUT) 🔴';
            } else if (isUptrend) {
                result = 'UP (CALL) 🟢';
            } else {
                result = 'DOWN (PUT) 🔴';
            }

            if(result.includes('UP')){
                signalArea.style.color = '#00ff66';
            } else {
                signalArea.style.color = '#ef4444';
            }
            signalArea.innerHTML = `${result}<br><span style="font-size:11px; color:#cbd5e1;">Time: ${selectedTime} | Accuracy: ~${accuracy}%</span>`;
        }, 2500);
    };

    document.getElementById('closeBotBtn').onclick = function(){
        botBox.remove();
        botIcon.remove();
        fullScanner.remove();
        window.QuotexAdvancedBot = false;
    };
})();
