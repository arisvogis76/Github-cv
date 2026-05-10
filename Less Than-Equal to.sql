SELECT title,released_year
 FROM books
 WHERE released_year<2000;
 
SELECT *
FROM books
WHERE released_year>2000
order by released_year;
 
SELECT title,pages 
 FROM books
 WHERE pages < 200 OR released_year>2005;
 
SELECT title, released_year 
FROM books
WHERE released_year>=2010;
 
 
 
 