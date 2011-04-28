SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `jhoppe` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;

-- -----------------------------------------------------
-- Table `jhoppe`.`Classes`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`Classes` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Index' ,
  `name` VARCHAR(45) NULL COMMENT 'Name' ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jhoppe`.`LessonPlans`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`LessonPlans` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Index' ,
  `name` VARCHAR(45) NULL COMMENT 'Name' ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jhoppe`.`Lessons`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`Lessons` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(45) NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jhoppe`.`Images`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`Images` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Index' ,
  `name` VARCHAR(45) NULL COMMENT 'Name' ,
  `url` VARCHAR(45) NULL COMMENT 'URL Path' ,
  `path` VARCHAR(45) NULL COMMENT 'File Path' ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jhoppe`.`ImageQuestions`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`ImageQuestions` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Index' ,
  `name` VARCHAR(45) NULL COMMENT 'Name' ,
  `text` VARCHAR(45) NULL COMMENT 'Display Text' ,
  `Images_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_ImageQuestions_Images1` (`Images_id` ASC) ,
  CONSTRAINT `fk_ImageQuestions_Images1`
    FOREIGN KEY (`Images_id` )
    REFERENCES `jhoppe`.`Images` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jhoppe`.`Class_LessonPlans`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`Class_LessonPlans` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `Classes_id` INT NOT NULL ,
  `LessonPlans_id` INT NOT NULL ,
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
COMMENT = 'Classes and LessonPlans many-many joiner table.';


-- -----------------------------------------------------
-- Table `jhoppe`.`LessonPlan_Lessons`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`LessonPlan_Lessons` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Index' ,
  `Lessons_id` INT NOT NULL ,
  `Class_LessonPlans_id` INT NOT NULL ,
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
COMMENT = 'LessonPlan and Lessons many-many joiner table.';


-- -----------------------------------------------------
-- Table `jhoppe`.`Lesson_ImageQuestions`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`Lesson_ImageQuestions` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `order_index` INT NOT NULL DEFAULT 0 COMMENT 'Ordering of Questions. ie. 1,2,3,..' ,
  `ImageQuestions_id` INT NOT NULL ,
  `LessonPlan_Lessons_id` INT NOT NULL ,
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
COMMENT = 'Lesson and ImageQuestions many-many joiner table.';


-- -----------------------------------------------------
-- Table `jhoppe`.`Pupils`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`Pupils` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `first_name` VARCHAR(45) NOT NULL ,
  `middle_name` VARCHAR(45) NULL ,
  `last_name` VARCHAR(45) NOT NULL ,
  `Images_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_Pupils_Images1` (`Images_id` ASC) ,
  CONSTRAINT `fk_Pupils_Images1`
    FOREIGN KEY (`Images_id` )
    REFERENCES `jhoppe`.`Images` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jhoppe`.`Tutors`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`Tutors` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `first_name` VARCHAR(45) NOT NULL ,
  `middle_name` VARCHAR(45) NULL ,
  `last_name` VARCHAR(45) NOT NULL ,
  `Images_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_Tutors_Images1` (`Images_id` ASC) ,
  CONSTRAINT `fk_Tutors_Images1`
    FOREIGN KEY (`Images_id` )
    REFERENCES `jhoppe`.`Images` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jhoppe`.`StatusCodes`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`StatusCodes` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(45) NOT NULL ,
  `description` VARCHAR(45) NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jhoppe`.`TutoringSession`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`TutoringSession` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `hash` VARCHAR(45) NOT NULL ,
  `Pupils_id` INT NOT NULL ,
  `Tutors_id` INT NOT NULL ,
  `Lesson_ImageQuestions_id` INT NOT NULL ,
  `StatusCodes_id` INT NOT NULL DEFAULT 1 ,
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
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jhoppe`.`PupilAnswers`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `jhoppe`.`PupilAnswers` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `answer` VARCHAR(45) NOT NULL ,
  `timestamp` INT NOT NULL ,
  `TutoringSession_id` INT NOT NULL ,
  `Lesson_ImageQuestions_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_PupilAnswers_TutoringSession1` (`TutoringSession_id` ASC) ,
  INDEX `fk_PupilAnswers_Lesson_ImageQuestions1` (`Lesson_ImageQuestions_id` ASC) ,
  CONSTRAINT `fk_PupilAnswers_TutoringSession1`
    FOREIGN KEY (`TutoringSession_id` )
    REFERENCES `jhoppe`.`TutoringSession` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PupilAnswers_Lesson_ImageQuestions1`
    FOREIGN KEY (`Lesson_ImageQuestions_id` )
    REFERENCES `jhoppe`.`Lesson_ImageQuestions` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
