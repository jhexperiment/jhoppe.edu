<!DOCTYPE HTML>

<html>
  <head>
    <link rel="stylesheet" href="/css/tutor.css" type="text/css">
		<link rel="stylesheet" href="/css/base/base.css" type="text/css">
		<link rel="stylesheet" href="/css/jquery/jquery-ui.css" type="text/css">
		<script type="text/javascript" src="/js/jquery/plugins/jquery.tools.min.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.form.js"></script>
		<script type="text/javascript" src="/js/jquery/jquery-ui.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/hoverIntent.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.disable.text.select.js"></script>
		<script type="text/javascript" src="/js/common.js"></script>
		<script type="text/javascript" src="/js/tutor.js"></script>

		<title>Tutor</title>
  </head>
  <body>
		<div id="config">
			<input type="hidden" id="session_hash" name="session_hash" value="1111111111">
		</div>
		<div id="header">
			<div class=".title"></div>
		</div>
		<center>
			<div id="image_question_header">
				<h2>Loading...</h2>
			</div>
			<div id="image_question_border">
				<div id="image_question_container">

				</div>
			</div>
		</center>

		<pre><?php echo print_r(array($_GET, $_POST, $_SESSION, $_SERVER), true); ?></pre>

		
  </body>
  
</html>
