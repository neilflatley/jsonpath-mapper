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

export const mapArrayObject = {
  application_context: {
    brand_name: () => 'revitive.com',
    locale: ({ currentLang }) => {
      return `${currentLang
        .substring(0, 3)
        .toLowerCase()}${currentLang.substring(3, 5).toUpperCase()}`;
    },
    shipping_preference: () => 'SET_PROVIDED_ADDRESS',
  },
  purchase_units: [
    {
      payee: { email_address: '', merchant_id: '' },
      payer: {
        email_address: 'customerDetails.email',
        name: {
          given_name: 'customerDetails.first_name',
          surname: 'customerDetails.last_name',
        },
        address: {
          address_line_1: 'billingAddress.line1',
          address_line_2: 'billingAddress.line2',
          admin_area_2: 'billingAddress.city',
          admin_area_1: 'billingAddress.state',
          postal_code: 'billingAddress.postal_code',
          country_code: 'billingAddress.country_iso_2',
        },
      },
      shipping: {
        name: {
          full_name: ({ customerDetails: { first_name, last_name } }) =>
            `${first_name} ${last_name}`,
        },
        address: {
          address_line_1: 'shippingAddress.line1',
          address_line_2: 'shippingAddress.line2',
          admin_area_2: 'shippingAddress.city',
          admin_area_1: 'shippingAddress.state',
          postal_code: 'shippingAddress.postal_code',
          country_code: 'shippingAddress.country_iso_2',
        },
      },
      amount: {
        value: 'orderAmount',
        breakdown: {
          item_total: {
            value: 'subTotal',
            currency_code: 'dictionary.currency',
          },
          shipping: {
            value: 'shipping',
            currency_code: 'dictionary.currency',
          },
          tax_total: {
            value: 'taxAmount',
            currency_code: 'dictionary.currency',
          },
          discount: {
            $path: 'discountValue',
            $formatting: {
              value: '.',
              currency_code: 'dictionary.currency',
            },
            $disable: ret => !ret,
          },
        },
      },
    },
  ],
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
