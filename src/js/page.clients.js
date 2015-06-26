(function(){
	"use strict";
	
	/*<*/
	var	DOC			=	document,
		WIN			=	window,
		QUERY		=	"querySelector",
		/*>*/

		main		=	DOC[ QUERY ]("main"),
		clients		=	DOC[ QUERY ]("#clients-list"),
		clip,

		/** Read the dimensions of the first cell in the clients grid. */
		top			=	clients.offsetTop,
		cell		=	clients.children[0],
		cellSize	=	cell.offsetWidth;


		/** If the scrollHeight of the main element appears to be taller than three rows in height on desktop, something went wrong. */
		if(WIN.innerWidth > 599 && main.scrollHeight > ((cellSize * 3) + top)){

			clip = clients.parentNode.insertBefore(New("div", {
				style:		{height: ((cellSize * 2) + top)+"px"},
				className:	"clipping-mask"
			}), clients);

			clip.appendChild(clients);

			WIN.addEventListener("resize", (new function(e){
				clip.style.height	=	(cell.scrollWidth * 2 + top)+"px"
				return this.constructor;
			}).debounce(500));
		}
}());
