SELECT SUM(pages) 
FROM books;

SELECT author_lname, SUM(pages), max(pages) AS maximum_pages
FROM books
GROUP BY author_lname;

SELECT author_lname, COUNT(*),SUM(released_year)
FROM books
GROUP BY author_lname;



