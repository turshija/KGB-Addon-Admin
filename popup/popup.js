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