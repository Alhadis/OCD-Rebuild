(function(){
	"use strict";

	/*<*/
	var	DOC				=	document,
		WIN				=	window,
		FALSE			=	false,

		QUERY			=	"querySelector",
		QUERY_ALL		=	QUERY + "All",
		ADD_LISTENER	=	"addEventListener",
		/*>*/


		clientsList	=	DOC[ QUERY ]("#clients-list"),
		gridNav		=	DOC[ QUERY ]("#grid-nav"),
		gridBack	=	gridNav[ QUERY ](".prev"),
		gridNext	=	gridNav[ QUERY ](".next");

		gridBack[ ADD_LISTENER ]("click", function(e){
			clientsList.scrollLeft	-=	WIN.innerWidth / 3;
			e.preventDefault();
			return FALSE;
		});

		gridNext[ ADD_LISTENER ]("click", function(e){
			clientsList.scrollLeft	+=	WIN.innerWidth / 3;

			e.preventDefault();
			return FALSE;
		});
}());
