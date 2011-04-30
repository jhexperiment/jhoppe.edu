$(document).ready(function()
{
	thisPage.init();

	$(window).load(function()
	{
		$("#image_tab").click();
	});
});

var baseDialog =
{
	'_name': null,
	'init': function()
  {
		var this_dialog_dom = $("#" + this._name + "_dialog");

		this_dialog_dom.data("obj_ref", this);
		this_dialog_dom.dialog(
		{
			'autoOpen': false,
			'modal': true,
			'width': "auto",
			'resizable': false,
			'closeOnEscape': true
		});
  },
	'accordionInit': function(type)
	{
		var dialog_name = this._name;
		var options =
		{
			active: 1,
			autoHeight: true,
			clearStyle: true,
			changestart: function ()
			{
				$(".validation_error_box").remove();
			}
		};
		$("#" + dialog_name + "_dialog #accordion").accordion(options);

		var icon_dblclick = function(dialog_name, event)
		{
			return function(event)
			{
				$("#" + dialog_name + "_dialog #accordion").accordion("activate", 0);
			}
		};

		$("#" + dialog_name + "_dialog .dialog_icon").dblclick(icon_dblclick(dialog_name));
	},
	'loadMiniIconList': function (dialog_name, responseText)
	{
		return function(responseText)
		{

			var image_list = eval(responseText);
			var image_list_count = image_list.length;

			$("#" + dialog_name + "_dialog .icon_list").html('');

			for (var i = 0; i < image_list_count; i++)
			{
				var image_info = image_list[i];
				var title = image_info.id + ' : ' + image_info.name + ' : ' + image_info.url + ' : ' + image_info.path;

				var html = '<div class="mini_icon thumbnail_container">'
								 +		'<input type="hidden" id="image_id" value="' + image_info.id + '">'
								 +		'<div class="image">'
								 +			'<img src="' + image_info.url + image_info.name + '">'
								 +		'</div>'
								 + '</div>';
				var html_dom = $(html);
				html_dom.data("info", image_info);

				var html_dom_dblclick = function()
				{
					var image_info = $(this).data('info');
					$("#" + dialog_name + "_dialog img#icon").attr("src", image_info.url + image_info.name);
					$("#" + dialog_name + "_dialog #Images_id").val(image_info.id);

				};
				html_dom.dblclick(html_dom_dblclick);

				$("#" + dialog_name + "_dialog .icon_list").append(html_dom);
			}
		}
	},
	'close': function(icon_dom)
	{
		return function()
		{
			if (! util.isEmpty(icon_dom))
				{$(this).data("icon").css("background-color", '');}

			$(".validation_error_box").remove();
			$(".pullout_image_list").remove();
		};
	},
	'drag':function (event, ui)
	{
		$(".validation_error_box").remove();
		$(".pullout_image_list").remove();
	},
  'open': function(icon_dom, type)
  {
		$(".validation_error_box").remove();
		$(".pullout_image_list").remove();

		if (! util.isEmpty(icon_dom))
			{$("#" + this._name + "_dialog").data("icon", icon_dom);}
		else
			{$("#" + this._name + "_dialog .dialog_icon img").attr('src', '');}

		var dialog_buttons = $.extend(true, {}, this._buttons);
		delete dialog_buttons._name;

		var options =
		{
			'buttons': dialog_buttons,
			'close': this.close(icon_dom),
			'drag': this.drag
		};

		switch (type)
		{
			case 'add':
				var add_options =
				{
					'title': "Add " + this._title,
					'open' : function(event, ui)
					{
						var name = $(this).data('obj_ref')._name;
						var dialog_css_id = "#" + name + "_dialog";
						$(dialog_css_id + ' #id').parent(".text").parent(".data_point").hide();
						$(dialog_css_id + ' #id').html('');
						$(dialog_css_id + ' input').val('');
						$(dialog_css_id + " ." + name + "_icon .image img").attr('src', '');
						$(dialog_css_id + ' .data_point').css('background-color','');
						$('.ui-dialog-buttonset button:contains(add)').show();
						$('.ui-dialog-buttonset button:contains(save)').hide();
						$('.ui-dialog-buttonset button:contains(delete)').hide();
					}
				};
				$.extend(true, options, add_options);
				break;

			case 'edit':
				var edit_options =
				{
					'title': "Edit " + this._title,
					'open': function(event, ui)
					{
						var name = $(this).data('obj_ref')._name;
						var dialog_css_id = "#" + name + "_dialog";

						var info = $(this).data("icon").data("info");
						var input_list = $("#" + name + "_dialog .input, #" + name + "_dialog .text");

						$(this).data("icon").css("background-color", '#FCE877');
						$.each(info, function(key, value)
						{
							var element = $(dialog_css_id + ' #' + key);
							if (element.parent().hasClass('text'))
								{element.html(value);}
							else if (element.parent().hasClass('input'))
								{element.val(value);}
							else if (element.parent().hasClass('icon'))
								{element.attr('src',value);}
						});

					$(dialog_css_id + ' #id').parent(".text").parent(".data_point").show();
					$(dialog_css_id + ' .data_point').css('background-color','');
					$('.ui-dialog-buttonset button:contains(add)').hide();
					$('.ui-dialog-buttonset button:contains(save)').show();
					$('.ui-dialog-buttonset button:contains(delete)').show();
					$('.ui-dialog-buttonset button:contains(delete)').addClass('dialog_delete_button');
					}
				};
				$.extend(true, options, edit_options);
				break;

			default:
				break;
		}

		$("#" + this._name + "_dialog").dialog(options);
		$("#" + this._name + "_dialog").dialog('open');

		$(".tooltip").hide();

		this.accordionInit(type);

		getDataList('config', 'image_list', {}, this.loadMiniIconList(this._name));
  },
  'add': function(info)
  {
		var add_callback = function(tab_name, info, response_text)
		{
			return function(response_text)
			{
				var id = parseInt(response_text);
				info['id'] = id;
				thisPage.tabs[tab_name].append(info);
			};
		};

		var post_info = $.extend(true, {}, info);
		
		delete post_info['icon'];
		delete post_info['id'];
		if (this.validate())
		{
			postData('config', 'add_' + this._name, post_info, add_callback(this._name, info));
			return true;
		}
		else
		{
			$("#" + this._name + "_dialog #accordion").accordion("activate", 1);
			setTimeout('$("#' + this._name + '_dialog").data("obj_ref")._validation_show_errors()', 750);
			//this._validation_show_errors();
			return false;
		}		
  },
  'save': function(info)
  {
		delete info['icon'];

		var update_callback = function(dialog_name)
		{
			return function()
			{
				$("." + dialog_name + "_icon #" + dialog_name + "_id").each(function()
				{
					if ($(this).val() == info.id)
					{
						var full_name = info.first_name + ' ' + info.middle_name + ' ' + info.last_name;
						$(this).parent('.' + dialog_name + '_icon').children('.' + dialog_name + '_name').html(info.first_name);
						$(this).parent().next().children().children('#' + dialog_name + '_id').html(info.id);
						$(this).parent().next().children().children('#' + dialog_name + '_name').html(full_name);
					}
				});
			};
		}
		
		if (this.validate())
		{
			postData('config', 'update_' + this._name, info, update_callback(this._name));
			return true;
		}
		else
		{
			$("#" + this._name + "_dialog #accordion").accordion("activate", 1);
			return false;
		}
	
  },
  'remove': function(info)
  {
		$("#" + this._name + "_panel ." + this._name + "_icon input[value='" + info['id'] + "']").parent().remove();
		postData('config', 'delete_' + this._name, info, function(response_text){});
  },
	'info': function()
	{
		var info = {};
		var dialog_css_id = '#' + this._name + '_dialog';
		$(dialog_css_id + ' .text, ' + dialog_css_id + ' .input, ' + dialog_css_id + ' .dialog_icon .image').each(function()
		{
			var key = $(this).children().attr('id');
			var element = $(this).children();
			switch (key)
			{
				case 'id':
					info[key] = element.html();
					break;

				case 'icon':
					info[key] = element.attr('src');
					break;

				default:
					info[key] = element.val();
					break;
			}
		});
		return info;
	},
	'_validation_error_list': null,
	'_validation_show_errors': function ()
	{
		$.each(this._validation_error_list, function(key, element)
		{
			var msg = util.isEmpty(element.val()) ? 'Required.' : element.attr('not_valid_msg');

			var data_point_dom = $('body');
			var html = '<div class="validation_error_box">'
							 +		msg
							 + '</div>';
			var html_dom = $(html);
			var left = element.offset().left + element.width() + parseInt(element.css('margin-left'));
					//left += parseInt(element.css('padding-left')) + parseInt(element.css('padding-right'));
			html_dom.css('left', left);
			html_dom.css('top', element.offset().top);
			html_dom.css('z-index', 2000);

			data_point_dom.append(html_dom);
			html_dom.hide();
			html_dom.animate(
				{
					'width': 'toggle'
				},
				500,
				'linear');

		});
	},
	'validate': function()
	{
		$(".validation_error_box").remove();

		var required_list = {};
		$('#' + this._name + '_dialog .text, #' + this._name + '_dialog .input').each(function()
		{
			var key = $(this).children().attr('id');
			var element = $(this).children();

			if (element.attr("required") == 'required')
				{required_list[key] = element;}
		});

		this._validation_error_list = {};

		var dialog_obj_ref = this;
		$.each(required_list, function(key, element)
		{
			element.parent().parent().css('background-color', '');
			
			var value;

			switch (key)
			{
				case 'Images_id':
					value = element.val();
					element = $('#' + dialog_obj_ref._name + '_dialog	.dialog_icon');
					break;

				default:
					value = element.val();
					break;
			}

			if (util.isEmpty(value))
				{dialog_obj_ref._validation_error_list[key] = element;}
			else
			{
				var pattern = element.attr("pattern");
				if (! util.isEmpty(pattern))
				{
					var regex = new RegExp(pattern);
					if (! regex.test(value))
						{dialog_obj_ref._validation_error_list[key] = element;}
				}
			}
		});

		if (util.isEmpty(this._validation_error_list))
		{
			return true;
		}
		else
		{
			this._validation_show_errors();
			return false;
		}
	}
};

