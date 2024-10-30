import { expect } from 'chai';
// import pkg from 'jsonpath-mapper';
import mapJson, { mapJsonAsync } from 'jsonpath-mapper';
import {
  store,
  nullSearchPayload,
  queryParamsToCourseApi,
  getQuery,
} from './sample-data.mjs';
import * as m from './mappers/index.mjs';
import * as a from './acceptance/index.mjs';
import { siteConfigEntry } from './sample-data.mjs';
import { mapArrayObject } from './sample-data.mjs';

// const { default: mapJson, mapJsonAsync } = pkg;
console.log('mapJson: ', mapJson);
console.log('mapJsonAsync: ', mapJsonAsync);

let count = 0;

/* eslint-disable no-unused-vars */
const logData = (data) => console.log('\ntest data: \n', data);
const logTemplate = (template) => console.log('template: \n', template);
const logResult = (result) => console.log('\nresult: \n', result, '\n');
const logTest = (testName, testNum) =>
  console.log(
    '\n===============================\n\n',
    'Test',
    testNum ? `${testNum}: ${testName}` : testName,
    '\n----------------\n'
  );

const doTest = (data, testName, mapper, key) => {
  let result = {};
  let asyncResult = {};
  let testNum = 0;
  // eslint-disable-next-line mocha/no-top-level-hooks
  before(async () => {
    testNum = count += 1;
    result = mapJson(data, m[mapper]);
    asyncResult = await mapJsonAsync(data, m[mapper]);
  });
  it(testName, () => {
    expect(key ? result[key] : result).to.deep.equal(
      key ? a[mapper][key] : a[mapper]
    );
  });
  it(`${testName} (async)`, () => {
    expect(key ? asyncResult[key] : asyncResult).to.deep.equal(
      key ? a[mapper][key] : a[mapper]
    );
  });
  // after(() => {
  //   logTest(testName, testNum);
  //   logTemplate(key ? m[mapper][key] : m[mapper]);
  //   logResult(key ? result[key] : result);
  // });
};

// Testing the tests
describe('First test', () => {
  it('Test the tests: Should assert true to be true', () => {
    expect(true).to.be.true;
  });
});

// Basic mapper template JSONPath expressions
describe('JSONPath tests', () => {
  doTest(store, 'Find all author objects', 'jsonPathTests', 'allBooksAuthors');
  doTest(
    store,
    'Find all author names',
    'jsonPathTests',
    'allBooksAuthorNames'
  );
  doTest(store, 'Find all names in books', 'jsonPathTests', 'allNamesInBooks');
  doTest(store, 'Find all author names', 'jsonPathTests', 'allAuthorNames');
  doTest(
    store,
    'Find all book titles by author name',
    'jsonPathTests',
    'allBookTitlesByAuthorName'
  );
  doTest(
    store,
    'Find all book titles by price less than 20',
    'jsonPathTests',
    'allBookTitlesByPriceLessThan'
  );
  doTest(store, 'Find first book title', 'jsonPathTests', 'firstBookTitle');
  doTest(store, 'Find last book title', 'jsonPathTests', 'lastBookTitle');
  doTest(
    store,
    'Find two first book titles',
    'jsonPathTests',
    'firstTwoBookTitles'
  );
  doTest(
    store,
    'Find two last book titles',
    'jsonPathTests',
    'lastTwoBookTitles'
  );
  doTest(
    store,
    'Find two book titles from second position',
    'jsonPathTests',
    'twoBookTitlesFromSecondPosition'
  );
  doTest(
    store,
    'long subpaths: find books by various authors, for under $20',
    'jsonPathTests',
    'booksByVariousAuthorWithPriceLessThan'
  );
  doTest(
    store,
    'nested predicates: same query, however ".author.name" isn\'t repeated. For JSON with many levels, enables much more compact queries.',
    'jsonPathTests',
    'booksByVariousAuthor'
  );
});

// Mapper feature tests
describe('Multiple paths with $path and $return hooks', () => {
  doTest(store, 'All prices for products in store', 'allPrices');
  doTest(nullSearchPayload, 'Dealing with a null payload', 'nullSearchPayload');
  doTest(
    mapArrayObject,
    'Mapping an object that is an array',
    'mapArrayObject'
  );
  doTest(
    queryParamsToCourseApi,
    'Converting query params to an api request',
    'disableEmptyParams'
  );
  doTest(getQuery, 'Convert a GET query into a POST body', 'postBody');
  doTest(
    siteConfigEntry,
    'Convert a SiteConfig entry into app state',
    'siteConfigState'
  );
});
