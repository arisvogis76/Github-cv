SELECT *
FROM books
WHERE author_lname='Eggers' AND released_year>2010 AND title LIKE '%novel%';

SELECT 1>0 AND 8=8;
SELECT 1>0 AND 8=7;

SELECT title
FROM books
WHERE char_length(title)>30 AND pages>500;