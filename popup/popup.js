/****************************************************************
 * KGB Admin extension for Chrome
 * Version 2.2 (28-SEP-2012)
 * Copyright (c) 2007-2012 KGB Hosting d.o.o.
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 ***************************************************************/

 $(document).ready(function() {
    if ( (!localStorage.username) || (!localStorage.password) ) {
        $('body').find('ul').remove().end().append('Desni klik na ikonicu -> Options da biste podesili podatke za login !');
    } else {
        var $soundOn = $("#soundOn");

        if ( parseInt(localStorage.soundOn,10) ) {
            $soundOn.attr('checked', true );
        }

        $soundOn.on('change', function() {
            var $this = $(this),
                checked = $this.attr('checked');

            if (checked) {
                localStorage.soundOn = 1;
            } else {
                localStorage.soundOn = 0;
            }
        });
    }
});