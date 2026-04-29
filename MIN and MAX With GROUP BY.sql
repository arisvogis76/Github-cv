SELECT author_fname, author_lname,COUNT(*) AS books_written, MIN(released_year) AS earliest_release, MAX(released_year) AS latest_release,
MAX(pages) AS longest_book
FROM books
GROUP BY author_lname,author_fname;



 