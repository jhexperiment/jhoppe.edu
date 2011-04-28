



function init()
{
	dialog_init();
	tab_init();

	$("#menu").hide();

	
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


	$("input[name='add_session']").click(function(event)
	{
		event.preventDefault();
		$("#session_dialog").dialog('option', 'title', 'Add Session');
		$("#session_dialog").dialog('open');
	});

	$("input[name='session_save_all']").click(function(event)
	{
		event.preventDefault();
		$("#session_table tr.session_row").each(function()
		{
			var input = $(this).children('td').children("input[type='text']");
			if (input.length > 0)
			{
				var session_id = $(this).children("#id").html();
				var session_info = {'session_id' : session_id};

				input.each(function()
				{
					var field_name = $(this).parent("td").attr("id");
					var new_value = $(this).val();
					session_info[field_name] = new_value;
					$(this).parent("td").html(new_value)
				});

				saveSessionRow(session_info);
			}
		});
	});


	

}

function saveSessionRow(session_info)
{
	session_info['action'] = 'update';
	session_info['type'] = 'session';

	$.ajax(
	{
		type: 'POST',
		url: 'config',
		data: session_info,
		success: function(responseText)
		{
			var tmp = responseText;

		}
	});
}

function dialog_init()
{
	$("#pupil_dialog").dialog(
	{
	  autoOpen: false,
	  modal: true,
	  width: "auto",
	  resizable: false,
	  closeOnEscape: true
	});

	$("#tutor_dialog").dialog(
	{
	  autoOpen: false,
	  modal: true,
	  width: "auto",
	  title: "Edit Tutor",
	  resizable: false,
	  closeOnEscape: true,
	  buttons:
		{
			close: function()
			{
				$(this).dialog('close');
			},
			save: function()
			{
				var tutor_info = {};
				$(this).children().children('.text, .input').each(function(key, value)
				{
					var key = $(this).children().attr('id');
					var element = $(this).children();
					tutor_info[key] = (key == 'id') ? element.html() : element.val();
				});

				postData('config', 'tutor', tutor_info, function()
				{
					 $(".tutor_icon #tutor_id").each(function()
					 {
						 if ($(this).val() == tutor_info.id)
						 {
								$(this).parent('.tutor_icon').children('.tutor_name').html(tutor_info.last_name);
						 }
					 });
					$(this).html();
				});
				$(this).dialog('close');
			}
		}

	});

	$("#image_dialog").dialog(
	{
		autoOpen: false,
		modal: true,
    width: 620,
    title: "Edit Image",
    resizable: false,
    closeOnEscape: true,
    buttons:
		{
			close: function()
			{
				$(this).dialog('close');
			},
			save: function()
			{
				$(this).dialog('close');
			},
			upload: function()
			{
				$("#image_form").submit();
				$(this).dialog('close');
			}
		}

	});

	$("#session_dialog").dialog(
	{
		autoOpen: false,
		modal: true,
    width: 620,
    title: "Edit Session",
    resizable: false,
    closeOnEscape: true,
    buttons:
		{
			close: function()
			{
				$(this).dialog('close');
			},
			save: function()
			{
				$(this).dialog('close');
			}
		}

	});
}

function pupil_tab_init()
{
	$("input[name='add_pupil']").click(function(event)
	{
		event.preventDefault();
		var pupil_dialog = $("#pupil_dialog");
		openPupilDialog(pupil_dialog, 'add');
	});
	
	$("#pupil_tab").click(function()
	{
		$(".tab").removeClass('selected_tab');
		$(this).addClass('selected_tab');
		$(".panel_data").hide();
		$(".panel").hide();
		$("#pupil_panel .panel_data").html('Loading...');
		$("#pupil_panel").show();

		getDataList('config', 'pupil_list', {}, function(responseText)
		{
			var pupil_list = eval(responseText);
			var pupil_list_count = pupil_list.length;
			$("#pupil_panel .panel_data").html('');

			for (var i = 0; i < pupil_list_count; i++)
				{appendPupil(pupil_list[i]);}
			
			$("#pupil_panel .panel_data").show();

			$("#pupil_panel .pupil_icon").tooltip(
			{
			  position: "bottom center",
			  offset: [-100, 20],
			  effect: "fade",
			  opacity: 0.9,
			  predelay: 500
			});
		});
	});
}

