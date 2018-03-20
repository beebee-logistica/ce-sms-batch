// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// modulePopUp
// a = ConfigureCheckBox
// b = Init

( function ( chrome ) {

	var _backPage = chrome.extension.getBackgroundPage();

	const modulePopUp = {
		Init: () => {
			chrome.storage.sync.get( null, ( values ) => {
				let settings = {};
				console.log('storage get');
			} );

			$('#message').keyup((e) => {
				$("#message-char-counter").html($('#message').val().length);
			});
		}
	};

	//Inicia módulo
	modulePopUp.Init();
}( chrome ) );
