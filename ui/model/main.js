let debug = true;

if (debug) {
    console.log('[+] - Activating debug');
    document.body.style["border"] = "5px solid red";
}

console.log('[+] - Extension loaded');

{
    let iframe = document.createElement("iframe");
// iframe.src = 'data:text/html;charset=utf-8,' + html;
    iframe.src = browser.runtime.getURL("ui/test.html");
    iframe.style.position = "fixed";
    iframe.style.bottom = 0;
    iframe.style.right = "120px";
// iframe.style.width = "400px";
// iframe.style.height = "400px";
    iframe.style.overflow = "scroll";
    iframe.style.zIndex = 1337;
// iframe.style.minHeight = 0; // What a headache
    iframe.style.backgroundColor = "transparent";

    document.body.appendChild(iframe);
}
