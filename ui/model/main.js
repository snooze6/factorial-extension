let debug = true;

if (debug) {
    console.log('[+] - Activating debug');
    document.body.style["border"] = "5px solid red";
}

console.log('[+] - Extension loaded');

let f = new factorial();

console.log('[+] - Factorial core created');

// Bypassing CSP
function getHTML(url) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("text/html");
    xhr.open("GET", browser.extension.getURL(url),false);
    xhr.send(null);
    if (xhr.status === 200)
        return xhr.response;
    else
        throw new Error('File not found')
}

let html = getHTML("ui/test.html");
// let html = getHTML("ui/compiled.html");
console.log(html);

let iframe = document.createElement("iframe");
iframe.src = 'data:text/html;charset=utf-8,' + html;
iframe.style.position = "fixed";
iframe.style.bottom = 0;
iframe.style.right = 0;
iframe.style.width = "400px";
iframe.style.height = "400px";
iframe.style.overflow = "scroll";
iframe.style.zIndex = 1337;
iframe.style.minHeight = 0; // What a headache

if (debug) iframe.style.backgroundColor = "cyan";

document.body.appendChild(iframe);