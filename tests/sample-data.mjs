export const store = {
  books: [
    {
      id: 1,
      title: 'Clean Code',
      author: { name: 'Robert C. Martin' },
      price: 17.96,
    },
    {
      id: 2,
      title: 'Maintainable JavaScript',
      author: { name: 'Nicholas C. Zakas' },
      price: 10,
    },
    {
      id: 3,
      title: 'Agile Software Development',
      author: { name: 'Robert C. Martin' },
      editor: { name: 'Yussef Miller' },
      price: 20,
    },
    {
      id: 4,
      title: 'JavaScript: The Good Parts',
      author: { name: 'Douglas Crockford' },
      price: 15.67,
    },
  ],
  bicycle: {
    color: 'red',
    price: 19.95,
  },
  software: {
    id: 1,
    title: 'jsonpath-mapper',
    author: { name: 'Neil Flatley' },
    cost: 0.0,
  },
};

export const nullSearchPayload = {
  duration: 16748.44500000472,
  facet: 'postgraduate-courses',
  pageIndex: 0,
  payload: null,
  preload: true,
};

export const queryParamsToCourseApi = {
  selectedFilters: {
    cluster: '',
    'study-options': '',
    location: '257fa015-8170-4689-8166-f55f1aaa78f0',
    'start-date': '',
  },
  pageIndex: 0,
  orderBy: ['entryTitle'],
  contentTypeIds: ['course'],
  linkDepth: 3,
  versionStatus: 'latest',
  pageSize: 12,
  projectId: 'website',
  searchTerm: '',
  webpageTemplates: [],
  customWhere: [],
  weightedSearchFields: [
    { fieldId: 'entryTitle', weight: 100 },
    { fieldId: 'title', weight: 100 },
    { fieldId: 'sys.uri', weight: 100 },
  ],
  fields: [
    'sys',
    'title',
    'entryTitle',
    'entryYears',
    'entryYear',
    'year',
    'courseImagery',
    'primaryImage',
    'awardLevel',
    'courseLevel',
  ],
  filters: [
    { expressionType: 'contentType', value: [] },
    { expressionType: 'contentType', value: [] },
    {
      expressionType: 'contentType',
      key: 'sys.contentTypeId',
      value: ['257fa015-8170-4689-8166-f55f1aaa78f0'],
    },
    { expressionType: 'contentType', value: [] },
  ],
};

export const getQuery = {
  fields: 'sys,title,description,thumbnail',
  orderBy: '[{"desc":"sys.version.published"},{"desc":"sys.version.modified"}]',
  pageIndex: '0',
  pageSize: '12',
  where:
    '[{"field":"sys.versionStatus","equalTo":"latest"},{"or":[{"and":[{"field":"sys.metadata.includeInSearch","exists":true},{"field":"sys.metadata.includeInSearch","equalTo":true}]},{"field":"sys.metadata.includeInSearch","exists":false}]},{"and":[{"field":"sys.dataFormat","equalTo":"webpage"},{"not":[{"field":"sys.contentTypeId","equalTo":"newCoursesWebpage"}]}]}]',
};