function openPupilDialog(pupil_icon_dom, type)
{
  var pupil_dialog = $("#pupil_dialog");

  pupil_dialog.data("pupil_info", pupil_icon_dom.data("pupil_info"));
  pupil_dialog.data("pupil_icon", pupil_icon_dom);

  var options = 
	{

	};
  var dialog_title = '';
  switch (type)
  {
	case 'add':
	  dialog_title = "Add Pupil";
	  $.extend(options,
	  {
		'open' : function(event, ui)
		{
		  $('#pupil_dialog #id').parent(".text").parent(".data_point").hide();
		  $('#pupil_dialog #id').html('');
		  $('#pupil_dialog input').val('');
		  $("#pupil_dialog .pupil_icon .image img").attr('src', '');
		  $('.ui-dialog-buttonset button:contains(add)').show();
		  $('.ui-dialog-buttonset button:contains(save)').hide();
		  $('.ui-dialog-buttonset button:contains(delete)').hide();
		}
	  });
	break;

	case 'edit':
	  dialog_title = "Edit Pupil";
	  $.extend(options,
	  {
		'open': function(event, ui)
		{
		  var pupil_info = $(this).data("pupil_info");
		  var input_list = $("#pupil_dialog .input, #pupil_dialog .text");

		  $(this).data("pupil_icon").css("background-color", '#FCE877');
		  $.each(pupil_info, function(key, value)
		  {
			switch (key)
			{
			  case 'id':
				$('#pupil_dialog #id').html(value);
				break;

			  case 'icon':
				$('#pupil_dialog #icon').attr('src', value);
				break;

			  default:
				input_list.children('#' + key).val(value);
				break;
			}
		  });

		  $('#pupil_dialog #id').parent(".text").parent(".data_point").show();
		  $('.ui-dialog-buttonset button:contains(add)').hide();
		  $('.ui-dialog-buttonset button:contains(save)').show();
		  $('.ui-dialog-buttonset button:contains(delete)').show();
		  $('.ui-dialog-buttonset button:contains(delete)').addClass('dialog_delete_button');
		}
	  });
	  break;

	default:
	  break;
  }

  $.extend(options,
  {
	'title': dialog_title,
	'close': function(event, ui)
	{
	  $(this).data("pupil_icon").css("background-color", '');
	},
	'buttons':
	{
	  'delete': function()
	  {
		var pupil_info = getPupilInfoFromDialog($(this));

		deletePupil(pupil_info);

		$(".pupil_icon input[value='" + pupil_info['id'] + "']").parent().remove();

		$(this).dialog('close');
	  },

	  'close': function()
	  {
		$(this).dialog('close');
	  },

	  'add': function()
	  {
		var pupil_info = getPupilInfoFromDialog($(this));

		addPupil(pupil_info);

		$(this).data("pupil_icon").data("pupil_info", pupil_info);
		$(this).dialog('close');
	  },

	  'save': function()
	  {
		var pupil_info = getPupilInfoFromDialog($(this));

		$(this).data("pupil_icon").data("pupil_info", pupil_info);
		$(this).data("pupil_icon").children(".image").children("img").attr("src", pupil_info['icon']);
		$(this).dialog('close');
		savePupil(pupil_info);
	  }
	}
  });

  pupil_dialog.dialog(options);
  pupil_dialog.dialog('open');

  $("#pupil_dialog #accordion").accordion({active: 1});

  $("#pupil_dialog .pupil_icon").dblclick(function()
  {
	$("#pupil_dialog #accordion").accordion("activate", 0);
  });

  getDataList('config', 'image_list', {}, function(responseText)
  {
	var image_list = eval(responseText);
	var image_list_count = image_list.length;

	$("#pupil_dialog .icon_list").html('');
	
	for (var i = 0; i < image_list_count; i++)
	{
	  var image_info = image_list[i];
	  var title = image_info.id + ' : ' + image_info.name + ' : ' + image_info.url + ' : ' + image_info.path;

	  var html = '<div class="image_icon thumbnail_container" title="' + title + '">'
					   +		'<input type="hidden" id="image_id" value="' + image_info.id + '">'
					   +		'<div class="image">'
				   +			'<img src="' + image_info.url + image_info.name + '">'
					   +		'</div>'
					   + '</div>';
	  var html_dom = $(html);
	  html_dom.data("image_info", image_info);
	  $("#pupil_dialog .icon_list").append(html_dom);
	  $("#pupil_dialog .image_icon").dblclick(function()
	  {
		var image_info = $(this).data('image_info');
		$("#pupil_dialog img#icon").attr("src", image_info.url + image_info.name);
		$("#pupil_dialog #Images_id").val(image_info.id);
	  });
	}

  });

}

