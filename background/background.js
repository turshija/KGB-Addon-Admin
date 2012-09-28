/****************************************************************
 * KGB Admin extension for Chrome
 * Version 2.2 (28-SEP-2012)
 * @author Boris Vujicic - turshija@gmail.com
 * Copyright (c) 2007-2012 KGB Hosting d.o.o.
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 ***************************************************************/

// globals
var lastTicketCount = 0;

$(document).ready(function() {
    // default localstorage vars
    if (!localStorage.frequency) localStorage.frequency = 5;
    if (!localStorage.ticketCount) localStorage.ticketCount = 30;
    if (!localStorage.ticketStep) localStorage.ticketStep = 5;
    if (!localStorage.soundOn) localStorage.soundOn = 0;

    if (localStorage.sfx) {
        $("#zvuk").attr('src', '../sounds/'+localStorage.sfx);
    }

    // default badge settings
    chrome.browserAction.setBadgeBackgroundColor({color:[200, 0, 0, 100]});
    chrome.browserAction.setBadgeText({text: 'WAIT'});

    // init
    getTicketsNumber();
});

function showTicketsNumber( number ) {
    console.log( number );
    chrome.browserAction.setBadgeText({
        text: String( number )
    });
    // pustanje zvuka
    if ( checkIfSoundNeeded(number) ) {
        console.log('play sound !');
        document.getElementById('zvuk').play();
    }
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function checkIfSoundNeeded( current ) {
    var soundOn = localStorage.soundOn,
        ticketCount = localStorage.ticketCount,
        ticketStep = localStorage.ticketStep;

    console.log('1');
    // if unknown number, abort
    if (!isNumber( current )) return false;
    console.log('2');
    // If we disabled sound in options, then abort
    if (!soundOn) return false;
    console.log('3');
    // If current ticket number is the same as last one, then abort
    if ( current == lastTicketCount ) return false;
    console.log('4');

    // if current ticket number is lower than the last one, then abort (someone is online at the moment working on tickets)
    if ( current < lastTicketCount  ) {
        lastTicketCount = current;
        return false;
    }

    lastTicketCount = current;
    console.log('5');

    if ( current-ticketCount >=0 ) {
        console.log('6');
        if ( (current-ticketCount)%ticketStep === 0 ) {
            console.log('7');
            return true;
        }
    }
    console.log('8');
    return false;
}

function getTicketsNumber() {
    if ( (!localStorage.username) || (!localStorage.password) ) {
        chrome.browserAction.setBadgeText({text: 'KLIK'});
        setTimeout(function() {
            getTicketsNumber();
        }, localStorage.frequency*1000 );
    } else {
        $.ajax({
            url: "http://www.kgb-hosting.com/api/admin-api.php",
            type: 'POST',
            dataType: 'text',
            data: {
                username : localStorage.username,
                password : localStorage.password
            },
            success: function(data, textStatus, xhr) {
                showTicketsNumber( data );
            },
            complete: function(xhr, textStatus) {
                if (!localStorage.frequency) localStorage.frequency = 5;

                setTimeout(function() {
                    getTicketsNumber();
                }, localStorage.frequency*1000 );
            },
            error: function(xhr, textStatus, errorThrown) {
                chrome.browserAction.setBadgeText({text: '???'});
            }
        });
    }
}