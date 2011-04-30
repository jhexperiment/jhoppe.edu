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
			<?php echo $filelist; ?>
		</td>
		<td id="imageContent">
			<div id="imageMenu">
				<div class="imageMenuLeftItem">&nbsp;</div>
				<div class="imageMenuLeftItem">File</div>
				<div class="imageMenuLeftItem">Edit</div
				<div class="imageMenuLeftItem">&nbsp;</div>
				<div class="imageMenuLeftItem">More</div>

				<div class="imageMenuRightItem">&nbsp;</div>
				<div class="imageMenuRightItem">Right Menu</div>
			</div>
			<div id="imageThumbnail">
				<img alt="imageThumbnail" src="">
			</div>
			<table>
				<tr>
					<th>Name:</th>
					<td><input type="text"></td>
				</tr>
				<tr>
					<th>Url:</th>
					<td><input type="text"></td>
				</tr>
				<tr>
					<th>Path:</th>
					<td><input type="text"></td>
				</tr>
			</table>
		</td>
	</tr>
</table>