function deletePupil(pupil_info)
{
  postData('config', 'delete_pupil', pupil_info, function(response_text)
  {
	
  });
}

function addPupil(pupil_info)
{
  var post_pupil_info = jQuery.extend(true, {}, pupil_info);
  delete post_pupil_info['icon'];
  delete post_pupil_info['id'];
  postData('config', 'add_pupil', post_pupil_info, function(response_text)
  {
	var id = parseInt(response_text);
	pupil_info['id'] = id;
	appendPupil(pupil_info);
  });
}

function savePupil(pupil_info)
{
  delete pupil_info['icon'];
  postData('config', 'update_pupil', pupil_info, function()
  {
	$(".pupil_icon #pupil_id").each(function()
	{
	  if ($(this).val() == pupil_info.id)
	  {
		var full_name = pupil_info.first_name + ' ' + pupil_info.middle_name + ' ' + pupil_info.last_name;
		$(this).parent('.pupil_icon').children('.pupil_name').html(pupil_info.first_name);
		$(this).parent().next().children().children("#pupil_id").html(pupil_info.id);
		$(this).parent().next().children().children("#pupil_name").html(full_name);
	  }
	});
  });
}

function getPupilInfoFromDialog(pupil_dialog)
{
	var pupil_info = {};
	$('#pupil_dialog .text, #pupil_dialog .input').each(function(key, value)
	{
		var key = $(this).children().attr('id');
		var element = $(this).children();
		pupil_info[key] = (key == 'id') ? element.html() : element.val();
	});

	pupil_info['icon'] = $('#pupil_dialog #icon').attr('src');
	return pupil_info;
}

function tutor_tab_init()
{
	$("input[name='add_tutor']").click(function(event)
	{
		event.preventDefault();
		$("#tutor_dialog").dialog('option', 'title', 'Add Tutor');
		$("#tutor_dialog").dialog('open');
		$("#tutor_dialog .input input").val('');
		$("#tutor_dialog .text").html('');
	});
	
	$("#tutor_tab").click(function()
	{
		$(".tab").removeClass('selected_tab');
		$(this).addClass('selected_tab');
		$(".panel").hide();
		$(".panel_data").hide();
		$("#tutor_panel .panel_data").html('');
		$("#tutor_panel").show();

		getDataList('config', 'tutor_list', {}, function(responseText)
		{
			var tutor_list = eval(responseText);
			var tutor_list_count = tutor_list.length;
			for (var i = 0; i < tutor_list_count; i++)
			{
				appendTutor(tutor_list[i]);
			}
			$("#tutor_panel .panel_data").show();
			$(".tutor_icon").dblclick(function(event)
			{
				openTutorDialog($(this));
			});
		});
	});
}

function openTutorDialog(tutor_icon_dom)
{
	var tutor_dialog = $("#tutor_dialog");
	tutor_dialog.data("tutor_info", tutor_icon_dom.data("tutor_info"));
	tutor_dialog.data("tutor_icon", tutor_icon_dom);

	var options =
	{
		open: function(event, ui)
		{
			var tutor_info = $(this).data("tutor_info");
			var input_list = $(this).children().children('.input, .text');

			$(this).data("tutor_icon").css("background-color", '#FCE877');
			$.each(tutor_info, function(key, value)
			{
				if (key == 'id')
					{input_list.children('#' + key).html(value);}
				else
					{input_list.children('#' + key).val(value);}
			});
		},
		close: function(event, ui)
		{
			$(this).data("tutor_icon").css("background-color", '');
		}
	};

	tutor_dialog.dialog(options);
	tutor_dialog.dialog('open');
}

