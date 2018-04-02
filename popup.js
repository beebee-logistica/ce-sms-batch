// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// modulePopUp
// a = ConfigureCheckBox
// b = Init

( function ( chrome, $ ) {

	var _backPage = chrome.extension.getBackgroundPage();

	const getToken = () => {
		return localStorage[ 'smsToken' ];
	};

	const getHost = () => {
		if ( localStorage[ 'smsEnviroment' ] == 'dev' ) {
			return 'api.dev.beebee.com.br';
		} else if ( localStorage[ 'smsEnviroment' ] == 'beta' ) {
			return 'api.beta.beebee.com.br';
		} else if ( localStorage[ 'smsEnviroment' ] == 'prod' ) {
			return 'api.beebee.com.br';
		}
	};


	const Init = () => {
		chrome.storage.sync.get( null, ( values ) => {
			let settings = {};
			console.log( 'storage get' );
		} );

		$( '#message' ).keyup( ( e ) => {
			$( "#message-char-counter" ).html( $( '#message' ).val().length );
		} );

		$( '#btn-send' ).click( ( e ) => {
			sendSMS();
		} );
	};

	const sendSMS = () => {
		let data = {
			message: $( '#message' ).val(),
			online: $( '#check-online' ).prop( 'checked' ),
			offline: $( '#check-offline' ).prop( 'checked' )
		}

		if ( data.message.length <= 0 ) {
			alert( 'Informe uma mensagem' );
			return;
		}

		console.log( $.ajax );

		$.ajax( 'https://' + getHost() + '/api/v1/vehicles/sendsms', {
			headers: { Authorization: 'Bearer ' + getToken() },
			method: 'POST',
			data: JSON.stringify( data ),
			contentType: 'application/json'
		} )
			.then( response => {
				console.log( response );
				alert( 'SMS enviado com sucesso!' );
			} )
			.catch( err => {
				console.error( err );
				alert( 'Erro ao enviar SMS.' );
			} );
	};

	//Inicia módulo
	Init();
}( chrome, $ ) );
