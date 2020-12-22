export const allBooksAuthors = {
  authors: 'books[*].author',
};

export const allBooksAuthorNames = {
  names: 'books[*].author.name',
};

export const allNamesInBooks = {
  names: 'books[*]..name',
};

export const allAuthorNames = {
  names: '..name',
};

// export const allBookTitlesByAuthorName = {
//   titles: 'books[?(@.author.name === "Robert C. Martin")].title',
// };

// export const allBookTitlesByPriceLessThan = {
//   titles: 'books[?(@.price < 20)].title',
// };

export const firstBookTitle = {
  title: 'books[0].title',
};

export const lastBookTitle = {
  title: 'books[-1:].title',
};

export const firstTwoBookTitles = {
  titles: 'books[:2].title',
};

export const lastTwoBookTitles = {
  titles: 'books[-2:].title',
};

export const twoBookTitlesFromSecondPosition = {
  titles: 'books[1:3].title',
};

// export const booksByVariousAuthorWithPriceLessThan = {
//   books:
//     '.books[?(@.price < 21 && (@.author.name.endsWith("Zakas") || @.author.name.startsWith("Douglas")))].title',
// };

// export const booksByVariousAuthor = {
//   books:
//     '.books[?(@.author.name.endsWith("Zakas") || @.price == 20 && @.title.startsWith("Agile"))].title',
// };