var baseDialogButtons =
{
	'_name': null,
	'delete': function()
	{
		$(this).data("obj_ref").remove($(this).data("obj_ref").info());
		$(this).dialog('close');
	},
	'close': function()
	{
		$(this).dialog('close');
	},
	'add': function()
	{
		var info = $(this).data("obj_ref").info();
		if ($(this).data("obj_ref").add(info))
		{
			$(this).dialog('close');
		}
	},
	'save': function()
	{
		var info = $(this).data("obj_ref").info();
		if ($(this).data("obj_ref").save($.extend({}, info)))
		{
			$(this).data("icon").data("info", info);
			$(this).data("icon").children(".image").children("img").attr("src", info.icon);
			$(this).dialog('close');
		}
	}
};

var baseTab =
{
	'_name': null,
	'init': function()
  {
		this.dialog.init(this);

		var add_click_callback = function(tab_name)
		{
			return function(event)
			{
				event.preventDefault();
				thisPage.tabs[tab_name].dialog.open(null, 'add');
			};
		};

		$("#" + this._name + "_panel #add_" + this._name).click(add_click_callback(this._name));

		$("#" + this._name + "_tab").click(this._click(this._name));
		$(".tab").disableTextSelect();
  },
	'_click': function(tab_name)
	{
		return function()
		{
			tabList.setSelectedTab($(this));
			$(".panel").hide();
			$("#" + tab_name + "_panel .panel_data").html('Loading...');
			$("#" + tab_name + "_panel").show();

			getDataList('config', tab_name + '_list', {}, function(responseText)
			{
				var item_list = eval(responseText);
				var item_list_count = item_list.length;
				$("#" + tab_name + "_panel .panel_data").html('');

				for (var i = 0; i < item_list_count; i++)
					{tabList[tab_name].append(item_list[i]);}

				$("#" + tab_name + "_panel .panel_data").show();

				
			});
		}
	},
  'append': function(info)
	{
	  var html = '<div class="' + this._name + '_icon thumbnail_container">'
						 +		'<input type="hidden" id="' + this._name + '_id" value="' + info.id + '">'
					   +		'<div class="image">'
					   +			'<img src="' + info.icon + '">'
					   +		'</div>'
					   +		'<div class="' + this._name + '_name">' + info.first_name + '</div>'
					   + '</div>';
	  var html_dom = $(html);
	  html_dom.data("info", info);
		html_dom.data("parent_dialog", this.dialog);

		html_dom.dblclick(function()
		{
			$(this).data("parent_dialog").open($(this), 'edit');
		});

	  $("#" + this._name + "_panel .panel_data").append(html_dom);

	  html	 = '<div class="tooltip">'
					 +	  '<div class="data_point">'
					 +			'<div class="label">ID:</div>'
					 +			'<div id="' + this._name + '_id" class="text">' + info.id + '</div>'
					 +	  '</div>'
					 +	  '<div class="data_point">'
					 +			'<div class="label">Name:</div>'
					 +			'<div id="' + this._name + '_name" class="text">'
					 +				info.first_name + ' ' + info.middle_name + ' ' + info.last_name
					 +			'</div>'
					 +	  '</div>'
					 + '</div>';
	  $("#" + this._name + "_panel .panel_data").append(html);
	}
};


// Pupil
var pupilDialogButtons =
{
	'_name': 'pupil'
};

var pupilDialog =
{
	'_title': 'Pupil',
	'_name': 'pupil',
	'_buttons': $.extend(true, {}, baseDialogButtons, pupilDialogButtons)
};

var pupilTab =
{
	'_name': 'pupil',
	'dialog': $.extend(true, {}, baseDialog, pupilDialog)
};


// Tutor
var tutorDialogButtons =
{
	'_name': 'tutor'
};

var tutorDialog =
{
  '_title': 'Tutor',
	'_name': 'tutor',
	'_buttons': $.extend(true, {}, baseDialogButtons, tutorDialogButtons)
};

var tutorTab =
{
	'_name': 'tutor',
	'dialog': $.extend(true, {}, baseDialog, tutorDialog)
};

// Image
var imageDialogButtons =
{
	'_name': 'image'
};


