$(document).ready(function()
{
	thisPage.init();

	$(window).load(function()
	{
		
	});
});


var fileBrowser = {
	'init': function() {
		
	},
	'addressBarSubmit': function() {
		fileBrowser.getFileList($("#browserAddressBar input").val());

	},

	'parentDirClick': function() {
		$("#imageContent").hide();
		
		var rootPath = $('#imageBrowser #browserAddressBar input').val();
		rootPath = rootPath.split('/');
		rootPath.pop();
		rootPath.pop();
		rootPath = rootPath.join('/');

		if (rootPath == '') {
			rootPath = '/images';
		}
		fileBrowser.getFileList(rootPath + '/');
	},

	'imageFileClick': function() {
		var Images_id = parseInt($(this).children('input.id').val());
		var data = {
			'type': 'GET',
			'action': 'getImage',
			'Images_id': Images_id
		};
		querySite('configNewTemplate', data, function(responseText) {
			$("#imageContent #imageThumbnail img").attr('src', '');
			$("#imageContent #imageFilename").val('');
			$("#imageContent #imageUrl").val('');
			$("#imageContent #imagePath").val('');
			$("#imageContent #currentLoadedImageId").val('');

			var info = eval('(' + responseText + ')');
			$("#imageContent").show();

			$("#imageContent #imageThumbnail img").attr('src', info.icon);
			$("#imageContent #imageFilename").val(info.name);
			$("#imageContent #imageUrl").val(info.url);
			$("#imageContent #imagePath").val(info.path);
			$("#imageContent #currentLoadedImageId").val(info.id);

			
		});
	},

	'imageFolderClick': function () {
		$("#imageContent").hide();
				
		fileBrowser.getFileList($(this).children('.rootPath').val());
		var tmp = '';
	},
	
	'getFileList': function (rootPath) {
		if ( util.isEmpty(rootPath) ) {
			rootPath = '/images/';
		}

		$("#imageBrowser #browserAddressBar input").val(rootPath);

		var data = {
			'type': 'GET',
			'action': 'getImageList',
			'rootPath': rootPath
		};

		querySite('configNewTemplate', data, function(responseText) {
			var imageList = eval('(' + responseText + ')');

			$("#imageBrowser #imageList").html('');

			//var html  = '<div class="imageListItem">..' + "</div>\n";
			var html  = '';
			var htmlDom = $(html);
			htmlDom.click(fileBrowser.fileClick);
			$("#imageBrowser #imageList").append(htmlDom);

			var pathSplit = imageList.rootPath.split('/');
			pathSplit.pop();
			pathSplit.pop();
			pathSplit.push('');
			var parentPath = pathSplit.join('/');
			if (util.isEmpty(parentPath) || parentPath == '/') {
				parentPath = '/images/';
			}
			
			imageList.folderList.unshift({
				'type': 'folder',
				'name': '..',
				'rootPath': parentPath
			});

			if (! util.isEmpty(imageList.folderList) ) {
				$.each(imageList.folderList, function(index) {
					var html  = '<div class="imageListItem imageFolder">'
										+		'<input class="rootPath" type="hidden" value="' + this.rootPath + '"/>'
										+		'<input class="type" type="hidden" value="' + this.type + '"/>'
										+		this.name
										+ "</div>\n";
					var htmlDom = $(html);
					htmlDom.click(fileBrowser.imageFolderClick);
					$("#imageBrowser #imageList").append(htmlDom);
				});
			}

			if (! util.isEmpty(imageList.fileList) ) {
				$.each(imageList.fileList, function() {
					var html  = '<div class="imageListItem imageFile">'
										+		'<input class="id" type="hidden" value="' + this.id + '"/>'
										+		'<input class="type" type="hidden" value="' + this.type + '"/>'
										+		this.name
										+ "</div>\n";
					var htmlDom = $(html);
					htmlDom.click(fileBrowser.imageFileClick);
					$("#imageBrowser #imageList").append(htmlDom);
				});
			}
		});

	}
}

