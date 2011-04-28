$(document).ready(function()
{
	thisPage.init();

	$(window).load(function()
	{
		thisPage.run();
	});
});


var thisPage =
{
	'init': function()
	{
		
	},
	'run': function()
	{
		getDataList('tutor', 'session_list', {}, this.loadSessionList);
	},
	'shiftSelectedImageQuestionRight': function(image_question_dom)
	{
		var next_image_question_dom = image_question_dom.next();
		if (! util.isEmpty(image_question_dom[0]))
			{thisPage.imageTurn(image_question_dom, 'left');}
		if (! util.isEmpty(next_image_question_dom[0]))
			{thisPage.imageTurn(next_image_question_dom, 'straight');}

		return next_image_question_dom;
	},
	'markAnswer': function()
	{
		var answer = $(this).data('answer');
		var type = $(this).data('type');
		var image_question_dom = $(this).parent('.' + type + '_controls').parent('.image_question');

		var question_info = image_question_dom.data('info');

		image_question_dom.children('.' + type).children('span').html(answer);

		question_info[type] = answer;
		//question_info.answer_timestamp = Math.round(new Date().getTime() / 1000);

		image_question_dom.data('info', question_info);


		var session_info = $("#image_question_container").data("session_info");
		var info =
		{
			'id': question_info.answer_id,
			'TutoringSession_id': session_info.id,
			'Lesson_ImageQuestions_id': question_info.Lesson_ImageQuestions_id
		};
		info[type] = answer;
		postData('tutor', 'update_answer', info, function(response_text)
		{
			question_info.answer_id = parseInt(response_text);
			image_question_dom.data('info', question_info);

			if (! util.isEmpty(question_info.text_answer) && ! util.isEmpty(question_info.image_answer))
			{
				var selected_image_question_info = thisPage.shiftSelectedImageQuestionRight(image_question_dom).data('info');
				if (! util.isEmpty(selected_image_question_info))
					{
					var session_info = $("#image_question_container").data("session_info");
					var post_info =
					{
						'id': session_info.id,
						'display_content': 'image',
						'Lesson_ImageQuestions_id': selected_image_question_info.Lesson_ImageQuestions_id
					};
					postData('tutor', 'update_tutoring_session', post_info, function(response_text){});
					}
			}

		});
	},
	'imageTurn': function(image_question_dom, direction)
	{
		image_question_dom = $(image_question_dom);
		var image_question_info = image_question_dom.data('info');
		var degree = 0;
		var css =
			{
				"-moz-transform": '',
				"-webkit-transform": '',
				"-o-transform": '',
				"-ms-transform": '',
				"transform": '',
				"z-index": 100
			};
		var image_obj = image_question_dom.children(".image").children("img");
		image_obj = $(image_obj);

		var new_image = new Image();
		new_image.src = image_obj.attr('src');

		var nat_height = new_image.height;
		var nat_width = new_image.width;
		var cur_height = image_obj.css('height').replace('px', '');
		var scale = cur_height/ nat_height;

		var width = nat_width * scale;
		var margin = '';

		var duration = '0.3';

		switch (direction)
		{
			case 'right':
				width = '75px';
				margin = '30px 0 0 -10px';
				degree = 20;
				css =
				{
					"-moz-transform": "skewY(" + degree + "deg)",
					"-webkit-transform": "skewY(" + degree + "deg)",
					"-o-transform": "skewY(" + degree + "deg)",
					"-ms-transform": "skewY(" + degree + "deg)",
					"transform": "skewY(" + degree + "deg)",
					"-webkit-transition": "-webkit-transform " + duration + "s ease-in-out",
					"z-index": 100 - parseInt(image_question_info.order_index)
				}
				image_question_dom.children('.text').hide();
				image_question_dom.children('.image_answer_controls').hide();
				image_question_dom.children('.text_answer_controls').hide();
				image_question_dom.children('.image_label').hide();
				image_question_dom.addClass('unselected_display_right');
				image_question_dom.removeClass('unselected_display_left');
				image_question_dom.removeClass('selected_display');
				break;

			case 'left':
				width = '75px';
				margin = '30px 0 0 -10px';
				degree = -20;
				css =
				{
					"-moz-transform": "skewY(" + degree + "deg)",
					"-webkit-transform": "skewY(" + degree + "deg)",
					"-o-transform": "skewY(" + degree + "deg)",
					"-ms-transform": "skewY(" + degree + "deg)",
					"transform": "skewY(" + degree + "deg)",
					"-webkit-transition": "-webkit-transform " + duration + "s ease-in-out",
					"z-index": 50 + parseInt(image_question_info.order_index)
				}
				image_question_dom.children('.text').hide();
				image_question_dom.children('.image_answer_controls').hide();
				image_question_dom.children('.text_answer_controls').hide();
				image_question_dom.children('.image_label').hide();
				image_question_dom.addClass('unselected_display_left');
				image_question_dom.removeClass('unselected_display_right');
				image_question_dom.removeClass('selected_display');
				break;

			case 'straight':
			default:
				margin = '20px 20px 0px 10px';
				image_question_dom.children('.text').show();
				image_question_dom.children('.image_answer_controls').show();
				image_question_dom.children('.text_answer_controls').show();
				image_question_dom.children('.image_label').show();
				image_question_dom.addClass('selected_display');
				image_question_dom.removeClass('unselected_display_left');
				image_question_dom.removeClass('unselected_display_right');
				break;
		}

		if (direction == 'left' || direction =='right')
		{
			image_obj.animate({"width": width},	300, function(){});
			image_question_dom.animate({"margin": margin},	300, function()
				{image_question_dom.css(css);});
		}
		else
		{
			image_question_dom.css(css);
			image_question_dom.animate({"margin": margin},	300, function(){});
			image_obj.animate({"width": width},	300, function()	{});
		}
	},
	'selectImageQuestion': function()
	{
		if ($(this).hasClass('selected_display'))
			{return false;}

		var selected_image_question_info = $(this).data('info');
		$.each($(".image_question"), function()
		{
			var info = $(this).data('info');
			if (parseInt(selected_image_question_info.order_index) > parseInt(info.order_index))
			{// left side
				if (! $(this).hasClass('unselected_display_left'))
				{
					thisPage.imageTurn(this, 'left');
				}
			}
			else if (parseInt(selected_image_question_info.order_index) < parseInt(info.order_index))
			{// right side
				if (! $(this).hasClass('unselected_display_right'))
				{
					thisPage.imageTurn(this, 'right');
				}
			}
			else
			{// selected
				thisPage.imageTurn(this, 'straight');
				var session_info = $("#image_question_container").data("session_info");
				var post_info =
				{
					'id': session_info.id,
					'display_content': 'image',
					'Lesson_ImageQuestions_id': selected_image_question_info.Lesson_ImageQuestions_id
				};
				postData('tutor', 'update_tutoring_session', post_info, function(response_text){});
			}
		});
	},
	'setDisplayContent': function()
	{
		var session_info = $("#image_question_container").data("session_info");
		var display_content = $(this).data('display_content');
		var post_info =
		{
			'id': session_info.id,
			'display_content': display_content
		};
		postData('tutor', 'update_tutoring_session', post_info, function(response_text)
		{
		});
	},
	'generateImageQuestion': function(info)
	{
		var image_answer = util.isEmpty(info.image_answer) ? '?' : info.image_answer ;
		var text_answer = util.isEmpty(info.text_answer) ? '?' : info.text_answer ;
		var image_question_css_classes = (info.Lesson_ImageQuestions_id == info.session_Lesson_ImageQuestions_id) ? 'selected_image_question' : '';
		var button_css_classes = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only';
		var html = '<div class="image_question ' + image_question_css_classes + '">'
						 +		'<div class="number_display">' + info.order_index +	'</div>'
						 +		'<div class="image_label">'
						 +			'<span class="label">Image:</span>'
						 +			'<span class="show_image"><a href="#">show</a></span>'
						 +		'</div>'
						 +		'<div class="image">'
						 +			'<img src="' + info.icon + '">'
						 +		'</div>'
						 +		'<div class="image_answer">'
						 +			'Image Answer: <span>' + image_answer + '</span>'
						 +		'</div>'
						 +		'<div class="image_answer_controls">'
						 +			'<input type="button" id="image_answer_yes" value="Yes" class="' + button_css_classes + '">'
						 +			'<input type="button" id="image_answer_no" value="No" class="' + button_css_classes + '">'
						 +			'<input type="button" id="image_answer_skip" value="Skip" class="' + button_css_classes + '">'
						 +		'</div>'
						 +		'<div class="text">'
						 +			'<span class="label">Text:</span>'
						 +			'<span class="value">' + info.text + '</span>'
						 +			'<span class="show_text"><a href="#">show</a></span>'
						 +		'</div>'
						 +		'<div class="text_answer">'
						 +			'Text Answer: <span>' + text_answer + '</span>'
						 +		'</div>'
						 +		'<div class="text_answer_controls">'
						 +			'<input type="button" id="text_answer_yes" value="Yes" class="' + button_css_classes + '">'
						 +			'<input type="button" id="text_answer_no" value="No" class="' + button_css_classes + '">'
						 +			'<input type="button" id="text_answer_skip" value="Skip" class="' + button_css_classes + '">'
						 +		'</div>'
						 + '</div>';
		var html_dom = $(html);
		html_dom.data('info', info);

		var show_image_a = html_dom.children('.image_label').children('.show_image').children('a');
		show_image_a.data('display_content', 'image');
		show_image_a.click(this.setDisplayContent);

		var show_text_a = html_dom.children('.text').children('.show_text').children('a');
		show_text_a.data('display_content', 'text');
		show_text_a.click(this.setDisplayContent);


		var image_answer_dom = {'yes':null, 'no':null, 'skip':null};

		image_answer_dom.yes = html_dom.children(".image_answer_controls").children('#image_answer_yes');
		image_answer_dom.yes.data('answer','yes');
		image_answer_dom.yes.data('type','image_answer');
		image_answer_dom.yes.click(thisPage.markAnswer);

		image_answer_dom.no = html_dom.children(".image_answer_controls").children('#image_answer_no');
		image_answer_dom.no.data('answer','no');
		image_answer_dom.no.data('type','image_answer');
		image_answer_dom.no.click(thisPage.markAnswer);

		image_answer_dom.skip = html_dom.children(".image_answer_controls").children('#image_answer_skip');
		image_answer_dom.skip.data('answer','skip');
		image_answer_dom.skip.data('type','image_answer');
		image_answer_dom.skip.click(thisPage.markAnswer);

		var text_answer_dom = {'yes':null, 'no':null, 'skip':null};

		text_answer_dom.yes = html_dom.children(".text_answer_controls").children('#text_answer_yes');
		text_answer_dom.yes.data('answer','yes');
		text_answer_dom.yes.data('type','text_answer');
		text_answer_dom.yes.click(thisPage.markAnswer);

		text_answer_dom.no = html_dom.children(".text_answer_controls").children('#text_answer_no');
		text_answer_dom.no.data('answer','no');
		text_answer_dom.no.data('type','text_answer');
		text_answer_dom.no.click(thisPage.markAnswer);

		text_answer_dom.skip = html_dom.children(".text_answer_controls").children('#text_answer_skip');
		text_answer_dom.skip.data('answer','skip');
		text_answer_dom.skip.data('type','text_answer');
		text_answer_dom.skip.click(thisPage.markAnswer);

		html_dom.dblclick(thisPage.selectImageQuestion)
		return html_dom;
	},
	'loadSessionLesson': function()
	{
		var session_info = $(this).data('info');
		var lesson_info = session_info.lesson_info;

		$("#image_question_header h2").html("Lesson: <span>" + lesson_info.name + "</span>");

		$("#image_question_container").html('');
		$("#image_question_container").data('session_info', $.extend(true, {}, session_info));
		$.each(lesson_info.question_info_list, function(index)
		{
			var image_question_info =
			{
				'session_Lesson_ImageQuestions_id': session_info.Lesson_ImageQuestions_id
			};
			image_question_info = $.extend(true, image_question_info, this);
			var html_dom = thisPage.generateImageQuestion(image_question_info);
			$("#image_question_container").append(html_dom);
		});

		var image_question_list = $(".image_question");

		$.each(image_question_list, function(index)
		{
			var image_question_info = $(this).data('info');
			$(this).children().show();
			$(this).removeClass();
			$(this).addClass("image_question");
			$(this).css("z-index", "");
			var display_image = $(this).children(".image").children("img");
			display_image.css("width", "");

			if (parseInt(image_question_info.order_index) == parseInt(session_info.order_index))
			{
				$(this).addClass('selected_display');
			}
			else
			{
				if (parseInt(image_question_info.order_index) < parseInt(session_info.order_index))
					{$(this).addClass('unselected_display_left');}
				else
				{
					$(this).addClass('unselected_display_right');
					$(this).css('z-index', 100 - index);
				}
				display_image.css('width', '50px');
				$(this).children(".text, .lesson_answer, .image_answer_controls, .text_answer_controls, .image_label").hide();

			}
		});

		var ui_button_dom_list = $(".ui-button");

		ui_button_dom_list.disableTextSelect();
		ui_button_dom_list.hoverIntent(
		function()
		{
			$(this).addClass('ui-state-hover');
		},
		function()
		{
			$(this).removeClass('ui-state-hover');
			$(this).removeClass('ui-state-active');
		});
		ui_button_dom_list.mousedown(function()
		{
			$(this).addClass('ui-state-active');
		});
	},
	'loadSessionList': function(response_text)
	{
		var session_list = eval(response_text);

		$.each(session_list, function(index)
		{
			var html =	'<div class="session_icon thumbnail_container">'
								+		'<center>'
								+			'<div class="pupil_icon thumbnail_container data_point">'
								+				'<div class="icon image">'
								+					'<img id="icon" src="' + this.pupil_info.icon + '" alt="?">'
								+				'</div>'
								+				'<div id="pupil_name">' + this.pupil_info.first_name + '</div>'
								+			'</div>'
								+			'<div class="tutor_icon thumbnail_container data_point">'
								+				'<div class="icon image">'
								+					'<img id="icon" src="' + this.tutor_info.icon + '" alt="?">'
								+				'</div>'
								+				'<div id="tutor_name">' + this.tutor_info.last_name + '</div>'
								+			'</div>'
								+		'</center>'
								+		'<input type="hidden" id="session_id" value="' + this.id + '">'
								+ '</div>';
			var html_dom = $(html);
			html_dom.children('.pupil_icon').data('info', this.pupil_info);
			html_dom.children('.tutor_icon').data('info', this.tutor_info);
			html_dom.children('.lesson_icon').data('info', this.lesson_info);
			html_dom.data("info", this);
			html_dom.disableTextSelect();
			html_dom.dblclick(thisPage.loadSessionLesson);

			$("#image_question_container").append(html_dom);
			/*
			html_dom.tooltip({
					position: "bottom center",
					offset: [-100, 0],
					effect: "fade",
					opacity: 0.9,
					predelay: 500
				});

			html	 = '<div class="tooltip">'
						 +	  '<div class="data_point">'
						 +			'<div class="label">ID:</div>'
						 +			'<div id="session_id" class="text">' + this.id + '</div>'
						 +	  '</div>'
						 +	  '<div class="data_point">'
						 +			'<div class="label">Name:</div>'
						 +			'<div id="session_name" class="text">'
						 +				this.name
						 +			'</div>'
						 +	  '</div>'
						 + '</div>';
			$("#image_question_container").append(html);
			*/
		});

		$("#image_question_header h2").html('Choose Session:');
	}
}