var imageDialog =
{
  '_title': 'Image',
	'_name': 'image',
	'_buttons': $.extend(true, {}, baseDialogButtons, imageDialogButtons),
	'accordionInit': function(type)
	{
		
	},
	'open': function(icon_dom, type)
  {
		$(".validation_error_box").remove();
		$(".tooltip").hide();

		if (! util.isEmpty(icon_dom))
			{$("#" + this._name + "_dialog").data("icon", icon_dom);}
		else
			{$("#" + this._name + "_dialog .dialog_icon img").attr('src', '');}

		var dialog_buttons = $.extend(true, {}, this._buttons);
		delete dialog_buttons._name;

		var options =
		{
			'buttons': dialog_buttons,
			'close': function()
			{
				if (! util.isEmpty(icon_dom))
					{$(this).data("icon").css("background-color", '');}
				$(".validation_error_box").remove();
			},
			'drag': function (event, ui)
			{
				$(".validation_error_box").remove();
			}
		};

		switch (type)
		{
			case 'add':
				var add_options =
				{
					'title': "Add " + this._title,
					'open' : function(event, ui)
					{
						var name = $(this).data('obj_ref')._name;
						var dialog_css_id = "#" + name + "_dialog";
						$(dialog_css_id + ' #id').parent(".text").parent(".data_point").hide();
						$(dialog_css_id + ' #id').html('');
						$(dialog_css_id + ' input').val('');
						$(dialog_css_id + " ." + name + "_icon .image img").attr('src', '');
						$(dialog_css_id + ' .data_point').css('background-color','');
						
						$(dialog_css_id + ' #action').val('image_upload');

						$(dialog_css_id + " div#upload").show();
						$(dialog_css_id + " div#image_form_container").show();

						$(dialog_css_id + " div#attributes").hide();
						$(dialog_css_id + " .dialog_icon").hide();
						$(dialog_css_id + " #require_note").hide();

						$('.ui-dialog-buttonset button:contains(add)').show();
						$('.ui-dialog-buttonset button:contains(save)').hide();
						$('.ui-dialog-buttonset button:contains(delete)').hide();
					}
				};
				$.extend(true, options, add_options);
				break;

			case 'edit':
				var edit_options =
				{
					'title': "Edit " + this._title,
					'open': function(event, ui)
					{
						var name = $(this).data('obj_ref')._name;
						var dialog_css_id = "#" + name + "_dialog";

						var info = $(this).data("icon").data("info");
						var input_list = $("#" + name + "_dialog .input, #" + name + "_dialog .text");

						$(this).data("icon").css("background-color", '#FCE877');
						$.each(info, function(key, value)
						{
							var element = $(dialog_css_id + ' #' + key);
							if (element.parent().hasClass('text'))
								{element.html(value);}
							else if (element.parent().hasClass('input'))
								{element.val(value);}
							else if (element.parent().hasClass('icon'))
								{element.attr('src',value);}

/*
							switch (key)
							{
							case 'id':
								$(dialog_css_id + ' #' + key).html(value);
								break;

							case 'icon':
								$(dialog_css_id + ' #icon').attr('src', value);
								break;

							default:
								input_list.children('#' + key).val(value);
								break;
							}
*/
					});

					$(dialog_css_id + ' #id').parent(".text").parent(".data_point").show();
					$(dialog_css_id + ' .data_point').css('background-color','');

					$(dialog_css_id + " div#upload").hide();
					$(dialog_css_id + " div#attributes").show();
					$(dialog_css_id + " .dialog_icon").show();
					$(dialog_css_id + " #require_note").show();


					$('.ui-dialog-buttonset button:contains(add)').hide();
					$('.ui-dialog-buttonset button:contains(save)').show();
					$('.ui-dialog-buttonset button:contains(delete)').show();
					$('.ui-dialog-buttonset button:contains(delete)').addClass('dialog_delete_button');
					}
				};
				$.extend(true, options, edit_options);
				break;

			default:
				break;
		}

		$("#" + this._name + "_dialog").dialog(options);
		$("#" + this._name + "_dialog").dialog('open');
  },
	'validate': function()
	{
		$(".validation_error_box").remove();

		var required_list = {};
		$('#' + this._name + '_dialog .text, #' + this._name + '_dialog .input').each(function()
		{
			var key = $(this).children().attr('id');
			var element = $(this).children();

			if (element.attr("required") == 'required')
				{required_list[key] = element;}
		});

		this._validation_error_list = {};

		var dialog_obj_ref = this;
		$.each(required_list, function(key, element)
		{
			element.parent().parent().css('background-color', '');

			var value;

			switch (key)
			{
				case 'Images_id':
					value = element.val();
					element = $('#' + dialog_obj_ref._name + '_dialog	.dialog_icon');
					break;

				default:
					value = element.val();
					break;
			}

			if (element.css('display') != 'none')
			{
				if (util.isEmpty(value))
					{dialog_obj_ref._validation_error_list[key] = element;}
				else
				{
					var pattern = element.attr("pattern");
					if (! util.isEmpty(pattern))
					{
						var regex = new RegExp(pattern);
						if (! regex.test(value))
							{dialog_obj_ref._validation_error_list[key] = element;}
					}
				}
			}

			
		});

		if (util.isEmpty(this._validation_error_list))
		{
			return true;
		}
		else
		{
			this._validation_show_errors();
			return false;
		}
	},
	'add': function(info)
  {
		var add_callback = function(tab_name, info, response_text)
		{
			return function(response_text)
			{
				var id = parseInt(response_text);
				info['id'] = id;
				thisPage.tabs[tab_name].append(info);
			};
		};

		var post_info = $.extend(true, {}, info);

		delete post_info['icon'];
		delete post_info['id'];
		if (this.validate())
		{
			$("#image_form").submit();
			return true;
		}
		else
		{
			this._validation_show_errors();
			return false;
		}
  },

};

var imageTab =
{
	'_name': 'image',
	'init': function()
  {
		this.dialog.init(this);

		var add_click_callback = function(tab_name)
		{
			return function(event)
			{
				event.preventDefault();
				thisPage.tabs[tab_name].dialog.open(null, 'add');
			};
		};

		$("#" + this._name + "_panel #add_" + this._name).click(add_click_callback(this._name));

		$("#" + this._name + "_tab").click(this._click(this._name));

		var this_tab_obj_ref = this;
		
		$("#image_form").submit(function()
		{
			$(this).ajaxSubmit(
			{
				success: function(responseText, statusText, xhr, $form)
				{
					var ret_value = responseText.replace("<head>",'').replace("</head>",'').replace("<body>",'').replace("</body>",'');
					if (ret_value == "0")
					{
						//$("#image_upload_return").html('There was an error uploading the file.');
					}
					else
					{
						var image_info = eval('(' + ret_value + ')');
						$("#image_form_container").hide();
						//$("#image_upload_return").html("File " + image_info.name + " successfully uploaded.");
						this_tab_obj_ref.append(image_info);
					}
				}
			});
			return false;
		});
  },
	'dialog': $.extend(true, {}, baseDialog, imageDialog),
	'append': function(info)
	{
	  var html = '<div class="' + this._name + '_icon thumbnail_container">'
						 +		'<input type="hidden" id="' + this._name + '_id" value="' + info.id + '">'
					   +		'<div class="image">'
					   +			'<img src="' + info.icon + '">'
					   +		'</div>'
					   +		'<div class="' + this._name + '_name">' + info.name + '</div>'
					   + '</div>';
	  var html_dom = $(html);
	  html_dom.data("info", info);
		html_dom.data("parent_dialog", this.dialog);

		html_dom.dblclick(function()
		{
			$(this).data("parent_dialog").open($(this), 'edit');
		});

	  $("#" + this._name + "_panel .panel_data").append(html_dom);

	  html	 = '<div class="tooltip">'
					 +	  '<div class="data_point">'
					 +			'<div class="label">ID:</div>'
					 +			'<div id="' + this._name + '_id" class="text">' + info.id + '</div>'
					 +	  '</div>'
					 +	  '<div class="data_point">'
					 +			'<div class="label">Name:</div>'
					 +			'<div id="' + this._name + '_name" class="text">'
					 +				info.name
					 +			'</div>'
					 +	  '</div>'
					 + '</div>';
	  $("#" + this._name + "_panel .panel_data").append(html);
	}
  
};


// Lesson
var lessonDialogButtons =
{
	'_name': 'lesson'
};

