
desc books;
select * from books;
SELECT DISTINCT author_lname FROM books;
SELECT released_year FROM books;
SELECT DISTINCT released_year FROM books;
SELECT DISTINCT concat(author_fname, ' ', author_lname) AS Full_name FROM books;
SELECT DISTINCT author_fname,author_lname,released_year  FROM books;


