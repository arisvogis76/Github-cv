CREATE TABLE friends(
name varchar(10)
);
INSERT INTO friends (name) 
VALUES ('tom'),('pablo'),('paul');
DESC friends;

CREATE TABLE states(abbr CHAR(2));
INSERT INTO states (abbr) 
VALUES ('CA'),('NY');
INSERT INTO states(abbr) VALUES ('x');
SELECT char_length(abbr) FROM STATES;
DESC states;