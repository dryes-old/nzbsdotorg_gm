// ==UserScript==
// @name           NZBs(got)DAT
// @author         dryes
// @description    Mark checkboxes of previously downloaded NZBs.
// @include        http*://www.nzbs.org/classic/*
// @include        http*://nzbs.org/classic/*
// @exclude        http*://www.nzbs.org/classic/index.php?action=mynzbs
// @exclude        http*://nzbs.org/classic/index.php?action=mynzbs
// ==/UserScript==
function testGotDat(gotDatFile) {
	var nzbtable = document.getElementById('nzbtable'),
		gotDatCache = new RegExp('^(' + (GM_getValue('gotDatCache') ? GM_getValue('gotDatCache').replace('.', '\.') : '') + ')$', 'i');
	for(var i = 2; i < nzbtable.rows.length - 1; i++) {
		if(gotDatFile && gotDatFile.test(nzbtable.rows[i].childNodes[2].childNodes[0].textContent.replace(/ /g, '_'))) {
			nzbtable.rows[i].childNodes[2].lastChild.innerHTML = nzbtable.rows[i].childNodes[2].lastChild.innerHTML.replace(/~|\+|−/, '−');
			setCheckGot(nzbtable.rows[i]);
			continue;
		} else if(gotDatCache.test(nzbtable.rows[i].childNodes[2].childNodes[0].textContent.replace(/ /g, '_'))) {
			nzbtable.rows[i].childNodes[2].lastChild.innerHTML = nzbtable.rows[i].childNodes[2].lastChild.innerHTML.replace(/~|\+|−/, '−');
		} else {
			nzbtable.rows[i].childNodes[2].lastChild.innerHTML = nzbtable.rows[i].childNodes[2].lastChild.innerHTML.replace(/~|\+|−/, '+');
			nzbtable.rows[i].childNodes[1].lastChild.textContent == GM_getValue('gotDatMark') ? toggleGot(nzbtable.rows[i].childNodes[2].childNodes[0].textContent, nzbtable.rows[i]) : null;
		}
	}
	document.getElementById('gotDatCount').textContent = (gotDatFile.toString().split('|').length - 1 + GM_getValue('gotDatCache').split('|').length - 1);
}

function readGotDatFile() {
	!GM_getValue('gotDatFileUrl') ? GM_setValue('gotDatFileUrl', prompt('Enter URL of txt file containing dirnames. (One per line.)', 'http://localhost/gotDat.txt')) : null;
	GM_xmlhttpRequest({
		method: 'GET',
		url: GM_getValue('gotDatFileUrl'),
		onload: function (gotDat) {
			if(gotDat.status != 200) {
				setHumanized('Error updating gotDatFile.');
				testGotDat();
				return;
			}
			if(gotDat.responseText != '' && GM_getValue('gotDatCache')) {
				var gotDatValue = GM_getValue('gotDatCache').split('|');
				for(var x in gotDatValue) {
					gotDat.responseText.match(gotDatValue[x]) ? GM_setValue('gotDatCache', GM_getValue('gotDatCache').replace('|' + gotDatValue[x], '')) : null;
				}
			}
			testGotDat(gotDat.responseText != '' ? new RegExp('^(' + gotDat.responseText.replace(/[\n]/g, '|').replace('.', '\.') + ')$', 'i') : '');
		}
	});
}

function toggleGot(nzbName, nzbRow, except) {
	switch(except) {
	case 'force':
		nzbRow.childNodes[2].lastChild.innerHTML = nzbRow.childNodes[2].lastChild.innerHTML.replace('−', '+');
		break;
	}
	switch(nzbRow.childNodes[2].lastChild.textContent) {
	case '(+)':
		GM_setValue('gotDatCache', (GM_getValue('gotDatCache') ? GM_getValue('gotDatCache') + '|' : 'undefined|') + nzbName);
		(document.getElementById('gotDatCount').textContent++);
		document.getElementById('gotDatCount').title = (document.getElementById('gotDatCount').title.replace(/[\d]+/, (GM_getValue('gotDatCache').split('|').length - 1)));
		nzbRow.childNodes[2].lastChild.innerHTML = nzbRow.childNodes[2].lastChild.innerHTML.replace('+', '−');
		break;
	case '(−)':
		GM_setValue('gotDatCache', GM_getValue('gotDatCache').replace('|' + nzbName, ''));
		(document.getElementById('gotDatCount').textContent--);
		document.getElementById('gotDatCount').title = (document.getElementById('gotDatCount').title.replace(/[\d]+/, (GM_getValue('gotDatCache').split('|').length - 1)));
		if(nzbRow.childNodes[1].lastChild.textContent == GM_getValue('gotDatMark')) {
			nzbRow.childNodes[1].removeChild(nzbRow.childNodes[1].lastChild);
			nzbRow.childNodes[1].firstChild.setAttribute('value', nzbRow.childNodes[1].firstChild.id.match(/[\d]+/));
			nzbRow.childNodes[1].firstChild.setAttribute('style', 'display: visible;');
		}
		nzbRow.childNodes[2].lastChild.innerHTML = nzbRow.childNodes[2].lastChild.innerHTML.replace('−', '+');
		break
	}
}

