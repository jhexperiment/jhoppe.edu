USE jhoppe;

INSERT INTO Images (`name`, `url`, `path`)
VALUES
('pupil_default.gif', '/images/pupil_icons/', '/web_root/images/pupil_icons/'),
('tutor_default.png', '/images/tutor_icons/', '/web_root/images/tutor_icons/');

INSERT INTO `jhoppe`.`StatusCodes` (`id` ,`name` ,`description`)
VALUES
(NULL , 'started', NULL),
(NULL , 'completed', NULL),
(NULL , 'deleted', NULL);
