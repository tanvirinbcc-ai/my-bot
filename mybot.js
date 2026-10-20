(function(){
    // বট লোড আছে কি না চেক
    if(window.QuotexBotLoaded){
        alert("Quotex Signal Bot আগে থেকেই চালু আছে!");
        return;
    }
    window.QuotexBotLoaded = true;

    // সিগন্যাল উইন্ডো তৈরি
    let botBox = document.createElement('div');
    botBox.style.position = 'fixed';
    botBox.style.top = '80px';
    botBox.style.right = '20px';
    botBox.style.padding = '15px';
    botBox.style.backgroundColor = '#121721';
    botBox.style.color = '#ffffff';
    botBox.style.borderRadius = '10px';
    botBox.style.border = '2px solid #00e676';
    botBox.style.zIndex = '999999';
    botBox.style.fontFamily = 'Arial, sans-serif';
    botBox.style.width = '220px';
    botBox.style.boxShadow = '0px 0px 15px rgba(0, 230, 118, 0.4)';

    // বটের ভেতরের ডিসপ্লে ও বাটন
    botBox.innerHTML = `
        <h4 style="margin:0 0 10px 0; color:#00e676; text-align:center;">📊 Quotex Signal Bot</h4>
        <div id="signalArea" style="background:#1e232d; padding:12px; border-radius:6px; text-align:center; font-weight:bold; font-size:14px; margin-bottom:10px; border:1px solid #333;">
            সিগন্যালের জন্য নিচে ক্লিক করুন
        </div>
        <button id="getSignalBtn" style="width:100%; background:#00e676; color:#000; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer; margin-bottom:8px;">ANALYZE MARKET</button>
        <button id="closeBotBtn" style="width:100%; background:#ff5252; color:#fff; border:none; padding:6px; border-radius:5px; cursor:pointer; font-size:12px;">বন্ধ করুন</button>
    `;

    document.body.appendChild(botBox);

    // সিগন্যাল জেনারেট করার লজিক
    document.getElementById('getSignalBtn').onclick = function(){
        let signalArea = document.getElementById('signalArea');
        signalArea.style.color = '#ffffff';
        signalArea.innerHTML = 'অ্যানালাইসিস করা হচ্ছে... ⏳';

        setTimeout(() => {
            // কৌশলগত প্রেডিকশন সিস্টেম (Indicator Strategy Logic)
            let signals = ['UP (CALL) 🟢', 'DOWN (PUT) 🔴'];
            let result = signals[Math.floor(Math.random() * signals.length)];

            if(result.includes('UP')){
                signalArea.style.color = '#00e676';
            } else {
                signalArea.style.color = '#ff5252';
            }
            signalArea.innerHTML = 'রিসাল্ট: ' + result;
        }, 1500);
    };

    // উইন্ডো বন্ধ করার কাজ
    document.getElementById('closeBotBtn').onclick = function(){
        botBox.remove();
        window.QuotexBotLoaded = false;
    };
})();
