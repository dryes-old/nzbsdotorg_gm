// ==UserScript==
// @name           NZBs(det)TOL
// @author         dryes
// @description    Persistent global/live blacklist with integrated P2P filter.
// @include        http*://www.nzbs.org/classic/*
// @include        http*://nzbs.org/classic/*
// ==/UserScript==
function testBlackList(showAll) {
	if(!showAll) {
		var blackList = new RegExp((GM_getValue('blackList') ? GM_getValue('blackList') : '^$'), 'i'),
			nonScene = new RegExp('(-|\\.|_| )(' + (GM_getValue('nonScene') ? GM_getValue('nonScene') : '^$') + ')$', 'i');
	} else {
		var blackList = /^$/g,
			nonScene = /^$/g;
	};
	var visiblePosts = [];
	var nzbtable = document.getElementById('nzbtable');
	for(var i = 2; i < nzbtable.rows.length - 1; i++) {
		if(blackList.test(nzbtable.rows[i].childNodes[2].firstChild.textContent) || nonScene.test(nzbtable.rows[i].childNodes[2].firstChild.textContent)) {
			nzbtable.rows[i].style.display = 'none';
			nzbtable.rows[i].childNodes[1].firstChild.setAttribute('value', 'hidden');
		} else {
			nzbtable.rows[i].style.display == 'none' ? nzbtable.rows[i].removeAttribute('style') : null;
			visiblePosts.push(nzbtable.rows[i]);
			nzbtable.rows[i].childNodes[1].firstChild.value == 'hidden' ? nzbtable.rows[i].childNodes[1].firstChild.setAttribute('value', nzbtable.rows[i].childNodes[1].firstChild.id.match(/[\d]+/)) : null;
		}
	}
	nzbtable.rows[0].childNodes[1].firstChild.value = 'Show All (' + (nzbtable.rows.length - 3 - visiblePosts.length) + ' hidden)';
	nzbtable.rows[0].firstChild.innerHTML = nzbtable.rows[0].firstChild.innerHTML.replace(/to [\d]+ :/g, 'to ' + (nzbtable.rows[0].firstChild.innerHTML.match(/Results ([\d]+) to/)[1] - 1 + visiblePosts.length) + ' :');
	nzbtable.rows[nzbtable.rows.length - 1].innerHTML = nzbtable.rows[0].innerHTML;
	nzbtable.rows[nzbtable.rows.length - 1].lastChild.firstChild.addEventListener('click', function () {
		testBlackList('showAll');
	}, false);
	for(var i = 0; i < visiblePosts.length; i++) {
		!visiblePosts[i].className.match(/last_visit| selected|expired/) ? visiblePosts[i].setAttribute('class', (i % 2 != 0 ? 'rowa' : 'rowb')) : null;
	}
	if(visiblePosts.length != '0') {
		return;
	}
	var h4 = document.createElement('h4');
	h4.addEventListener('click', function () {
		testBlackList('showAll');
		document.getElementsByTagName('h4')[0].parentNode.removeChild(document.getElementsByTagName('h4')[0]);
		nzbtable.parentNode.removeAttribute('style');
	}, false);
	h4.innerHTML = 'No NZBs found matching your search. (' + (nzbtable.rows.length - 3 - visiblePosts.length) + ' blacklisted results. Click to display.)';
	h4.style.cursor = 'pointer';
	nzbtable.parentNode.parentNode.insertBefore(h4, nzbtable.parentNode.parentNode.childNodes[2]);
	nzbtable.parentNode.setAttribute('style', 'display: none;');
}

function setHumanized(humanizedMessage) {
	document.getElementById('humanized').setAttribute('style', 'top: 200px; left: ' + (document.body.clientWidth / 3 + 27.5) + 'px; display: block; visibility: visible; opacity: 0.90;');
	document.getElementById('humanizedmessage').removeAttribute('style');
	document.getElementById('humanizedmessage').removeAttribute('opacity');
	document.getElementById('humanizedmessage').textContent = humanizedMessage;
	setTimeout("document.getElementById('humanized').removeAttribute('style')", 2000);
}

