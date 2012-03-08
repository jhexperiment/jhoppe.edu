SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS `default_schema` ;

CREATE SCHEMA IF NOT EXISTS `jhoppe` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;

USE `jhoppe`;

CREATE  TABLE IF NOT EXISTS `jhoppe`.`Classes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Index' ,
  `name` VARCHAR(45) NULL DEFAULT NULL COMMENT 'Name' ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE IF NOT EXISTS `jhoppe`.`LessonPlans` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Index' ,
  `name` VARCHAR(45) NULL DEFAULT NULL COMMENT 'Name' ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE IF NOT EXISTS `jhoppe`.`Lessons` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(45) NULL DEFAULT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE IF NOT EXISTS `jhoppe`.`ImageQuestions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Index' ,
  `name` VARCHAR(45) NULL DEFAULT NULL COMMENT 'Name' ,
  `text` VARCHAR(45) NULL DEFAULT NULL COMMENT 'Display Text' ,
  `Images_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_ImageQuestions_Images1` (`Images_id` ASC) ,
  CONSTRAINT `fk_ImageQuestions_Images1`
    FOREIGN KEY (`Images_id` )
    REFERENCES `jhoppe`.`Images` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE IF NOT EXISTS `jhoppe`.`Images` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Index' ,
  `label` VARCHAR(45) NULL DEFAULT NULL ,
  `filename` VARCHAR(45) NULL DEFAULT NULL COMMENT 'Name' ,
  `ImageFolders_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_Images_ImageFolders1` (`ImageFolders_id` ASC) ,
  CONSTRAINT `fk_Images_ImageFolders1`
    FOREIGN KEY (`ImageFolders_id` )
    REFERENCES `jhoppe`.`ImageFolders` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE IF NOT EXISTS `jhoppe`.`Class_LessonPlans` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `Classes_id` INT(11) NOT NULL ,
  `LessonPlans_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_Class_LessonPlans_Classes` (`Classes_id` ASC) ,
  INDEX `fk_Class_LessonPlans_Lesson_Plans` (`LessonPlans_id` ASC) ,
  CONSTRAINT `fk_Class_LessonPlans_Classes`
    FOREIGN KEY (`Classes_id` )
    REFERENCES `jhoppe`.`Classes` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Class_LessonPlans_Lesson_Plans`
    FOREIGN KEY (`LessonPlans_id` )
    REFERENCES `jhoppe`.`LessonPlans` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci
COMMENT = 'Classes and LessonPlans many-many joiner table.';

CREATE  TABLE IF NOT EXISTS `jhoppe`.`LessonPlan_Lessons` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Index' ,
  `Lessons_id` INT(11) NOT NULL ,
  `Class_LessonPlans_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_LessonPlan_Lessons_Lessons1` (`Lessons_id` ASC) ,
  INDEX `fk_LessonPlan_Lessons_Class_LessonPlans1` (`Class_LessonPlans_id` ASC) ,
  CONSTRAINT `fk_LessonPlan_Lessons_Lessons1`
    FOREIGN KEY (`Lessons_id` )
    REFERENCES `jhoppe`.`Lessons` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_LessonPlan_Lessons_Class_LessonPlans1`
    FOREIGN KEY (`Class_LessonPlans_id` )
    REFERENCES `jhoppe`.`Class_LessonPlans` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci
COMMENT = 'LessonPlan and Lessons many-many joiner table.';

CREATE  TABLE IF NOT EXISTS `jhoppe`.`Lesson_ImageQuestions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `order_index` INT(11) NOT NULL DEFAULT 0 COMMENT 'Ordering of Questions. ie. 1,2,3,..' ,
  `ImageQuestions_id` INT(11) NOT NULL ,
  `LessonPlan_Lessons_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_Lesson_ImageQuestions_ImageQuestions1` (`ImageQuestions_id` ASC) ,
  INDEX `fk_Lesson_ImageQuestions_LessonPlan_Lessons1` (`LessonPlan_Lessons_id` ASC) ,
  CONSTRAINT `fk_Lesson_ImageQuestions_ImageQuestions1`
    FOREIGN KEY (`ImageQuestions_id` )
    REFERENCES `jhoppe`.`ImageQuestions` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Lesson_ImageQuestions_LessonPlan_Lessons1`
    FOREIGN KEY (`LessonPlan_Lessons_id` )
    REFERENCES `jhoppe`.`LessonPlan_Lessons` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci
