CREATE TABLE unique_cats (
cat_id INT NOT NULL PRIMARY KEY,
name VARCHAR(100),
age int);
INSERT INTO unique_cats (cat_id,name,age)
VALUES (1,'bingo',2);

INSERT INTO unique_cats (cat_id,name,age)
VALUES (2,'bingo',3);

SELECT * FROM unique_cats;

INSERT INTO unique_cats (cat_id,name,age)
VALUES (3,'bingo',99);