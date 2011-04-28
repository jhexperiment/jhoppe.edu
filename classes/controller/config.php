<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Config extends Controller_Template
{
	public $template = 'text';
	private $_image_upload_dir;

	public function init()
	{
		$this->_image_upload_dir = APPPATH . '/web_root/images/uploads/';
	}

	public function action_index()
	{
		if ( ! $_SESSION['JH_LOGGED_IN']) {
			Request::instance()->redirect('http://jhoppe.jhexperiment.com/index.php');
		}
		$this->init();
		
		$data = array();
		switch ($_REQUEST['action'])
		{
			case 'get':
				switch ($_REQUEST['type'])
				{
					case 'image':
						$this->template->output = $this->getImage($_GET);
						break;
					case 'pupil':
						$this->template->output = $this->getPupil($_GET);
						break;
					case 'tutor':
						$this->template->output = $this->getTutor($_GET);
						break;
					case 'lesson':
						$this->template->output = $this->getLesson($_GET);
						break;
					case 'lessonplan':
						$this->template->output = $this->getLessonPlan($_GET);
						break;
					case 'class':
						$this->template->output = $this->getClass($_GET);
						break;
					case 'session':
						$this->template->output = $this->getSession($_GET);
						break;
				}
				break;

			case 'get_list':
				switch ($_REQUEST['type'])
				{
					case 'image_list':
						$this->template->output = $this->getImageList();
						break;
					case 'pupil_list':
						$this->template->output = $this->getPupilList();
						break;
					case 'tutor_list':
						$this->template->output = $this->getTutorList();
						break;
					case 'lesson_list':
						$this->template->output = $this->getLessonList();
						break;
					case 'lessonplan_list':
						$this->template->output = $this->getLessonPlanList();
						break;
					case 'class_list':
						$this->template->output = $this->getClassList();
						break;
					case 'session_list':
						$this->template->output = $this->getSessionList();
						break;
				}
				break;

			case 'update':
				switch ($_REQUEST['type'])
				{
					// Session
					case 'update_session':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->updateSession($_POST);
						break;
					case 'add_session':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->addSession($_POST);
						break;
					case 'delete_session':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->deleteSession($_POST);
						break;

					// Pupil
					case 'delete_pupil':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->deletePupil($_POST);
						break;
					case 'update_pupil':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->updatePupil($_POST);
						break;
					case 'add_pupil':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->addItem('Pupils', $_POST);
						break;

					// Tutor
					case 'delete_tutor':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->deleteTutor($_POST);
						break;
					case 'update_tutor':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->updateTutor($_POST);
						break;
					case 'add_tutor':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->addItem('Tutors', $_POST);
						break;

					case 'delete_image':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->deleteImage($_POST);
						break;

					// Lesson
					case 'update_lesson':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->updateLesson($_POST);
						//$this->template->output = print_r($_POST,true);
						break;
					case 'add_lesson':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->addLesson($_POST);
						break;
					case 'delete_lesson':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->deleteLesson($_POST);
						break;

					// Lesson Plan
					case 'add_lessonplan':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->addItem('LessonPlans', $_POST);
						break;
					case 'delete_lessonplan':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->deleteLessonPlan($_POST);
						break;
					case 'update_lessonplan':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->updateLessonPlan($_POST);
						break;

					// Class
					case 'add_class':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->addItem('Classes', $_POST);
						break;
					case 'delete_class':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->deleteClass($_POST);
						break;
					case 'update_class':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->updateClass($_POST);
						break;



				}
				break;

			case 'image_upload':
				$this->template->output = $this->uploadFile($_FILES['image_file']);
				break;

			default:
				$this->template = new View('config');
				$this->template->data = $data;
				break;
		}
	}


	
	private function addItem($table, $info)
	{
		unset($info['id']);
		$ret = DB::insert($table)
						->columns(array_keys($info))
						->values(array_values($info))
						->execute();
		$id = $ret[0];
		return $id;
	}

	private function uploadFile($file_info)
	{
		if (move_uploaded_file($file_info['tmp_name'], $this->_image_upload_dir . $file_info['name']))
		{
			$image_info = array();

			$image_info['name'] = $file_info['name'];
			$image_info['url'] = mysql_real_escape_string('/images/uploads/');
			$image_info['path'] = mysql_real_escape_string('/web_root/images/uploads/');

			$db = Database::instance();
			$sql = "INSERT INTO Images
								(name, url, path)
							VALUES
								('{$image_info['name']}', '{$image_info['url']}', '{$image_info['path']}')";
			list($index, $row_count) = $db->query(DATABASE::INSERT, $sql, FALSE);
			$image_info['id'] = $index;
			$image_info['icon'] = "{$image_info['url']}{$image_info['name']}";
			return json_encode($image_info);
		}
		else
		{
			return "0";
		}
	}


	// Lesson Plan

	private function getLessonPlanList()
	{
		$db = Database::instance();
		$sql = "SELECT id, name
						FROM LessonPlans";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);

		return json_encode($ret->as_array());
	}

	private function deleteLessonPlan($info)
	{
		$ret = DB::delete('LessonPlans')->where('id', '=', intval($info['id']))->execute();
		return $ret;
	}

	private function updateLessonPlan($info)
	{
		$id = $info['id'];
		unset($info['id']);

		return DB::update('LessonPlans')->set($info)->where('id', '=', $id)->execute();
	}


	// Class

	private function getClassList()
	{
		$db = Database::instance();
		$sql = "SELECT id, name
						FROM Classes";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);

		return json_encode($ret->as_array());
	}

	private function deleteClass($info)
	{
		$ret = DB::delete('Classes')->where('id', '=', intval($info['id']))->execute();
		return $ret;
	}

	private function updateClass($info)
	{
		$id = $info['id'];
		unset($info['id']);

		return DB::update('Classes')->set($info)->where('id', '=', $id)->execute();
	}


	
	// Lesson
	private function getLesson($request)
	{
		$id = $request['id'];
		$db = Database::instance();

		$sql = "SELECT l_iq.ImageQuestions_id,
									 lp_l.Lessons_id,
									 l_iq.LessonPlan_Lessons_id,
									 iq.Images_id, CONCAT(i.url, i.name) AS icon,
									 l_iq.order_index, iq.text
						FROM Lesson_ImageQuestions AS l_iq
						JOIN ImageQuestions AS iq ON (l_iq.ImageQuestions_id = iq.id)
						JOIN Images AS i ON (iq.Images_id = i.id)
						JOIN LessonPlan_Lessons AS lp_l ON (l_iq.LessonPlan_Lessons_id = lp_l.id)
						JOIN Lessons AS l ON (lp_l.Lessons_id = l.id)
						WHERE lp_l.Lessons_id = $id";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$question_record_list = $ret->as_array();

		$question_info_list = array();
		foreach ($question_record_list as $question)
		{
			$question_info_list[] = $question;
		}

		$lesson_info = array();
		$lesson_info['Lessons_id'] = $id;
		$lesson_info['question_info_list'] = $question_info_list;

		return json_encode($lesson_info);
	}

	private function getLessonList()
	{
		$lesson_list = array();


		$db = Database::instance();
		$sql = "SELECT id, name
						FROM Lessons";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);

		$lesson_record_list = $ret->as_array();
		foreach ($lesson_record_list as $record)
		{
			$lesson_info = array();
			$lesson_info['id'] = $record['id'];
			$lesson_info['lesson_name'] = $record['name'];

			$sql = "SELECT l_iq.ImageQuestions_id,
										 lp_l.Lessons_id,
										 l_iq.LessonPlan_Lessons_id,
										 iq.Images_id, CONCAT(i.url, i.name) AS icon,
										 l_iq.order_index, iq.text,
										 l_iq.id AS Lesson_ImageQuestions_id
							FROM Lesson_ImageQuestions AS l_iq
							JOIN ImageQuestions AS iq ON (l_iq.ImageQuestions_id = iq.id)
							JOIN Images AS i ON (iq.Images_id = i.id)
							JOIN LessonPlan_Lessons AS lp_l ON (l_iq.LessonPlan_Lessons_id = lp_l.id)
							WHERE lp_l.Lessons_id = {$record['id']}
							ORDER BY l_iq.order_index ASC";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$question_record_list = $ret->as_array();

			$question_info_list = array();
			foreach ($question_record_list as $question)
			{
				$question_info_list[] = $question;
			}

			$lesson_info['question_info_list'] = $question_info_list;
			$lesson_list[] = $lesson_info;
		}



		return json_encode($lesson_list);
	}

	private function addLesson($info)
	{
		$ret = DB::insert('Lessons')
						->columns(array('name'))
						->values(array($info['lesson_name']))
						->execute();
		$Lessons_id = $ret[0];

		$ret = DB::insert('LessonPlan_Lessons')
						->columns(array('Lessons_id', 'Class_LessonPlans_id'))
						->values(array($Lessons_id, 1))
						->execute();
		$LessonPlan_Lessons_id = $ret[0];

		foreach ($info['question_info_list'] as $question_info)
		{

			$ret = DB::insert('ImageQuestions')
							->columns(array('text', 'Images_id'))
							->values(array($question_info['text'], $question_info['Images_id']))
							->execute();
			$ImageQuestions_id = $ret[0];

			$ret = DB::insert('Lesson_ImageQuestions')
							->columns(array('order_index', 'ImageQuestions_id', 'LessonPlan_Lessons_id'))
							->values(array($question_info['order_index'], $ImageQuestions_id, $LessonPlan_Lessons_id))
							->execute();
		}


		return $Lessons_id;
	}

	private function deleteLesson($info)
	{
		$ret = DB::select('id')
						->from('LessonPlan_Lessons')
						->where('Lessons_id', '=', $info['id'])
						->execute();
		$ret = $ret->as_array();
		$LessonPlan_Lessons_id = $ret[0]['id'];

		foreach ($info['question_info_list'] as $question_info)
		{
			if (! empty($question_info['ImageQuestions_id']))
			{
				$ret = DB::delete('Lesson_ImageQuestions')
								->where('ImageQuestions_id', '=', $question_info['ImageQuestions_id'])
								->and_where('LessonPlan_Lessons_id', '=', $LessonPlan_Lessons_id)
								->execute();

				$ret = DB::delete('ImageQuestions')
							->where('id', '=', $question_info['ImageQuestions_id'])
							->execute();

			}
		}

		$ret = DB::delete('LessonPlan_Lessons')
						->where('id', '=', $LessonPlan_Lessons_id)
						->execute();

		$ret = DB::delete('Lessons')
						->where('id', '=', $info['id'])
						->execute();




		return true;
	}

	private function updateLesson($info)
	{
		$ret = DB::select('id')
						->from('LessonPlan_Lessons')
						->where('Lessons_id', '=', $info['id'])
						->execute();
		$ret = $ret->as_array();
		$LessonPlan_Lessons_id = $ret[0]['id'];

		$ret = DB::update('Lessons')
						->set(array('name' => $info['lesson_name']))
						->where('id', '=', $info['id'])
						->execute();

		foreach ($info['question_info_list'] as $question_info)
		{
			if (empty($question_info['ImageQuestions_id']))
			{
				$ret = DB::insert('ImageQuestions')
							->columns(array('text', 'Images_id'))
							->values(array($question_info['text'], $question_info['Images_id']))
							->execute();
				$ImageQuestions_id = $ret[0];

				$ret = DB::insert('Lesson_ImageQuestions')
								->columns(array('order_index', 'ImageQuestions_id', 'LessonPlan_Lessons_id'))
								->values(array($question_info['order_index'], $ImageQuestions_id, $LessonPlan_Lessons_id))
								->execute();
			}
			else
			{
				$ret = DB::update('ImageQuestions')
								->set(array(
										'text' => $question_info['text'],
										'Images_id' => $question_info['Images_id']
										))
								->where('id', '=', $question_info['ImageQuestions_id'])
								->execute();

				$ret = DB::update('Lesson_ImageQuestions')
								->set(array(
										'order_index' => $question_info['order_index'],
										'ImageQuestions_id' => $question_info['ImageQuestions_id'],
										'LessonPlan_Lessons_id' => $question_info['LessonPlan_Lessons_id']
										))
								->where('id', '=', $question_info['Lesson_ImageQuestions_id'])
								->execute();
			}
		}


		return true;
	}


	// Tutor

	private function getTutorList()
	{
		$db = Database::instance();
		$sql = "SELECT t.*,
						CONCAT(i.url, i.name) AS icon
						FROM Tutors AS t
						LEFT OUTER JOIN Images AS i ON (t.Images_id = i.id)";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);

		return json_encode($ret->as_array());
	}

	private function updateTutor($tutor_info)
	{
		$id = $tutor_info['id'];
		unset($tutor_info['id']);

		return DB::update('Tutors')->set($tutor_info)->where('id', '=', $id)->execute();
	}

	private function deleteTutor($tutor_info)
	{
		$ret = DB::delete('Tutors')->where('id', '=', intval($tutor_info['id']))->execute();
		return $ret;
	}



	// Pupil

	private function getPupilList()
	{
		$db = Database::instance();
		$sql = "SELECT p.*,
						CONCAT(i.url, i.name) AS icon
						FROM Pupils AS p
						LEFT OUTER JOIN Images AS i ON (p.Images_id = i.id)";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);

		return json_encode($ret->as_array());
	}

	private function updatePupil($pupil_info)
	{
		$id = $pupil_info['id'];
		unset($pupil_info['id']);

		return DB::update('Pupils')->set($pupil_info)->where('id', '=', $id)->execute();
	}

	private function addPupil($pupil_info)
	{
		unset($pupil_info['id']);
		$ret = DB::insert('Pupils')
						->columns(array_keys($pupil_info))
						->values(array_values($pupil_info))
						->execute();
		$id = $ret[0];
		return $id;
	}

	private function deletePupil($pupil_info)
	{
		$ret = DB::delete('Pupils')->where('id', '=', intval($pupil_info['id']))->execute();
		return $ret;
	}


	// Image

	private function getImageList()
	{
		$db = Database::instance();
		$sql = "SELECT i.*, CONCAT(i.url, i.name) AS icon
						FROM Images AS i";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);

		return json_encode($ret->as_array());
	}

	private function deleteImage($image_info)
	{
		$db = Database::instance();
		$sql = "SELECT CONCAT(path, name) AS file_path
						FROM Images
						WHERE id = {$image_info['id']}";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$ret = $ret->as_array();

		$file_path = APPPATH . $ret[0]['file_path'];

		unlink($file_path);

		$ret = DB::delete('Images')->where('id', '=', intval($image_info['id']))->execute();
		return $ret;
	}


	// Session


	private function getSessionList()
	{
	  $db = Database::instance();
		/*
	  $sql = "SELECT ts.id, ts.hash,
						CONCAT(p.first_name, ' ', p.middle_name, ' ', p.last_name) AS pupil_name,
						CONCAT(p_i.url, p_i.name) AS pupil_icon,
						CONCAT(t.first_name, ' ', t.middle_name, ' ', t.last_name) AS tutor_name,
						CONCAT(t_i.url, t_i.name) AS tutor_icon,
						l_q.order_index,
						q.name AS question_name, q.text AS question_text, q_i.name AS question_image,
						l.name AS lesson_name, l.id AS Lessons_id,
						lp.name AS lesson_plan_name,
						c.name AS class_name
						FROM TutoringSessions AS ts
						JOIN Pupils AS p ON (ts.Pupils_id = p.id)
						JOIN Images AS p_i ON (p.Images_id = p_i.id)
						JOIN Tutors AS t ON (ts.Tutors_id = t.id)
						JOIN Images AS t_i ON (t.Images_id = t_i.id)
						JOIN Lesson_ImageQuestions AS l_q ON (ts.Lesson_ImageQuestions_id = l_q.id)
						JOIN ImageQuestions AS q ON (l_q.ImageQuestions_id = q.id)
						JOIN Images AS q_i ON (q.Images_id = q_i.id)
						JOIN LessonPlan_Lessons AS lp_l ON (l_q.LessonPlan_Lessons_id = lp_l.id)
						JOIN Lessons AS l ON (lp_l.Lessons_id = l.id)
						JOIN Class_LessonPlans AS c_lp ON (lp_l.Class_LessonPlans_id = c_lp.id)
						JOIN Classes AS c ON (c_lp.Classes_id = c.id)
						JOIN LessonPlans AS lp ON (c_lp.LessonPlans_id = lp.id)
						ORDER BY ts.id
						";
		 *
		 */
		$sql = "SELECT *
						FROM TutoringSessions AS ts
						WHERE ts.StatusCodes_id <> 3
						ORDER BY ts.id";
	  $ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$session_list = $ret->as_array();
		foreach($session_list as &$session_info)
		{
			$sql = "SELECT p.*, CONCAT(i.url, i.name) AS icon
							FROM Pupils AS p
							JOIN Images AS i ON (p.Images_id = i.id)
							WHERE p.id = {$session_info['Pupils_id']}";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$ret = $ret->as_array();
			$session_info['pupil_info'] = $ret[0];

			$sql = "SELECT t.*, CONCAT(i.url, i.name) AS icon
							FROM Tutors AS t
							JOIN Images AS i ON (t.Images_id = i.id)
							WHERE t.id = {$session_info['Tutors_id']}";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$ret = $ret->as_array();
			$session_info['tutor_info'] = $ret[0];

			$sql = "SELECT l.*, name AS lesson_name
							FROM Lesson_ImageQuestions AS l_iq
							JOIN LessonPlan_Lessons AS lp_l ON (l_iq.LessonPlan_Lessons_id = lp_l.id)
							JOIN Lessons AS l ON (lp_l.Lessons_id = l.id)
							WHERE l_iq.id = {$session_info['Lesson_ImageQuestions_id']}";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$ret = $ret->as_array();
			$lesson_info = $ret[0];

			$sql = "SELECT iq.*, CONCAT(i.url, i.name) AS icon
							FROM Lesson_ImageQuestions AS l_iq
							JOIN ImageQuestions AS iq ON (l_iq.ImageQuestions_id = iq.id)
							JOIN Images AS i ON (iq.Images_id = i.id)
							JOIN LessonPlan_Lessons AS lp_l ON (l_iq.LessonPlan_Lessons_id = lp_l.id)
							JOIN Lessons AS l ON (lp_l.Lessons_id = l.id)
							WHERE l.id = {$lesson_info['id']}";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$lesson_info['question_info_list'] = $ret->as_array();

			$session_info['lesson_info'] = $lesson_info;

		}


	  return json_encode($session_list);
	}

	private function addSession($info)
	{

		$hash = md5(time());

		$db = Database::instance();
	  $sql = "SELECT l_iq.id
						FROM Lesson_ImageQuestions AS l_iq
						LEFT OUTER JOIN LessonPlan_Lessons AS lp_l ON (l_iq.LessonPlan_Lessons_id = lp_l.id)
						WHERE lp_l.Lessons_id = {$info['Lessons_id']}
						ORDER BY l_iq.order_index ASC
						LIMIT 1";
	  $ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$ret = $ret->as_array();
		$Lesson_ImageQuestions_id = $ret[0]['id'];

		$ret = DB::insert('TutoringSessions')
						->columns(array('hash', 'Pupils_id', 'Tutors_id', 'Lesson_ImageQuestions_id'))
						->values(array($hash, $info['Pupils_id'], $info['Tutors_id'], $Lesson_ImageQuestions_id))
						->execute();
		$Sessions_id = $ret[0];

		return $Sessions_id;
	}

	private function deleteSession($info)
	{
		$ret = DB::update('TutoringSessions')
						->set(array('StatusCodes_id' => 3))
						->where('id', '=', $info['session_info']['id'])
						->execute();
		return true;
	}

	private function updateSession($info)
	{
		$db = Database::instance();
	  $sql = "SELECT l_iq.id
						FROM Lesson_ImageQuestions AS l_iq
						LEFT OUTER JOIN LessonPlan_Lessons AS lp_l ON (l_iq.LessonPlan_Lessons_id = lp_l.id)
						WHERE lp_l.Lessons_id = {$info['lesson_info']['id']}
						ORDER BY l_iq.order_index ASC
						LIMIT 1";
	  $ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$ret = $ret->as_array();
		$Lesson_ImageQuestions_id = $ret[0]['id'];

		$ret = DB::update('TutoringSessions')
						->set(array(
								'Pupils_id' => $info['pupil_info']['id'],
								'Tutors_id' => $info['tutor_info']['id'],
								'Lesson_ImageQuestions_id' => $Lesson_ImageQuestions_id
								))
						->where('id', '=', $info['session_info']['id'])
						->execute();

		return true;
	}

	

	
	
	
	

} 