function image_tab_init()
{
	$("input[name='add_image']").click(function(event)
	{
		event.preventDefault();
		$("#image_dialog").dialog('option', 'title', 'Add Image');
		$("#image_dialog").dialog('open');
		$('.ui-dialog-buttonpane button:contains(save)').hide();
		$('.ui-dialog-buttonpane button:contains(upload)').show();
		$("#image_dialog #image_form_container").show();
		$("#image_dialog .data_point").hide();
	});

	$("#image_form").submit(function()
	{
		$(this).ajaxSubmit(
		{
			success: function(responseText, statusText, xhr, $form)
			{
				var ret_value = responseText.replace("<head>",'').replace("</head>",'').replace("<body>",'').replace("</body>",'');
				if (ret_value == "0")
				{
					$("#image_upload_return").html('There was an error uploading the file.');
				}
				else
				{
					var image_info = eval('(' + ret_value + ')');
					$("#image_form_container").hide();
					$("#image_upload_return").html("File " + image_info.name + " successfully uploaded.");
					appendImage(image_info);
				}
			}
		});
		return false;
	});
	
	$("#image_tab").click(function()
	{
		$(".tab").removeClass('selected_tab');
		$(this).addClass('selected_tab');
		$(".panel").hide();
		$(".panel_data").hide();
		$("#image_form_container").hide();
		$("#image_panel .panel_data").html('');
		$("#image_upload_return").html('');
		$("#image_panel").show();

		getDataList('config', 'image_list', {}, function(responseText)
		{
			var image_list = eval(responseText);
			var image_list_count = image_list.length;
			for (var i = 0; i < image_list_count; i++)
			{
				appendImage(image_list[i]);
			}
			$("#image_panel .panel_data").show();
			$(".image_icon").dblclick(function(event)
			{
				//$("#image_dialog").dialog('option', 'title', 'Edit Image');
				
				$('.ui-dialog-buttonpane button:contains(upload)').hide();
				$('.ui-dialog-buttonpane button:contains(save)').show();
				$("#image_dialog #image_form_container").hide();
				$("#image_dialog .data_point").show();


				var image_dialog = $("#image_dialog");
				image_dialog.data("image_info", $(this).data("image_info"));
				image_dialog.data("image_icon", $(this));

				var options =
				{
					title: 'Edit Image',
					open: function(event, ui)
					{
						var image_info = $(this).data("image_info");
						var input_list = $(this).children().children('.input, .text');

						$(this).data("image_icon").css("background-color", '#FCE877');
						$.each(image_info, function(key, value)
						{
							if (key == 'id')
								{input_list.children('#' + key).html(value);}
							else
								{input_list.children('#' + key).val(value);}
						});
					},
					close: function(event, ui)
					{
						$(this).data("image_icon").css("background-color", '');
					}
				};

				image_dialog.dialog(options);
				image_dialog.dialog('open');
			});

		});
	});
}

