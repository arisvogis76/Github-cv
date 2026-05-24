SELECT 10 != 10;
SELECT 15>14 AND 99-5<=94;
SELECT 1 IN (5,3) OR 9 BETWEEN 8 AND 10;

SELECT *
FROM books
WHERE released_year<1980;

SELECT *
FROM books
WHERE author_lname='EGGERS' OR author_lname='CHABON';

SELECT *
FROM books
WHERE author_lname='LAHIRI' AND released_year>2000;

SELECT * 
FROM books
WHERE pages >=100 AND pages<=200;

SELECT * 
FROM books
WHERE author_lname LIKE'C%' OR author_lname LIKE 'S%';

SELECT title, author_lname,
CASE
    WHEN title LIKE '%stories%' THEN 'Short Stories'
    WHEN title = 'Just Kids' THEN 'Memoir' 
    WHEN title = 'A Heartbreaking Work of Staggering Genius' THEN 'Memior'
    ELSE 'Novel'
END AS type
FROM books;

SELECT author_fname, author_lname,
	CASE
        WHEN COUNT(*) = 1 THEN '1 book'
        ELSE CONCAT(COUNT(*), ' books')
	END AS count
FROM books
WHERE author_lname IS NOT NULL
GROUP BY author_fname, author_lname;



