const init = () => {
	console.log( 'init BeeBee chrome extension background' );

	chrome.runtime.onMessage.addListener( ( request, sender, sendResponse ) => {
		console.log( sender.tab ? "from a content script:" + sender.tab.url : "from the extension" );
		if ( request.type == 'token' ) {
			localStorage[ 'sms-token' ] = request.token;
			sendResponse( 0 );
		} else if ( request.type == 'enviroment' ) {
			localStorage[ 'sms-enviroment' ] = request.enviroment;
			sendResponse( 0 );
		}
	} );
}

init();