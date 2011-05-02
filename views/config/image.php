<table>
	<tr>
		<td id="imageBrowser">
			<div id="browserView">
				View:
				<select>
					<option>File List</option>
					<option>Thumbnails</option>

				</select>
			</div>
			<div id="browserAddressBar">
				<input type="text">
			</div>
			<?php echo $fileBrowser; ?>
		</td>
		<td id="imageContent">
			<input id="currentLoadedImageId" type="hidden">
			<!--
			<div id="imageMenu">
				<div class="menuLeftItem">&nbsp;</div>
				<div class="menuLeftItem">File</div>
				<div class="menuLeftItem">Edit</div
				<div class="menuLeftItem">&nbsp;</div>
				<div class="menuLeftItem">More</div>

				<div class="menuRightItem">&nbsp;</div>
				<div class="menuRightItem">Right Menu</div>
			</div>
			-->
			<div id="imageThumbnail">
				<img alt="imageThumbnail" src="">
			</div>
			<table>
				<tr>
					<th>Name:</th>
					<td><input id="imageName" type="text"></td>
				</tr>
				<tr>
					<th>Filename:</th>
					<td><input id="imageFilename" type="text"></td>
				</tr>
				<tr>
					<th>Url:</th>
					<td><input id="imageUrl" type="text"></td>
				</tr>
				<tr>
					<th>Path:</th>
					<td><input id="imagePath" type="text"></td>
				</tr>
			</table>
		</td>
	</tr>
</table>