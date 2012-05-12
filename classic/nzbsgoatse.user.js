// ==UserScript==
// @name           NZBs(goa)TSE
// @author         dryes
// @description    Widen container to accommodate additional links.
// @include        http*://www.nzbs.org/classic/*
// @include        http*://nzbs.org/classic/*
// ==/UserScript==
function widenContainer() {
	var menu = document.getElementsByClassName('menu')[0];
	menu.setAttribute('style', 'padding: 36px 0px 0px; margin: 0px 0px 0px; float: none;');
	document.getElementById('container').setAttribute('style', 'width: ' + (document.body.clientWidth / 1.35) + 'px;');
}
document.getElementById('nzbtable') ? widenContainer() : null;