function session_tab_init()
{
	$("#session_tab").click(function()
	{
		$(".tab").removeClass('selected_tab');
		$(this).addClass('selected_tab');
		$(".panel").hide();
		$(".panel_data").hide();
		$("#session_panel .panel_data").html('');
		$("#session_panel").show();


		getDataList('config', 'session_list', {}, function(responseText)
		{
			var session_list = eval(responseText);
			var html = generateSessionTable(session_list);
			$("#session_panel .panel_data").html(html);

			$("#session_panel .panel_data").show();

			$("#session_table td").dblclick(function()
			{
				var this_id = $(this).attr('id');
				if (this_id != 'id' && $(this).children('input').length == 0)
				{
					var session_id = $(this).parent('tr').attr('id').replace('sess_', '');
					var col_index = $(this).attr('cellIndex');
					var edit_box_id = 'edit_box_' + session_id + '_' + col_index;
					var save_button_id = 'save_button_' + session_id + '_' + col_index;
					var cur_value = $(this).html();
					var cur_td = $(this);


					switch (this_id)
					{
						case 'pupil':
							getDataList('config', 'pupil_list', {}, function(responseText)
							{
								var pupil_list = eval(responseText);
								html = generatePupilDropdown(pupil_list);
								html += '<input type="button" id="' + save_button_id + '" value="Save">';
								cur_td.html(html);
							});
							break;

						case 'tutor':
							getDataList('config', 'tutor_list', {}, function(responseText)
							{
								var tutor_list = eval(responseText);
								html = generateTutorDropdown(tutor_list);
								html += '<input type="button" id="' + save_button_id + '" value="Save">';
								cur_td.html(html);
							});
							break;

						default:
							html = '<input type="text" id="' + edit_box_id + '" value="' + cur_value + '">'
									 + '<input type="button" id="' + save_button_id + '" value="Save">';
							$(this).html(html);

							break;
					}


					$("#" + save_button_id).click(function(event)
					{
						event.preventDefault();
						var session_id = $(this).parent("td").parent("tr").children("#id").html();
						var field_name = $(this).parent("td").attr("id");
						var new_val = $('#' + edit_box_id).val();

						var session_info =
						{
							'session_id' : session_id,
							field_name : new_val
						};

						saveSessionRow(session_info);

						$(this).parent('td').html(new_val);
					});

					$('#' + edit_box_id).keyup(function(event)
					{
						if (event.keyCode == 13)
						{
							$("#" + save_button_id).click();
						}
					});
				}
			});
		});
	});
}

function class_tab_init()
{
	$("#class_tab").click(function()
	{
		$(".tab").removeClass('selected_tab');
		$(this).addClass('selected_tab');
		$(".panel").hide();
		$(".panel_data").hide();
		$("#class_panel .panel_data").html('');
		$("#class_panel").show();
	});
}

function lesson_plan_tab_init()
{
	$("#lesson_plan_tab").click(function()
	{
		$(".tab").removeClass('selected_tab');
		$(this).addClass('selected_tab');
		$(".panel").hide();
		$(".panel_data").hide();
		$("#lesson_plan_panel .panel_data").html('');
		$("#lesson_plan_panel").show();
	});
}

function lesson_tab_init()
{
	$("#lesson_tab").click(function()
	{
		$(".tab").removeClass('selected_tab');
		$(this).addClass('selected_tab');
		$(".panel").hide();
		$(".panel_data").hide();
		$("#lesson_panel .panel_data").html('');
		$("#lesson_panel").show();
	});
}

function tab_init()
{
	pupil_tab_init();
	tutor_tab_init();
	image_tab_init();
	session_tab_init();
	class_tab_init();
	lesson_plan_tab_init();
	lesson_tab_init();
}

function showMenu(tab_dom, button_list)
{
	if (tab_dom.hasClass('selected_tab'))
	{
		var offsets = tab_dom.offset();
		var menu_dom = $("#menu");

		var margin = 10;
		var extra_border_offset = 1;

		var border_right_width = parseInt(tab_dom.css('border-right-width').replace('px',''));
		var border_left_width = parseInt(tab_dom.css('border-left-width').replace('px',''));

		var width = tab_dom.width()
							+ parseInt(tab_dom.css('padding-left').replace('px',''))
							+ parseInt(tab_dom.css('padding-right').replace('px',''))
							+ border_left_width
							+ border_right_width
							- margin;
		width += 50;
		var top = offsets.top + tab_dom.height() - extra_border_offset;
		//var left = offsets.left + (margin / 2) - Math.abs(border_left_width - border_right_width);
		//var left = offsets.left + 25;
		var left = offsets.left;

		menu_dom.css('top', top + 'px');
		menu_dom.css('left', left + 'px');
		menu_dom.css('width', width + 'px');

		$.each(button_list, function(name, click_function)
		{
			var html = '<div class="menu_item">' + name + '</div>';
			var html_dom = $(html);
			html_dom.click(click_function);
			menu_dom.append(html_dom);
		});

		var height = menu_dom.height();
		menu_dom.height(0);
		menu_dom.animate({'height': height}, 500);

		menu_dom.hoverIntent
		(
			function()
			{

			},
			function()
			{
				//$(this).hide();
				$(this).animate({'height': 0}, 500);
			}
		);
	}
	


}

