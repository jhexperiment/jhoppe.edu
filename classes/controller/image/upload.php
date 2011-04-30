<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Image_Upload extends Controller_Template {
	public $template = 'image/upload';

	public function action_index() {





		if (!empty($_FILES['userfile'])) {
			$arrFiles = $_FILES['userfile'];
			for ($i = 0; $i < count($arrFiles['tmp_name']); $i++) {
				if (preg_match('/.*(jpg|png|gif|jpeg)$/', $arrFiles['name'][$i])) {

					if (move_uploaded_file($arrFiles['tmp_name'][$i], "images/uploads/{$arrFiles['name'][$i]}")) {

						$image_info = array();

						$image_info['name'] = $arrFiles['name'][$i];
						$image_info['url'] = '/images/uploads/';
						$image_info['path'] = '/web_root/images/uploads/';
						//$image_info['url'] = mysql_real_escape_string('/images/uploads/');
						//$image_info['path'] = mysql_real_escape_string('/web_root/images/uploads/');


						$ret = DB::insert('Images')
											->columns(array_keys($image_info))
											->values(array_values($image_info))
											->execute();
						$image_info['id'] = $ret[0];
						/*
							$db = Database::instance('default');
						$sql = "INSERT INTO Images
											(name, url, path)
										VALUES
											('{$image_info['name']}', '{$image_info['url']}', '{$image_info['path']}')";
						list($index, $row_count) = $db->query(DATABASE::INSERT, $sql, FALSE);
						*/
						//$image_info['id'] = $index;
						//$image_info['icon'] = "{$image_info['url']}{$image_info['name']}";
						//return json_encode($image_info);
						$this->template->success = "File uploaded successfully.";
					}
					else {
						$this->template->success = "File failed to upload, sorry.";
					}
					
				}
				elseif (preg_match('/*.zip$/', $arrFiles['name'])) {
					// extract images only from zip
				}
			}
		}
		/*
		if (move_uploaded_file($file_info['tmp_name'], $this->_image_upload_dir . $file_info['name']))
		{
			$image_info = array();

			$image_info['name'] = $file_info['name'];
			$image_info['url'] = mysql_real_escape_string('/images/uploads/');
			$image_info['path'] = mysql_real_escape_string('/web_root/images/uploads/');



			$db = Database::instance('default');
			$sql = "INSERT INTO Images
								(name, url, path)
							VALUES
								('{$image_info['name']}', '{$image_info['url']}', '{$image_info['path']}')";
			list($index, $row_count) = $db->query(DATABASE::INSERT, $sql, FALSE);
			$image_info['id'] = $index;
			$image_info['icon'] = "{$image_info['url']}{$image_info['name']}";
			return json_encode($image_info);
		}
		*/
	}

} 
