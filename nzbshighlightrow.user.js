// ==UserScript==
// @name           NZBs(highlight)ROW
// @namespace      dryes
// @description    Highlight table row on mouseover with classic theme.
// @include        http*://www.nzbs.org/*
// @include        http*://nzbs.org/*
// @version        0003
// @updateURL      https://github.com/dryes/nzbsdotorg_gm/raw/master/nzbshighlightrow.user.js
// ==/UserScript==
$ = unsafeWindow.$;

function main() {
    GM_addStyle('.mouseover { background-color: ' + ($('body').attr('class') == 'classic' ? '#CDF4F4' : '#7F85AB') + ' !important; }');

    $('tbody').delegate('tr', 'mouseover mouseleave', function (event) {
        if (event.type == 'mouseover') {
            $(this).addClass('mouseover');
        } else {
            $(this).removeClass('mouseover');
        }
    });
}

main();
