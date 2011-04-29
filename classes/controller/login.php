<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Login extends Controller_Template {
	public $template = 'login';
	private $redirectTo = 'config';

	public function action_index() {
		session_start();
		$_SESSION['JH_LOGGED_IN'] = false;
		if ( $_SESSION['JH_LOGGED_IN']) {
			Request::instance()->redirect($this->redirectTo);
		}

		if ($_POST['submit'] == 'Login') {
			if ($_POST['username'] == 'hosh_joppe' && $_POST['pass'] == 'zaq12wsx') {

				$_SESSION['JH_LOGGED_IN'] = true;
				$this->request->redirect($this->redirectTo);
			}
		}
	}

} 
