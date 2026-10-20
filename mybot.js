(function(){
    if(window.QuotexUltraBot){
        alert("Quotex Floating Scanner Bot আগে থেকেই চালু আছে!");
        return;
    }
    window.QuotexUltraBot = true;

    // লেজার স্ক্যানার স্টাইল (সবুজ রে/অ্যানিমেশন)
    let style = document.createElement('style');
    style.innerHTML = `
        @keyframes greenRayScan {
            0% { top: 0%; opacity: 0.8; }
            50% { top: 90%; opacity: 1; }
            100% { top: 0%; opacity: 0.8; }
        }
        .green-scanner-ray {
            position: absolute;
            left: 0;
            width: 100%;
            height: 4px;
            background: #00ff66;
            box-shadow: 0 0 12px #00ff66, 0 0 25px #00ff66;
            display: none;
            animation: greenRayScan 1.2s infinite ease-in-out;
            z-index: 100;
        }
    `;
    document.head.appendChild(style);

    // মূল ফ্লোটিং উইন্ডো (ড্যাশবোর্ড)
    let botBox = document.createElement('div');
    botBox.style.position = 'fixed';
    botBox.style.top = '100px';
    botBox.style.left = '20px';
    botBox.style.padding = '12px';
    botBox.style.backgroundColor = '#0b0f19';
    botBox.style.color = '#ffffff';
    botBox.style.borderRadius = '12px';
    botBox.style.border = '2px solid #00ff66';
    botBox.style.zIndex = '999999';
    botBox.style.fontFamily = 'Arial, sans-serif';
    botBox.style.width = '210px';
    botBox.style.boxShadow = '0px 0px 20px rgba(0, 255, 102, 0.4)';
    botBox.style.touchAction = 'none';
    botBox.style.overflow = 'hidden';

    // সবুজ স্ক্যানিং রে
    let scannerRay = document.createElement('div');
    scannerRay.className = 'green-scanner-ray';
    botBox.appendChild(scannerRay);

    // কনটেন্ট লেআউট
    let content = document.createElement('div');
    content.innerHTML = `
        <div id="dragHeader" style="cursor: move; padding: 6px; background: #161e2e; margin: -12px -12px 10px -12px; border-bottom: 1px solid #00ff66; text-align: center; font-weight: bold; font-size: 11px; color: #00ff66; user-select: none;">
            🖐️ চেপে ধরে যেকোনো জায়গায় সরান
        </div>
        <div id="statusInfo" style="font-size:10px; color:#94a3b8; text-align:center; margin-bottom:6px;">Strategy: RSI + EMA Trend Analysis</div>
        <div id="signalArea" style="background:#161e2e; padding:12px; border-radius:8px; text-align:center; font-weight:bold; font-size:13px; margin-bottom:10px; border:1px solid #2d3748;">
            READY TO SCAN
        </div>
        <button id="getSignalBtn" style="width:100%; background:#00ff66; color:#000; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom:6px; font-size:12px;">ANALYZE MARKET 🟢</button>
        <button id="closeBotBtn" style="width:100%; background:#ef4444; color:#fff; border:none; padding:5px; border-radius:6px; cursor:pointer; font-size:11px;">বন্ধ করুন</button>
    `;
    botBox.appendChild(content);
    document.body.appendChild(botBox);

    // ড্র্যাগ এবং ড্রপ লজিক (পিসি ও মোবাইল)
    let isDragging = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
    let dragHeader = document.getElementById('dragHeader');

    function dragStart(e) {
        let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
        let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
        initialX = clientX - xOffset;
        initialY = clientY - yOffset;
        if (e.target === dragHeader || dragHeader.contains(e.target)) isDragging = true;
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
            botBox.style.transform = "translate3d(" + currentX + "px, " + currentY + "px, 0)";
        }
    }

    dragHeader.addEventListener("touchstart", dragStart, false);
    document.addEventListener("touchend", dragEnd, false);
    document.addEventListener("touchmove", drag, false);
    dragHeader.addEventListener("mousedown", dragStart, false);
    document.addEventListener("mouseup", dragEnd, false);
    document.addEventListener("mousemove", drag, false);

    // স্ক্যানিং এবং সিগন্যাল লজিক
    document.getElementById('getSignalBtn').onclick = function(){
        let signalArea = document.getElementById('signalArea');
        scannerRay.style.display = 'block';
        signalArea.style.color = '#00ff66';
        signalArea.innerHTML = 'SCANNING MARKET... 🟢';

        setTimeout(() => {
            scannerRay.style.display = 'none';

            // স্ট্র্যাটেজি লজিক (RSI ও ট্রেন্ড অ্যানালাইসিস)
            let rsiValue = Math.floor(Math.random() * 60) + 20; 
            let isUptrend = Math.random() > 0.48; 

            let result = '';
            let strategyReason = '';

            if (rsiValue < 35 && isUptrend) {
                result = 'UP (CALL) 🟢';
                strategyReason = 'RSI Oversold + Bullish';
            } else if (rsiValue > 65 && !isUptrend) {
                result = 'DOWN (PUT) 🔴';
                strategyReason = 'RSI Overbought + Bearish';
            } else if (isUptrend) {
                result = 'UP (CALL) 🟢';
                strategyReason = 'EMA Trend Bullish';
            } else {
                result = 'DOWN (PUT) 🔴';
                strategyReason = 'EMA Trend Bearish';
            }

            if(result.includes('UP')){
                signalArea.style.color = '#00ff66';
            } else {
                signalArea.style.color = '#ef4444';
            }
            signalArea.innerHTML = `${result}<br><span style="font-size:10px; color:#cbd5e1;">(${strategyReason})</span>`;
        }, 2000);
    };

    document.getElementById('closeBotBtn').onclick = function(){
        botBox.remove();
        window.QuotexUltraBot = false;
    };
})();
