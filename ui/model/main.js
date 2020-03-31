let debug = false;

if (debug) {
    console.log('[+] - Activating debug');
    document.body.style["border"] = "5px solid red";
}

console.log('[+] - Extension loaded');

{
    let html = `
        <style>
            .speech-bubble {
                position: relative;
                background-color: #638ddf;
                border-radius: .4em;
            }

            .speech-bubble:after {
                content: '';
                position: absolute;
                right: 0;
                top: 70%;
                width: 0;
                height: 0;
                border: 20px solid transparent;
                border-left-color: #638ddf;
                border-right: 0;
                margin-top: -20px;
                margin-right: -20px;
            }
        </style>
        <div id="snz_button" style="z-index:1337; position: fixed; bottom: 120px; right: 30px">
            <button
                    onclick="document.getElementById('snz_div').style.display = (document.getElementById('snz_div').style.display === 'none') ? 'block' : 'none';"
                    style="background-image: linear-gradient(-60deg,#7c73e6,#73ace6);}; border: none; color: white; padding: 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; border-radius: 50%"
            >
                &#9202;
            </button>
        </div>
        <div id="snz_div" class="speech-bubble" style="display: none; z-index:1337;position: fixed; width: 420px; height: 420px; bottom: 30px; right: 120px">
            <iframe id="snz_iframe" 
                sandbox="allow-scripts allow-same-origin allow-modals allow-top-navigation" 
                src="{{URL}}" 
                style="width: 100%; height: 100%">
            </iframe>
        </div>
    `;
    html = html.replace("{{URL}}",browser.runtime.getURL("ui/dashboard.html"));

    let div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);
}

console.log('[+] - Frame injected from '+browser.runtime.getURL("ui/dashboard.html"));
