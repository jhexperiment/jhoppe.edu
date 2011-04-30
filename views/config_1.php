<!DOCTYPE HTML>

<html>
  <head>
    <link rel="stylesheet" href="/css/config.css" type="text/css">
		<link rel="stylesheet" href="/css/base/base.css" type="text/css">
		<link rel="stylesheet" href="/css/jquery/jquery-ui.css" type="text/css">
		<script type="text/javascript" src="/js/jquery/plugins/jquery.tools.min.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.form.js"></script>
		<script type="text/javascript" src="/js/jquery/jquery-ui.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/hoverIntent.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.disable.text.select.js"></script>
		<script type="text/javascript" src="/js/common.js"></script>
		<script type="text/javascript" src="/js/config.js"></script>

		<title>Config</title>
  </head>
  <body>
		<div id="config">
			<input id="current_tab" name="current_tab" type="hidden" value="">
		</div>
		<center>
			<div id="tab_container">
				<div id="pupil_tab" class="tab first_tab">Pupil</div>
				<div id="tutor_tab" class="tab">Tutor</div>
				<div id="image_tab" class="tab">Image</div>
				<div id="lesson_tab" class="tab">Lesson</div>
				<div id="lessonplan_tab" class="tab" style="display:none">Lesson Plan</div>
				<div id="class_tab" class="tab" style="display:none">Class</div>
				<div id="session_tab" class="tab last_tab">Session</div>

			</div>
			
			<div id="panel_container">
				
				<div id="pupil_panel" class="panel">
					<div class="control_container">
						<input type="button" id="add_pupil" name="add_pupil" value="Add New"
									 class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">
					</div>
					<div class="panel_data"></div>
				</div>

				<div id="tutor_panel" class="panel">
					<div class="control_container">
						<input type="button" id="add_tutor" name="add_tutor" value="Add New"
									 class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">
					</div>
					<div class="panel_data"></div>
				</div>

				<div id="image_panel" class="panel">
					<div class="control_container">
						<input type="button" id="add_image" name="add_image" value="Add New"
									 class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">
					</div>
					<div class="panel_data"></div>
				</div>

				<div id="session_panel" class="panel">
					<div class="control_container">
						<input type="button" role="button" id="add_session" name="add_session" value="Add New"
									 class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">
					</div>
					<div class="panel_data"></div>
				</div>

				<div id="class_panel" class="panel">
					<div class="control_container">
						<input type="button" id="add_class" name="add_class" value="Add New"
									 class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">
					</div>
					<div class="panel_data"></div>
				</div>

				<div id="lessonplan_panel" class="panel">
					<div class="control_container">
						<input type="button" id="add_lessonplan" name="add_lessonplan" value="Add New"
									 class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">
					</div>
					<div class="panel_data"></div>
				</div>

				<div id="lesson_panel" class="panel">
					<div class="control_container">
						<input type="button" id="add_lesson" name="add_lesson" value="Add New"
									 class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">
					</div>
					<div class="panel_data"></div>
				</div>
			</div>
		</center>

		<div id="pupil_dialog" class="dialog">
			<div class="dialog_icon thumbnail_container data_point" title="">
				<div class="icon image">
					<img id="icon" src="" alt="?">
				</div>
			  <div class="input">
					<input type="hidden" id="Images_id" required="required" value="">
			  </div>
			</div>
			<div id="require_note">
				<span>* Required.</span>
			</div>
			<div id="accordion" class="data_point">
			  <h3 id="choose_icon"><a href="#">Choose Icon</a></h3>
			  <div>
					<div class="icon_list data_point">
					</div>
			  </div>
			  <h3 id="attributes"><a href="#">Attributes</a></h3>
			  <div>
					<div class="data_point">
						<div class="label">ID:</div>
						<div class="text">
							<div id="id">&nbsp;</div>
						</div>
					</div><br>
					<div class="data_point">
						<div class="label">
							First Name:
							<span style="color:red;">*</span>
						</div>
						<div class="input">
							<input type="text" id="first_name"
										 required="required" pattern="^[0-9A-Za-z\-\_\.]+$"
										 not_valid_msg="Only alphanumerics, dashes, underscores, and periods allowed.">
						</div>
					</div><br>
					<div class="data_point">
						<div class="label">Middle Name:</div>
						<div class="input">
							<input type="text" id="middle_name">
						</div>
					</div><br>
					<div class="data_point">
						<div class="label">
							Last Name:
							<span style="color:red;">*</span>
						</div>
						<div class="input">
							<input type="text" id="last_name"
										 required="required" pattern="^[0-9A-Za-z\-\_\.]+$"
										 not_valid_msg="Only alphanumerics, dashes, underscores, and periods allowed.">
						</div>
					</div><br>
			  </div>
			</div>
		</div>

		<div id="tutor_dialog" class="dialog">
			<div class="dialog_icon thumbnail_container data_point" title="">
				<div class="icon image">
					<img id="icon" src="" alt="?">
				</div>
			  <div class="input">
					<input type="hidden" id="Images_id" required="required" value="">
			  </div>
			</div>
			<div id="require_note">
				<span>* Required.</span>
			</div>
			<div id="accordion" class="data_point">
			  <h3 id="choose_icon"><a href="#">Choose Icon</a></h3>
			  <div>
					<div class="icon_list data_point">
					</div>
			  </div>
			  <h3 id="attributes"><a href="#">Attributes</a></h3>
			  <div>
					<div class="data_point">
						<div class="label">ID:</div>
						<div class="text">
							<div id="id">&nbsp;</div>
						</div>
					</div><br>
					<div class="data_point">
						<div class="label">
							First Name:
							<span style="color:red;">*</span>
						</div>
						<div class="input">
							<input type="text" id="first_name" 
										 required="required" pattern="^[0-9A-Za-z\-\_\.]+$"
										 not_valid_msg="Only alphanumerics, dashes, underscores, and periods allowed.">
						</div>
					</div><br>
					<div class="data_point">
						<div class="label">Middle Name:</div>
						<div class="input">
							<input type="text" id="middle_name">
						</div>
					</div><br>
					<div class="data_point">
						<div class="label">
							Last Name:
							<span style="color:red;">*</span>
						</div>
						<div class="input">
							<input type="text" id="last_name" 
										 required="required" pattern="^[0-9A-Za-z\-\_\.]+$"
										 not_valid_msg="Only alphanumerics, dashes, underscores, and periods allowed.">
						</div>
					</div>
			  </div>
			</div>
		</div>

		<div id="image_dialog" class="dialog">
			<div class="dialog_icon thumbnail_container data_point" title="">
				<div class="icon image">
					<img id="icon" src="" alt="?">
				</div>
			  <div class="input">
					<input type="hidden" id="Images_id" required="required" value="">
			  </div>
			</div>
			<div id="require_note">
				<span>* Required.</span>
			</div>
			<div id="upload">
				<div id="image_form_container">
						<form id="image_form" action="config" method="POST" type="multipart/form-data">
							<input type="hidden" id="action" name="action" value="image_upload">
							<div class="label">Upload Image:</div>
							<div class="input">
								<input type="file" id="image_file" name="image_file" size="32" required="required">
							</div>
						</form>
					</div>
			</div>
			<div id="attributes">
				<div class="data_point">
					<div class="label">ID:</div>
					<div class="text"><div id="id"></div></div>
				</div><br>
				<div class="data_point">
					<div class="label">Name:</div>
					<div class="text"><div id="name"></div></div>
				</div><br>
				<div class="data_point">
					<div class="label">Url:</div>
					<div class="text"><div id="url"></div></div>
				</div><br>
				<div class="data_point">
					<div class="label">Path:</div>
					<div class="text"><div id="path"></div></div>
				</div><br>
			</div>
			
		</div>

		<div id="lesson_dialog" class="dialog">
			<input type="hidden" id="lesson_id" name="lesson_id" value="">
			<div class="data_point">
				<div class="label">Lesson Name:</div>
				<div class="input">
					<input type="text" id="lesson_name" name="lesson_name" value=""
								 required="required" pattern="^[0-9A-Za-z\-\_\.]+$"
								 not_valid_msg="Only alphanumerics, dashes, underscores, and periods allowed.">
				</div>
			</div>
			<div id="question_list_container" class="column">
				<div id="new_question_container">
					<span id="load_question">Load</span>
					<span class="text">Questions</span>
					<span id="new_question">+ New</span>
				</div>
				<div id="question_list"></div>
			</div>
			<div id="question_info" class="column">
				<div class="data_point">
					<div class="text">Image:</div><br>
					<div class="dialog_icon thumbnail_container">
						<div class="image">
							<img id="icon" src="" alt="?">
						</div>
					</div>
				</div>
				<br>
				<div class="data_point">
					<div class="text">Text:</div><br>
					<div class="input">
						<input type="text" id="text" name="text" value="">
					</div>
				</div>
			</div>
		</div>

		<div id="lessonplan_dialog" class="dialog">
			<div class="hidden data_point">
				<div class="label">ID:</div>
					<div class="text">
						<div id="id"></div>
					</div>
			</div>
			<div class="data_point">
				<div class="label">Lesson Plan Name:</div>
				<div class="input">
					<input type="text" id="name" name="lessonplan_name" value=""
								 required="required" pattern="^[0-9A-Za-z\-\_\.]+$"
								 not_valid_msg="Only alphanumerics, dashes, underscores, and periods allowed.">
				</div>
			</div>
		</div>

		<div id="class_dialog" class="dialog">
			<div class="hidden data_point">
				<div class="label">ID:</div>
					<div class="text">
						<div id="id"></div>
					</div>
			</div>
			<div class="data_point">
				<div class="label">Class Name:</div>
				<div class="input">
					<input type="text" id="name" name="class_name" value=""
								 required="required" pattern="^[0-9A-Za-z\-\_\.]+$"
								 not_valid_msg="Only alphanumerics, dashes, underscores, and periods allowed.">
				</div>
			</div>
		</div>

		<div id="session_dialog" class="dialog">
			<center>
				<div class="pupil_icon thumbnail_container data_point" title="" required="required">
					<div class="pupil_label">Pupil:</div><div id="pupil_name"></div>
					<div class="icon image">
						<img id="icon" src="" alt="?">
					</div>
					<div class="input">
						<input type="hidden" id="Images_id" value="">
					</div>
				</div>
				<div class="tutor_icon thumbnail_container data_point" title="" required="required">
					<div class="tutor_label">Tutor:</div><div id="tutor_name"></div>
					<div class="icon image">
						<img id="icon" src="" alt="?">
					</div>
					<div class="input">
						<input type="hidden" id="Images_id" value="">
					</div>
				</div>
			</center>
			<br>
			<div class="lesson_icon thumbnail_container" required="required">
				<div class="lesson_name">
					<span class="label">Lesson:</span><span id="lesson_name"></span>
				</div>
				<input type="hidden" id="lesson_id" value="">
				<div class="image_list"></div>
			</div>
		</div>

		
		<div id="menu" class="menu"></div>

		
  </body>
  
</html>
