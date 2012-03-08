$(document).ready(function() {
	thisPage.init();

	$(window).load(function() {
		
	});
});


var thisPage = {
	'init': function() {
		
		$(".ui-buttonset .ui-button").click(thisPage.buttonsetClick);
		$(".ui-buttonset .ui-button").hoverIntent(
			function() {
				$(this).addClass("ui-state-hover");
			},
			function() {
				$(this).removeClass("ui-state-hover");
			}
		);

		$("#sessionChooser .pulldownButton").click(function() {
			if ("0px" == $(this).parent().css('left')) {
				thisPage.sessionChooserShow($(this).parent().css("margin-left").replace("-",""));
			}
			else {
				thisPage.sessionChooserHide();
			}

		});

		$("#modalBackground").click(function() {
			$("#sessionChooser .pulldownButton").click();
		});

		$("#sessionChooser .sessionItem").click(thisPage.sessionItemClick);

		$("#userMenu").click(function() {
			$(this).children(".menu").show();
		});

	},
	'sessionItemClick': function() {
		$("#sessionChooser .pulldownButton").click();
	},
	'buttonsetClick': function() {
		$(this).parent().children(".ui-button").removeClass("ui-state-active");
		$(this).addClass("ui-state-active");
	},
	'sessionChooserShow': function(marginLeft) {
		$("#modalBackground").show();
		$("#sessionChooser .ui-icon").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-w");
		
		$("#sessionChooser").animate({
			'left': marginLeft
		}, 750, function() {
			
		});
	},
	'sessionChooserHide': function() {
		$("#sessionChooser .ui-icon").removeClass("ui-icon-triangle-1-w").addClass("ui-icon-triangle-1-e");

		$("#sessionChooser").animate({
			'left': '0px'
		}, 750, function() {
			
			$("#modalBackground").hide();
		});
	}
}
