<?php defined('SYSPATH') or die('No direct script access.');

class UI_Generator_Pupil
{
	private $_dom;
	public $_config;

	private function getDefaultConfig()
	{
		$config = array();
		$config['image'] = array();

		$config['text'] = 'blah';
		
		$config['image'] = array();
		$config['image']['path'] = '/images/aligator.jpg';
		$image_info = getimagesize(APPPATH . '/web_root' . $config['image']['path']);
		$config['image']['width'] = $image_info[0];
		$config['image']['height'] = $image_info[1];

		$config['content'] = array();
		$config['content']['width'] = 600;
		$config['content']['height'] = 700;

		$config['progress_bar'] = array();
		$config['progress_bar']['width'] = $config['content']['width'];
		$config['progress_bar']['height'] = 125;
		$config['progress_bar']['total_count'] = 10;
		$config['progress_bar']['index'] = 3;
		$config['progress_bar']['image'] = array();
		$config['progress_bar']['image']['path'] = '/images/star.jpg';
		$image_info = getimagesize(APPPATH . '/web_root' . $config['progress_bar']['image']['path']);
		$config['progress_bar']['image']['width'] = $image_info[0];
		$config['progress_bar']['image']['height'] = $image_info[1];


		//$config['image']['width'] = round($config['content']['width'] / 2);
		//$config['image']['height'] = $config['content']['height'];
		//$config['image']['left'] = round(($config['content']['width'] - $config['image']['width']) / 2);

		$config['height'] = $config['content']['height'] + $config['progress_bar']['height'];
		$config['width'] = max($config['content']['width'], $config['progress_bar']['width']);
		return $config;
	}

	private function init()
	{
		$this->_dom = new DOMDocument();
		if (empty($config))
		{
			$config = $this->getDefaultConfig();
		}
		$this->_config = $config;
	}

	public function __construct($config=array())
	{
		$this->init();

		$this->renderContainer();
	}

	private function renderImage($display_content)
	{

/*
		if ($this->_config['content']['width'] > $this->_config['content']['height'])
		{ // content is wide
			if ($this->_config['image']['width'] > $this->_config['image']['height'])
			{// image is wide
				$width = $this->_config['content']['width'];
				$height = round($this->_config['content']['height'] * ($width / $this->_config['image']['width']));
				$top = round(abs($height - $this->_config['content']['height']) / 2);
				//$top = 0;
				$left = 0;
			}
			else
			{// content is taller than image
				$width = $this->_config['content']['width'];
				$height = round($this->_config['image']['height'] * ($width / $this->_config['content']['height']));
				$top = round(abs($height - $this->_config['content']['height']) / 2);
				$left = 0;
			}
		}
		else
		{ // content is wider than image
			if ($this->_config['image']['height'] > $this->_config['content']['height'])
			{// image is taller than content
				$height = $this->_config['content']['height'];
				$width = round($this->_config['image']['width'] * ($this->_config['content']['width'] / $height));
				$left = round(abs($width - $this->_config['content']['width']) / 2);
				$top = 0;
			}
			else
			{// content is taller than image
			

			}
			
		}
*/
		$top = 0;
		$left = 0;
		if ($this->_config['content']['height'] == $this->_config['content']['width'])
		{
			$width = $this->_config['image']['width'] *
											($this->_config['content']['height'] / $this->_config['image']['height']);
			$height = $this->_config['content']['height'];
		}
		else if ($this->_config['content']['width'] > $this->_config['content']['height'])
		{
			$width = round($this->_config['image']['width'] *
											($this->_config['content']['height'] / $this->_config['image']['height']));
			$height = $this->_config['content']['height'];
			$top = 0;
			$left = round(($this->_config['content']['width'] - $width	) / 2);
		}
		else
		{
			if ($this->_config['image']['width'] < $this->_config['image']['height'])
			{
				$width = round($this->_config['image']['width'] *
											($this->_config['content']['height'] / $this->_config['image']['height']));
				$height = $this->_config['content']['height'];
				$top = 0;
				$left = round(($this->_config['content']['width'] - $width	) / 2);
			}
			else
			{
				$width = $this->_config['content']['width'];
				$height = round($this->_config['image']['height'] *
												($this->_config['content']['width'] / $this->_config['image']['width']));;
				$top = round(($this->_config['content']['height'] - $height	) / 2);
				$left = 0;
				
			}
		}

		//display_image
		$display_image = $this->_dom->createElement('div');
		$style = "width:{$this->_config['content']['width']}px;";
		$style .= "height:{$this->_config['content']['height']}px;";
		$style .= 'position:absolute;';
		$style .= 'z-index:0;';
		$display_image->setAttribute('style', $style);
		$display_image->setAttribute('id', 'display_image');
		
		$image = $this->_dom->createElement('img');
		$image->setAttribute('src', $this->_config['image']['path']);
		$style = "width:{$width}px;";
		$style .= "height:{$height}px;";
		$style .= "position:absolute;";
		$style .= "top:{$top}px; left:{$left}px;";
		$image->setAttribute('style', $style);

		$display_image->appendChild($image);

		$display_content->appendChild($display_image);
	}

