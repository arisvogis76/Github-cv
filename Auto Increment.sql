CREATE TABLE unique_cats3 (
cat_id INT auto_increment,
name VARCHAR(100),
age int,
 PRIMARY KEY (cat_id)
 );
 
INSERT INTO unique_cats3 (name,age)
VALUES ('bingo',5);
select * FROM UNIQUE_CATS3;