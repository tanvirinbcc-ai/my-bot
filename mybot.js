(function(){
    // চেক করবে বট আগে থেকেই ওপেন করা আছে কি না
    if(window.MyCustomBot){
        alert("আপনার বটটি আগে থেকেই চালু আছে!");
        return;
    }
    window.MyCustomBot = true;

    // একটি ভাসমান উইন্ডো বা বট তৈরি করা
    let botBox = document.createElement('div');
    botBox.style.position = 'fixed';
    botBox.style.bottom = '20px';
    botBox.style.right = '20px';
    botBox.style.padding = '20px';
    botBox.style.backgroundColor = '#1e1e1e';
    botBox.style.color = '#00ff00';
    botBox.style.borderRadius = '10px';
    botBox.style.zIndex = '999999'; // সবার উপরে রাখার জন্য
    botBox.style.fontFamily = 'Arial, sans-serif';
    botBox.style.boxShadow = '0px 0px 15px rgba(0,0,0,0.8)';
    
    // বটের ভেতরের লেখা ও বাটন
    botBox.innerHTML = `
        <h3 style="margin:0 0 10px 0;">🤖 আমার নিজস্ব বট</h3>
        <p style="margin:0 0 15px 0;">এটি সফলভাবে কাজ করছে!</p>
        <button id="closeBotBtn" style="background:red; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">বন্ধ করুন</button>
    `;
    
    document.body.appendChild(botBox);

    // বন্ধ করার বাটনের কাজ
    document.getElementById('closeBotBtn').onclick = function(){
        botBox.remove();
        window.MyCustomBot = false; // আবার লোড করার জন্য রিসেট করা
    };
})();
