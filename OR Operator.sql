SELECT title,author_lname,released_year
FROM books
WHERE author_lname='eggers' OR released_year>2010;

SELECT 1 < 5 OR 4=5;

SELECT title,pages 
FROM books
WHERE pages<200 OR title LIKE '%stories%';