var lessonDialog =
{
  '_title': 'Lesson',
	'_name': 'lesson',
	'_buttons': $.extend(true, {}, baseDialogButtons, lessonDialogButtons),
	'newQuestionClickEvent': function(this_dialog_obj_ref)
	{
		var tmp = this_dialog_obj_ref;

		return function(event)
		{
			event.preventDefault();
			$(".validation_error_box").remove();
			$(".pullout_image_list").remove();

			
			$("#" + this_dialog_obj_ref._name + "_dialog .selected_question").removeClass('selected_question');
			$("#" + this_dialog_obj_ref._name + "_dialog .dialog_icon img").attr('src', '');

			var question_count = $("#" + this_dialog_obj_ref._name + "_dialog #question_list .question").length;
			if ($("#" + this_dialog_obj_ref._name + "_dialog #question_info").css('display') == 'none')
			{
				this_dialog_obj_ref.showQuestionInfo();
			}
			question_count += 1;

			
			var info =
			{
				'Images_id': '',
				'text': 'new question',
				'order_index': question_count
			};
			
			this_dialog_obj_ref.loadQuestion(info, true);
			
			$("#" + this_dialog_obj_ref._name + "_dialog #question_info #text").val(info.text);
			
		}
	},
	'showQuestionInfo': function()
	{
		$("#" + this._name + "_dialog #question_info").animate(
		{
			'width': 'toggle'
		},
		500
		);
	},
	'questionClickEvent': function()
	{
		$(".validation_error_box").remove();
		$(".pullout_image_list").remove();


		var info = $(this).data('info');
		var this_dialog_obj_ref = $(this).data('this_dialog_obj_ref');

		
		$("#" + this_dialog_obj_ref._name + "_dialog .selected_question").removeClass('selected_question');

		$(this).addClass('selected_question');

		$("#" + this_dialog_obj_ref._name + "_dialog #question_info #text").val(info.text);
		var img_src = (util.isEmpty(info.icon)) ? '' : info.icon;
		$("#" + this_dialog_obj_ref._name + "_dialog .dialog_icon img").attr('src', img_src);

		if ($("#" + this_dialog_obj_ref._name + "_dialog #question_info").css('display') == 'none')
		{
			this_dialog_obj_ref.showQuestionInfo();
		}


	},
	'loadQuestion': function(info, selected_question)
	{
		var order_index = info.order_index;
		var bg_color = (order_index % 2 == 0) ? 'bg1' : 'bg2';
		var selected_question_class = (selected_question) ? 'selected_question' : '';
		var html = '<div class="question ' + selected_question_class + ' ' + bg_color + '">'
						 +		'<input type="hidden" id="order_index" name="order_index" value="' + order_index + '">'
						 +		'<div id="order_number">'
						 +			order_index + '.'
						 +		'</div>'
						 +		'<div id="text">'
						 +			info.text
						 +		'</div>'
						 + '</div>';

		var html_dom = $(html);

		html_dom.click(this.questionClickEvent);

		html_dom.data('info', info);
		html_dom.data('this_dialog_obj_ref', this);
		html_dom.disableTextSelect();

		$("#" + this._name + "_dialog #question_list").append(html_dom);
	},
  'init': function()
  {
		var this_dialog_dom = $("#" + this._name + "_dialog");

		this_dialog_dom.data("obj_ref", this);
		this_dialog_dom.dialog(
		{
			'autoOpen': false,
			'modal': true,
			'width': "auto",
			'resizable': false,
			'closeOnEscape': true
		});

		$("#" + this._name + "_dialog .dialog_icon").data('this_dialog_obj_ref', this);
		$("#" + this._name + "_dialog .dialog_icon").dblclick(function()
		{
			var this_dialog_obj_ref = $(this).data('this_dialog_obj_ref');
			getDataList('config', 'image_list', {}, this_dialog_obj_ref.loadMiniIconList(this));

		});

		var text_change_event = function(this_dialog_obj_ref)
		{
			return function()
			{
				var info = $("#" + this_dialog_obj_ref._name + "_dialog .selected_question").data('info');
				info.text = $(this).val();
				$("#" + this_dialog_obj_ref._name + "_dialog .selected_question #text").html($(this).val());
				$("#" + this_dialog_obj_ref._name + "_dialog .selected_question").data('info', info);
			}
		}

		var question_update_event = function()
		{
			var question_list_dom = $(this);
			$.each(question_list_dom.children('.question'), function(index)
			{
				var order_index = index + 1;
				var question_dom = $(this);
				var info = question_dom.data('info');
				
				info['order_index'] = order_index;

				question_dom.children('#order_number').html(order_index + '.')
				question_dom.data('info', info);
				question_dom.removeClass('bg1');
				question_dom.removeClass('bg2');
				var class_name = (order_index % 2 == 0) ? 'bg1' : 'bg2';
				question_dom.addClass(class_name);
			});
		}

		$("#" + this._name + "_dialog #question_list").sortable(
		{
			//'helper': 'original',
			'items': 'div.question',
			'containment': 'parent',
			'revert': true,
			'update': question_update_event
		});
		$("#" + this._name + "_dialog #question_list .question").disableSelection();

		$("#" + this._name + "_dialog #question_info #text").keyup(text_change_event(this));
		$("#" + this._name + "_dialog #question_info #text").focus(function()
		{
			$(".validation_error_box").remove();
			$(".pullout_image_list").remove();
		});

		$("#" + this._name + "_dialog #new_question").click(this.newQuestionClickEvent(this));
		$("#" + this._name + "_dialog #new_question").disableTextSelect();
		$("#" + this._name + "_dialog .dialog_icon").disableTextSelect();
  },
	'loadMiniIconList': function (dialog_icon_dom, responseText)
	{
		var this_dialog_obj_ref = this;
		
		return function(responseText)
		{

			var image_list = eval(responseText);
			var image_list_count = image_list.length;

			$('.pullout_image_list').remove();

			var body_dom = $('body');
			var html = '<div class="pullout_image_list">'
							 +		'<div class="header">'
							 +			'<div class="label">Choose Image:</div>'
							 +				'<a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button">'
							 +					'<span class="ui-icon ui-icon-closethick">close</span>'
							 +				'</a>'
							 +		'</div><br>'
							 +		'<div class="content"></div><br>'
							 + '</div>';
			var pullout_image_list_dom = $(html);
			var left = $(dialog_icon_dom).offset().left + $(dialog_icon_dom).width()
							+ parseInt($(dialog_icon_dom).css('margin-left'));
					//left += parseInt(element.css('padding-left')) + parseInt(element.css('padding-right'));
			pullout_image_list_dom.css('left', left);
			pullout_image_list_dom.css('top', $(dialog_icon_dom).offset().top);
			pullout_image_list_dom.css('z-index', 2000);

			pullout_image_list_dom.children('.header').children('a').click(function()
			{
				$(this).parent().parent().hide();
			});

			
			for (var i = 0; i < image_list_count; i++)
			{
				var image_info = image_list[i];
			
				html = '<div class="mini_icon thumbnail_container">'
						 +		'<input type="hidden" id="image_id" value="' + image_info.id + '">'
						 +		'<div class="image">'
						 +			'<img src="' + image_info.url + image_info.name + '">'
						 +		'</div>'
						 + '</div>';
				var mini_icon_dom = $(html);
				mini_icon_dom.data("info", image_info);
				mini_icon_dom.data("this_dialog_obj_ref", this_dialog_obj_ref);


				var html_dom_dblclick = function()
				{
					var image_info = $(this).data('info');
					var this_dialog_obj_ref = $(this).data('this_dialog_obj_ref');
					$("#" + this_dialog_obj_ref._name + "_dialog img#icon").attr("src", image_info.url + image_info.name);
					$("#" + this_dialog_obj_ref._name + "_dialog #Images_id").val(image_info.id);

					var info = $("#" + this_dialog_obj_ref._name + "_dialog .selected_question").data('info');
					info.icon = image_info.url + image_info.name;
					info.Images_id = image_info.id;
					$("#" + this_dialog_obj_ref._name + "_dialog .selected_question").data('info', info);

					$(".pullout_image_list .header a").click();
				};
				mini_icon_dom.dblclick(html_dom_dblclick);

				pullout_image_list_dom.children('.content').append(mini_icon_dom);
			}

			body_dom.append(pullout_image_list_dom);
			pullout_image_list_dom.hide();
			pullout_image_list_dom.animate(
			{
				'width': 'toggle'
			},
			500,
			'linear');

		}
	},
	'open': function(icon_dom, type)
  {
		var this_dialog_obj_ref = this;

		$("#" + this_dialog_obj_ref._name + "_dialog #question_list").html('');
		$("#" + this._name + "_dialog #question_info").hide();
		$(".validation_error_box").remove();
		$(".pullout_image_list").remove();

		if (! util.isEmpty(icon_dom))
			{$("#" + this._name + "_dialog").data("icon", icon_dom);}
		else
			{$("#" + this._name + "_dialog .dialog_icon img").attr('src', '');}

		var dialog_buttons = $.extend(true, {}, this._buttons);
		delete dialog_buttons._name;

		var options =
		{
			'buttons': dialog_buttons,
			'close': this.close(icon_dom),
			'drag': this.drag
		};

		switch (type)
		{
			case 'add':
				var add_options =
				{
					'title': "Add " + this._title,
					'open' : function(event, ui)
					{
						var name = $(this).data('obj_ref')._name;
						var dialog_css_id = "#" + name + "_dialog";
						$(dialog_css_id + ' #id').parent(".text").parent(".data_point").hide();
						$(dialog_css_id + ' #id').html('');
						$(dialog_css_id + ' input').val('');
						$(dialog_css_id + " ." + name + "_icon .image img").attr('src', '');
						$(dialog_css_id + ' .data_point').css('background-color','');
						$(dialog_css_id + ' #lesson_name').val('');
						$('.ui-dialog-buttonset button:contains(add)').show();
						$('.ui-dialog-buttonset button:contains(save)').hide();
						$('.ui-dialog-buttonset button:contains(delete)').hide();
					}
				};
				$.extend(true, options, add_options);
				break;

			case 'edit':
				var edit_options =
				{
					'title': "Edit " + this._title,
					'open': function(event, ui)
					{
						var name = $(this).data('obj_ref')._name;
						var dialog_css_id = "#" + name + "_dialog";

						var info = $(this).data("icon").data("info");
						
						$("#" + name + "_dialog #lesson_name").val(info.lesson_name);

						$(dialog_css_id + " #lesson_id").val(info.id);

						$.each(info.question_info_list, function(index)
						{
							var question_info = $(this)[0];
							thisPage.tabs[name].dialog.loadQuestion(question_info);
						});
						
						
						$('.ui-dialog-buttonset button:contains(add)').hide();
						$('.ui-dialog-buttonset button:contains(save)').show();
						$('.ui-dialog-buttonset button:contains(delete)').show();
						$('.ui-dialog-buttonset button:contains(delete)').addClass('dialog_delete_button');
					}
				};
				$.extend(true, options, edit_options);
				break;

			default:
				break;
		}

		$("#" + this._name + "_dialog").dialog(options);
		$("#" + this._name + "_dialog").dialog('open');

		$(".tooltip").hide();

		this.accordionInit(type);

		//getDataList('config', 'image_list', {}, this.loadMiniIconList(this._name));
  },
	'add': function(info)
  {
		var add_callback = function(tab_name, info, response_text)
		{
			return function(response_text)
			{
				var id = parseInt(response_text);
				info['id'] = id;
				thisPage.tabs[tab_name].append(info);
			};
		};

		var post_info = $.extend(true, {}, info);

		if (this.validate())
		{
			postData('config', 'add_' + this._name, post_info, add_callback(this._name, info));
			return true;
		}
		else
		{
			$("#" + this._name + "_dialog #accordion").accordion("activate", 1);
			setTimeout('$("#' + this._name + '_dialog").data("obj_ref")._validation_show_errors()', 750);
			return false;
		}
  },
	'remove': function(info)
  {
		$("#" + this._name + "_panel ." + this._name + "_icon input[value='" + info['id'] + "']").parent().remove();
		postData('config', 'delete_' + this._name, info, function(response_text){});
  },
	'save': function(info)
  {
		if (this.validate())
		{
			postData('config', 'update_' + this._name, info, function(){});
			var icon_dom = $("#" + this._name + "_dialog").data("icon");
			icon_dom.children('.image_list').html('');

			icon_dom.children('.lesson_name').children('#lesson_name').html(info.lesson_name);
			thisPage.tabs[this._name].loadMiniIcons(info.question_info_list, icon_dom);

			return true;
		}
		else
		{
			return false;
		}

  },
  'info': function()
	{
		var info = {};
		var dialog_css_id = '#' + this._name + '_dialog';

		info['lesson_name'] = $(dialog_css_id + " #lesson_name").val();

		var question_info_list = {};
		$(dialog_css_id + ' .question').each(function(index)
		{
			var question_info = $(this).data('info');
			question_info_list[index] = question_info;
		});

		info['id'] = $(dialog_css_id + " #lesson_id").val();

		info['question_info_list'] = question_info_list;
		return info;
	},
	'validate': function()
	{
		$(".validation_error_box").remove();
		var this_dialog_css_id = '#' + this._name + '_dialog';
		var required_list = {};
		$(this_dialog_css_id + ' .input').each(function()
		{
			var key = $(this).children().attr('id');
			var element = $(this).children();

			if (element.attr("required") == 'required')
				{required_list[key] = element;}
		});

		if ($(this_dialog_css_id + ' #question_list').children().length === 0)
		{
			//required_list['question_list'] = $(this_dialog_css_id + ' #new_question');
			required_list['question_list'] = $(this_dialog_css_id + ' #question_list');
		}

		$(this_dialog_css_id + ' .question').each(function(index)
		{
			required_list['question_' + index] = this;
		});

		this._validation_error_list = {};

		var dialog_obj_ref = this;
		$.each(required_list, function(key, element)
		{
			
			if (key == 'lesson_name')
			{
				var value = element.val();
				if (util.isEmpty(value))
					{dialog_obj_ref._validation_error_list[key] = element;}
				else
				{
					var pattern = element.attr("pattern");
					if (! util.isEmpty(pattern))
					{
						var regex = new RegExp(pattern);
						if (! regex.test(value))
							{dialog_obj_ref._validation_error_list[key] = element;}
					}
				}
			}
			else if (key == 'question_list')
			{
				dialog_obj_ref._validation_error_list[key] = element;
			}
			else if (util.isEmpty($(element).data('info').Images_id))
			{
				dialog_obj_ref._validation_error_list[key] = $(this_dialog_css_id + ' .dialog_icon');
				$(element).click();
				return false;
			}
		});

		if (util.isEmpty(this._validation_error_list))
		{
			return true;
		}
		else
		{
			this._validation_show_errors();
			return false;
		}
	}
};

