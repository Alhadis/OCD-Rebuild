(function(){
	"use strict";
	
	/*< Helper functions */
		/** Strips any text nodes from the immediate descendants of an element. */
		function pruneTextNodes(e,i){if(!e||!e.childNodes.length)return e;e.normalize();var t=e.lastChild,n=/^\s*$/;if(3===t.nodeType&&(!i||n.test(t.data))){e.removeChild(t);t=e.lastChild;if(!t)return e}while(t=t.previousSibling)if(3===t.nodeType&&(!i||n.test(t.data)))e.removeChild((t=t.nextSibling).previousSibling);return e};
	/*>/


	/*<*/
	var DOC		=	document,
		WIN		=	window,
		BODY	=	DOC.body,
		TRUE	=	true,
		FALSE	=	false,
		OBJ		=	Object,
		
		/** Dictionary */
		TEXT_CONTENT	=	"textContent",
		QUERY			=	"querySelector",
		QUERY_ALL		=	QUERY+"All",
		ADD_LISTENER	=	"addEventListener",
		POINT_EVENT		=	"click",
		RESIZE			=	"resize",
		STRING			=	"string",
		PROTOTYPE		=	"prototype",
		/*>*/


		/** Which property to use when getting/setting an HTMLElement's textual content (thanks for NaN, IE8) */
		TEXT		=	TEXT_CONTENT in BODY ? TEXT_CONTENT : "innerText",






		Rotator		=	function(el, args){

			/** Pointer to the Rotator instance being created. */
			var THIS			=	this,


			/** Internal values for our getter/setter methods. */
				currentSlide	=	NaN,
				autoplay		=	0,
				autoplayTimer;


			OBJ.defineProperties(THIS, {

				/** Index of the currently visible slide. */
				currentSlide:{
					get: function(){ return currentSlide; },
					set: function(i){
						var max	=	THIS.slides.children.length - 1;

							 if(i < 0)		i = THIS.wrap ? max : 0;
						else if(i > max)	i = THIS.wrap ? 0 : max;

						currentSlide	=	i;
						THIS.update();

						/** If autoplaying, clear the last timer (if it was still running) and ready another automatic transition. */
						if(THIS.autoplay){
							clearTimeout(autoplayTimer);
							autoplayTimer = setTimeout(function(){ ++THIS.currentSlide; }, THIS.autoplay);
						}
					}
				},


				/** Number of milliseconds between automated transitions. */
				autoplay: {
					get:	function(){ return autoplay; },
					set:	function(i){

						/** Stay positive */
						if(i < 0) i = 0;

						/** No change? Bail. */
						if(i == autoplay) return;

						clearTimeout(autoplayTimer);
						if(i) autoplayTimer = setTimeout(function(){ ++THIS.currentSlide; }, i);

						autoplay = i;
					}
				}
			});


			/** Start assigning our arguments. */
			for(var i in args) THIS[i]	=	args[i];


			/** Tie a reference to the outer-most container defining our rotator. */
			THIS.el			=	el;

			/** Hook into its descendants. */
			THIS.navPrev	=	 (STRING === typeof THIS.navPrev)	? el[QUERY](THIS.navPrev)	:	THIS.navPrev;
			THIS.navNext	=	 (STRING === typeof THIS.navNext)	? el[QUERY](THIS.navNext)	:	THIS.navNext;
			THIS.slides		=	((STRING === typeof THIS.slides)	? el[QUERY](THIS.slides)	:	THIS.slides) || el;



			/** Good grief, IE8. Get it together. */
			if(!THIS.slides.children)
				OBJ.defineProperty(THIS.slides, "children", {
					get:	function(){
						for(var output = [], i = 0, c = this.childNodes, l = c.length; i < l; ++i)
							if(Node.ELEMENT_NODE === c[i].nodeType)
								output.push(c[i]);
						return output;
					}
				});



			/** Make DOM traversal easier. */
			if(!THIS.keepTextNodes)
				pruneTextNodes(THIS.slides);



			/** Event listeners */
			!THIS.navPrev || THIS.navPrev[ ADD_LISTENER ](POINT_EVENT, function(e){ --THIS.currentSlide; });
			!THIS.navNext || THIS.navNext[ ADD_LISTENER ](POINT_EVENT, function(e){ ++THIS.currentSlide; });

			DOC[ADD_LISTENER]("visibilitychange", function(){
				var state	=	this.visibilityState;

				if(THIS.autoplay){
					/** Window's losing focus/visibility: don't bother running transitions. */
					if(state === "unloaded" || state === "hidden")
						clearTimeout(autoplayTimer);

					/** Otherwise, we're gaining visibility, let's go. */
					else THIS.currentSlide	=	currentSlide;
				}
			});

			THIS.currentSlide	=	0;
			return THIS;
		};



		/** Define the Rotator class's default properties/methods. */
		Rotator[PROTOTYPE]	=	{

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
				var	THIS		=	this,
					index		=	THIS.currentSlide,
					children	=	THIS.slides.children,
					length		=	children.length,
					rClass		=	new RegExp("(^|\\s)" + THIS.activeClass + "(?:\\s|$)", "g"),
					c, i		=	0;

				for(; i < length; ++i){
					c				=	children[i];

					/** IE9 and below don't support DOMTokenList/.classList. We'll do things the trickier way. */
					c.className		=	c.className.replace(rClass, "$1");

					if(i === index)
						c.className +=	THIS.activeClass;
				}
			}
		};



	
		/*< Extensions */
			
			/** Augment array-like DOM interfaces with useful array-like methods */
			NodeList[PROTOTYPE].forEach				=
			HTMLCollection[PROTOTYPE].forEach		=	Array[PROTOTYPE].forEach;
			if(WIN.StaticNodeList)
				StaticNodeList[PROTOTYPE].forEach	=	Array[PROTOTYPE].forEach;

			/** Stops a function from firing too quickly. */
			Function.prototype.debounce=function(t,e){var i=this,t=t<0?0:t,n,o,u,a,f=function(){var r=Date.now()-n;if(r>=t){if(!e)i.apply(o,u);if(a)clearTimeout(a);a=o=u=null}else a=setTimeout(f,t-r)};return function(){o=this,u=arguments;if(!t)return i.apply(o,u);n=Date.now();if(!a){if(e)i.apply(o,u);a=setTimeout(f,t)}}};
		/*>*/



		/** IE8 has "issues" with using Object.defineProperty on native JavaScript objects. So we'll use a hack instead. */
		if(WIN.IS_IE8)
			Rotator	=	IE8PropertyPunch(Rotator);



		DOC[QUERY_ALL](".rotator").forEach(function(o){
			new Rotator(o, {
				autoplay:	4000
			});
		});




	/** Accordions: adjust heights */
	var accordions	=	DOC[QUERY_ALL](".fold"),
		navMenu		=	DOC[QUERY]("#topnav > .fold");
	if(accordions.length){

		/** Update each accordion's maxHeight to fit their (possibly resized) content. */
		WIN[ADD_LISTENER](RESIZE, (new function(){

			accordions.forEach(function(o){
				var height	=	o.scrollHeight;

				/** For the nav menu, ensure it doesn't extend further than the viewport's height: it'll make some items unreachable! */
				if(navMenu === o)
					height	=	Math.min(height, WIN.innerHeight - o.offsetTop);

				o.style.maxHeight	=	(height || 0) + "px";
			});

			return this.constructor;
		}).debounce(100));
	}

	/** Automatically close the mobile nav-menu when a link's been tapped. */
	var navMenuControl	=	DOC[QUERY]("#topnav_0");
	navMenu[ QUERY_ALL ]("a").forEach(function(o){

		o[ ADD_LISTENER ](POINT_EVENT, function(){
			navMenuControl.checked	=	true;
		}, false);
	});


	/** Export */
	WIN.Rotator	=	Rotator;
}());
