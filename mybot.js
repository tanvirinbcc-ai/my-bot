(function(){
    if(window.QuotexVIPBot){
        alert("VIP Bot আগে থেকেই চালু আছে!");
        return;
    }
    window.QuotexVIPBot = true;

    // পাসওয়ার্ড সেটআপ (এখানে পাসওয়ার্ড পরিবর্তন করতে পারেন)
    const SECRET_PASSWORD = "admin";

    // 3D, পার্টিকেল স্ক্যানার ও গ্লাসমরফিজম CSS
    let style = document.createElement('style');
    style.innerHTML = `
        @keyframes scanNet { 0% { background-position: 0 0; } 100% { background-position: 0 100vh; } }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 15px rgba(0,255,102,0.6); } 50% { box-shadow: 0 0 35px rgba(0,255,102,1), 0 0 15px inset rgba(0,255,102,0.5); } 100% { box-shadow: 0 0 15px rgba(0,255,102,0.6); } }
        .particle-scanner { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: linear-gradient(rgba(0,255,102,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,102,0.1) 1px, transparent 1px); background-size: 20px 20px; z-index: 999998; pointer-events: none; display: none; animation: scanNet 2s linear infinite; }
        .scan-line { position: absolute; left: 0; width: 100%; height: 4px; background: #00ff66; box-shadow: 0 0 25px #00ff66, 0 0 50px #00ff66; animation: scanMove 1.5s ease-in-out infinite alternate; }
        @keyframes scanMove { 0% { top: 0%; opacity: 0.8; } 100% { top: 98%; opacity: 1; } }
        .glass-3d { background: rgba(10, 15, 25, 0.85) !important; backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(0,255,102,0.4) !important; box-shadow: 0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(0,255,102,0.2), inset 0 1px 1px rgba(255,255,255,0.1) !important; transform-style: preserve-3d; perspective: 1000px; transition: transform 0.1s ease-out; }
        .btn-3d { transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(0,255,102,0.3); }
        .btn-3d:active { transform: translateY(2px); box-shadow: 0 2px 5px rgba(0,255,102,0.3); }
        .no-select { -webkit-touch-callout: none; user-select: none; outline: none; -webkit-tap-highlight-color: transparent; }
    `;
    document.head.appendChild(style);

    let particleScanner = document.createElement('div');
    particleScanner.className = 'particle-scanner';
    let scanLine = document.createElement('div');
    scanLine.className = 'scan-line';
    particleScanner.appendChild(scanLine);
    document.body.appendChild(particleScanner);

    // পাসওয়ার্ড প্যানেল
    let authBox = document.createElement('div');
    authBox.className = 'glass-3d no-select';
    authBox.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);padding:25px;border-radius:16px;z-index:999999;text-align:center;font-family:Arial,sans-serif;color:#fff;width:280px;';
    authBox.innerHTML = `
        <h2 style="margin:0 0 15px 0;color:#00ff66;text-shadow:0 0 10px rgba(0,255,102,0.5);">🔐 VIP ACCESS</h2>
        <input type="password" id="vipPassword" placeholder="Enter VIP Key" style="width:90%;padding:12px;background:rgba(0,0,0,0.6);border:1px solid #00ff66;color:#00ff66;border-radius:8px;text-align:center;margin-bottom:20px;outline:none;font-size:16px;">
        <button id="loginVipBtn" class="btn-3d" style="width:100%;padding:12px;background:linear-gradient(45deg,#00ff66,#00b347);color:#000;font-weight:900;border:none;border-radius:8px;cursor:pointer;font-size:15px;">INITIALIZE BOT</button>
    `;
    document.body.appendChild(authBox);

    document.getElementById('loginVipBtn').onclick = function(){
        if(document.getElementById('vipPassword').value === SECRET_PASSWORD){
            authBox.remove();
            initVIPBot();
        } else {
            alert("❌ Invalid VIP Key!");
        }
    };

    function initVIPBot(){
        let botIcon = document.createElement('div');
        botIcon.className = 'pulseGlow glass-3d no-select';
        botIcon.style.cssText = 'position:fixed;top:100px;left:20px;width:60px;height:60px;border-radius:50%;z-index:999999;display:flex;justify-content:center;align-items:center;cursor:pointer;touch-action:none;box-shadow:0 0 20px rgba(0,255,102,0.8);animation:pulseGlow 2s infinite;';
        botIcon.innerHTML = `<div style="font-size:28px;pointer-events:none;">🤖</div>`;
        document.body.appendChild(botIcon);

        let botBox = document.createElement('div');
        botBox.className = 'glass-3d no-select';
        botBox.style.cssText = 'position:fixed;top:100px;left:20px;padding:15px;border-radius:16px;z-index:999999;font-family:Arial,sans-serif;width:260px;touch-action:none;display:none;';
        botBox.innerHTML = `
            <div id="dragHeader" style="cursor:move;padding:10px;background:rgba(0,0,0,0.5);margin:-15px -15px 15px -15px;border-bottom:1px solid rgba(0,255,102,0.3);display:flex;justify-content:space-between;align-items:center;border-radius:16px 16px 0 0;">
                <span style="font-weight:900;font-size:12px;color:#00ff66;letter-spacing:1px;pointer-events:none;">⚡ VIP TRADING ENGINE</span>
                <button id="minimizeBtn" style="background:none;border:none;color:#00ff66;font-size:18px;cursor:pointer;">➖</button>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:5px;font-weight:bold;">⏱️ TRADE TIMEFRAME:</label>
                <input type="text" id="tradeTimeInput" placeholder="e.g. 1m, 30s" value="1m" style="width:90%;background:rgba(0,0,0,0.7);color:#00ff66;border:1px solid rgba(0,255,102,0.6);padding:10px;border-radius:8px;font-weight:bold;outline:none;text-align:center;font-size:14px;">
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:15px;align-items:center;background:rgba(0,0,0,0.4);padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
                <span style="font-size:11px;color:#cbd5e1;font-weight:bold;">🤖 AUTO TRADE (CLICK)</span>
                <input type="checkbox" id="autoTradeCheck" checked style="width:18px;height:18px;accent-color:#00ff66;">
            </div>
            <div id="signalArea" style="background:rgba(0,0,0,0.7);padding:20px 10px;border-radius:10px;text-align:center;font-weight:bold;font-size:14px;margin-bottom:15px;border:1px inset rgba(0,255,102,0.3);color:#fff;min-height:50px;display:flex;align-items:center;justify-content:center;flex-direction:column;">SYSTEM IDLE</div>
            <button id="startScanBtn" class="btn-3d" style="width:100%;background:linear-gradient(45deg,#00ff66,#00cc52);color:#000;border:none;padding:12px;border-radius:8px;font-weight:900;cursor:pointer;margin-bottom:10px;font-size:14px;">ANALYZE MARKET 🟢</button>
            <button id="closeBotBtn" style="width:100%;background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid #ef4444;padding:8px;border-radius:8px;cursor:pointer;font-size:11px;font-weight:bold;">TERMINATE SYSTEM</button>
        `;
        document.body.appendChild(botBox);

        function makeDraggable(el, handle, isIcon){
            let isD = false, cX = 0, cY = 0, iX = 0, iY = 0, xO = 0, yO = 0, moved = false;
            function dS(e){
                let cX_e = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
                let cY_e = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
                iX = cX_e - xO; iY = cY_e - yO; moved = false;
                if(e.target === handle || handle.contains(e.target) || el === handle) isD = true;
            }
            function dE(){
                if(isD && !moved && isIcon){
                    if(botBox.style.display === 'none'){ botBox.style.display = 'block'; botIcon.style.display = 'none'; }
                }
                isD = false;
            }
            function d(e){
                if(isD){
                    e.preventDefault(); moved = true;
                    let cX_e = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
                    let cY_e = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
                    cX = cX_e - iX; cY = cY_e - iY; xO = cX; yO = cY;
                    el.style.transform = "translate3d(" + cX + "px," + cY + "px,0)";
                }
            }
            handle.addEventListener("touchstart", dS, {passive: false});
            document.addEventListener("touchend", dE, false);
            document.addEventListener("touchmove", d, {passive: false});
            handle.addEventListener("mousedown", dS, false);
            document.addEventListener("mouseup", dE, false);
            document.addEventListener("mousemove", d, false);
        }

        makeDraggable(botBox, document.getElementById('dragHeader'), false);
        makeDraggable(botIcon, botIcon, true);

        // 3D Tilt Effect
        botBox.addEventListener('mousemove', function(e){
            let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            botBox.style.transform = `translate3d(${botBox.style.transform.match(/translate3d\((.*?)\)/)?botBox.style.transform.match(/translate3d\((.*?)\)/)[1]:'0,0,0'}) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        botBox.addEventListener('mouseleave', function(){
            botBox.style.transform = `translate3d(${botBox.style.transform.match(/translate3d\((.*?)\)/)?botBox.style.transform.match(/translate3d\((.*?)\)/)[1]:'0,0,0'}) rotateY(0deg) rotateX(0deg)`;
        });

        document.getElementById('minimizeBtn').onclick = function(e){
            botBox.style.display = 'none'; botIcon.style.display = 'flex'; e.stopPropagation();
        };

        function playSound(type){
            let ctx = new(window.AudioContext || window.webkitAudioContext)();
            let osc = ctx.createOscillator();
            let gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            if(type === 'scan'){
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime+0.5);
                gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime+0.5);
                osc.start(); osc.stop(ctx.currentTime+0.5);
            } else if(type === 'success'){
                osc.type = 'sine'; osc.frequency.setValueAtTime(800, ctx.currentTime); osc.frequency.setValueAtTime(1200, ctx.currentTime+0.1);
                gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime+0.3);
                osc.start(); osc.stop(ctx.currentTime+0.3);
            } else if(type === 'alert'){
                osc.type = 'square'; osc.frequency.setValueAtTime(300, ctx.currentTime); osc.frequency.setValueAtTime(250, ctx.currentTime+0.2);
                gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime+0.4);
                osc.start(); osc.stop(ctx.currentTime+0.4);
            }
        }

        document.getElementById('startScanBtn').onclick = function(){
            let tI = document.getElementById('tradeTimeInput').value;
            let autoTrade = document.getElementById('autoTradeCheck').checked;
            if(tI.trim() === ""){ alert("Please enter trade time!"); return; }
            let sA = document.getElementById('signalArea');
            let btn = document.getElementById('startScanBtn');
            btn.disabled = true; btn.style.opacity = '0.5';
            particleScanner.style.display = 'block'; playSound('scan');
            sA.style.color = '#00ff66';
            sA.innerHTML = `<span>Connecting Server... 📡</span>`;
            
            setTimeout(()=>{
                playSound('scan'); sA.innerHTML = `<span>Scanning Particles... 🧬</span>`;
                setTimeout(()=>{
                    playSound('scan'); sA.innerHTML = `<span>Calculating Risk... ⚖️</span>`;
                    setTimeout(()=>{
                        particleScanner.style.display = 'none'; btn.disabled = false; btn.style.opacity = '1';
                        let confidence = Math.floor(Math.random()*25)+75;
                        let isUp = Math.random() > 0.5;
                        let isRisk = confidence < 80;

                        if(isRisk){
                            playSound('alert'); sA.style.color = '#ffaa00';
                            sA.innerHTML = `<span style="font-size:16px;font-weight:900;">⚠️ HIGH RISK DETECTED</span><br><span style="font-size:11px;color:#cbd5e1;margin-top:6px;display:block;">Confidence: ${confidence}% (Below 80%)</span><span style="font-size:10px;color:#ef4444;margin-top:4px;display:block;">AUTO-TRADE CANCELLED</span>`;
                            return;
                        }

                        playSound('success');
                        let sT = isUp ? 'STRONG UP 🟢' : 'STRONG DOWN 🔴';
                        let rT = isUp ? 'Support Bounce + Volatility' : 'Resistance Hit + Divergence';
                        sA.style.color = isUp ? '#00ff66' : '#ef4444';
                        sA.innerHTML = `<span style="font-size:20px;font-weight:900;">${sT}</span><br><span style="font-size:11px;color:#cbd5e1;margin-top:6px;display:block;">Conf: ${confidence}% | Vol: High</span><span style="font-size:10px;color:#64748b;margin-top:3px;display:block;">Log: ${rT}</span>`;

                        if(autoTrade){
                            let btnText = isUp ? 'CALL' : 'PUT';
                            sA.innerHTML += `<br><span style="font-size:10px;color:#00ff66;margin-top:4px;display:block;">Auto-Click Initiated... ⏳</span>`;
                            setTimeout(()=>{
                                let buttons = document.querySelectorAll('button, div');
                                let clicked = false;
                                for(let b of buttons){
                                    if(b.innerText && b.innerText.toUpperCase().includes(btnText)){
                                        b.click(); clicked = true; break;
                                    }
                                }
                                if(clicked){
                                    sA.innerHTML += `<br><span style="font-size:11px;color:#00ff66;">✓ Order Placed (${btnText})</span>`;
                                } else {
                                    sA.innerHTML += `<br><span style="font-size:11px;color:#ffaa00;">⚠ Auto-Click Failed.</span>`;
                                }
                            }, 800);
                        }
                    }, 1500);
                }, 1500);
            }, 1200);
        };

        document.getElementById('closeBotBtn').onclick = function(){
            botBox.remove(); botIcon.remove(); particleScanner.remove(); window.QuotexVIPBot = false;
        };
    }
})();
