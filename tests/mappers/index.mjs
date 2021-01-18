export * as jsonPathTests from './jsonpath.mappers';

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
  additionalTest: {
    versionStatus: {
      $path: 'whereArr',
      $formatting: {
        fieldId: ['field', 'or', 'and'],
        value: ['equalTo', 'exists'],
      },
      $return: arr => arr.filter(f => f.fieldId === 'sys.versionStatus'),
    },
  },
};

export const siteConfigState = {
  contactDetails: 'contactDetails',
  footerLinks: {
    $path: 'footerLinks',
    $formatting: {
      title: 'title',
      links: {
        $path: 'links',
        $formatting: {
          title: 'entryTitle',
          path: 'sys.uri',
        },
      },
    },
  },
  legalText: 'footerLegalText',
  splitPaymentsBasketValue: 'splitPaymentsMinimumBasketValue',
  language: 'sys.language',
  mailingListSignUp: {
    title: 'mailingListSignUp.title',
    text: 'mailingListSignUp.text',
    path: 'mailingListSignUp.path.sys.uri',
    buttonText: 'mailingListSignUp.buttonText',
  },
  mainNavigation: {
    $path: 'mainNavigation',
    $formatting: {
      title: 'entryTitle',
      link: 'itemLink.sys.uri',
      id: 'sys.id',
      children: {
        $path: 'children',
        $formatting: {
          title: 'entryTitle',
          link: 'sys.uri',
        },
      },
      offers: {
        $path: 'offers',
        $formatting: {
          id: 'sys.id',
          accentColor: {
            $path: 'accentColor',
            $formatting: accentColor => accentColor.toLowerCase(),
          },
          tag: 'offerStrapline',
          title: 'title',
          offer: 'subTitle',
          image: 'specialOffer.image[0].asset.sys.uri',
          badges: {
            $path: 'specialOfferHighlight',
            $formatting: {
              label: 'offerBenefit',
              color: 'benefitBackground',
            },
          },
          description: 'specialOffer.description',
          price: 'specialOffer.netsuiteProduct.unitPrice',
          monthly: {
            $path: 'specialOffer.netsuiteProduct.unitPrice',
            $formatting: price => (parseFloat(price) / 4).toFixed(2),
          },
          vatRelief: '',
          buttonText: 'ctaText',
          productInfo: {
            $path: 'specialOffer',
            $formatting: {
              name: 'entryTitle',
              image: 'image[0].asset.sys.uri',
              price: {
                $path: ['price', 'netsuiteProduct.unitPrice'],
                $formatting: price => parseFloat(price).toFixed(2),
              },
              link: 'sys.uri',
              itemId: 'netsuiteProduct.itemId',
              id: 'netsuiteProduct.sku',
            },
          },
        },
      },
    },
  },
};