COMMENT = 'Lesson and ImageQuestions many-many joiner table.';

CREATE  TABLE IF NOT EXISTS `jhoppe`.`Pupils` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `first_name` VARCHAR(45) NOT NULL ,
  `middle_name` VARCHAR(45) NULL DEFAULT NULL ,
  `last_name` VARCHAR(45) NOT NULL ,
  `Images_id` INT(11) NOT NULL DEFAULT 1 ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_Pupils_Images1` (`Images_id` ASC) ,
  CONSTRAINT `fk_Pupils_Images1`
    FOREIGN KEY (`Images_id` )
    REFERENCES `jhoppe`.`Images` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE IF NOT EXISTS `jhoppe`.`Tutors` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `first_name` VARCHAR(45) NOT NULL ,
  `middle_name` VARCHAR(45) NULL DEFAULT NULL ,
  `last_name` VARCHAR(45) NOT NULL ,
  `Images_id` INT(11) NOT NULL DEFAULT 2 ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_Tutors_Images1` (`Images_id` ASC) ,
  CONSTRAINT `fk_Tutors_Images1`
    FOREIGN KEY (`Images_id` )
    REFERENCES `jhoppe`.`Images` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE IF NOT EXISTS `jhoppe`.`TutoringSessions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `hash` VARCHAR(45) NOT NULL ,
  `display_content` VARCHAR(45) NOT NULL DEFAULT 'image' ,
  `Pupils_id` INT(11) NOT NULL ,
  `Tutors_id` INT(11) NOT NULL ,
  `Lesson_ImageQuestions_id` INT(11) NOT NULL ,
  `StatusCodes_id` INT(11) NOT NULL DEFAULT 1 ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_TutoringSession_Pupil1` (`Pupils_id` ASC) ,
  INDEX `fk_TutoringSession_Tutor1` (`Tutors_id` ASC) ,
  INDEX `fk_TutoringSession_Lesson_ImageQuestions1` (`Lesson_ImageQuestions_id` ASC) ,
  UNIQUE INDEX `hash_UNIQUE` (`hash` ASC) ,
  INDEX `fk_TutoringSession_StatusCodes1` (`StatusCodes_id` ASC) ,
  CONSTRAINT `fk_TutoringSession_Pupil1`
    FOREIGN KEY (`Pupils_id` )
    REFERENCES `jhoppe`.`Pupils` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TutoringSession_Tutor1`
    FOREIGN KEY (`Tutors_id` )
    REFERENCES `jhoppe`.`Tutors` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TutoringSession_Lesson_ImageQuestions1`
    FOREIGN KEY (`Lesson_ImageQuestions_id` )
    REFERENCES `jhoppe`.`Lesson_ImageQuestions` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TutoringSession_StatusCodes1`
    FOREIGN KEY (`StatusCodes_id` )
    REFERENCES `jhoppe`.`StatusCodes` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE IF NOT EXISTS `jhoppe`.`PupilAnswers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `image_answer` VARCHAR(45) NULL DEFAULT NULL ,
  `text_answer` VARCHAR(45) NULL DEFAULT NULL ,
  `timestamp` INT(11) NOT NULL ,
  `TutoringSession_id` INT(11) NOT NULL ,
  `Lesson_ImageQuestions_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_PupilAnswers_TutoringSession1` (`TutoringSession_id` ASC) ,
  INDEX `fk_PupilAnswers_Lesson_ImageQuestions1` (`Lesson_ImageQuestions_id` ASC) ,
  CONSTRAINT `fk_PupilAnswers_TutoringSession1`
    FOREIGN KEY (`TutoringSession_id` )
    REFERENCES `jhoppe`.`TutoringSessions` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PupilAnswers_Lesson_ImageQuestions1`
    FOREIGN KEY (`Lesson_ImageQuestions_id` )
    REFERENCES `jhoppe`.`Lesson_ImageQuestions` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE IF NOT EXISTS `jhoppe`.`StatusCodes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(45) NOT NULL ,
  `description` VARCHAR(45) NULL DEFAULT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE IF NOT EXISTS `jhoppe`.`ImageFolders` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(128) NULL DEFAULT NULL ,
  `rootPath` VARCHAR(1024) NULL DEFAULT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

