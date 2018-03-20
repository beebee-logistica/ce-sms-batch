console.log( 'contente-script loaded beebee' );

const strCheckboxHead =
    `<th style="width: 2.25em">
    <p-tableheadercheckbox>
        <div class="ui-chkbox ui-widget checkbox-all">
            <div class="ui-helper-hidden-accessible">
                <input type="checkbox">
            </div>
            <div class="ui-chkbox-box ui-widget ui-state-default">
                <span class="ui-chkbox-icon ui-clickable"></span>
            </div>
        </div>
    </p-tableheadercheckbox>
</th>`;
const strCheckbox =
    `<td>
    <p-tablecheckbox>
        <div class="ui-chkbox ui-widget">
            <div class="ui-helper-hidden-accessible">
                <input type="checkbox">
            </div>
            <div class="ui-chkbox-box ui-widget ui-state-default">
                <span class="ui-chkbox-icon ui-clickable"></span>
            </div>
        </div>
    </p-tablecheckbox>
</td>`;

$( document ).ready( () => {

    const toggleCheckboxStyle = ( $element, checked ) => {
        if ( checked ) {
            $element.find( '.ui-chkbox-box' ).addClass( 'ui-state-active' );
            $element.find( '.ui-chkbox-icon' ).addClass( 'fa' );
            $element.find( '.ui-chkbox-icon' ).addClass( 'fa-check' );
        } else {
            $element.find( '.ui-chkbox-box' ).removeClass( 'ui-state-active' );
            $element.find( '.ui-chkbox-icon' ).removeClass( 'fa' )
            $element.find( '.ui-chkbox-icon' ).removeClass( 'fa-check' );
        }
    };

    const toggleCheckbox = ( $input, checked = undefined ) => {
        if ( checked === undefined ) {
            checked = !$input.prop( 'checked' );
        }
        $input.prop( 'checked', checked );
        toggleCheckboxStyle( $input.parents( '.ui-chkbox.ui-widget' ), checked )
        return checked;
    }

    setTimeout( () => {
        $( 'table thead tr' ).prepend( $( strCheckboxHead ) );
        $( 'table tbody tr' ).each( ( i, item ) => $( item ).prepend( $( strCheckbox ) ) );
    }, 1000 );

    $( 'body' ).on( 'click', 'table thead .ui-chkbox.ui-widget.checkbox-all', ( e ) => {
        const checked = toggleCheckbox( $( e.target ).parents( '.ui-chkbox.ui-widget' ).find( 'input' ) );
        $( 'table tbody .ui-chkbox.ui-widget' ).each( ( i, item ) => toggleCheckbox( $( item ).find( 'input' ), checked ) );
    } );

    $( 'body' ).on( 'click', 'table tbody .ui-chkbox.ui-widget', ( e ) => {
        toggleCheckbox( $( e.target ).parents( '.ui-chkbox.ui-widget' ).find( 'input' ) );
    } );
} );