var lessonTab =
{
	'_name': 'lesson',
	'dialog': $.extend(true, {}, baseDialog, lessonDialog),
	'loadMiniIcons': function(question_info_list, icon_dom)
	{
		$.each(question_info_list, function(index)
		{
			var element = $(this)[0];
			var order_index = parseInt(index) + 1;
			var html = '<div class="mini_icon">'
							 +		'<div class="image">'
							 +			'<img src="' + element.icon + '"><br>'
							 +		'<center>' + order_index + '.</center>'
							 +		'</div>'
							 +	'</div>';

			icon_dom.children('.image_list').append(html);
		});
	},
	'append': function(info)
	{
	  var html = '<div class="' + this._name + '_icon thumbnail_container">'
						 +		'<div class="' + this._name + '_name">'
						 +			'<span class="label">Lesson:</span><span id="lesson_name">' + info.lesson_name + '</span>'
						 +		'</div>'
					   +		'<input type="hidden" id="' + this._name + '_id" value="' + info.id + '">'
					   +		'<div class="image_list">'
					   +		'</div>'
					   + '</div>';
	  var icon_dom = $(html);
	  icon_dom.data("info", info);
		icon_dom.data("parent_dialog", this.dialog);

		this.loadMiniIcons(info.question_info_list, icon_dom);
		
		icon_dom.dblclick(function()
		{
			$(this).data("parent_dialog").open($(this), 'edit');
		});

	  $("#" + this._name + "_panel .panel_data").append(icon_dom);

	  html	 = '<div class="tooltip">'
					 +	  '<div class="data_point">'
					 +			'<div class="label">ID:</div>'
					 +			'<div id="' + this._name + '_id" class="text">' + info.id + '</div>'
					 +	  '</div>'
					 +	  '<div class="data_point">'
					 +			'<div class="label">Name:</div>'
					 +			'<div id="' + this._name + '_name" class="text">'
					 +				info.first_name + ' ' + info.middle_name + ' ' + info.last_name
					 +			'</div>'
					 +	  '</div>'
					 + '</div>';
	  $("#" + this._name + "_panel .panel_data").append(html);
	}
};

// Lesson Plan
var lessonplanDialogButtons =
{
	'_name': 'session'
};

var lessonplanDialog =
{
  '_title': 'Lesson Plan',
	'_name': 'lessonplan',
	'_buttons': $.extend(true, {}, baseDialogButtons, lessonplanDialogButtons),
	'save': function(info)
  {
		delete info['icon'];

		var update_callback = function(dialog_name)
		{
			return function()
			{
				$("." + dialog_name + "_icon #id").each(function()
				{
					if ($(this).val() == info.id)
					{
						$(this).parent('.input').parent('.' + dialog_name + '_icon').children('.name').html(info.name);
					}
				});
			};
		}

		if (this.validate())
		{
			postData('config', 'update_' + this._name, info, update_callback(this._name));
			return true;
		}
		else
		{
			return false;
		}
  }
};

var lessonplanTab =
{
	'_name': 'lessonplan',
	'dialog': $.extend(true, {}, baseDialog, lessonplanDialog),
	'append': function(info)
	{
	  var html = '<div class="' + this._name + '_icon thumbnail_container">'
						 +		'<div class="input">'
						 +			'<input type="hidden" id="id" value="' + info.id + '">'
						 +		'</div>'
					   +		'<div class="image">'
					   +			'<img src="' + info.icon + '">'
					   +		'</div>'
					   +		'<div class="name">' + info.name + '</div>'
					   + '</div>';
	  var html_dom = $(html);
	  html_dom.data("info", info);
		html_dom.data("parent_dialog", this.dialog);

		html_dom.dblclick(function()
		{
			$(this).data("parent_dialog").open($(this), 'edit');
		});

	  $("#" + this._name + "_panel .panel_data").append(html_dom);

	  html	 = '<div class="tooltip">'
					 +	  '<div class="data_point">'
					 +			'<div class="label">ID:</div>'
					 +			'<div id="' + this._name + '_id" class="text">' + info.id + '</div>'
					 +	  '</div>'
					 +	  '<div class="data_point">'
					 +			'<div class="label">Name:</div>'
					 +			'<div id="' + this._name + '_name" class="text">'
					 +				info.name
					 +			'</div>'
					 +	  '</div>'
					 + '</div>';
	  $("#" + this._name + "_panel .panel_data").append(html);
	}
};


// Lesson Plan
var classDialogButtons =
{
	'_name': 'session'
};

var classDialog =
{
  '_title': 'Class',
	'_name': 'class',
	'_buttons': $.extend(true, {}, baseDialogButtons, classDialogButtons),
	'save': function(info)
  {
		delete info['icon'];

		var update_callback = function(dialog_name)
		{
			return function()
			{
				$("." + dialog_name + "_icon #id").each(function()
				{
					if ($(this).val() == info.id)
					{
						$(this).parent('.input').parent('.' + dialog_name + '_icon').children('.name').html(info.name);
					}
				});
			};
		}

		if (this.validate())
		{
			postData('config', 'update_' + this._name, info, update_callback(this._name));
			return true;
		}
		else
		{
			return false;
		}
  }
};

