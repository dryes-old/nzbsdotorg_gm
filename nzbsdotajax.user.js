// ==UserScript==
// @name           NZBs(dot)AJAX
// @namespace      dryes
// @description    Fancy-looking AJAX pages.
// @include        http*://www.nzbs.org/*
// @include        http*://nzbs.org/*
// @version        0006
// @updateURL      https://github.com/dryes/nzbsdotorg_gm/raw/master/nzbsdotajax.user.js
// ==/UserScript==
//TODO: capture submits.
//functions require stacking for Chrome jQuery support.
function main() {
    function init(bool) {
        var isdefault = ($('body').attr('class') == 'default' ? true : false),
            nzb_multi_operations_form = (isdefault ? '#nzb_multi_operations_form' : '#nzbtable'),
            nav = (isdefault ? '.nav' : '.menu'),
            navigation = (isdefault ? '#navigation' : '#user_box'),
            main = (isdefault ? '#main' : '.content');

        $('.pager').delegate('.page', 'click', function (event) {
            doAjax(event, $(this).attr('href'), nzb_multi_operations_form);
        });

        $('h1, ' + main).delegate('a', 'click', function (event) {
            doAjax(event, $(this).attr('href'), main);
        });

        if (!bool) {
            return;
        }

        if (location.href == location.protocol + '//' + location.hostname + '/') {
            location.href = location.protocol + '//' + location.hostname + '/#';
        }
        $(nav + ', ' + navigation).delegate('a', 'click', function (event) {
            doAjax(event, $(this).attr('href'), main);
        });
    }

    function doAjax(event, url, div) {
        if (event.ctrlKey || url.match(/(?:\#|\.jpg)|(?:\/(?:(?:\?|logout)$)|(?:(?:nfo|getnzb)\/|derefer\.me|admin))/i)) {
            return;
        }
        event.preventDefault();

        $.ajax({
            url: url,
            success: function (data) {
                var odiv = $(div),
                    ndiv = $(data).find(div).eq(0);

                if (!ndiv) {
                    return false;
                }

                odiv.fadeOut(250);
                ndiv.attr('style', 'display: none;');

                setTimeout(function () {
                    odiv.replaceWith(ndiv);

                    //http://bugs.jquery.com/ticket/6061
                    $('head').html(data.match(/(<head>[\s\S]+<\/head>)/m)[1]);

                    $(div).fadeIn(450);

                    init(false);
                }, 250);
            }
        });
    }

    init(true);
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
