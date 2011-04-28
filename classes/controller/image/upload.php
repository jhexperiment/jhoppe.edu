<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Image_Upload extends Controller_Template {
	public $template = 'image/upload';

	public function action_index()
	{
	$this->template_success = '';
	if (!empty($_FILES['userfile']))
		{
		$arrFiles = $_FILES['userfile'];
		for ($i = 0; $i < count($arrFiles['tmp_name']); $i++)
			{
			if (move_uploaded_file($arrFiles['tmp_name'][$i], "images/{$arrFiles['name'][$i]}"))
				{
				$this->template->success = "File uploaded successfully.";
				}
			else
				{
				$this->template->success = "File failed to upload, sorry.";
				}
			}
				
		}
	}

} 