var classTab =
{
	'_name': 'class',
	'dialog': $.extend(true, {}, baseDialog, classDialog),
	'append': function(info)
	{
	  var html = '<div class="' + this._name + '_icon thumbnail_container">'
						 +		'<div class="input">'
						 +			'<input type="hidden" id="id" value="' + info.id + '">'
						 +		'</div>'
					   +		'<div class="image">'
					   +			'<img src="' + info.icon + '">'
					   +		'</div>'
					   +		'<div class="name">' + info.name + '</div>'
					   + '</div>';
	  var html_dom = $(html);
	  html_dom.data("info", info);
		html_dom.data("parent_dialog", this.dialog);

		html_dom.dblclick(function()
		{
			$(this).data("parent_dialog").open($(this), 'edit');
		});

	  $("#" + this._name + "_panel .panel_data").append(html_dom);

	  html	 = '<div class="tooltip">'
					 +	  '<div class="data_point">'
					 +			'<div class="label">ID:</div>'
					 +			'<div id="' + this._name + '_id" class="text">' + info.id + '</div>'
					 +	  '</div>'
					 +	  '<div class="data_point">'
					 +			'<div class="label">Name:</div>'
					 +			'<div id="' + this._name + '_name" class="text">'
					 +				info.name
					 +			'</div>'
					 +	  '</div>'
					 + '</div>';
	  $("#" + this._name + "_panel .panel_data").append(html);
	}
};





// Session
var sessionDialogButtons =
{
	'_name': 'session'
};

