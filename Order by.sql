SELECT * FROM books;

SELECT book_id,author_fname ,author_lname FROM BOOKS
ORDER BY released_year;

SELECT title,pages FROM books
ORDER BY pages,title DESC;

SELECT title,author_fname,author_lname FROM books
ORDER BY 2;

SELECT CONCAT(author_fname, ' ', author_lname) AS author FROM BOOKS 
ORDER BY author;