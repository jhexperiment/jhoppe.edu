<?php
header("Content-type: $content_type");
$image = new Imagick($filename);
echo $image;
?>