// Page
var thisPage =
{
	init: function()
	{
		// global init
		
		$("#imageMenuItem").click(thisPage.loadImagePage);

		$("input[type='button']").disableTextSelect();

		$("input[type='button']").hoverIntent(
			function() { //on hover
				//$(this).addClass('ui-state-hover');
			},
			function() { //off hover
				//$(this).removeClass('ui-state-hover');
				//$(this).removeClass('ui-state-active');
			}
		);

		$("input[type='button']").mousedown(function() {
			//$(this).addClass('ui-state-active');
		});



		thisPage.loadImagePage();
	},
	'loadImagePage': function() {
		$(".menuBarItem").removeClass('currentMenuBarItem');
		$("#imageMenuItem").addClass('currentMenuBarItem');

		$("#content").html('Loading Image Page...');
		var data = {
			'type': 'GET',
			'action': 'getImagePage'
		};
		querySite('configNewTemplate', data, function(responseText) {
			var htmlDom = $(responseText);
			$("#content").html(htmlDom);
			$("#imageListMenu #parentDir").click(fileBrowser.parentDirClick);
			$("#imageListMenu #moreActions").click(thisPage.displayImageListMenu);
			$("#imageBrowser #browserAddressBar input").keyup(function(event) {
				if (event.keyCode == '13') {
					 event.preventDefault();
					 fileBrowser.addressBarSubmit();
				 }			 
			});

			fileBrowser.getFileList();
		});
	},

	'newFolder': function() {

		var tmp='';
	},

	'uploadFile': function() {
		var html	= '<div id="fileUploadMenu">'
							+		'<form action="configNewTemplate" method="POST" type="multipart/form-data">'
							+			'<input type="hidden" id="action" name="action" value="imageUpload">'
							+			'<input type="hidden" id="backgroundLock" value="0">'
							+			'<input type="file" id="imageFile" name="imageFile">'
							+		'</form>'
							+	'</div>';

		var fileUploadMenuDom = $(html);
		fileUploadMenuDom.css('position', 'absolute');
		var offset = $(this).offset();
		var left = offset.left + $(this).width()
						 + parseInt($(this).css('padding-left').replace('px',''))
						 + parseInt($(this).css('padding-right').replace('px', ''));
		fileUploadMenuDom.css('left', left);
		var top = offset.top;// + parseInt($(this).css('padding-right').replace('px', ''));
		fileUploadMenuDom.css('top', top);

		var imageFileDom = fileUploadMenuDom.children('form').children('#imageFile');
		imageFileDom.click(function() {
			$("#backgroundLock").val(1);
		});
		imageFileDom.change(function() {
			$("#backgroundLock").val(0);
			$("#fileUploadMenu #imageFile").submit();
		});

		fileUploadMenuDom.children('form').submit(function() {
			$(this).ajaxSubmit({
				success: function(responseText, statusText, xhr, $form) {
					var ret_value = responseText.replace("<head>",'').replace("</head>",'').replace("<body>",'').replace("</body>",'');
					if (ret_value == "0") {
						//$("#image_upload_return").html('There was an error uploading the file.');
					}
					else {
						var image_info = eval('(' + ret_value + ')');
						//$("#image_form_container").hide();
						//$("#image_upload_return").html("File " + image_info.name + " successfully uploaded.");
						//this_tab_obj_ref.append(image_info);
						var tmp = '';
					}
				}
			});
		});

		var imageUploadBackground = $('<div id="imageUploadBackground" style="width:100%; height:100%; index: 100"></div>')
		imageUploadBackground.click(function() {
			if ($("#backgroundLock").val() == "0") {
				if ($("#popupBackground").length != 0) {
					$("#popupBackground").remove();
				}

				$("#imageUploadBackground").remove();
			}
			
		});
		imageUploadBackground.append(fileUploadMenuDom);
		$("body").append(imageUploadBackground);
		

		var tmp='';
	},

	'displayImageListMenu': function() {
		var menuItemList = [
			{'name': 'New folder', 'action': thisPage.newFolder},
			{'name': 'Upload file', 'action': thisPage.uploadFile},
			{'name': 'Menu 3', 'action': function(){}}
		];

		thisPage.displayPopupMenu(this, menuItemList);
	},
	
	'displayPopupMenu': function(srcDom, menuItemList) {
		if (! util.isEmpty(menuItemList) ) {
			$("#popupMenu").remove();


			var popupMenuDom = $('<div id="popupMenu"></div>');
			$.each(menuItemList, function() {
				var html = '<div class="popupMenuItem">'
								 +		this.name
								 + '</div>';
				var htmlDom = $(html);
				htmlDom.click(this.action);
				popupMenuDom.append(htmlDom);
			});

			var srcDomOffset = $(srcDom).offset();
			popupMenuDom.css('position', 'absolute');
			popupMenuDom.css('left', srcDomOffset.left);
			var top = srcDomOffset.top + $(srcDom).height() 
							+ parseInt($(srcDom).css('padding-top').replace('px',''))
							+ parseInt($(srcDom).css('padding-bottom').replace('px', ''));
			popupMenuDom.css('top', top);

			var popupBackground = $('<div id="popupBackground"></div>')
			popupBackground.click(function() {
				if ($("#imageUploadBackground").length == 0) {
					$("#popupBackground").remove();
				}
			});
			popupBackground.append(popupMenuDom);
			$("body").append(popupBackground);

		}
	}
};

