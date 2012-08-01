k// ==UserScript==
// @name           NZBs(dot)AJAX
// @namespace      dryes
// @description    Fancy-looking AJAX pages.
// @include        http*://www.nzbs.org/*
// @include        http*://nzbs.org/*
// @version        0003
// @updateURL      https://github.com/dryes/nzbsdotorg_gm/raw/master/nzbsdotajax.user.js
// ==/UserScript==
//TODO: capture submits; match 'Jump To' links; improve animations.
//functions require stacking for Chrome jQuery support.
function main() {
    function init(bool) {
        var isdefault = ($('body').attr('class') == 'default' ? true : false),
            nzb_multi_operations_form = (isdefault ? '#nzb_multi_operations_form' : '#nzbtable'),
            nav = (isdefault ? '.nav' : '.menu'),
            navigation = (isdefault ? '#navigation' : '#user_box'),
            main = (isdefault ? '#main' : '.content');

        $('.page').each(function () {
            $(this).unbind('click').bind('click', function (event) {
                doAjax(event, $(this).attr('href'), nzb_multi_operations_form);
            });
        });

	$('.title, .item, .data, .movextra, h2, .footer').find('a').unbind('click').bind('click', function (event) {
		doAjax(event, $(this).attr('href'), main);
	});

        if (!bool) {
            return;
        }

        location.href = location.protocol + '//' + location.hostname + '/#';
        $(nav + ', ' + navigation).find('a').unbind('click').bind('click', function (event) {
                doAjax(event, $(this).attr('href'), main);
        });
    }

    function doAjax(event, url, div) {
        if (url.match(/(?:\.jpg|(?:\/(\#[\w]*|logout|admin))$)/i)) {
            return;
        }
        event.preventDefault();

        $.ajax({
            url: url,
            success: function (data) {
                var rdiv = $(div),
                    head = $('head');

                rdiv.hide(250);

                setTimeout(function () {
                    rdiv.replaceWith($(data).find(div));
                    $(div).show(250);
                    //http://bugs.jquery.com/ticket/6061
                    head.html(data.match(/(<head>[\s\S]+<\/head>)/m)[1]);

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