function setCheckGot(nzbRow) {
	if(nzbRow.childNodes[1].firstChild.value == 'hidden') {
		return;
	}
	var gotCheck = document.createElement('b');
	gotCheck.style.fontSize = '9px';
	gotCheck.innerHTML = GM_getValue('gotDatMark');
	nzbRow.childNodes[1].appendChild(gotCheck, nzbRow.childNodes[1]);
	nzbRow.childNodes[1].firstChild.setAttribute('value', 'hidden');
	nzbRow.childNodes[1].firstChild.setAttribute('style', 'display: none;');
}

function shiftClick(fromRow, toRow) {
	var nzbtable = document.getElementById('nzbtable');
	for(var j = (fromRow < toRow ? fromRow + 1 : fromRow - 1); j != toRow; (fromRow < toRow ? j++ : j--)) {
		nzbtable.rows[j].childNodes[1].firstChild.value != 'hidden' ? toggleGot(nzbtable.rows[j].childNodes[2].childNodes[0].textContent, nzbtable.rows[j]) : null;
	}
}

function setHumanized(humanizedMessage) {
	document.getElementById('humanized').setAttribute('style', 'top: 200px; left: ' + (document.body.clientWidth / 3 + 27.5) + 'px; display: block; visibility: visible; opacity: 0.90;');
	document.getElementById('humanizedmessage').removeAttribute('style');
	document.getElementById('humanizedmessage').removeAttribute('opacity');
	document.getElementById('humanizedmessage').textContent = humanizedMessage; //unusual. fails when refer by var.
	setTimeout("document.getElementById('humanized').removeAttribute('style')", 2000);
}

function insertNodes() {
	!GM_getValue('gotDatMark') ? GM_setValue('gotDatMark', prompt('Enter text to mark checkboxes with.', 'GOT')) : null;
	!GM_getValue('gotDatCache') ? GM_setValue('gotDatCache', 'undefined') : null;
	lastRow = [];
	var gotDatBold = document.createElement('b');
	var gotDatCount = document.createElement('a');
	gotDatBold.innerHTML = '<br><b>gotDat:</b> '
	gotDatCount.innerHTML = '<a id="gotDatCount" style="text-decoration: underline; cursor: pointer;" title="' + (GM_getValue('gotDatCache').split('|').length - 1) + ' releases in cache.">0</a>';
	document.getElementById('user_box').appendChild(gotDatBold);
	document.getElementById('user_box').appendChild(gotDatCount);
	document.getElementById('gotDatCount').addEventListener('click', function () {
		GM_setValue('gotDatCache', 'undefined');
		document.getElementById('gotDatCount').title = (document.getElementById('gotDatCount').title.replace(/[\d]+/, (GM_getValue('gotDatCache').split('|').length - 1)));
		setHumanized('gotDat cache cleared.');
		readGotDatFile();
	}, false);
	var nzbtable = document.getElementById('nzbtable');
	var nzbColour = window.getComputedStyle(nzbtable.rows[2].childNodes[2].childNodes[0], null).getPropertyValue('color') == 'rgb(85, 85, 85)' ? 'rgb(51, 51, 51)' : 'rgb(221, 221, 221)';
	for(var i = 2; i < nzbtable.rows.length - 1; i++) {
		(function (i) {
			var haveGot = document.createElement('small');
			haveGot.innerHTML = '(<a style="cursor: pointer; color: ' + nzbColour + ';">~</a>)';
			haveGot.addEventListener('click', function () {
				toggleGot(nzbtable.rows[i].childNodes[2].childNodes[0].textContent, nzbtable.rows[i])
			}, false);
			nzbtable.rows[i].childNodes[2].appendChild(haveGot, nzbtable.rows[i].childNodes[2])
			nzbtable.rows[1].addEventListener('change', function () {
				nzbtable.rows[i].childNodes[1].firstChild.value != 'hidden' ? toggleGot(nzbtable.rows[i].childNodes[2].childNodes[0].textContent, nzbtable.rows[i]) : null;
			}, false);
			nzbtable.rows[i].addEventListener('change', function () {
				toggleGot(nzbtable.rows[i].childNodes[2].childNodes[0].textContent, nzbtable.rows[i]);
				lastRow.push(i);
			}, false);
			nzbtable.rows[i].addEventListener('keyup', function (event) {
				if(event.which == 16) {
					shiftClick(lastRow[lastRow.length - 2], i);
				}
			}, false);
			nzbtable.rows[i].lastChild.firstChild.addEventListener('mousedown', function () {
				toggleGot(nzbtable.rows[i].childNodes[2].childNodes[0].textContent, nzbtable.rows[i], 'force');
			}, false);
		})(i);
	}
	readGotDatFile();
}
document.getElementById('nzbtable') ? insertNodes() : null;
