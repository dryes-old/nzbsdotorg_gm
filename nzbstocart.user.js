// ==UserScript==
// @name           NZBs(toc)ART
// @namespace      dryes
// @description    Add posts to 'My Cart' when checkbox is clicked - browse/search list view only.
// @include        http*://www.nzbs.org/*
// @include        http*://nzbs.org/*
// @updateURL      https://raw.github.com/dryes/nzbsdotorg_gm/nzbstocart.user.js
// ==/UserScript==
//TODO: re-check all after 'Add to Cart'; shift-click fix (keyup not detected).
//functions require stacking for Chrome JQuery support.
function main() {
    var nzbtable = document.getElementById('nzbtable');
    document.getElementById('chkSelectAll').addEventListener('change', function () {
        checkAll($('#nzbtable tbody tr th input#chkSelectAll.nzb_check_all.cartbox').is(':checked') ? true : false);
        toCart(0, true);
        checkAll($('#nzbtable tbody tr th input#chkSelectAll.nzb_check_all.cartbox').is(':checked') ? false : true);
    }, false);

    lastRow = [];
    for (i = 2; i < (nzbtable.rows.length - 1); ++i) {
        (function (i) {
            nzbtable.rows[i].childNodes[1].addEventListener('change', function () {
                toCart(i, false);
                lastRow.push(i);
                setColour();
            }, false);
            nzbtable.rows[i].childNodes[1].addEventListener('keyup', function (event) {
                if (event.which == 16) {
                    shiftClick(lastRow[(lastRow.length - 2)], i);
                    setColour();
                }
            }, false);
        })(i);
    }

    function toCart(i, bool) {
        if (bool) {
            $('#nzbtable tbody tr td.pagelinks div.nzb_multi_operations input.nzb_multi_operations_cart.submit').click();
        } else {
            $('#nzbtable tbody tr td.icons div.icon.icon_cart').eq((i - 2)).click();
        }
    }

    function shiftClick(fromRow, toRow) {
        for (var j = (fromRow < toRow ? fromRow + 1 : fromRow - 1); j != toRow; (fromRow < toRow ? j++ : j--)) {
            toCart(j, false);
        }
    }

    function checkAll(bool) {
        $('#nzbtable tbody tr th input#chkSelectAll.nzb_check_all.cartbox').prop('checked', bool);
        $('#nzbtable tbody tr td.check input.nzb_check.cartbox').each(function () {
            //$(this).prop('checked', bool);
            if (bool) {
                $(this).attr('checked', 'checked');
            } else {
                $(this).removeAttr('checked');
            }
        });
    }

    function setColour(nzbtable) {
        $('#nzbtable tbody tr td.check input.nzb_check.cartbox').each(function () {
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

document.getElementById('nzbtable') ? addJQuery(main) : null;