	private function renderText($display_content)
	{
		//display_text
		$display_text = $this->_dom->createElement('div');
		$style = "width:{$this->_config['content']['width']}px;";
		//$style .= "height:{$this->_config['height']};";
		$style .= 'text-align:center;';
		$style .= 'postition:absolute;';
		$top = round($this->_config['content']['height'] / 2);
		$style .= "top:{$top}px; left:0;";
		$style .= 'z-index:1;';
		$display_text->setAttribute('style', $style);
		$display_text->setAttribute('id', 'display_text');
		$display_text->nodeValue = 'blah';

		$display_content->appendChild($display_text);
	}

	private function renderContent($display_container)
	{
		//display_content
		$display_content = $this->_dom->createElement('div');
		$style = "width:{$this->_config['content']['width']}px;";
		$style .= "height:{$this->_config['content']['height']}px;";
		$style .= 'postition:absolute;';
		$style .= 'top:0; left:0;';
		$display_content->setAttribute('style', $style);
		$display_content->setAttribute('id', 'display_content');

		$this->renderImage($display_content);
		$this->renderText($display_content);

		$display_container->appendChild($display_content);
	}

	private function renderProgressBar($display_container)
	{
		//progress_bar
		$progress_bar = $this->_dom->createElement('div');
		$style = "width:{$this->_config['progress_bar']['width']}px;";
		$style .= "height:{$this->_config['progress_bar']['height']}px;";
		//$style .= "height:{$this->_config['height']};";
		$style .= 'position:relative;';
		$style .= 'bottom:0; left:0;';
		$progress_bar->setAttribute('style', $style);
		$progress_bar->setAttribute('id', 'progress_bar');

		$this->renderProgressBarCells($progress_bar);

		$display_container->appendChild($progress_bar);
	}

	private function renderProgressBarCells($progress_bar)
	{
		$cell_width = round($this->_config['progress_bar']['width'] / $this->_config['progress_bar']['total_count']);
		for($i = 0; $i < $this->_config['progress_bar']['total_count']; $i++)
		{
			$cell_container = $this->_dom->createElement('div');
			$cell = $this->_dom->createElement('img');
			$style = "width:{$cell_width}px;";
			$style .= "height:{$this->_config['progress_bar']['height']}px;";
			$cell->setAttribute('style', $style);
			$style .= 'position:absolute;';
			if ($i < $this->_config['progress_bar']['index'])
			{
				$cell->setAttribute('src', $this->_config['progress_bar']['image']['path']);
				$cell_container->appendChild($cell);
			}
			$left = $cell_width * $i;
			$style .= "top:0; left:{$left}px;";
			$cell_container->setAttribute('style', $style);
			

			$progress_bar->appendChild($cell_container);
		}
	}

	private function renderContainer()
	{
		//display_container
		$display_container = $this->_dom->createElement('div');
		$style = "width:{$this->_config['width']}px;";
		$style .= "height:{$this->_config['height']}px;";
		$style .= "margin:auto;";
		$style .= "border:1px solid #CCCCCC;";
		$display_container->setAttribute('style', $style);
		$display_container->setAttribute('id', 'display_container');
		
		$this->renderContent($display_container);
		$this->renderProgressBar($display_container);

		$this->_dom->appendChild($display_container);
	}
	
	public function saveHTML()
	{
		return $this->_dom->saveHTML();
	}
}
?>
