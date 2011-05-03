<!DOCTYPE HTML>

<html>
  <head>
    <link rel="stylesheet" href="/css/configNewTemplate.css" type="text/css">
		<link rel="stylesheet" href="/css/jquery/jquery-ui.css" type="text/css">
		<script type="text/javascript" src="/js/jquery/plugins/jquery.tools.min.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.form.js"></script>
		<script type="text/javascript" src="/js/jquery/jquery-ui.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/hoverIntent.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.disable.text.select.js"></script>
		<script type="text/javascript" src="/js/common.js"></script>
		<script type="text/javascript" src="/js/configNewTemplate.js"></script>

		<title>Config</title>
  </head>
  <body>
		<div id="appNavBar">
			<div class="appNavLeftItem">&nbsp;</div>
			<div id="pupilNavItem" class="appNavLeftItem">Pupil</div>
			<div id="tutorNavItem" class="appNavLeftItem">Tutor</div>
			<div id="configNavItem" class="currentNavItem appNavLeftItem">Config</div>
			<div id="configNavItem" class="appNavLeftItem">Reports</div>
			<div id="configNavItem" class="appNavLeftItem">Flash Cards</div>
			<div class="appNavLeftItem">&nbsp;</div>
			<div id="moreNavItem" class="appNavLeftItem">More</div>

			<div class="appNavRightItem">&nbsp;</div>
			<div id="userNavItem" class="appNavRightItem">user@jhoppe.jhexperiment.com</div>
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
					<div id="pupilMenuItem" class="menuBarItem">Pupil</div>
					<div id="tutorMenuItem" class="menuBarItem">Tutor</div>
					<div id="imageMenuItem" class="menuBarItem currentMenuBarItem">Image</div>
					<div id="lessonMenuItem" class="menuBarItem">Lesson</div>
					<div id="sessionMenuItem" class="menuBarItem">Session</div>
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
