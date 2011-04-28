<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Api extends Controller_Template {
	public $template = 'api';

	public function action_index()
	{
	$this->template->content_type = 'image/jpeg';
	$this->template->filename = '/media/www/mediapc/applications/jhoppe/web_root/images/star.jpg';
	}

} 