var sessionDialog =
{
  '_title': 'Session',
	'_name': 'session',
	'_buttons': $.extend(true, {}, baseDialogButtons, sessionDialogButtons),
	'init': function()
  {
		var this_dialog_css_id = "#" + this._name + "_dialog";
		var this_dialog_dom = $(this_dialog_css_id);

		this_dialog_dom.data("obj_ref", this);
		this_dialog_dom.dialog(
		{
			'autoOpen': false,
			'modal': true,
			'width': "auto",
			'minHeight': 300,
			'minWidth': 500,
			'resizable': false,
			'closeOnEscape': true
		});

		var this_dialog_obj_ref = this;
		$(this_dialog_css_id + " .pupil_icon").disableTextSelect();
		$(this_dialog_css_id + " .pupil_icon").dblclick(function()
		{
			getDataList('config', 'pupil_list', {}, this_dialog_obj_ref.showPupilList(this_dialog_obj_ref));
		});
		$(this_dialog_css_id + " .tutor_icon").disableTextSelect();
		$(this_dialog_css_id + " .tutor_icon").dblclick(function()
		{
			getDataList('config', 'tutor_list', {}, this_dialog_obj_ref.showTutorList(this_dialog_obj_ref));
		});
		$(this_dialog_css_id + " .lesson_icon").disableTextSelect();
		$(this_dialog_css_id + " .lesson_icon").dblclick(function()
		{
			getDataList('config', 'lesson_list', {}, this_dialog_obj_ref.showLessonList(this_dialog_obj_ref));
		});
  },
	'showPupilList': function(this_dialog_obj_ref)
	{
		return function(responseText)
		{
			var pupil_list = eval(responseText);
			var pupil_list_count = pupil_list.length;

			$('.pullout_image_list').remove();

			var dialog_icon_dom = $("#" + this_dialog_obj_ref._name + "_dialog .pupil_icon");

			var body_dom = $('body');
			var html = '<div class="pullout_image_list">'
							 +		'<div class="header">'
							 +			'<div class="label">Choose Pupil:</div>'
							 +				'<a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button">'
							 +					'<span class="ui-icon ui-icon-closethick">close</span>'
							 +				'</a>'
							 +		'</div><br>'
							 +		'<div class="content"></div><br>'
							 + '</div>';
			var pullout_image_list_dom = $(html);
			var left = $(dialog_icon_dom).offset().left - parseInt($(dialog_icon_dom).css('margin-left'));
				
			pullout_image_list_dom.css('left', left);
			pullout_image_list_dom.css('top', $(dialog_icon_dom).offset().top);
			pullout_image_list_dom.css('z-index', 2000);

			pullout_image_list_dom.children('.header').children('a').click(function()
			{
				$(this).parent().parent().hide();
			});


			for (var i = 0; i < pupil_list_count; i++)
			{
				var pupil_info = pupil_list[i];

				html = '<div class="mini_icon thumbnail_container">'
						 +		'<input type="hidden" id="image_id" value="' + pupil_info.id + '">'
						 +		'<div class="image">'
						 +			'<img src="' + pupil_info.icon + '">'
						 +		'</div>'
						 +		'<div class="label">'
						 +			'<div class="name">' + pupil_info.first_name + '</div>'
						 +		'</div>'
						 + '</div>';
				var mini_icon_dom = $(html);
				mini_icon_dom.data("info", pupil_info);
				mini_icon_dom.data("this_dialog_obj_ref", this_dialog_obj_ref);

				var html_dom_click = function()
				{
					$(this).addClass("selected_item");
					var pupil_info = $(this).data('info');
					var this_dialog_obj_ref = $(this).data('this_dialog_obj_ref');
					$("#" + this_dialog_obj_ref._name + "_dialog .pupil_icon #icon").attr("src", pupil_info.icon);
					$("#" + this_dialog_obj_ref._name + "_dialog .pupil_icon #Images_id").val(pupil_info.id);
					$("#" + this_dialog_obj_ref._name + "_dialog .pupil_icon #pupil_name").html(pupil_info.first_name);
					$("#" + this_dialog_obj_ref._name + "_dialog .pupil_icon").data('info', pupil_info);

					$(".pullout_image_list .header a").click();
				};
				mini_icon_dom.click(html_dom_click);

				pullout_image_list_dom.children('.content').append(mini_icon_dom);
			}

			body_dom.append(pullout_image_list_dom);
			pullout_image_list_dom.hide();
			pullout_image_list_dom.animate(
			{
				'width': 'toggle',
				'left': "-=" + pullout_image_list_dom.css('max-width')
			},
			500,
			'linear');
		};
	},
	'showTutorList': function(this_dialog_obj_ref)
	{
		return function(responseText)
		{
			var tutor_list = eval(responseText);
			var tutor_list_count = tutor_list.length;

			$('.pullout_image_list').remove();

			var dialog_icon_dom = $("#" + this_dialog_obj_ref._name + "_dialog .tutor_icon");

			var body_dom = $('body');
			var html = '<div class="pullout_image_list">'
							 +		'<div class="header">'
							 +			'<div class="label">Choose Tutor:</div>'
							 +				'<a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button">'
							 +					'<span class="ui-icon ui-icon-closethick">close</span>'
							 +				'</a>'
							 +		'</div><br>'
							 +		'<div class="content"></div><br>'
							 + '</div>';
			var pullout_image_list_dom = $(html);
			var left = $(dialog_icon_dom).offset().left + $(dialog_icon_dom).width()
							+ parseInt($(dialog_icon_dom).css('margin-left'));
					//left += parseInt(element.css('padding-left')) + parseInt(element.css('padding-right'));
			pullout_image_list_dom.css('left', left);
			pullout_image_list_dom.css('top', $(dialog_icon_dom).offset().top);
			pullout_image_list_dom.css('z-index', 2000);

			pullout_image_list_dom.children('.header').children('a').click(function()
			{
				$(this).parent().parent().hide();
			});


			for (var i = 0; i < tutor_list_count; i++)
			{
				var tutor_info = tutor_list[i];

				html = '<div class="mini_icon thumbnail_container">'
						 +		'<input type="hidden" id="image_id" value="' + tutor_info.id + '">'
						 +		'<div class="image">'
						 +			'<img src="' + tutor_info.icon + '">'
						 +		'</div>'
						 +		'<div class="label">'
						 +			'<div class="name">' + tutor_info.first_name + '</div>'
						 +		'</div>'
						 + '</div>';
				var mini_icon_dom = $(html);
				mini_icon_dom.data("info", tutor_info);
				mini_icon_dom.data("this_dialog_obj_ref", this_dialog_obj_ref);


				var html_dom_click = function()
				{
					$(this).addClass("selected_item");
					var tutor_info = $(this).data('info');
					var this_dialog_obj_ref = $(this).data('this_dialog_obj_ref');
					$("#" + this_dialog_obj_ref._name + "_dialog .tutor_icon #icon").attr("src", tutor_info.icon);
					$("#" + this_dialog_obj_ref._name + "_dialog .tutor_icon #Images_id").val(tutor_info.id);
					$("#" + this_dialog_obj_ref._name + "_dialog .tutor_icon #tutor_name").html(tutor_info.last_name);
					$("#" + this_dialog_obj_ref._name + "_dialog .tutor_icon").data('info', tutor_info);

					$(".pullout_image_list .header a").click();
				};
				mini_icon_dom.click(html_dom_click);

				pullout_image_list_dom.children('.content').append(mini_icon_dom);
			}

			body_dom.append(pullout_image_list_dom);
			pullout_image_list_dom.hide();
			pullout_image_list_dom.animate(
			{
				'width': 'toggle'
			},
			500,
			'linear');
		};
	},
	'showLessonList': function(this_dialog_obj_ref)
	{
		return function(responseText)
		{
			var lesson_list = eval(responseText);
			var lesson_list_count = lesson_list.length;

			$('.pullout_image_list').remove();

			var dialog_icon_dom = $("#" + this_dialog_obj_ref._name + "_dialog .lesson_icon");

			var body_dom = $('body');
			var html = '<div class="pullout_image_list">'
							 +		'<div class="header">'
							 +			'<div class="label">Choose Lesson:</div>'
							 +				'<a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button">'
							 +					'<span class="ui-icon ui-icon-closethick">close</span>'
							 +				'</a>'
							 +		'</div><br>'
							 +		'<div class="content"></div><br>'
							 + '</div>';
			var pullout_image_list_dom = $(html);
			var left = $(dialog_icon_dom).offset().left;
			var top = $(dialog_icon_dom).offset().top + $(dialog_icon_dom).height()
							+ parseInt($(dialog_icon_dom).css('margin-top'))
							+ parseInt($(dialog_icon_dom).css('margin-bottom'));

			pullout_image_list_dom.css('left', left);
			pullout_image_list_dom.css('top', top);
			pullout_image_list_dom.css('z-index', 2000);

			pullout_image_list_dom.children('.header').children('a').click(function()
			{
				$(this).parent().parent().hide();
			});


			for (var i = 0; i < lesson_list_count; i++)
			{
				var lesson_info = lesson_list[i];

				html = '<div class="mini_lesson_icon thumbnail_container">'
						 +		'<input type="hidden" id="image_id" value="' + lesson_info.id + '">'
						 +		'<div class="lesson_name">'
						 +			'<span class="label">Lesson:</span>'
						 +			'<span id="lesson_name">' + lesson_info.lesson_name + '</span>'
						 +		'</div>'
						 +		'<input type="hidden" id="lesson_id" value="">'
						 +		'<div class="image_list"></div>'
						 + '</div><br>';
				var mini_lesson_icon_dom = $(html);
				mini_lesson_icon_dom.data("info", lesson_info);
				mini_lesson_icon_dom.data("this_dialog_obj_ref", this_dialog_obj_ref);

				$.each(lesson_info.question_info_list, function(index)
				{
					var question_info = this;
					html = '<div class="mini_icon thumbnail_container">'
						 +		'<input type="hidden" id="image_id" value="' + question_info.id + '">'
						 +		'<div class="image">'
						 +			'<img src="' + question_info.icon + '">'
						 +		'</div>'
						 +		'<div class="label">'
						 +			'<div class="name">' + question_info.text + '</div>'
						 +		'</div>'
						 + '</div>';
					var mini_icon_dom = $(html);
					mini_icon_dom.data("info", question_info);
					mini_icon_dom.data("this_dialog_obj_ref", this_dialog_obj_ref);
					
					mini_lesson_icon_dom.children('.image_list').append(mini_icon_dom);
				});


				var html_dom_click = function()
				{
					var lesson_info = $(this).data('info');
					var this_dialog_obj_ref = $(this).data('this_dialog_obj_ref');
					var mini_icon_list = $(this).children('.image_list').children('.mini_icon').clone(true);
					$("#" + this_dialog_obj_ref._name + "_dialog .lesson_icon #lesson_name").html(lesson_info.lesson_name);
					$("#" + this_dialog_obj_ref._name + "_dialog .lesson_icon .image_list").html('');
					$("#" + this_dialog_obj_ref._name + "_dialog .lesson_icon .image_list").append(mini_icon_list);
					$("#" + this_dialog_obj_ref._name + "_dialog .lesson_icon").data('info', lesson_info);

					$(".pullout_image_list .header a").click();
				};
				mini_lesson_icon_dom.click(html_dom_click);

				pullout_image_list_dom.children('.content').append(mini_lesson_icon_dom);
			}

			var max_height = $(window).height() - $(dialog_icon_dom).offset().top
										 - $(dialog_icon_dom).height();
			pullout_image_list_dom.css('max-width', '95%');
			pullout_image_list_dom.css('max-height', max_height);
			pullout_image_list_dom.css('left', '0');

			body_dom.append(pullout_image_list_dom);
			pullout_image_list_dom.hide();
			pullout_image_list_dom.animate(
			{
				'height': 'toggle'
			},
			500,
			'linear');
		};
	},
	'info': function()
	{
		var info = {};
		var dialog_css_id = '#' + this._name + '_dialog';
		var session_info = $(dialog_css_id).data('info');
		var pupil_info = $(dialog_css_id + " .pupil_icon").data('info');
		var tutor_info = $(dialog_css_id + " .tutor_icon").data('info');
		var lesson_info = $(dialog_css_id + " .lesson_icon").data('info');

		info['pupil_info'] = pupil_info;
		info['tutor_info'] = tutor_info;
		info['lesson_info'] = lesson_info;
		info['session_info'] = session_info;

		return info;
	},
	'add': function(info)
  {
		info['StatusCodes_id'] = 1;

		var add_callback = function(tab_name, info, response_text)
		{
			return function(response_text)
			{
				var id = parseInt(response_text);
				info['id'] = id;
				thisPage.tabs[tab_name].append(info);
			};
		};

		var post_info = $.extend(true, {}, info);

		if (this.validate())
		{
			postData('config', 'add_' + this._name, post_info, add_callback(this._name, info));
			return true;
		}
		else
		{
			$("#" + this._name + "_dialog #accordion").accordion("activate", 1);
			setTimeout('$("#' + this._name + '_dialog").data("obj_ref")._validation_show_errors()', 750);
			return false;
		}
  },
	'open': function(icon_dom, type)
  {
		$(".validation_error_box").remove();
		$(".pullout_image_list").remove();

		var this_dialog_css_id = "#" + this._name + "_dialog";
		$(this_dialog_css_id + ' .pupil_icon #icon').attr('src', '');
		$(this_dialog_css_id + ' .pupil_icon #pupil_name').html('');
		$(this_dialog_css_id + ' .tutor_icon #icon').attr('src', '');
		$(this_dialog_css_id + ' .tutor_icon #tutor_name').html('');
		$(this_dialog_css_id + ' .lesson_icon .image_list').html('');
		$(this_dialog_css_id + ' .lesson_icon #lesson_name').html('');



		if (! util.isEmpty(icon_dom))
			{$(this_dialog_css_id).data("icon", icon_dom);}
		else
			{$(this_dialog_css_id + " .dialog_icon img").attr('src', '');}

		var dialog_buttons = $.extend(true, {}, this._buttons);
		delete dialog_buttons._name;

		var options =
		{
			'buttons': dialog_buttons,
			'close': this.close(icon_dom),
			'drag': this.drag
		};

		switch (type)
		{
			case 'add':
				var add_options =
				{
					'title': "Add " + this._title,
					'open' : function(event, ui)
					{
						var name = $(this).data('obj_ref')._name;
						var dialog_css_id = "#" + name + "_dialog";
						$('.ui-dialog-buttonset button:contains(add)').show();
						$('.ui-dialog-buttonset button:contains(save)').hide();
						$('.ui-dialog-buttonset button:contains(delete)').hide();
					}
				};
				$.extend(true, options, add_options);
				break;

			case 'edit':
				var edit_options =
				{
					'title': "Edit " + this._title,
					'open': function(event, ui)
					{
						var name = $(this).data('obj_ref')._name;
						var dialog_css_id = "#" + name + "_dialog";

						var session_info = $(this).data("icon").data("info");

						$(dialog_css_id + ' .pupil_icon #icon').attr('src', session_info.pupil_info.icon);
						$(dialog_css_id + ' .tutor_icon #icon').attr('src', session_info.tutor_info.icon);

						$(dialog_css_id + ' .pupil_icon #pupil_name').html(session_info.pupil_info.first_name);
						$(dialog_css_id + ' .tutor_icon #tutor_name').html(session_info.tutor_info.last_name);
						$(dialog_css_id + ' .lesson_icon #lesson_name').html(session_info.lesson_info.lesson_name);

						$(dialog_css_id + ' .pupil_icon').data('info', session_info.pupil_info);
						$(dialog_css_id + ' .tutor_icon').data('info', session_info.tutor_info);
						$(dialog_css_id + ' .lesson_icon').data('info', session_info.lesson_info);

						$(dialog_css_id).data('info', session_info);
						
						var getLessonImages_callback = function(this_dialog_obj_ref)
						{
							return function(response_text)
							{
								var image_list = eval('(' + response_text + ')');
								var image_list_count = image_list.length;


								$.each(image_list.question_info_list, function(index)
								{
									var question_info = this;
									var html = '<div class="mini_icon thumbnail_container">'
													 +		'<input type="hidden" id="image_id" value="' + question_info.id + '">'
													 +		'<div class="image">'
													 +			'<img src="' + question_info.icon + '">'
													 +		'</div>'
													 +		'<div class="label">'
													 +			'<div class="name">' + question_info.text + '</div>'
													 +		'</div>'
													 + '</div>';
									var mini_icon_dom = $(html);
									mini_icon_dom.data("info", question_info);
									mini_icon_dom.data("this_dialog_obj_ref", this_dialog_obj_ref);

									$(dialog_css_id + ' .lesson_icon .image_list').append(mini_icon_dom);
								});

							}
						}
						getData('config', 'lesson', {'id':session_info.lesson_info.id}, getLessonImages_callback($(this).data('obj_ref')));

						$('.ui-dialog-buttonset button:contains(add)').hide();
						$('.ui-dialog-buttonset button:contains(save)').show();
						$('.ui-dialog-buttonset button:contains(delete)').show();
						$('.ui-dialog-buttonset button:contains(delete)').addClass('dialog_delete_button');
					}
				};
				$.extend(true, options, edit_options);
				break;

			default:
				break;
		}

		$("#" + this._name + "_dialog").dialog(options);
		$("#" + this._name + "_dialog").dialog('open');

		$(".tooltip").hide();
  },
	'save': function(info)
  {
		var update_callback = function(dialog_name)
		{
			return function(response_text)
			{
				var this_dialog_css_id = "#" + dialog_name + "_dialog";
				var session_info = $(this_dialog_css_id).data('info');
				var pupil_info = $(this_dialog_css_id + " .pupil_icon").data('info');
				var tutor_info = $(this_dialog_css_id + " .tutor_icon").data('info');
				var lesson_info = $(this_dialog_css_id + " .lesson_icon").data('info');

				var icon_dom = $(this_dialog_css_id).data('icon');

				var pupil_icon_dom = icon_dom.children('center').children('.pupil_icon');
				var tutor_icon_dom = icon_dom.children('center').children('.tutor_icon');

				pupil_icon_dom.children('.icon').children('#icon').attr('src', pupil_info.icon);
				pupil_icon_dom.children('#pupil_name').html(pupil_info.first_name);
				pupil_icon_dom.data('info', pupil_info);

				tutor_icon_dom.children('.icon').children('#icon').attr('src', tutor_info.icon);
				tutor_icon_dom.children('#tutor_name').html(tutor_info.last_name);
				tutor_icon_dom.data('info', tutor_info);

				session_info.pupil_info = pupil_info;
				session_info.tutor_info = tutor_info;
				session_info.lesson_info = lesson_info;

				$(this_dialog_css_id).data('info', session_info);
			};
		}

		if (this.validate())
		{
			postData('config', 'update_' + this._name, info, update_callback(this._name));
			return true;
		}
		else
		{
			return false;
		}

  },
	'remove': function(info)
  {
		var this_dialog_css_id = "#" + this._name + "_dialog";
		$(this_dialog_css_id).data('icon').remove();
		postData('config', 'delete_' + this._name, info, function(response_text){});
  },
	'validate': function()
	{
		$(".validation_error_box").remove();

		this._validation_error_list = {};
		
		var dialog_css_id = '#' + this._name + '_dialog';
		var pupil_info_dom = $(dialog_css_id + " .pupil_icon");
		var tutor_info_dom = $(dialog_css_id + " .tutor_icon");
		var lesson_info_dom = $(dialog_css_id + " .lesson_icon");

		if (util.isEmpty(pupil_info_dom.data('info')))
			{this._validation_error_list['pupil'] = pupil_info_dom;}
		if (util.isEmpty(tutor_info_dom.data('info')))
			{this._validation_error_list['tutor'] = tutor_info_dom;}
		if (util.isEmpty(lesson_info_dom.data('info')))
			{this._validation_error_list['lesson'] = lesson_info_dom;}

		if (util.isEmpty(this._validation_error_list))
		{
			return true;
		}
		else
		{
			this._validation_show_errors();
			return false;
		}
	}
};

