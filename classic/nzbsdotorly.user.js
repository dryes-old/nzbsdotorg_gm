// ==UserScript==
// @name           NZBs(dot)ORLY
// @author         dryes
// @description    Add ORLYDB/DUP3/D00P/VCDQ mouseovers to NZBs(dot)ORG.
// @include        http*://www.nzbs.org/classic/*
// @include        http*://nzbs.org/classic/*
// ==/UserScript==
function insertLinks() {
	var nzbtable = document.getElementById('nzbtable'),
		nzbColour = window.getComputedStyle(nzbtable.rows[2].childNodes[2].childNodes[0], null).getPropertyValue('color') == 'rgb(85, 85, 85)' ? 'rgb(51, 51, 51)' : 'rgb(221, 221, 221)';
	for(var i = 2; i < nzbtable.rows.length - 1; i++) {
		(function (i) {
			var nzbLinks = ['ORLYDB', 'DUP3', 'D00P', 'VCDQ'],
				nzbName = nzbtable.rows[i].childNodes[2].childNodes[0].textContent.replace(/ /g, '_');
			if(location.href.indexOf('/index.php?action=browse&catid=') < 0) {
				var nzbCat = nzbtable.rows[i].childNodes[3].textContent
			} else {
				var nzbCat = document.getElementsByTagName('h3')[0].textContent.replace(/Home (>|&gt\;) /, '').replace(/ (>|&gt\;) /, '-');
			}!nzbCat.match(/Movies-|TV-|PC-ISO|Console-PS3|Console-XBox360|Console-Wii/)) ? nzbLinks.pop() : null;
		for(var x in nzbLinks.reverse()) {
			(function (x) {
				var nzbLink = document.createElement('small');
				nzbtable.rows[i].childNodes[2].childNodes[2].textContent == '(NFO)' ? nzbLink.style.marginLeft = '0.8em' : nzbLink.style.marginRight = '0.8em';
				nzbLink.innerHTML = '(<a style="cursor: pointer; color: ' + nzbColour + ';" class="viewcover">' + nzbLinks[x] + '</a>)';
				nzbLink.addEventListener('mouseover', function () {
					setTooltip('hidden');
				}, false);
				nzbLink.addEventListener('mouseout', function () {
					setTooltip('remove');
				}, false);
				nzbLink.addEventListener('click', function () {
					setTooltip('visible');
					eval(nzbLinks[x].toLowerCase() + 'Scrape')(nzbName, nzbtable.rows[i], nzbLinks.length + (nzbtable.rows[i].childNodes[2].childNodes[2].textContent == '(NFO)' ? 2 : 1) - x);
				}, false);
				nzbtable.rows[i].childNodes[2].insertBefore(nzbLink, nzbtable.rows[i].childNodes[2].childNodes[nzbtable.rows[i].childNodes[2].childNodes[2].textContent == '(NFO)' ? 3 : 2]);
			})(x);
		}
		})(i);
}
}

function setTooltip(state) {
	var tooltip = document.evaluate('/html/body/div[3]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
	switch(state) {
	case 'hidden':
		tooltip.style.padding = '0px';
		break;
	case 'visible':
		tooltip.style.padding = '8px';
		break;
	case 'remove':
		tooltip.style.removeProperty('padding');
		tooltip.style.removeProperty('background-image');
		tooltip.childNodes[1] ? tooltip.removeChild(tooltip.childNodes[1]) : null;
		break;
	default:
		tooltip.style.backgroundImage = 'none';
		var refView = document.createElement('div');
		refView.innerHTML = '<div class="tool-text">' + state + '</div>';
		tooltip.appendChild(refView, tooltip);
		break;
	}
}

function setClass(nzbClass, nzbLinkText, nzbRow, nzbLink) {
	nzbClass == 'default' ? null : nzbRow.setAttribute('class', nzbClass);
	nzbClass == 'expired' ? nzbRow.childNodes[2].childNodes[nzbLink].childNodes[1].style.fontStyle = 'italic' : null;
	nzbRow.childNodes[2].childNodes[nzbLink].childNodes[1].textContent = nzbLinkText;
}

function orlydbScrape(nzbName, nzbRow, nzbLink) {
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://www.orlydb.com/?q="' + nzbName + '"',
		onload: function (orlyReply) {
			if(orlyReply.status != 200) {
				setTooltip('Error connecting to ORLYDB.');
				setClass('default', 'Error connecting.', nzbRow, nzbLink);
				return;
			}
			var orlyInfo, orlyMatch = /class="(?:timestamp|section\">[^>]+|release|nuke)">([^<]+)/g,
				orlyArray = [];
			while(orlyInfo = orlyMatch.exec(orlyReply.responseText)) {
				orlyArray.push(orlyInfo[1]);
			}
			if(!orlyArray[2] || orlyArray[2] != nzbName) {
				setTooltip('No results in ORLYDB.');
				setClass('expired', '0 results.', nzbRow, nzbLink);
				return;
			}
			setTooltip('<b>PRE:</b> ' + orlyArray[0] + '<br><b>CAT:</b> ' + orlyArray[1] + (orlyArray.length == 4 ? '<br><br><b>NUKE:</b> ' + orlyArray[3] : ''));
			orlyArray.length == 4 ? setClass('expired', 'NUKE: ' + orlyArray[3], nzbRow, nzbLink) : setClass('last_visit', 'PRE: ' + orlyArray[0], nzbRow, nzbLink);
		}
	});
}

