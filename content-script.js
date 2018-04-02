console.log( 'bee bee chrome extension' );

let enviroment = undefined;

if ( location.host.startsWith( 'dev' ) ) {
    enviroment = 'dev';
} else if ( location.host.startsWith( 'beta' ) ) {
    enviroment = 'beta';
} else if ( location.host.startsWith( 'beebee' ) ) {
    enviroment = 'prod';
}

if ( enviroment ) {
    chrome.runtime.sendMessage( { type: 'enviroment', enviroment: enviroment }, ( response ) => {
        console.log( response );
    } );
}

let tokenStorage = "bee-jwt-token-" + enviroment;
let token = localStorage[ tokenStorage ];

if ( token ) {
    chrome.runtime.sendMessage( { type: 'token', token: token }, ( response ) => {
        console.log( response );
    } );
}