function generateTutorDropdown(tutor_list)
{
	var select_id = 'tutor_dropdown';
	var classes = '';
	var html = '<select id="' + select_id + '" name="' + select_id + '" class="' + classes + '">';

	var tutor_count = tutor_list.length;
	for (var i = 0; i < tutor_count; i++)
	{
		html +=			'<option value="' + tutor_list[i].id + '">'
					+					tutor_list[i].first_name + ' ' + tutor_list[i].middle_name + ' ' + tutor_list[i].last_name
					+			'</option>';
	}

	html +=		 '</select>';
	return html;
}

function generatePupilDropdown(pupil_list)
{
	var select_id = 'pupil_dropdown';
	var classes = '';
	var html = '<select id="' + select_id + '" name="' + select_id + '" class="' + classes + '">';

	var pupil_count = pupil_list.length;
	for (var i = 0; i < pupil_count; i++)
	{
		html +=			'<option value="' + pupil_list[i].id + '">'
					+					pupil_list[i].first_name + ' ' + pupil_list[i].middle_name + ' ' + pupil_list[i].last_name
					+			'</option>';
	}

	html +=		 '</select>';
	return html;
}

function appendTutor(tutor_info)
{
	var title = tutor_info.id + ' : ' + tutor_info.first_name + ' : '
						+ tutor_info.middle_name + ' : ' + tutor_info.last_name;
	var icon = (tutor_info.icon == null || tutor_info.icon == '') ? '/images/tutor_default.png' : tutor_info.icon;

	var html = '<div class="tutor_icon thumbnail_container" title="' + title + '">'
					 +		'<input type="hidden" id="tutor_id" value="' + tutor_info.id + '">'
		  		 +		'<div class="image">'
					 +			'<img src="' + icon + '">'
					 +		'</div>'
					 +		'<div class="tutor_name">' + tutor_info.last_name + '</div>'
					 + '</div>';
	var html_dom = $(html);
	html_dom.data("tutor_info", tutor_info);
	$("#tutor_panel .panel_data").append(html_dom);
}

function appendPupil(pupil_info)
{
	var title = pupil_info.id + ' : ' + pupil_info.first_name + ' : '
						+ pupil_info.middle_name + ' : ' + pupil_info.last_name;
	//var icon = (pupil_info.icon == null || pupil_info.icon == '') ? '/images/pupil_default.gif' : pupil_info.icon;
	var icon = pupil_info.icon;
	var html = '<div class="pupil_icon thumbnail_container">'
		  		 +		'<input type="hidden" id="pupil_id" value="' + pupil_info.id + '">'
					 +		'<div class="image">'
					 +			'<img src="' + icon + '">'
					 +		'</div>'
					 +		'<div class="pupil_name">' + pupil_info.first_name + '</div>'
					 + '</div>';
	var html_dom = $(html);
	html_dom.data("pupil_info", pupil_info);
	html_dom.dblclick(function(event)
	{
		openPupilDialog($(this), 'edit');
	});

	$("#pupil_panel .panel_data").append(html_dom);

	html	 = '<div class="tooltip">'
			 +	  '<div class="data_point">'
			 +		'<div class="label">ID:</div>'
			 +		'<div id="pupil_id" class="text">' + pupil_info.id + '</div>'
			 +	  '</div>'
			 +	  '<div class="data_point">'
			 +		'<div class="label">Name:</div>'
			 +		'<div id="pupil_name" class="text">'
			 +		  pupil_info.first_name + ' ' + pupil_info.middle_name + ' ' + pupil_info.last_name
			 +		'</div>'
			 +	  '</div>'
			 + '</div>';
	$("#pupil_panel .panel_data").append(html);

}


function appendImage(image_info)
{
	var title = image_info.id + ' : ' + image_info.name + ' : ' + image_info.url + ' : ' + image_info.path;

	var html = '<div class="image_icon thumbnail_container">'
			 +		'<input type="hidden" id="image_id" value="' + image_info.id + '">'
			 +		'<div class="image">'
			 +			'<img src="' + image_info.url + image_info.name + '">'
			 +		'</div>'
			 + '</div>';
	var html_dom = $(html);
	html_dom.data("image_info", image_info);
	

}




