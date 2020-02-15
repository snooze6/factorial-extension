let debug = true;

if (debug) {
    console.log('[+] - Activating debug');
    document.body.style["border"] = "5px solid red";
}

console.log('[+] - Extension loaded');

let f = new factorial();

console.log('[+] - Factorial core created');
