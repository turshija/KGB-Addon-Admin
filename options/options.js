/****************************************************************
 * KGB Admin extension for Chrome
 * Version 2.2 (28-SEP-2012)
 * Copyright (c) 2007-2012 KGB Hosting d.o.o.
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 ***************************************************************/

 $(document).ready(function() {
    var $frequency = $("#frequency"),
        $ticketCount = $("#ticketCount"),
        $ticketStep = $("#ticketStep"),
        $soundOn = $("#soundOn"),
        $sfx = $("#sfx");

    if ( (!localStorage.username) || (!localStorage.password) ) {
        $('.loginOptions').show();
    } else {
        $('.options').show();
    }
    // Code if not logged in
    $("#loginForm").on('submit', function(e) {
        var $this = $(this);

        checkLogin( $this );
        e.preventDefault();
    });

    // Code if logged in
    $(".loginChange").on('click', function(e) {
        e.preventDefault();
        $('.loginOptions').fadeIn('fast');
        $('.options').hide();
        localStorage.removeItem('username');
        localStorage.removeItem('password');
    });
    if ( parseInt(localStorage.soundOn,10) ) {
        $soundOn.attr('checked', true );
        $("#soundSettings").show();
    }
    $frequency.find('option').filter('[value="'+localStorage.frequency+'"]').attr('selected',true);
    $ticketCount.find('option').filter('[value="'+localStorage.ticketCount+'"]').attr('selected',true);
    $ticketStep.find('option').filter('[value="'+localStorage.ticketStep+'"]').attr('selected',true);
    $sfx.find('option').filter('[value="'+localStorage.sfx+'"]').attr('selected',true);

    $frequency.on('change', function() {
        var $this = $(this),
            selected = $this.find('option:selected').val();

        localStorage.frequency = selected;
    });

    $ticketCount.on('change', function() {
        var $this = $(this),
            selected = $this.find('option:selected').val();

        localStorage.ticketCount = selected;
        showExample();
    });

    $ticketStep.on('change', function() {
        var $this = $(this),
            selected = $this.find('option:selected').val();

        localStorage.ticketStep = selected;
        showExample();
    });

    $sfx.on('change', function() {
        var $this = $(this),
            selected = $this.find('option:selected').val(),
            $zvuk = $("#dummyzvuk"),
            dir = '../sounds/';

        localStorage.sfx = selected;
        $zvuk.attr('src', dir + selected);
        document.getElementById('dummyzvuk').play();
        $("#sfxNotif").fadeIn();
    });

    $soundOn.on('change', function() {
        var $this = $(this),
            checked = $this.attr('checked'),
            $soundSettings = $("#soundSettings");

        if (checked) {
            localStorage.soundOn = 1;
            $soundSettings.fadeIn('fast');
        } else {
            localStorage.soundOn = 0;
            $soundSettings.fadeOut('fast');
        }
    });

    showExample();
});

var showExample = function() {
    var start = localStorage.ticketCount,
        step = localStorage.ticketStep,
        out = '',
        numSteps = 7;

    while (numSteps--) {
        out += start + ',';
        start = parseInt(start,10)+parseInt(step,10);
    }
    out += "...";

    $("#showExample").html( out );
},
checkLogin = function( $form ) {
    var username = $form.find('input').filter('[name="username"]').val(),
        password = $form.find('input').filter('[name="password"]').val();

    $form.find('button').text('Loading...').attr('disabled',true).end().find('.loginFormNotif').hide();

    $.ajax({
        url: 'http://www.kgb-hosting.com/api/admin-api.php',
        type: 'POST',
        dataType: 'text',
        data: {
            username: username,
            password: password
        },
        complete: function(xhr, textStatus) {
            $form.find('button').text('Login').attr('disabled',false);
        },
        success: function(data, textStatus, xhr) {
            localStorage.username = username;
            localStorage.password = password;
            $('.loginOptions').hide();
            $('.options').fadeIn();
        },
        error: function(xhr, textStatus, errorThrown) {
            $form.find('.loginFormNotif').fadeIn('fast');
        }
    });
};