var sessionTab =
{
	'_name': 'session',
	'dialog': $.extend(true, {}, baseDialog, sessionDialog),
	'append': function(session_info)
	{
	  var html =	'<div class="' + this._name + '_icon thumbnail_container">'
							+		'<center>'
							+			'<div class="pupil_icon thumbnail_container data_point">'
							+				'<div class="icon image">'
							+					'<img id="icon" src="' + session_info.pupil_info.icon + '" alt="?">'
							+				'</div>'
							+				'<div id="pupil_name">' + session_info.pupil_info.first_name + '</div>'
							+			'</div>'
							+			'<div class="tutor_icon thumbnail_container data_point">'
							+				'<div class="icon image">'
							+					'<img id="icon" src="' + session_info.tutor_info.icon + '" alt="?">'
							+				'</div>'
							+				'<div id="tutor_name">' + session_info.tutor_info.last_name + '</div>'
							+			'</div>'
							+		'</center>'
							+		'<input type="hidden" id="' + this._name + '_id" value="' + session_info.id + '">'
							+ '</div>';
	  var html_dom = $(html);
		html_dom.children('.pupil_icon').data('info', session_info.pupil_info);
		html_dom.children('.tutor_icon').data('info', session_info.tutor_info);
		html_dom.children('.lesson_icon').data('info', session_info.lesson_info);
	  html_dom.data("info", session_info);
		html_dom.data("parent_dialog", this.dialog);

		html_dom.dblclick(function()
		{
			$(this).data("parent_dialog").open($(this), 'edit');
		});

	  $("#" + this._name + "_panel .panel_data").append(html_dom);

	  html	 = '<div class="tooltip">'
					 +	  '<div class="data_point">'
					 +			'<div class="label">ID:</div>'
					 +			'<div id="' + this._name + '_id" class="text">' + session_info.id + '</div>'
					 +	  '</div>'
					 +	  '<div class="data_point">'
					 +			'<div class="label">Name:</div>'
					 +			'<div id="' + this._name + '_name" class="text">'
					 +				session_info.first_name + ' ' + session_info.middle_name + ' ' + session_info.last_name
					 +			'</div>'
					 +	  '</div>'
					 + '</div>';
	  $("#" + this._name + "_panel .panel_data").append(html);
	}
};


/*
 * $("#" + tab_name + "_panel .pupil_icon").tooltip(
				{
					position: "bottom center",
					offset: [-100, 0],
					effect: "fade",
					opacity: 0.9,
					predelay: 500
				});
 *
 *
 */




// Tabs
var tabList =
{
	'pupil': $.extend(true, {}, baseTab, pupilTab),
	'tutor': $.extend(true, {}, baseTab, tutorTab),
	'image': $.extend(true, {}, baseTab, imageTab),
	'lesson': $.extend(true, {}, baseTab, lessonTab),
	'lessonplan': $.extend(true, {}, baseTab, lessonplanTab),
	'class': $.extend(true, {}, baseTab, classTab),
	'session': $.extend(true, {}, baseTab, sessionTab),
	'setSelectedTab': function (selected_tab_dom)
	{
		$(".tab").removeClass('selected_tab');
		selected_tab_dom.addClass('selected_tab');
	}
};

// Page
var thisPage =
{
	tabs: tabList,
	init: function()
	{
		// tab init
		this.tabs.pupil.init();
		this.tabs.tutor.init();
		this.tabs.image.init();
		this.tabs.lesson.init();
		this.tabs.lessonplan.init();
		this.tabs['class'].init();
		this.tabs.session.init();

		// global init
		$("input[type='button']").disableTextSelect();

		$("input[type='button']").hoverIntent
		(
			function() //on hover
			{
				$(this).addClass('ui-state-hover');
			},
			function() //off hover
			{
				$(this).removeClass('ui-state-hover');
				$(this).removeClass('ui-state-active');
			}
		);

		$("input[type='button']").mousedown(function()
		{
			$(this).addClass('ui-state-active');
		});
	}
};

