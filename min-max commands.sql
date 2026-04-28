SELECT max(released_year) FROM books;

SELECT max(pages) FROM books;

SELECT MIN(author_lname) FROM books;

SELECT MIN(author_lname), MAX(author_lname) FROM books;

SELECT MAX(pages) AS TOTAL_PAGES , title FROM books
GROUP BY title
ORDER BY title;





