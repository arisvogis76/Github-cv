SELECT * FROM books
WHERE pages = (SELECT MIN(pages) FROM books);

INSERT INTO books (title,pages) VALUES ('my life in words',634); 

SELECT title,pages FROM books
WHERE pages = (SELECT MAX(pages) FROM books);

SELECT title, released_year FROM books 
WHERE released_year = (SELECT MIN(released_year) FROM books);



