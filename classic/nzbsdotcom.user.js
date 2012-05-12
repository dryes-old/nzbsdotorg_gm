// ==UserScript==
// @name           NZBs(dot)COM
// @author         dryes
// @description    Asterisk commented posts on NZBs(dot)ORG.
// @include        http*://www.nzbs.org/classic/*
// @include        http*://nzbs.org/classic/*
// ==/UserScript==
function asterComms() {
	var nzbtable = document.getElementById('nzbtable');
	for(var i = 2; i < nzbtable.rows.length - 1; i++) {
		!nzbtable.rows[i].lastChild.previousSibling.textContent.match(/0 cmts/) ? nzbtable.rows[i].childNodes[2].childNodes[0].innerHTML += ' *' : null;
		var completion = nzbtable.rows[i].lastChild.previousSibling.previousSibling.previousSibling.lastChild.textContent.match(/(\d+(\.\d+)?)%/) ? nzbtable.rows[i].lastChild.previousSibling.previousSibling.previousSibling.lastChild.textContent.match(/(\d+(\.\d+)?)%/)[1] : 100;
		if(completion < 95.0 || completion > 105.0) {
			nzbtable.rows[i].lastChild.previousSibling.previousSibling.previousSibling.lastChild.style.color = '#FF6666';
		}
	}
}
asterComms();