import mapJson from '../../dist/json-mapper';
import MappingTemplate from '../../src/models/Template';
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
} from './jsonpath.acceptance';

export const allPrices = {
  booksData: [17.96, 10, 20, 15.67],
  books: 63.63,
  bicycles: 19.95,
  software: 0,
};

export const disableEmptyParams = {
  fields:
    '["sys","title","entryTitle","entryYears","entryYear","year","courseImagery","primaryImage","awardLevel","courseLevel"]',
  linkDepth: 4,
  pageSize: 12,
  pageIndex: 0,
  versionStatus: 'latest',
  location: '257fa015-8170-4689-8166-f55f1aaa78f0',
};

export const nullSearchPayload = {
  type: 'SET_SEARCH_ENTRIES',
  facet: 'postgraduate-courses',
  nextFacet: {
    entries: {
      isLoading: false,
      isError: false,
      items: [],
    },
    queryDuration: 16748.44500000472,
    pagingInfo: {
      pageCount: 0,
      totalCount: 0,
      pageSize: 0,
      pageIndex: 0,
    },
    preloaded: true,
  },
  preload: true,
};

type WhereField = {
  field: string;
  equalTo?: string | number | boolean;
  exists?: boolean;
};
export type WhereClause =
  | {
      or?: WhereClause[];
      and?: WhereClause[];
      not?: WhereClause[];
    }
  | WhereField;

export type PostBody = {
  pageIndex: string;
  pageSize: string;
  fields: string[];
  orderBy: { asc?: string; desc?: string }[];
  where: WhereClause[];
};

export const postBody: PostBody = {
  pageIndex: '0',
  pageSize: '12',
  fields: ['sys', 'title', 'description', 'thumbnail'],
  orderBy: [
    { desc: 'sys.version.published' },
    { desc: 'sys.version.modified' },
  ],
  where: [
    { field: 'sys.versionStatus', equalTo: 'latest' },
    {
      or: [
        {
          and: [
            { field: 'sys.metadata.includeInSearch', exists: true },
            { field: 'sys.metadata.includeInSearch', equalTo: true },
          ],
        },
        { field: 'sys.metadata.includeInSearch', exists: false },
      ],
    },
    {
      and: [
        { field: 'sys.dataFormat', equalTo: 'webpage' },
        {
          not: [{ field: 'sys.contentTypeId', equalTo: 'newCoursesWebpage' }],
        },
      ],
    },
  ],
};

// const tt: MappingTemplate<PostBody> = postBody => ({
//   ...postBody,
//   egg: '',
// });

const yy: MappingTemplate<PostBody> = {
  ab: '',
  cd: {
    $path: 'where',
    $formatting: (where: WhereClause[], rt) =>
      where.map(clause => ('field' in clause ? clause.equalTo : null))
        .length !== 0,
    $disable: a => !a,
    egg: '',
  },
  ef: {
    gh: {
      $path: '',
    },
  },
};
mapJson<PostBody, PostBody>(postBody, yy);

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
