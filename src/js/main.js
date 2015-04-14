/**
 * Array.forEach
 * 
 * Production steps of ECMA-262, Edition 5, 15.4.4.18
 * @link http://es5.github.io/#x15.4.4.18 - Reference
 */ 
if(!Array.prototype.forEach){

	Array.prototype.forEach = function(callback, thisArg){
		if(typeof callback !== "function")	throw new TypeError(callback + " is not a function");
		if(this == null)					throw new TypeError('"this" is null or undefined.');

		var	kValue,
			k	=	0,
			O	=	Object(this),
			len	=	O.length >>> 0;

		while(k < len){
			if(k in O) callback.call(thisArg, O[k], k, O);
			++k;
		}
	};
}

/** DOMTokenList polyfill for IE8-9 */
window.DOMTokenList||function(){var t="defineProperty"in Object||"__defineGetter__"in Object.prototype||null,e=function(e,n,i,r){Object.defineProperty?Object.defineProperty(e,n,{configurable:!1===t?!0:!!r,get:i}):e.__defineGetter__(n,i)};if(t)try{e({},"support")}catch(n){t=!1}var i=function(t,n){var i,r=[],l={},s=0,o=0,a=function(){if(s>=o)for(;s>o;++o)(function(t){e(this,t,function(){return c.call(this),r[t]},!1)}).call(this,o)},c=function(){var e;if(arguments.length)for(e=0;e<arguments.length;++e)if(/\s/.test(arguments[e])){var o=new SyntaxError('String "'+arguments[e]+'" contains an invalid character');throw o.code=5,o.name="InvalidCharacterError",o}if(i!==t[n]){r=(""+t[n]).replace(/^\s+|\s+$/g,"").split(/\s+/),l={};for(var e=0;e<r.length;++e)l[r[e]]=!0;s=r.length,a.call(this)}};return c.call(this),e(this,"length",function(){return c.call(this),s}),this.toLocaleString=this.toString=function(){return c.call(this),r.join(" ")},this.item=function(t){return c.call(this),r[t]},this.contains=function(t){return c.call(this),!!l[t]},this.add=function(){c.apply(this,arguments);for(var e,i=0;i<arguments.length;++i)e=arguments[i],l[e]||(r.push(e),l[e]=!0);s!==r.length&&(s=r.length>>>0,t[n]=r.join(" "),a.call(this))},this.remove=function(){c.apply(this,arguments);for(var e={},i=0;i<arguments.length;++i)e[arguments[i]]=!0,delete l[arguments[i]];for(var o=[],i=0;i<r.length;++i)e[r[i]]||o.push(r[i]);r=o,s=o.length>>>0,t[n]=r.join(" "),a.call(this)},this.toggle=function(t,e){return c.apply(this,[t]),void 0!==e?e?(this.add(t),!0):(this.remove(t),!1):l[t]?(this.remove(t),!1):(this.add(t),!0)},function(t,e){if(e)for(var n="item contains add remove toggle toString toLocaleString".split(" "),i=0;7>i;++i)e(t,n[i],{enumerable:!1})}(this,Object.defineProperty),this};i.polyfill=!0,window.DOMTokenList=i;var r=function(n,l,s){e(n.prototype,l,function(){var n,o="__defining_"+l+"__";if(this[o])return n;if(this[o]=!0,!1===t){for(var a,c=r.mirror=r.mirror||document.createElement("div"),h=c.childNodes,u=h.length,f=0;u>f;++f)if(h[f].reflectedElement===this){a=h[f];break}a||(a=document.createElement("div"),c.appendChild(a)),n=i.call(a,this,s)}else n=new i(this,s);return e(this,l,function(){return n}),delete this[o],n},!0)};r(Element,"classList","className"),r(HTMLLinkElement,"relList","rel"),r(HTMLAnchorElement,"relList","rel"),r(HTMLAreaElement,"relList","rel")}();


/** DOM Extensions */
NodeList.prototype.forEach				=
HTMLCollection.prototype.forEach		=	Array.prototype.forEach;
if(window.StaticNodeList)
	StaticNodeList.prototype.forEach	=	Array.prototype.forEach;

Date.now				=	Date.now || function(){return +new Date};
String.prototype.trim	=	String.prototype.trim || function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");};


/** Which property to use when getting/setting an HTMLElement's textual content (thanks for NaN, IE8) */
var TEXT		=	"textContent" in document.body ? "textContent" : "innerText";






