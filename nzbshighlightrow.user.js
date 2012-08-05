// ==UserScript==
// @name           NZBs(highlight)ROW
// @namespace      dryes
// @description    Highlight table row on mouseover with classic theme.
// @include        http*://www.nzbs.org/*
// @include        http*://nzbs.org/*
// @version        0001
// @updateURL      https://github.com/dryes/nzbsdotorg_gm/raw/master/nzbshighlightrow.user.js
// ==/UserScript==
function main() {
    $('tbody').delegate('tr', 'mouseover mouseleave', function (event) {
        if (event.type == 'mouseover') {
	    $(this).css('background-color', ($('body').attr('class') == 'classic' ? '#CDF4F4' : '#7F85AB'));
        } else {
            $(this).css('background-color', '');
        }
    });
}

//required for Chrome - no @require.
function addJQuery(callback) {
    var script = document.createElement('script');
    script.setAttribute('src', '/templates/default/scripts/jquery.js');
    script.addEventListener('load', function () {
        var script = document.createElement('script');
        script.textContent = '(' + callback.toString() + ')();';
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

addJQuery(main);
