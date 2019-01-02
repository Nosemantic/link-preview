$.each(DefaultOptions,function(i,v){if(!window.localStorage.getItem(v.label))window.localStorage.setItem(v.label,v.value)});

function getPreview(url) {
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://localhost:2019/?url=" + url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				// WARNING! Might be evaluating an evil script!
				resolve(xhr.responseText);
			}
		};
		xhr.send();
	});
}
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
	var previewPromise = getPreview(request.url);
	previewPromise.then(function(ImgData){
		var  r =  {
			istooltip:(window.localStorage.getItem(DefaultOptions.istooltip.label)==='true'),
			time:parseInt(window.localStorage.getItem(DefaultOptions.timeout.label)),
			position:window.localStorage.getItem(DefaultOptions.position.label),
			domaincolor:window.localStorage.getItem(DefaultOptions.domaincolor.label),
			Coords: request.Coords,
			dataUrl: ImgData
		};
		sendResponse(r);
	}).catch(function(err){
		var r =  {
			istooltip:(window.localStorage.getItem(DefaultOptions.istooltip.label)==='true'),
			time:parseInt(window.localStorage.getItem(DefaultOptions.timeout.label)),
			position:window.localStorage.getItem(DefaultOptions.position.label),
			domaincolor:window.localStorage.getItem(DefaultOptions.domaincolor.label),
			Coords: request.Coords,
			dataUrl: err
		};
		sendResponse(r);
	});
	return true;
});