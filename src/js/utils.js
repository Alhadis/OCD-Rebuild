function random(min, max){
	return Math.floor(Math.random() * max - min + 1) + min;
}

function percent(value, outOf, startAt){
	var startAt	=	(startAt == undefined) ? 0 : startAt;
	return ((value-startAt) / (outOf-startAt)) * 100;
}

function percentOf(percentage, outOf, startAt){
	return ((percentage / 100) * (outOf - ((startAt == undefined) ? 0 : startAt)));
}

/** Measures the arctangent between two points (the angle required for one point to face another). */
function angleTo(a, b){
	return (Math.atan2(b[1] - a[1], a[0] - b[0])) * 180 / Math.PI;
}

/** Measures the distance between two points. */
function distance(a, b){
	return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}

/** Converts radians to degrees. */
function radToDeg(value){
	return value * 180 / Math.PI;
}

/** Converts degrees to radians. */
function degToRad(value){
	return value * Math.PI / 180;
}


/** Applies De Casteljau's algorithm to an array of points to ascertain the final midpoint. */
function deCasteljau(points, p){
	var a, b, i, p	=	p || .5,
		midpoints	=	[];

	while(points.length > 1){

		for(i = 0; i < points.length - 1; ++i){
			a	=	points[i];
			b	=	points[i+1];

			midpoints.push([
				a[0] + ((b[0] - a[0]) * p),
				a[1] + ((b[1] - a[1]) * p)
			]);
		}

		points		=	midpoints;
		midpoints	=	[];
	}

	return [points[0], a, b];
}



/**
 * Add leading zeros when necessary.
 *
 * @param {Number} value - The number being formatted.
 * @param {Number} min - The minimum required length of the formatted number.
 */
function zeroise(value, min){
	var val	=	value.toString();
	if(val.length < min)
		val	=	Array(min - val.length + 1).join("0") + val;
	return val;
}




/**
 * Formats a number of bytes for human-readable output.
 * @param {Number} input - Number of bytes.
 * @return {String} A reader-friendly representation of filesize.
 */
function formatBytes(input){
	var bytes = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
	for(val in bytes) if(input >= 1024) input = input / 1024; else break;
	return Math.round(input*100)/100+" "+bytes[val];
}



/**
 * Parses a well-formed URL query string into an associative array.
 * 
 * @param {String} q - If supplied, will be used instead of the current document's own URL.
 * @return {Object} A hash enumerated with key/value pairs found in the parsed string.
 */
function unserialiseQuery(q){
	var q	=	q || document.location.search;
	if(!q) return {};
	q	=	q.replace(/^\?/, "").split(/&/g);
	for(var output = {}, i = 0; i < q.length; ++i){
		if(!i) continue;
		q[i]	=	q[i].split(/=/);
		output[q[i][0]]	=	q[i].slice(1).join("=");
	}
	return output;
}


