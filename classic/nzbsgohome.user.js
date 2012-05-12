// ==UserScript==
// @name           NZBs(goh)OME
// @author         dryes
// @description    Set header on NZBs(dot)ORG as link to frontpage.
// @include        http*://www.nzbs.org/classic/*
// @include        http*://nzbs.org/classic/*
// ==/UserScript==
function h1Index() {
	var h1 = document.createElement('h1');
	h1.innerHTML = '<a href="index.php">NZBs(dot)ORG</a>';
	document.getElementById('header').replaceChild(h1, document.getElementsByTagName('h1')[0]);
}
h1Index();