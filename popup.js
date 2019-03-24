// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// modulePopUp
// a = ConfigureCheckBox
// b = Init

( function ( chrome, $ ) {

	// var _backPage = chrome.extension.getBackgroundPage();
	var _token = null;

	const getToken = () => {
		return localStorage.getItem( 'sms-token' );
	};

	const getHost = () => {
		if ( localStorage.getItem( 'sms-enviroment' ) == 'dev' ) {
			return 'api.dev.beebee.com.br';
		} else if ( localStorage.getItem( 'sms-enviroment' ) == 'beta' ) {
			return 'api.beta.beebee.com.br';
		} else if ( localStorage.getItem( 'sms-enviroment' ) == 'prod' ) {
			return 'api.beebee.com.br';
		}
	};

	const Init = () => {
		chrome.storage.sync.get( null, ( values ) => {
			console.log( 'storage get' );
		} );

		_token = getToken();
		console.log( _token );

		$( '#message' ).keyup( ( e ) => {
			$( "#message-char-counter" ).html( $( '#message' ).val().length );
		} );

		$( '#btn-send' ).click( ( e ) => {
			sendSMS();
		} );

		// load categories
		if ( _token ) {
			getCategories()
				.then( categories => {
					if ( categories && categories.length > 0 ) {
						let strOptions = '<option selected="selected" value="0">Todas</option>';
						categories.forEach( item => {
							strOptions += "<option value='" + item.id + "'>" + item.name + "</option>";
						} );
						let $selectCategory = $( '#selectCategory' );
						$selectCategory.empty();
						$selectCategory.append( strOptions );
					}
				} );
		}
	};

	const sendSMS = () => {
		let categoryValue = $( '#selectCategory' ).val();

		let data = {
			message: $( '#message' ).val(),
			online: $( '#check-online' ).prop( 'checked' ),
			offline: $( '#check-offline' ).prop( 'checked' ),
			categoryId: categoryValue == 0 ? null : categoryValue
		}

		if ( data.message.length <= 0 ) {
			alert( 'Informe uma mensagem' );
			return;
		}

		$.ajax( 'https://' + getHost() + '/api/v1/vehicles/sendsms', {
			headers: { Authorization: 'Bearer ' + _token },
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

	const getCategories = () => {
		return $.get( {
			url: 'https://' + getHost() + '/api/v1/categories',
			headers: { Authorization: 'Bearer ' + _token },
			contentType: 'application/json'
		} )
			.then( mapCategories );
	}

	const mapCategories = ( list ) => list.map( item => ( { id: item.id, name: item.name } ) );


	//Inicia módulo
	Init();
}( chrome, $ ) );
