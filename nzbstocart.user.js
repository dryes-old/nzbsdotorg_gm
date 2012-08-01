// ==UserScript==
// @name           NZBs(toc)ART
// @namespace      dryes
// @description    Add posts to 'My Cart' when checkbox is clicked - browse/search list view only.
// @include        http*://www.nzbs.org/*
// @include        http*://nzbs.org/*
// @version        0003
// @updateURL      https://github.com/dryes/nzbsdotorg_gm/raw/master/nzbstocart.user.js
// ==/UserScript==
//shift-click doesn't work under OSX (FF at least).
//functions require stacking for Chrome jQuery support.
function main() {
    var offset = ($('body').attr('class') == 'default' ? 1 : 2);

    $('#chkSelectAll').bind('change', function () {
        checkAll($('#chkSelectAll').is(':checked') ? true : false);
        toCart(0, true);
        checkAll($('#chkSelectAll').is(':checked') ? false : true);
    });

    lastRow = [];
    $('.nzb_check').each(function () {
        $(this).bind('change', function () {
            var index = ($(this).parent().parent('tr').prevAll().length - offset);
            toCart(index, false);
            lastRow.push(index);
            setColour();
        });
        $(this).bind('keyup', function (event) {
            var index = ($(this).parent().parent('tr').prevAll().length - offset);
            if (event.which == 16) {
                shiftClick(lastRow[(lastRow.length - 2)], index);
                setColour();
            }
        });
    });

    function toCart(index, bool) {
        if (bool) {
            $('.nzb_multi_operations_cart').click();
        } else {
            $('.icon_cart').eq((index)).click();
        }
    }

    function shiftClick(fromRow, toRow) {
        for (var j = (fromRow < toRow ? fromRow + 1 : fromRow - 1); j != toRow; (fromRow < toRow ? j++ : j--)) {
            toCart(j, false);
        }
    }

    function checkAll(bool) {
        //$('input#chkSelectAll.nzb_check_all.cartbox').prop('checked', bool);
        if (bool) {
            $('#chkSelectAll').attr('checked', 'checked');
        } else {
            $('#chkSelectAll').removeAttr('checked');
        }
        $('.nzb_check').each(function () {
            //$(this).prop('checked', bool);
            if (bool) {
                $(this).attr('checked', 'checked');
            } else {
                $(this).removeAttr('checked');
            }
        });
    }

    function setColour(browsetable) {
        $('.nzb_check').each(function () {
            $(this).parent().parent().css('background-color', ($(this).is(':checked') ? '#FFF3E2' : ''));
        });
    }
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

(document.getElementById('browsetable') || document.getElementById('nzbtable')) ? addJQuery(main) : null;