function nonSceneUpdate() {
	GM_xmlhttpRequest({
		method: 'GET',
		url: location.href.split('n', 1) + 'nzbs.org/classic/forum.php?action=view&topic=786',
		onload: function (nonScene) {
			if(nonScene.status != 200) {
				setHumanized('Error updating filters.');
				return;
			}
			GM_setValue('nonScene', nonScene.responseText.match(/\!P2P\: ([^<]+)/g).toString().replace(/\!P2P\: /g, '').replace(/\,/g, '|'));
			setHumanized('NZBs(det)TOL P2P filters updated.');
			testBlackList();
		}
	});
}

function blackListValue(searchfield) {
	switch(searchfield.value.substring(0, 7)) {
	case '':
		return;
		break;
	case '!CLEAR ':
		if(searchfield.value.substring(7).match(/\b(blackList|nonScene)\b/)) {
			GM_setValue(searchfield.value.substring(7), '');
			setHumanized(searchfield.value.substring(7) + ' filter cleared.');
			testBlackList();
			searchfield.value = '';
			return;
		} else {
			setHumanized(searchfield.value.substring(7) + ' is not a filter.');
			searchfield.value = '';
			return;
		};
		break;
	default:
		GM_setValue('blackList', (GM_getValue('blackList') ? GM_getValue('blackList') + '|' : '') + searchfield.value);
		setHumanized("'" + searchfield.value + "'" + ' added to blacklist.');
		searchfield.value = '';
		break
	}
}

function switchSearch(searchfield) {
	switch(searchfield.parentNode.lastChild.value) {
	case 'Search':
		searchfield.parentNode.lastChild.setAttribute('value', 'Black!');
		searchfield.parentNode.childNodes[5].setAttribute('style', 'display: none;');
		searchfield.parentNode.childNodes[6].setAttribute('style', 'display: none;');
		searchfield.parentNode.addEventListener('submit', function () {
			if(searchfield.parentNode.lastChild.value == 'Black!') {
				blackListValue(searchfield);
				setTimeout('window.stop();', 0);
				testBlackList();
			}
		}, false);
		break;
	case 'Black!':
		searchfield.parentNode.lastChild.setAttribute('value', 'Search');
		searchfield.parentNode.childNodes[5].removeAttribute('style');
		searchfield.parentNode.childNodes[6].removeAttribute('style');
		break;
	}
}

function insertLinks() {
	var userBox = document.getElementById('user_box'),
		filterUpdate = document.createElement('a');
	filterUpdate.textContent = 'Update P2P filters | ';
	filterUpdate.style.cursor = 'pointer';
	filterUpdate.addEventListener('click', function () {
		nonSceneUpdate();
	}, false);
	userBox.firstChild.insertBefore(filterUpdate, userBox.firstChild.lastChild);
	var searchfield = document.evaluate('/html/body/div/div/div/form/input[2]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
	searchfield.addEventListener('dblclick', function () {
		searchfield.value == '' ? switchSearch(searchfield) : null;
	}, false);
	var pagelinks = document.getElementById('nzbtable').rows[0].childNodes[1],
		showAll = document.createElement('input');
	showAll.setAttribute('class', 'submit');
	showAll.setAttribute('type', 'button');
	showAll.setAttribute('value', 'Show All');
	showAll.addEventListener('click', function () {
		testBlackList('showAll');
	}, false);
	pagelinks.insertBefore(showAll, pagelinks.firstChild);
}

function fixChrome() {
	GM_setValue = function (name, value) {
		localStorage.setItem(name, value);
	}
	GM_getValue = function (name) {
		return localStorage.getItem(name);
	}
	//author: GIJoe // http://userscripts.org/topics/41177#posts-198077
	GM_xmlhttpRequest = function (obj) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function () {
			if(obj.onreadystatechange) {
				obj.onreadystatechange(request);
			};
			if(request.readyState == 4 && obj.onload) {
				obj.onload(request);
			}
		}
		request.onerror = function () {
			if(obj.onerror) {
				obj.onerror(request);
			}
		}
		try {
			request.open(obj.method, obj.url, true);
		} catch(e) {
			if(obj.onerror) {
				obj.onerror({
					readyState: 4,
					responseHeaders: '',
					responseText: '',
					responseXML: '',
					status: 403,
					statusText: 'Forbidden'
				});
			};
			return;
		}
		if(obj.headers) {
			for(name in obj.headers) {
				request.setRequestHeader(name, obj.headers[name]);
			}
		}
		request.send(obj.data);
		return request;
	}
}
navigator.userAgent.match(/Chrom(e|ium)|Iron/i) ? fixChrome() : null; //because it's stupid.
insertLinks();
testBlackList();