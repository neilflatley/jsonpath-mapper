# jsonpath-mapper

A json to json transformation utility with a powerful templating methodology to use when translating for example API responses into a domain object for use in your reusable components in your JavaScript applications. Path resolution underpinned by a light weight implementation of `JSONPath`, the spiritual successor to `XPath`

This library can be used in JavaScript applications with the `mapJson` function and in React applications with the `useMapper` hook.

# Mappers

## Mappers? Transformations?
A mapper is essentially a function to map one object into a different representation of the same object.

JavaScript has its own `map` function to work over arrays e.g. `const prices = products.map(product => product.price);` This example transforms the inner `product` from the `products` into just a price and returns it to the new prices array.

This is a mapper in its simplest form, often the requirement extends far beyond transforming a predictable list of products that will always have a price into something a lot more sophisticated and complex.

All of this can be achieved in raw JavaScript but often results in boilerplate overload, pyramids of null-checking, if statements, switch cases, brittle code, bloated bundles, unminifiable code and a monolith to manage or change. Just to normalise a list of responses so we can use the data in our application. 

Another approach could be to write our applications around a fixed model that every implementation must conform to.

Any kind of sophisticated mapping from one object format into another is best referred to as object `transformation`.

This pattern is often needed for many reasons when integrating systems and applications together:

"*applications that need to be integrated by a messaging system* [e.g. JSON responses from a REST API] *rarely agree on a common data format. For example, an accounting system is going to have a different notion of a Customer object than a customer relationship management system.... Integrating existing applications often means that we do not have the liberty of modifying the applications to work more easily with other systems. Rather, the integration solution has to accommodate and resolve the differences between the varying systems. The Message Transformation pattern offers a general solution to such differences in data formats.*"
https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageTransformationIntro.html

This package was created for JavaScript developers to have an intuitive, scalable and robust solution to this common problem.


## Mapping Templates

Briefly mentioned in the examples below in the simplest form using jsonpath expressions to resolve the values for the object we wish to create

A mapping template can be likened to the "wiring" of a complicated Hi-Fi system, each property in the target object needs to be specified and then "wired-in" for it to recieve its value/input from a specific place.

We will often need to massage, or enrich our mapped data to suit a specific need. There are functions available at every stage that will help us achieve this.

We can wire in a property's value with a `jsonpath` string expression, an array of `jsonpath` string expressions (to find a value at one of the paths on an 'or' basis) or we can open up a simple "wire function", with the element we are currently scoped supplied as the first argument to the function.

### Wire functions

Instead of having `jsonpath` find our value, we can open a function to 'wire' in our value for that property using raw JavaScript

```
const mapping = {
    bookTitle: book => book.title,
    isbn: book => {
        const isbns = ProductHelper.GetCodes(book.id);
        return isbns.join(', ') || 'n/a';
    },
    isBook: () => 'Yes',
}

const webProduct = mapJson(book, mapping);
```

That's great but now we can't use `jsonpath` to find the values inside our object?

### $path / $formatting

### $return

### $default

### $disable

## useMapper / mapJson

In its simplest form, map one json object to another

**This is the most important method as all the other methods are just helper implementations of this method**

| Argument | Type   | Description                                                                                                                                                                                                                                                |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| json     | object | The original object we wish to transform into another                                                                                                                                                                                                      |
| template | object | A keyed object representing the object we wish to create, the value for each key is a string that is the path to the data we require inside the original object (look for `jsonpath` documentation online, or `simple-jsonpath` as per our implementation) |

```
const cardProps = useMapper(
    entry,
    {
        title: 'heading',
        descripton: 'summary',
        image: 'mainImage.asset.sys.uri',
        tags: 'category[*].title',
        uri: 'sys.uri',
    });

<Card title={cardProps.title} {...cardProps} />

console.log(cardProps);

# Object({
#     title: 'Interesting book',
#     description: 'This is a reader for sure.',
#     image: '/image-library/interesting001.png',
#     tags: [ 'Interesting', 'Thought provoking' ],
#     uri: '/webstore/books/interesting-book',
# })
```




## useEntriesMapper / mapEntries

Take a list of entries and transform each entry to a specific object based on the value inside a given field Id - default is `sys.contentTypeId` - to return an array of transformed objects

This is useful for normalising a list of different content type entries into a common format, such as result cards.

| Argument | Type     | Description                                                                                                                                                                                                                                                                                                                   |
| -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| entries  | object[] | The array of entries we wish to transform into another format                                                                                                                                                                                                                                                                 |
| mappers  | object   | A keyed object with a key for each content type we wish to transform into another format. The value is an object representing the object we wish to create (see `template` in `mapJson`)) |

```
const searchResults = useEntriesMapper(
    searchResponse.items,
    {
        blogPage: {
            title: 'blogTitle',
            description: 'metadata.md_description',
            image: 'thumbnail.asset.sys.uri',
        },
        contentPage: {
            title: 'title',
            description: 'description',
            image: 'composer[*].image[0].asset.sys.uri',
        },
        productPage: {
            title: 'title',
            description: ['summary', 'leadInText'],
            image: 'images[0].asset.sys.uri'
        },
    });

<StyledSearch>
    <SearchResults cards={searchResults}>
</StyledSearch>
```

## useComposerMapper / mapComposer

Take a composer array and transform the `value` from each composer item into a specific object based on the value inside the `type` field.

```
const composerProps = useComposerMapper(
    composer,
    {
        textBlock: {
            heading: 'title',
            copy: 'description',
        },
        heroImage: {
            uri: 'image.asset.sys.uri',
            altText: 'image.altText',
            fullWidth: composerItem => composerItem.display === 'Full Width',
        },
    });

composerProps.map(itemProps => {
    switch (itemProps._type) {
        case 'textBlock':
            return <TextBlock {...itemProps} />;
        case 'heroImage':
            return <HeroImage {...itemProps} />;
    };
});
```

## jpath

This is really the most important function but we rarely need to invoke it as the `mapJson` function natively calls `jpath` on each string expression you supply in the properties of the template argument

This takes an object and looks for a value at a specific location inside that object, using a `jsonpath` expression

```
 const title = jpath('title', entry);
 ```
 This is pointless, we could just say `const title = entry.title;` or `const { title } = entry;`

 Consider this complex expression, an entry containing an array of related entries which has a component with a repeatable image field with the uri inside a deeply nested object that could be null or undefined at any level of the expression. How many lines of JavaScript would it take to work out the related image uris? :see-no-evil:
 ```
 const relatedImages = jpath('relatedContent[*].heroBanner.images[0].asset.sys.uri', entry);
```
