<?php defined('SYSPATH') or die('No direct script access.');

//require_once APPPATH . '/classes/ui/generator/pupil.php';

class Controller_Pupil extends Controller_Template {
	public $template = 'text';

	private $progress_bar_cell_count = 10;

	public function action_index()
	{

		session_start();
		if ( ! $_SESSION['JH_LOGGED_IN']) {
			Request::instance()->redirect('login');
		}
		

		$data = array();
		switch ($_REQUEST['action'])
		{
			case 'get_list':
				switch ($_GET['type'])
				{
					case 'current_lesson':
						$this->template->output = $this->getCurrentLesson($_GET['session_hash']);
						break;
					case 'session_list':
						$this->template->output = $this->getSessionList();
						break;
				}
				break;
			
			case 'get':
				switch ($_REQUEST['type'])
				{
					case 'current_image':
						$this->template->output = $this->getCurrentImage($_REQUEST['session_hash']);
						break;
				}
				break;

			default:
				$data['image_info'] = getimagesize(APPPATH . 'web_root/images/uploads/star.png');
				$progress_bar = array();
				$cell_list = array();
				for ($i = 0; $i < $this->progress_bar_cell_count; $i++)
				{
					$cell = array();
					$cell['url'] = '/images/uploads/star.jpg';
					$cell_list[] = $cell;
				}
				$progress_bar['cell_list'] = $cell_list;
				$data['progress_bar'] = $progress_bar;

				$display_image = array();
				$display_image['url'] = '/images/coyote.jpg';
				$data['display_image'] = $display_image;
				$data['display_text'] = 'coyote';
				$this->template = new View('pupil');
				$this->template->data = $data;
				break;
		}
	}

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
		$sql = "SELECT ts.*, l_iq.order_index
						FROM TutoringSessions AS ts
						LEFT OUTER JOIN Lesson_ImageQuestions AS l_iq ON (ts.Lesson_ImageQuestions_id = l_iq.id)
						WHERE ts.StatusCodes_id <> 3
						ORDER BY ts.id";
	  $ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$session_list = $ret->as_array();
		foreach($session_list as &$session_info)
		{
			$sql = "SELECT p.*, CONCAT(i.url, i.name) AS icon
							FROM Pupils AS p
							LEFT OUTER JOIN Images AS i ON (p.Images_id = i.id)
							WHERE p.id = {$session_info['Pupils_id']}";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$ret = $ret->as_array();
			$session_info['pupil_info'] = $ret[0];

			$sql = "SELECT t.*, CONCAT(i.url, i.name) AS icon
							FROM Tutors AS t
							LEFT OUTER JOIN Images AS i ON (t.Images_id = i.id)
							WHERE t.id = {$session_info['Tutors_id']}";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$ret = $ret->as_array();
			$session_info['tutor_info'] = $ret[0];

			$sql = "SELECT l.*, name AS lesson_name
							FROM Lesson_ImageQuestions AS l_iq
							LEFT OUTER JOIN LessonPlan_Lessons AS lp_l ON (l_iq.LessonPlan_Lessons_id = lp_l.id)
							LEFT OUTER JOIN Lessons AS l ON (lp_l.Lessons_id = l.id)
							WHERE l_iq.id = {$session_info['Lesson_ImageQuestions_id']}";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$ret = $ret->as_array();
			$lesson_info = $ret[0];

			$sql = "SELECT iq.*, CONCAT(i.url, i.name) AS icon,
										pa.id AS answer_id, pa.image_answer, pa.text_answer, pa.timestamp AS answer_timestamp,
										l_iq.order_index, l_iq.id AS Lesson_ImageQuestions_id
							FROM Lesson_ImageQuestions AS l_iq
							LEFT OUTER JOIN ImageQuestions AS iq ON (l_iq.ImageQuestions_id = iq.id)
							LEFT OUTER JOIN Images AS i ON (iq.Images_id = i.id)
							LEFT OUTER JOIN LessonPlan_Lessons AS lp_l ON (l_iq.LessonPlan_Lessons_id = lp_l.id)
							LEFT OUTER JOIN Lessons AS l ON (lp_l.Lessons_id = l.id)
							LEFT OUTER JOIN PupilAnswers AS pa ON (l_iq.id = pa.Lesson_ImageQuestions_id)
							WHERE l.id = {$lesson_info['id']}
							ORDER BY l_iq.order_index ASC";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$lesson_info['question_info_list'] = $ret->as_array();

			$session_info['lesson_info'] = $lesson_info;

		}


	  return json_encode($session_list);
	}


	private function getCurrentImage($session_hash)
	{
		$db = Database::instance();
		$sql = "SELECT ts.id, ts.display_content,
						l_q.order_index,
						iq.name AS question_name, iq.text AS question_text,
						CONCAT(i.url, i.name) AS icon,
						(SELECT COUNT(*) FROM Lesson_ImageQuestions AS tmp WHERE tmp.LessonPlan_Lessons_id = l_q.LessonPlan_Lessons_id) AS total_questions
						FROM TutoringSessions AS ts
						JOIN Lesson_ImageQuestions AS l_q ON (ts.Lesson_ImageQuestions_id = l_q.id)
						JOIN ImageQuestions AS iq ON (l_q.ImageQuestions_id = iq.id)
						JOIN Images AS i ON (iq.Images_id = i.id)
						WHERE ts.hash = '$session_hash'
						ORDER BY ts.id
						LIMIT 1";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);

		return json_encode(array_pop($ret->as_array()));
	}

} 
