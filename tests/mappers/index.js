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
  booksByVariousAuthor,
} from './jsonpath.mappers';

export const allPrices = {
  booksData: 'books[*].price',
  books: {
    $path: 'books[*].price',
    $return: books => books.reduce((a, b) => a + b, 0),
  },
  bicycles: 'bicycle.price',
  software: ['software.price', 'software.cost'],
};

export const disableEmptyParams = {
  fields: ({ fields }) => JSON.stringify(fields),
  linkDepth: () => 4,
  pageSize: 'pageSize',
  pageIndex: 'pageIndex',
  term: { $path: 'searchTerm', $disable: t => !t },
  versionStatus: 'versionStatus',
  cluster: {
    $path: `selectedFilters.cluster`,
    $disable: f => !f,
  },
  location: {
    $path: `selectedFilters.location`,
    $disable: f => !f,
  },
  'study-options': {
    $path: `selectedFilters.study-options`,
    $disable: f => !f,
  },
  'start-date': {
    $path: `selectedFilters.start-date`,
    $disable: f => !f,
  },
};

export const nullSearchPayload = {
  type: () => 'SET_SEARCH_ENTRIES',
  facet: 'facet',
  nextFacet: {
    entries: {
      isLoading: () => false,
      isError: () => false,
      items: {
        $path: 'payload.items',
        $default: [],
      },
    },
    queryDuration: 'duration',
    pagingInfo: {
      pageCount: {
        $path: 'payload.pageCount',
        $default: 0,
      },
      totalCount: {
        $path: 'payload.totalCount',
        $formatting: totalCount => totalCount,
        $default: 0,
      },
      pageSize: {
        $path: 'payload.pageSize',
        $formatting: pageSize => pageSize,
        $default: 0,
      },
      pageIndex: action => action.pageIndex,
    },
    preloaded: { $path: 'preload', $default: false },
  },
  preload: 'preload',
};

export const postBody = {
  pageIndex: {
    $path: 'pageIndex',
    $default: '0',
  },
  pageSize: {
    $path: 'pageSize',
    $default: '25',
  },
  fields: {
    $path: 'fields',
    $formatting: fields => fields.split(','),
    $disable: o => !o,
  },
  orderBy: {
    $path: 'orderBy',
    $formatting: orderBy => JSON.parse(orderBy),
    $disable: o => !o,
  },
  where: {
    $path: 'where',
    $formatting: where => JSON.parse(where),
    $disable: w => !w,
  },
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
  booksByVariousAuthor,
};
