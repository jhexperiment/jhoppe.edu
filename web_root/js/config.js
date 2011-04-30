$(document).ready(function()
{
	thisPage.init();

	$(window).load(function()
	{
		
	});
});


// Page
var thisPage =
{
	init: function()
	{
		// tab init
		
		// global init
		$("input[type='button']").disableTextSelect();

		$("input[type='button']").hoverIntent
		(
			function() //on hover
			{
				//$(this).addClass('ui-state-hover');
			},
			function() //off hover
			{
				//$(this).removeClass('ui-state-hover');
				//$(this).removeClass('ui-state-active');
			}
		);

		$("input[type='button']").mousedown(function()
		{
			//$(this).addClass('ui-state-active');
		});
	}
};

