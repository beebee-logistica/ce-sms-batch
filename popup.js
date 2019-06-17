// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// modulePopUp
// a = ConfigureCheckBox
// b = Init

( function ( chrome, $ ) {

	// var _backPage = chrome.extension.getBackgroundPage();
	var _token = null;
	var _target = null;

	const getToken = () => {
		return localStorage.getItem( 'sms-token' );
	};

	const getHost = () => {
		if ( localStorage.getItem( 'sms-enviroment' ) == 'dev' ) {
			return 'https://api.dev.beebee.com.br';
		} else if ( localStorage.getItem( 'sms-enviroment' ) == 'hom' ) {
			return 'https://api.hom.beebee.com.br';
		} else if ( localStorage.getItem( 'sms-enviroment' ) == 'prod' ) {
			return 'https://api.beebee.com.br';
		} else {
			return 'http://localhost:8000';
		}
	};

	const getSMSVehicleEndpoint = () => {
		if ( localStorage.getItem( 'sms-enviroment' ) == 'prod' ) {
			return 'https://' + getHost() + '/api/v1/vehicles/sendsms';
		} else {
			return 'https://' + getHost() + '/api/v1/users/send-sms-vehicle-associated';
		}
	};

	const Init = () => {
		chrome.storage.sync.get( null, ( values ) => {
			console.log( 'storage get' );
		} );

		_token = getToken();
		console.log( _token );

		$( 'a[data-toggle="tab"]' ).on( 'shown.bs.tab', function ( e ) {
			// e.target // newly activated tab
			// e.relatedTarget // previous active tab
			_target = $( e.target ).data( "sms-target" );
		} )

		$( '#message' ).keyup( ( e ) => {
			$( "#message-char-counter" ).html( $( '#message' ).val().length );
		} );

		$( '#btn-send' ).click( ( e ) => {
			sendSMS( _target );
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

	const sendSMS = ( target ) => {
		const message = $( '#message' ).val();

		if ( message.length <= 0 ) {
			alert( 'Informe uma mensagem' );
			return;
		}

		if ( target == 'vehicles' ) {
			sendSMSVehicles( message );
		} else if ( target == 'users' ) {
			sendSMSUsers( message );
		};
	}

	const getCategories = () => {
		return $.get( {
			url: getHost() + '/api/v1/categories',
			headers: getRequestHeaders(),
			contentType: 'application/json'
		} )
			.then( mapCategories );
	}

	const sendSMSVehicles = ( message ) => {
		let categoryValue = $( '#selectCategory' ).val();

		let data = {
			categoryId: categoryValue == 0 ? null : categoryValue,
			online: $( '#check-online' ).prop( 'checked' ),
			offline: $( '#check-offline' ).prop( 'checked' ),
			message: $( '#message' ).val()
		}

		$.ajax( getSMSVehicleEndpoint(), {
			headers: getRequestHeaders(),
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
	}

	const sendSMSUsers = () => {
		let phones = $( '#phones' ).val();
		const phonesRegex = new RegExp( '[0-9,]', 'g' );
		phones = phones.match( phonesRegex ).join( '' );

		let data = {
			phones: phones.split( ',' ),
			message: $( '#message' ).val()
		}

		$.ajax( getHost() + '/api/v1/users/send-sms-users', {
			headers: getRequestHeaders(),
			method: 'POST',
			data: JSON.stringify( data ),
			contentType: 'application/json'
		} )
			.then( response => {
				console.log( response );
				alert( 'Operação realizada com sucesso! \n\n ' + response );
			} )
			.catch( err => {
				console.error( err );
				alert( 'Erro ao enviar SMS.' );
			} );
	}

	const mapCategories = ( list ) => list.map( item => ( { id: item.id, name: item.name } ) );

	const getRequestHeaders = () => {
		return { Authorization: 'Bearer ' + _token };
	}

	//Inicia módulo
	Init();
}( chrome, $ ) );