function dup3Scrape(nzbName, nzbRow, nzbLink) {
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://pre.scnsrc.net/index.php?s=' + nzbName,
		onload: function (dup3Reply) {
			if(dup3Reply.status != 200) {
				setTooltip('Error connecting to DUP3.me.');
				setClass('default', 'Error connecting.', nzbRow, nzbLink);
				return;
			}
			if(dup3Reply.responseText.indexOf('search was an epic fail') > -1) {
				setTooltip('No results in DUP3.');
				setClass('expired', '0 results.', nzbRow, nzbLink);
				return;
			}
			var dup3Array = [dup3Reply.responseText.match(/results\.<\/b>[\s]+(\d{4}-\d{2}-\d{2}\ \d{2}:\d{2}:\d{2})/)[1]];
			dup3Array.push(dup3Reply.responseText.match(/id="nostyle"\ href="\?cat=([^"]+)"/)[1]);
			dup3Array.push(dup3Reply.responseText.match(/id="nostyle"\ href="\?group=([^&]+)/)[1]);
			dup3Reply.responseText.match(/<span>(UN)?NUKED:/) ? dup3Array.push(dup3Reply.responseText.match(/<span>((?:UN)?NUKED:\ [^<]+)/)[1]) : null
			setTooltip('<b>PRE:</b> ' + dup3Array[0] + '<br><b>CAT:</b> ' + dup3Array[1] + (dup3Array[3] ? '<br><br><b>' + dup3Array[3].replace('NUKED:', 'NUKE:</b>') : ''));
			dup3Array[3] ? setClass('expired', dup3Array[3].replace('NUKED:', 'NUKE:'), nzbRow, nzbLink) : setClass('last_visit', 'PRE: ' + dup3Array[0], nzbRow, nzbLink);
		}
	});
}

function d00pScrape(nzbName, nzbRow, nzbLink) {
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://doopes.com/index.php?cat=454647&lang=0&num=0&mode=1&from=&to=&exc=&inc=' + nzbName + '+&opt=0',
		onload: function (d00pReply) {
			if(d00pReply.status != 200) {
				setTooltip('Error connecting to D00P.');
				setClass('default', 'Error connecting.', nzbRow, nzbLink);
				return;
			}
			var d00pInfo, d00pMatch = /<td>([^<]+)/g,
				d00pArray = [];
			while(d00pInfo = d00pMatch.exec(d00pReply.responseText)) {
				d00pArray.push(d00pInfo[1]);
			}
			d00pArray.toString().match(/\.(UN)?NUKE:/) ? d00pArray.push(d00pArray.toString().match(/\.((?:UN)?NUKE:[^,\s]+)/)[1]) : null;
			while(d00pArray[1] == 'NUKES') {
				d00pArray.shift();
				d00pArray.shift();
				d00pArray.shift();
			}
			if(!d00pArray[2] || d00pArray[2].match(/([^\s]+)/)[1] != nzbName) {
				setTooltip('No results in D00P.');
				setClass('expired', '0 results.', nzbRow, nzbLink);
				return;
			}
			setTooltip('<b>PRE:</b> ' + d00pArray[0] + '<br><b>CAT:</b> ' + d00pArray[1] + (d00pArray.length % 3 != 0 ? '<br><br><b>' + d00pArray[d00pArray.length - 1].replace('NUKE:', 'NUKE:</b> ') : ''));
			d00pArray.length % 3 != 0 ? setClass('expired', d00pArray[d00pArray.length - 1].replace('NUKE:', 'NUKE: '), nzbRow, nzbLink) : setClass('last_visit', 'PRE: ' + d00pArray[0], nzbRow, nzbLink);
		}
	});
}

function vcdqScrape(nzbName, nzbRow, nzbLink) {
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://www.vcdq.com/browse/0/0/0/0/0/0/0/' + nzbName + '/0/0/0',
		onload: function (vcdqReply) {
			if(vcdqReply.status != 200) {
				setTooltip('Error connecting to VCDQ.');
				setClass('default', 'Error connecting.', nzbRow, nzbLink);
				return;
			}
			var vcdqInfo, vcdqMatch = /id="(?:dateField|(standardField|formatField|sourceField|titleField|groupField)\">[^>]+|videoField|audioField)\">([^<]+)/g,
				vcdqArray = [],
				vcdqArrayJpg = [];
			while(vcdqInfo = vcdqMatch.exec(vcdqReply.responseText)) {
				vcdqArray.push(vcdqInfo[1].replace(/[\t]|[\n]/g, ''));
			};
			vcdqMatch = /(\/files\/samples\/[^\"]+)/g;
			while(vcdqInfo = vcdqMatch.exec(vcdqReply.responseText)) {
				vcdqArrayJpg.push((vcdqArrayJpg.length % 2 == 0 ? '<br>' : '') + '<img src="http://www.vcdq.com/' + vcdqInfo[1] + 't">');
			}
			if(!vcdqArray[7] || vcdqArray[7] != nzbName) {
				setTooltip('No results in VCDQ.');
				setClass('default', '0 results.', nzbRow, nzbLink);
				return;
			}
			setTooltip('<b>FORMAT:</b> ' + vcdqArray[5] + ' - ' + vcdqArray[6] + '<br><b>GROUP:</b> ' + vcdqArray[8] + ' [' + vcdqArray[4] + ']' + '<br><b>DATE:</b> ' + vcdqArray[3] + (vcdqArray[9] != '0' ? '<br><b>RATING:</b> V:' + vcdqArray[9] + ' A:' + vcdqArray[10] : '') + (vcdqArrayJpg[0] ? '<br>' + vcdqArrayJpg.join(' ') : ''));
			setClass('default', (vcdqArray[9] != '0' ? 'V:' + vcdqArray[9] + ' A:' + vcdqArray[10] : 'Not rated.'), nzbRow, nzbLink);
		}
	});
}
insertLinks();