var Rotator		=	function(el, args){
	for(var i in args)
		this[i]	=	args[i];
		

	/** Tie a reference to the outer-most container defining our rotator. */
	this.el			=	el;

	/** Hook into its descendants. */
	this.navPrev	=	("string" === typeof this.navPrev)	? el.querySelector(this.navPrev)	:	this.navPrev;
	this.navNext	=	("string" === typeof this.navNext)	? el.querySelector(this.navNext)	:	this.navNext;
	this.slides		=	("string" === typeof this.slides)	? el.querySelector(this.slides)		:	this.slides;


	/** Define our getter/setter pairs. */
	var _currentSlide = NaN;
	Object.defineProperty(this, "currentSlide", {
		get:	function(){	return _currentSlide; },
		set:	function(i){
			var max	=	this.slides.children.length - 1;

				 if(i < 0)		i = this.wrap ? max : 0;
			else if(i > max)	i = this.wrap ? 0 : max;

			_currentSlide	=	i;
			this.update();
		}
	});


	/** Good grief, IE8. Get it together. */
	if(!this.slides.children){
		Object.defineProperty(this.slides, "children", {
			get:	function(){
				var output	=	[];
				for(var i = 0; i < this.childNodes.length; ++i)
					if(Node.ELEMENT_NODE === this.childNodes[i].nodeType)
						output.push(this.childNodes[i]);
				return output;
			}
		});
	}


	/** Event listeners */
	var $this	=	this;
	this.navPrev.addEventListener("click", function(e){ --$this.currentSlide; });
	this.navNext.addEventListener("click", function(e){ ++$this.currentSlide; });

	this.currentSlide	=	0;
	return this;
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


/** IE8< polyfill for addEventListener */
(function(){
	var d	=	document.createElement("div");
	if(!d.addEventListener){

		Object.defineProperty(d.constructor.prototype, "addEventListener", {
			value:	function(name, fn){
				this.attachEvent("on" + name, fn);
			}
		});
	}
}());


var rotators	=	document.querySelectorAll(".rotator");


/** IE8 has "issues" with using Object.defineProperty on native JavaScript objects. So we'll use a hack instead. */
if(isIE(8, "<="))
	for(var p, rot, l = rotators.length, i = 0; i < l; ++i){
		rot	=	rotators[i];
		for(p in Rotator.prototype)
			rot[p]	=	Rotator.prototype[p];
		Rotator.call(rot, rot);
	}


else Array.prototype.forEach.call(rotators, function(o){
	new Rotator(o);
});