function resolveProperty(object, path){
	var	path	=	path.replace(/\[(['"])?([^\]]+)\1\]/g, ".$2").split(/\./g),
		prev	=	object, p, i = 0;
	for(; i < path.length; ++i){
		p	=	path[i];
		if(!prev || !(p in prev)) return undefined;
		prev	=	prev[p];
		if(i >= path.length-1)
			return prev;
	}
	return undefined;
}



/**
 * Returns the English ordinal suffix for a number (-st, -nd, -rd, -th)
 *
 * @param {Number} n - A number (preferably an integer) to return the suffix for.
 * @return {String}
 */
function ordinalSuffix(n){
	return [,"st", "nd", "rd"][((n %= 100) > 10 && n < 20) ? 0 : (n % 10)] || "th";
}


/**
 * Returns a number of milliseconds from a string representing a time value in CSS.
 *
 * @param {String} t - A CSS time value such as "3200ms" or "4s".
 * @return {Number}
 */
function parseDuration(t){
	if(typeof t != "string")	return t;
	if(/\ds\s*$/i.test(t))		return parseFloat(t) * 1000;
	else						return parseFloat(t);
}



/**
 * Ascertains a browser's support for a CSS property.
 * 
 * @param {String} s - CSS property name, supplied in sentence case (e.g., "Transition")
 * @return {Boolean} TRUE if the browser supports the property in either prefixed or unprefixed form. 
 */
function cssSupport(s){
	if(s.toLowerCase() in document.documentElement.style) return true;
	for(var p = "Webkit Moz Ms O Khtml", p = (p.toLowerCase() + p).split(" "), i = 0; i < p.length; ++i)
		if(p[i]+s in document.documentElement.style) return true;
	return false;
}




/**
 * Returns TRUE if a browser appears to support a given CSS unit.
 *
 * @param {String} unit - Name of a CSS unit (e.g., em, rem, vmax)
 * @return {Boolean}
 */
function cssUnitSupport(unit){
	try{
		var d			=	document.createElement("div");
		d.style.width	=	"32"+unit;
		return d.style.width == "32"+unit;
	}	catch(e){return false;}
}



/**
 * Returns the width of the scrollbars being displayed by this user's OS/device.
 * @return {Number}
 */
function getScrollbarWidth(){
	var el	=	document.createElement("div");
	el.style.width		=	"120px";
	el.style.height		=	"60px";
	el.style.overflow	=	"auto";
	el.innerHTML		=	Array(150).join(" W ");
	(document.body || document.documentElement).appendChild(el);

	var output	=	el.offsetWidth - el.scrollWidth;
	el.parentNode.removeChild(el);
	return output;
}




/**
 * Inclusive string splitting method. Similar to String.prototype.split, except
 * matching results are always included as part of the returned array.
 *
 * @param {RegExp} pattern - The pattern to split the string by.
 * @this {String}
 * @return {Array}
 */
String.prototype.isplit	=	function(pattern){
	var	output			=	[],
		startFrom		=	0,
		match;
	while(match = pattern.exec(this)){
		output.push(this.substring(startFrom, pattern.lastIndex - match[0].length), match[0]);
		startFrom	=	pattern.lastIndex;
	}
	if(startFrom < this.length)
		output.push(this.substring(startFrom, this.length));
	return output;
};



/**
 * Converts a string to title case using crude/basic English capitalisation rules.
 *
 * @this {String}
 * @return {String}
 */
String.prototype.toTitleCase	=	function(){
	var ignore	=	(function(o){
		var h	=	{};
		for(var i in o) h[o[i]] = true;
		return h;
	}("the a an and but or nor of to in on for with to".split(" "))),

	o	=	this.toLowerCase().replace(/\b(\w)(\w+)/gi, function(word, firstLetter, remainder){
		if(ignore[word]) return word;
		return firstLetter.toUpperCase() + remainder;
	});

	return o[0].toUpperCase() + o.slice(1);
};



/**
 * Truncates a block of text to a designated number of characters or words, returning the split result as an array.
 * Default behaviour is to split the text at 25 characters, breaking words if need be.
 *
 * @param {String} Text to operate on.
 * @param {Object} Options for fine-tuning the truncation result. Possible options are:
 *	-	by:			{Enum}		Whether to measure text based on word or character limit (Values: "char" or "word").
 *	-	limit:		{Number}	Maximum number of words/characters permitted before breaking.
 *	-	cutoff:		{Mixed}		Decides where and if to break a word to meet the character limit.
 *	-	I'll finish this off later, probably...
 */
function truncate(string){
	if(arguments.length < 2 || !string) return [string || ""];

	/** Default arguments. */
	var args	=	{
		limit:		25,
		by:			"char",
		cutoff:		"break",
		trim:		true
	};


	/** If passed a number as our second argument, simply set the limit parameter. */
	if("number" === typeof arguments[1])
		args.limit	=	arguments[1];


	/** Otherwise, simply merge our supplied arguments into our defaults. */
	else for(var i in arguments[1])
		args[i]	=	arguments[1][i];
	

	/** Lowercase our string-typed arguments for easier comparison. */
	args.by			=	args.by.toLowerCase();
	args.cutoff		=	"string" === typeof args.cutoff ? args.cutoff.toLowerCase() : +(args.cutoff);



	/** Trim leading/trailing whitespace from our string */
	if(args.trim)
		string	=	string.replace(/(^\s+|\s+$)/g, "");



	/** Truncating based on word count. */
	if("word" === args.by){
		var words	=	string.split(/\s+/);

		if(words.length <= args.limit) return [string];

		return [
			words.slice(0, args.limit).join(" "),
			words.slice(args.limit).join(" ")
		];
	}



	/** Truncating based on character count (default behaviour). */
	else{
		if(string.length < args.limit) return [string];


		/** Break text mid-word; or, the character at the cutoff point is whitespace anyway. */
		if(!args.cutoff || "break" === args.cutoff || /\s/.test(string[args.limit])) return [
			string.substring(0, args.limit),
			string.substring(args.limit)
		];


		/** Some word-preservation behaviour is in order, so let's dig a little closer into the string's contents. */
		var before		=	string.substring(0, args.limit),
			after		=	string.substring(args.limit),
			lastStart	=	before.match(/(\s*)(\S+)$/),
			lastEnd		=	after.match(/^\S+/);



		/** Always include the last word in the untruncated half of the string. */
		if("after" === args.cutoff) return [
			string.substring(0,	before.length + lastEnd[0].length),
			string.substring(	before.length + lastEnd[0].length)
		];


		/** Never include the final word in the untruncated result. */
		else if("before" === args.cutoff) return [
			string.substring(0,	before.length - lastStart[0].length),
			string.substring(	before.length - lastStart[0].length)
		];


		/** Otherwise, use an arbitrary threshold point to determine where the threshold should lie. */
		else{
			var lastWord	=	lastStart[2] + lastEnd;

			/** If supplied a floating point number, interpret it as a percentage of the affected word's length. */
			if(args.cutoff > 0 && args.cutoff < 1)
				args.cutoff	=	Math.round(lastWord.length * args.cutoff);


			/** Word's cutoff length is still less than the desired truncation limit. Include the word in the first half. */
			if(args.limit > (before.length - lastStart[2].length)+args.cutoff) return [
				string.substring(0,	before.length - lastStart[0].length),
				string.substring(	before.length - lastStart[0].length)
			];

			/** Otherwise, do the opposite of what the above comment just said. */
			return [
				string.substring(0,	before.length + lastEnd[0].length),
				string.substring(	before.length + lastEnd[0].length)
			];
		}
	}

	return [string];
}




/**
 * Executes a callback function on every text node found within an element's descendants.
 * 
 * @param {Element} el - Element to parse the contents of.
 * @param {Function} fn - Callback executed on each text node. Passed two args: the text node itself, and the currentl depth level.
 * @param {Number} depth - Internal use only. Current number of recursion levels.
 * 
 * @return {Element} The HTML element originally passed to the function.
 */
function walkTextNodes(el, fn, depth){
	depth	=	depth || 0;

	var children	=	Array.prototype.slice.call(el.childNodes, 0);
	for(var n, l = children.length, i = 0; i < l; ++i){
		n	=	children[i];
		if(n.nodeType === Node.TEXT_NODE)
			fn.call(this, n, depth);
		else if(n.nodeType === Node.ELEMENT_NODE)
			walkTextNodes(n, fn, depth+1);
	}
	return el;
};


/** Injects <wbr /> elements into any lengthy words found in each text node found within an element's descendants. */
function injectWordBreaks(element, limit){

	walkTextNodes(element, function(node){
		var original	=	node;
		var terminators	=	'.,+*?$|#{}()\\^\\-\\[\\]\\\\\/!%\'"~=<>_:;\\s';
		var splitAt		=	new RegExp("([^" + terminators + "]{" + limit + "})", "g");
		
		/** Collect a list of insertion points. */
		var breakPoints	=	[];
		while(splitAt.exec(node.data))
			breakPoints.push(splitAt.lastIndex);
	
		for(var otherHalf, i = breakPoints.length - 1; i >= 0; --i){
			otherHalf	=	node.splitText(breakPoints[i]);
			node.parentNode.insertBefore(document.createElement("wbr"), otherHalf);
		}
	});
}


/**
 * Checks if the user agent is a particular version of Internet Explorer.
 *
 * @param {String} [version] - The version to check against.
 * @param {String} [operand] - Type of comparison to perform. Use basic JavaScript operators: <, >=, !=, etc.
 * @return {Boolean}
 */
function isIE(version, operand){
	var operands	=	{
		"<":	"lt ",
		"<=":	"lte ",
		">":	"gt ",
		">=":	"gte ",
		"!=":	"!"
	};

	var div			=	document.createElement("div");
	div.innerHTML	=	"<!--[if "+(operands[operand] || "")+"IE "+version+"]><i></i><![endif]-->";
	return div.getElementsByTagName("i").length;
}