SELECT * 
FROM books
WHERE title LIKE '% %';

SELECT * 
FROM books
WHERE title NOT LIKE '% %';

SELECT title, author_fname,author_lname
FROM books
WHERE author_fname LIKE 'da%';

SELECT title
FROM books
WHERE title NOT LIKE '%a%';


