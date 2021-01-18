export * as jsonPathTests from './jsonpath.acceptance';

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

export const postBody = {
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
  additionalTest: {
    versionStatus: [{ fieldId: 'sys.versionStatus', value: 'latest' }],
  },
};

export const siteConfigState = {
  contactDetails: {
    phone: '0800 014 6377',
    phoneLineTimes: 'Mon-Fri 8am-5:30pm, Sat 9am-4pm ',
    twitterLink: null,
    youTubeLink: null,
    facebookLink:
      'https://www.facebook.com/Revitive-LV-Canada-152762861578009/',
  },
  footerLinks: [
    {
      title: 'Products',
      links: [
        {
          title: 'Revitive Medic',
          path: '/ca/products/revitive-medic',
        },
        {
          title: 'Revitive IX',
          path: '/ca/products/revitive-prod-ix',
        },
      ],
    },
    {
      title: 'Customer service',
      links: [
        {
          title: 'Returns and Refunds',
          path: '/ca/returns',
        },
        {
          title: 'Shipping',
          path: '/ca/delivery',
        },
      ],
    },
    {
      title: 'Useful links',
      links: [
        {
          title: 'About Revitive',
          path: '/ca/about-us',
        },
        {
          title: 'Can I Use Revitive?',
          path: '/ca/can-i-use',
        },
        {
          title: 'Website Usage Terms & Conditions',
          path: '/ca/terms-of-use',
        },
        {
          title: 'Privacy Policy',
          path: '/ca/privacy-policy',
        },
        {
          title: 'How we use cookies',
          path: '/ca/cookies',
        },
        {
          title: 'Accessibility Guide',
          path: '/ca/accessibility',
        },
        {
          title: 'Register warranty',
          path: '/ca/warranty-registration',
        },
      ],
    },
  ],
  legalText:
    '<p>Revitive Circulation Booster&reg; (all models) should not be used by people who are fitted with an electronic implant, such as a pacemaker or AICD, being treated for, or have the symptoms of, a deep vein thrombosis, or are pregnant.</p>\n<p>Revitive Circulation Booster&reg; is intended to help reduce symptoms of poor circulation. It is not intended to treat underlying medical conditions.</p>\n<p>The Revitive Guarantee includes free standard P&amp;P worth &pound;7.99 in England &amp; Wales. Some areas of Scotland, Northern Ireland and other remote postcodes will incur a surcharge cost of &pound;19.99 for standard delivery. Next day, Saturday or express deliveries cost more, please ask our customer service team for a quote. If returned within 90 days, full refund of purchase price, minus collection fee of &pound;7.99 (some areas of Scotland and other remote postcodes will incur a surcharge cost of &pound;19.99). A list of postcodes that fall within remote locations can be found on our delivery page.</p>\n<p>**Individual results may vary**</p>\n<p>All special offers and bundles are only available to customers residing in the UK</p>\n<p>Copyright &copy; 2021 Actegy Ltd. All rights reserved&nbsp;</p>\n<p>Revitive is a trading name of<br />Actegy Ltd, <br />Company Number 04819502, <br />Reflex, Cain Road, <br />Bracknell, RG12 1HL</p>',
  splitPaymentsBasketValue: 50,
  language: 'en-CA',
  mailingListSignUp: {
    title: 'Sign up to our mailing list',
    text:
      'For free hints, tips & special offers, sign up using your email address',
    path: '/ca/sign-up',
    buttonText: 'Sign up',
  },
  mainNavigation: [
    {
      title: 'Home',
      link: '/ca',
      id: '08aacefe-1af2-412e-9456-8776266ef5cc',
      children: [],
      offers: [],
    },
    {
      title: 'Products',
      id: '7bb05862-5902-451d-8ca6-b6b11f7cf9b1',
      link: undefined,
      children: [
        {
          title: 'All products',
          link: '/ca/products',
        },
        {
          title: 'Revitive IX',
          link: '/ca/products/revitive-prod-ix',
        },
        {
          title: 'Revitive Medic',
          link: '/ca/products/revitive-medic',
        },
        {
          title: 'Revitive Cream',
          link: '/ca/accessories/revitive-cream',
        },
        {
          title: 'Revitive Electrode Body Pads',
          link: '/ca/accessories/revitive-tens-body-pads',
        },
        {
          title: 'Revitive IX Remote Control',
          link: '/ca/accessories/revitive-remote',
        },
        {
          title: 'Revitive Power Adaptor',
          link: '/ca/accessories/adaptor',
        },
        {
          title: 'Revitive Storage Bag',
          link: '/ca/accessories/storage-bag',
        },
      ],
      offers: [
        {
          id: 'c847455b-f1d2-4957-a18b-bee15ad01571',
          accentColor: 'red',
          tag: 'Best Deal',
          title: 'Revitive Medic',
          offer: 'Gold Package',
          image: '/image-library-ca/medic-offers.x05124733.png',
          badges: [
            {
              label: '3-Year Warranty',
              color: 'Orange fill',
            },
            {
              label: 'Bonus $25',
              color: 'Red fill',
            },
          ],
          description:
            '<ul>\n<li><strong>1&nbsp;</strong>Revitive Medic</li>\n<li><strong>3</strong> Year Gold Warranty</li>\n<li><strong> 1</strong> Bonus pack of body pads</li>\n<li>Free Delivery</li>\n</ul>',
          price: 299,
          monthly: '74.75',
          buttonText: 'Buy now',
          productInfo: {
            name: 'Revitive Medic Gold Package',
            image: '/image-library-ca/medic-offers.x05124733.png',
            price: '299.00',
            id: '2472',
            itemId: undefined,
          },
          vatRelief: undefined,
        },
        {
          id: 'f900ffc4-d45f-447c-be98-797ab6e2476b',
          accentColor: 'red',
          tag: 'Best Deal',
          title: 'Medic',
          offer: 'Complete Pain Management Pack',
          image: '/image-library-ca/revitive-medic.x697c74e8.png',
          badges: [
            {
              label: 'Save £104',
              color: 'Orange fill',
            },
            {
              label: '3-year Warranty',
              color: 'Red fill',
            },
          ],
          description:
            '<ul>\n<li>Revitive Medic GWP 1Pay Platinum Pack</li>\n<li>1 x revitive medic</li>\n<li>3 x body pads</li>\n<li>1 x carry bagFree shipping</li>\n<li>3 year warranty</li>\n</ul>',
          price: 317.29,
          monthly: '79.32',
          buttonText: 'Buy Now',
          productInfo: {
            name: 'Revitive Medic Platinum Bundle TEST',
            image: '/image-library-ca/revitive-medic.x697c74e8.png',
            price: '317.29',
            link: '/ca/special-offers/revitive-medic-platinum-bundle-test',
            id: '3423',
            itemId: undefined,
          },
          vatRelief: undefined,
        },
      ],
    },
    {
      title: 'Symptoms',
      link: '/ca/how-can-revitive-help-you',
      id: '3bdbb18e-3167-47ca-9d30-aa2708df07f0',
      children: [
        {
          title: 'How can Revitive help you?',
          link: '/ca/how-can-revitive-help-you',
        },
        {
          title: 'Poor Circulation',
          link: '/ca/symptoms/poor-circulation',
        },
        {
          title: 'Leg Pain',
          link: '/ca/symptoms/leg-pain',
        },
        {
          title: 'Swelling',
          link: '/ca/symptoms/swollen-feet',
        },
        {
          title: 'Neuropathic Pain',
          link: '/ca/symptoms/neuropathy',
        },
        {
          title: 'Osteoarthritis',
          link: '/ca/symptoms/arthritis',
        },
        {
          title: 'Diabetes',
          link: '/ca/symptoms/diabetes',
        },
      ],
      offers: [],
    },
    {
      title: 'Offers',
      link: '/ca/special-offers',
      id: '930f2fb2-3900-4e8f-ae7f-f1ae4cba6bf8',
      children: [],
      offers: [],
    },
  ],
};
