<!DOCTYPE HTML>

<html>
  <head>
    <link rel="stylesheet" href="/css/config.css" type="text/css">
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
		<div id="appNavBar">
			<div class="appNavLeftItem">&nbsp;</div>
			<div class="appNavLeftItem">Pupil</div>
			<div class="appNavLeftItem">Tutor</div>
			<div class="appNavLeftItem">Config</div>
			<div class="appNavLeftItem">&nbsp;</div>
			<div class="appNavLeftItem">More</div>

			<div class="appNavRightItem">&nbsp;</div>
			<div class="appNavRightItem">user@jhoppe.jhexperiment.com</div>
			<div class="appNavRightItem">Third</div>
		</div>
		<div id="header">
			<div id="logo"><img alt="logo" src="/images/logo.jpg"/></div>
			<div id="searchBar">
				<input type="text"/>
				<input type="button" value="Search Images"/>
				<input type="button" value="Search All"/>
			</div>
		</div>
		<table>
			<tr>
				<td id="menuBar">
					<div class="menuBarItem">Pupil</div>
					<div class="menuBarItem currentMenuBarItem">Tutor</div>
					<div class="menuBarItem">Image</div>
					<div class="menuBarItem">Lesson</div>
					<div class="menuBarItem">Session</div>
				</td>
				<td id="content">
					<?php echo $content; ?>
				</td>
			</tr>
		</table>
		
		<div id="footer">
			<div class="footerLeftItem">&nbsp;</div>
			<div class="footerLeftItem">Footer1</div>

			<div class="footerRightItem">&nbsp;</div>
			<div class="footerRightItem">Footer2</div>
		</div>
  </body>
  
</html>
