SELECT COUNT(*) AS TOTAL_BOOKS 
FROM books;

SELECT COUNT(*) AS TOTAL_BOOKS, released_year
FROM books
GROUP BY released_year;

SELECT stock_quantity,title,COUNT(*) AS TOTAL_BOOKS
FROM books
GROUP BY stock_quantity,title;

SELECT author_lname,author_fname,AVG(released_year)
FROM books
GROUP BY author_lname,author_fname;

SELECT CONCAT(author_fname, ' ', author_lname) AS author, pages FROM books
WHERE pages = (SELECT MAX(pages) FROM books);

SELECT released_year AS year, COUNT(*) AS books,AVG(pages) AS avg_pages 
FROM books
GROUP BY year
ORDER BY year;