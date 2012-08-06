// ==UserScript==
// @name           NZBs(dot)COM
// @namespace      dryes
// @description    Place asterisk beside commented posts and mark red incomplete post %.
// @include        http*://www.nzbs.org/*
// @include        http*://nzbs.org/*
// @version        0001
// @updateURL      https://github.com/dryes/nzbsdotorg_gm/raw/master/nzbsdotcom.user.js
// ==/UserScript==
$ = unsafeWindow.$;

function main() {
    $('tr').each(function () {
        var index = $(this).prevAll().length;
        if (index < 2 || index == $(this).parent().children().length) {
            return;
        }

        var rights = $(this).find('.right'),
            completiontext = rights.eq(1).children('small'),
            completion = Number(completiontext.text().replace(/\%$/, '')),
            comments = Number(rights.eq(3).children('a').text().replace(/ cmts$/, '')),
            title = $(this).children('.title').children('b');

        if (completion <= 95 || completion >= 105) {
            completiontext.attr('style', 'color: #FF6666;');
        }

        if (comments > 0) {
            title.append(' *');
        }
    });
}

main();
