import {
  allBooksAuthors,
  allBooksAuthorNames,
  allNamesInBooks,
  allAuthorNames,
  allBookTitlesByAuthorName,
  allBookTitlesByPriceLessThan,
  firstBookTitle,
  lastBookTitle,
  firstTwoBookTitles,
  lastTwoBookTitles,
  twoBookTitlesFromSecondPosition,
  booksByVariousAuthorWithPriceLessThan,
  booksByVariousAuthor
} from "./jsonpath.mappers";

export const allPrices = {
  booksData: "books[*].price",
  books: {
    $path: "books[*].price",
    $return: books => books.reduce((a, b) => a + b, 0)
  },
  bicycles: "bicycle.price",
  software: ["software.price", "software.cost"]
};

export const jsonPathTests = {
  allBooksAuthors,
  allBooksAuthorNames,
  allNamesInBooks,
  allAuthorNames,
  allBookTitlesByAuthorName,
  allBookTitlesByPriceLessThan,
  firstBookTitle,
  lastBookTitle,
  firstTwoBookTitles,
  lastTwoBookTitles,
  twoBookTitlesFromSecondPosition,
  booksByVariousAuthorWithPriceLessThan,
  booksByVariousAuthor
};