var Rotator		=	function(el, args){
	
	/** Pointer to the Rotator instance being created. */
	var THIS			=	this,


	/** Internal values for our getter/setter methods. */
		_currentSlide	=	NaN,
		_autoplay		=	0,
		_autoplayTimer;


	/** Index of the currently visible slide. */
	Object.defineProperty(THIS, "currentSlide", {
		get:	function(){	return _currentSlide; },
		set:	function(i){
			var max	=	THIS.slides.children.length - 1;

				 if(i < 0)		i = THIS.wrap ? max : 0;
			else if(i > max)	i = THIS.wrap ? 0 : max;

			_currentSlide	=	i;
			THIS.update();

			/** If autoplaying, clear the last timer (if it was still running) and ready another automatic transition. */
			if(THIS.autoplay){
				clearTimeout(_autoplayTimer);
				_autoplayTimer = setTimeout(function(){ ++THIS.currentSlide; }, THIS.autoplay);
			}
		}
	});


	/** Number of milliseconds between automated transitions. */
	Object.defineProperty(THIS, "autoplay", {
		get:	function(){ return _autoplay; },
		set:	function(i){

			/** Stay positive */
			if(i < 0) i = 0;

			/** No change? Bail. */
			if(i == _autoplay) return;

			clearTimeout(_autoplayTimer);
			if(i) _autoplayTimer = setTimeout(function(){ ++THIS.currentSlide; }, i);

			_autoplay = i;
		}
	});



	/** Start assigning our arguments. */
	for(var i in args) THIS[i]	=	args[i];


	/** Tie a reference to the outer-most container defining our rotator. */
	THIS.el			=	el;

	/** Hook into its descendants. */
	THIS.navPrev	=	("string" === typeof THIS.navPrev)	? el.querySelector(THIS.navPrev)	:	THIS.navPrev;
	THIS.navNext	=	("string" === typeof THIS.navNext)	? el.querySelector(THIS.navNext)	:	THIS.navNext;
	THIS.slides		=	(("string" === typeof THIS.slides)	? el.querySelector(THIS.slides)		:	THIS.slides) || el;



	/** Good grief, IE8. Get it together. */
	if(!THIS.slides.children)
		Object.defineProperty(THIS.slides, "children", {
			get:	function(){
				for(var output = [], i = 0, l = this.childNodes.length; i < l; ++i)
					if(Node.ELEMENT_NODE === this.childNodes[i].nodeType)
						output.push(this.childNodes[i]);
				return output;
			}
		});



	/** Make DOM traversal easier. */
	if(!THIS.keepTextNodes)
		pruneTextNodes(THIS.slides);



	/** Event listeners */
	!THIS.navPrev || THIS.navPrev.addEventListener("click", function(e){ --THIS.currentSlide; });
	!THIS.navNext || THIS.navNext.addEventListener("click", function(e){ ++THIS.currentSlide; });

	document.addEventListener("visibilitychange", function(){
		var state	=	this.visibilityState;
		
		if(THIS.autoplay){
			/** Window's losing focus/visibility: don't bother running transitions. */
			if(state === "unloaded" || state === "hidden")
				clearTimeout(_autoplayTimer);

			/** Otherwise, we're gaining visibility, let's go. */
			else THIS.currentSlide	=	_currentSlide;
		}
	});

	THIS.currentSlide	=	0;
	return THIS;
};


/** Define the Rotator class's default properties/methods. */
(function(a, b){ for(var i in b) a[i] = b[i]; }(Rotator.prototype, {

	/** Default DOM selectors. */
	navPrev:	".n.prev",
	navNext:	".n.next",
	slides:		"ul",


	/** Name of the CSS class applied to denote an active/displayed slide. */
	activeClass:	"active",

	/** Whether to wrap the slides list to the first or last item if setting .currentSlide out of bounds. */
	wrap:	true,


	/** Updates the active slide based on the .currentSlide property. */
	update:	function(){
		var index		=	this.currentSlide,
			children	=	this.slides.children,
			length		=	children.length,
			rClass		=	new RegExp("(^|\\s)" + this.activeClass + "(?:\\s|$)", "g"),
			c, i		=	0;

		for(; i < length; ++i){
			c				=	children[i];

			/** IE9 and below don't support DOMTokenList/.classList. We'll do things the trickier way. */
			c.className		=	c.className.replace(rClass, "$1");
			if(i === index)	c.className +=	this.activeClass;
		}
	}
}));


/** IE8 has "issues" with using Object.defineProperty on native JavaScript objects. So we'll use a hack instead. */
if(window.IS_IE8)
	Rotator	=	IE8PropertyPunch(Rotator);



var rotators	=	document.querySelectorAll(".rotator");
rotators.forEach(function(o){
	new Rotator(o, {
		autoplay:	4000
	});
});




/** Accordions: adjust heights */
var accordions	=	document.querySelectorAll(".fold");
if(accordions.length){

	/** Update each accordion's maxHeight to fit their (possibly resized) content. */
	window.addEventListener("resize", (new function(){

		accordions.forEach(function(o){
			o.style.maxHeight	=	o.scrollHeight + "px";
		});

		return this.constructor;
	}).debounce(100));
}