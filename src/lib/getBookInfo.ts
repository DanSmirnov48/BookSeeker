interface BookInfo {
  title: string;
  author: string;
  releaseYear: string;
  description: string;
  previewLink: string;
  imageUrl: string | null;
}

export default async function getBookInfo(bookTitle: string): Promise<BookInfo | null> {
  try {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      bookTitle
    )}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const book = data.items[0].volumeInfo;

      const title = book.title || "Title not found";
      const author = (book.authors && book.authors[0]) || "Author not found";
      const releaseYear = book.publishedDate || "Release year not found";
      const description = book.description || "Description not found";
      const imageUrl = book.imageLinks?.thumbnail || null;
      const previewLink = book.previewLink || null;

      // book.industryIdentifiers

      const bookInfo: BookInfo = {
        title,
        author,
        releaseYear,
        description,
        previewLink,
        imageUrl,
      };
      return bookInfo;
    } else {
      throw new Error("Book not Found!");
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An Error: " + error);
  }
}