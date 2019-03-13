console.log('===== Start of bee bee sms extension content-script');
console.log(location.host);
let enviroment = undefined;

if (location.host.startsWith('dev')) {
    enviroment = 'dev';
} else if (location.host.startsWith('beta')) {
    enviroment = 'beta';
} else if (location.host.startsWith('beebee') || location.host.startsWith('app.beebee')) {
    enviroment = 'prod';
}

console.log(enviroment);
if (enviroment) {
    chrome.runtime.sendMessage({ type: 'enviroment', enviroment: enviroment }, (response) => {
        console.log(response);
    });
}

let akitaStateString = localStorage.getItem('akita-state-' + enviroment);
console.log(akitaStateString);

if (akitaStateString) {
    let akitaState = JSON.parse(akitaStateString);
    console.log(akitaState.auth.token);
    if (akitaState && akitaState.auth && akitaState.auth.token) {
        chrome.runtime.sendMessage({ type: 'token', token: akitaState.auth.token }, (response) => {
            console.log(response);
        });
    }
} else {
    // backwards compatibility
    let token = localStorage.getItem('bee-jwt-token-' + enviroment);
    console.log({ token });
    if (token) {
        chrome.runtime.sendMessage({ type: 'token', token: token }, (response) => {
            console.log(response);
        });
    }
}
console.log('===== End of beebee sms extension content-stript')