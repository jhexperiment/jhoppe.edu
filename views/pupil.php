<!DOCTYPE HTML>

<html>
  <head>
    <link rel="stylesheet" href="/css/pupil.css" type="text/css">
		<link rel="stylesheet" href="/css/base/base.css" type="text/css">
		<link rel="stylesheet" href="/css/jquery/jquery-ui.css" type="text/css">
		<script type="text/javascript" src="/js/jquery/plugins/jquery.tools.min.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.form.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.stretch.js"></script>
		<script type="text/javascript" src="/js/jquery/jquery-ui.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/hoverIntent.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.disable.text.select.js"></script>
		<script type="text/javascript" src="/js/common.js"></script>
		<script type="text/javascript" src="/js/pupil.js"></script>

		<title>Pupil</title>
  </head>
  <body>
		<center>
		<div id="content">
			
			<div id="config">
				<input type="hidden" name="cur_win_height" value="-1">
				<input type="hidden" name="cur_win_width" value="-1">
				<input type="hidden" name="progress_index" value="3">
				<input type="hidden" id="session_hash" name="session_hash" value="">
			</div>

			<div id="session_list_display">
				<div class="header"><h2>Choose Session:</h2></div>
				<div class="content"></div>
			</div>

			<div id="pupil_display">
				<div id="progress_bar">
					Progress Bar Loading...
				</div>
				<div id="display">
					<div id="display_image">
						<img src="" alt="Image Loading...">
					</div>
					<div id="display_text"></div>
				</div>
				<div id="answer_controls">
					<div class="prev_question ui-icon ui-icon-seek-prev ui-state-default" title="Previous Question"></div>
					<div class="content_type ui-icon-seek-next ui-widget ui-button ui-state-default" title="Image/Text Toggle">image</div>
					<div class="next_question ui-icon ui-icon-seek-next ui-state-default" title="Next Question"></div>
					<div class="yes_button ui-widget ui-button ui-state-default">Yes</div>
					<div class="no_button ui-widget ui-button ui-state-default">No</div>
				</div>
			</div>
		</div>
		</center>
  </body>
  
</html>
