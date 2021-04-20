# jsonpath-mapper

A json to json transformation utility with a powerful templating methodology to use when translating for example API responses into a domain object for use in your reusable components in your JavaScript applications. Path resolution underpinned by a light weight implementation of `JSONPath`, the spiritual successor to `XPath`

This library can be used in JavaScript and TypeScript applications with the `mapJson` function and in React applications with the `useMapper` hook.

# Mappers

## Mappers? Transformations? Why?

A mapper is essentially a function to map one object into a different representation of the same object.

JavaScript has its own `map` function to work over arrays e.g. `const prices = products.map(product => product.price);` This example transforms the inner `product` from the `products` into just a price and returns it to the new prices array.

This is a mapper in its simplest form, often the requirement extends far beyond transforming a predictable list of products that will always have a price into something a lot more sophisticated and complex. Any kind of sophisticated mapping from one object format into another can be referred to as object "transformation".

All of this can be achieved in raw JavaScript but often results in boilerplate overload, pyramids of null-checking, if statements, switch cases, brittle code, bloated bundles, unminifiable code and a monolith to manage or change. Just to normalise a list of objects from our API responses so we can use the data in our application.

Another approach could be to write our applications around a fixed model that every implementation must conform to.

This pattern of mapping or remapping of objects is often needed for many reasons when integrating systems and applications together:

"_applications that need to be integrated by a messaging system_ [e.g. JSON responses from a REST API] _rarely agree on a common data format. For example, an accounting system is going to have a different notion of a Customer object than a customer relationship management system... Integrating existing applications often means that we do not have the liberty of modifying the applications to work more easily with other systems. Rather, the integration solution has to accommodate and resolve the differences between the varying systems. The Message Transformation pattern offers a general solution to such differences in data formats._"
https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageTransformationIntro.html

This package was created for JavaScript developers to apply an intuitive, scalable and robust templating methodology to this common problem.

## Mapping Templates

Briefly mentioned in the examples below in the simplest form using jsonpath expressions to resolve the values for the object we wish to create

A mapping template can be likened to the "wiring" of a complicated Hi-Fi system or an old fashioned telephone exchange, each property in the target object needs to be specified/available and then the value is "wired-in" for it to recieve its input from a specific place.

We will often need to massage, or enrich our mapped data to suit a specific need. There are functions available at every stage that will help us achieve this.

We can wire in any property's value with a JsonPath string expression, an array of JsonPath` string expressions (to find a value at one of the paths on an 'or' basis) or we can open up a simple "wire function", with the element we are currently scoped supplied as the first argument to the function. We will get to that later on, lets first concentrate on creating a mapping template to transform an object, doing some complex transformation purely with JsonPath.

### JsonPath expressions

JsonPath is a domain specific language which helps us easily locate deeply nested values from within a complex object. It is the spiritual successor to XPath, which is used with a template engine, to transform an XML document into another representation of the same data. We are using the same approach here except with a JavaScript object, using a template engine to build the representation of our new object and JsonPath expressions to locate and pass the data through from our source object.

It is recommended to read the example JsonPath expressions to understand how to use JsonPath:
#### v1.0:
Check the examples at https://github.com/dchester/jsonpath#readme or for the lightweight implementation some features are unavailable so a reduced list of examples are here: https://github.com/nico2che/jsonpath#readme. 

#### New in v1.1: 
v1.1 attempts to reinstate the full JsonPath feature set by changing the underlying package that does the real heavy lifting, querying our input object for our JsonPath expressions, to a more modern package which supports ESM bundling, and has less dependencies itself. v1.0 used a lighter-weight implementation of JsonPath which did reduce bundle sizes in exchange for removing support for JsonPath's more advanced syntax. https://jsonpath-plus.github.io/JSONPath/docs/ts/

We can use the elementary `jpath` method outside of our mapping template to find a single value based on a given JsonPath expression from any object anywhere in code, although for complex object mappings the calls to resolve JsonPath expressions are handled natively within the context of a mapping template.

Consider the following example of a book store who also sells software and also has a bicycle for sale:

```
const store = {
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
    }
  ],
  bicycle: {
    color: 'red',
    price: 19.95,
  },
  software: [{
    id: 1,
    title: 'jsonpath-mapper',
    author: { name: 'Neil Flatley' },
    cost: 0.0,
  }],
};
```

To create a normalised representation of the `store` we can apply the following mapping template to do the transformations and create the object we need for our application to use:

```
// This is defining the mapping template
const sampleMapping = {
  authors: 'books[*].author.name', // Fetch all 'author.name' values from the books array
  editors: 'books[*].editor.name', // Fetch all 'editor.name' values from the books array
  allNames: 'books[*]..name', // Fetch all '.name' values from any object member inside the books array
  bikeColour: 'bicycle.color',
}

// This is invoking the mapper function, applying our mapping template and returning our new object
const names = mapJson(store, sampleMapping);

console.log(names);

# Object({
#   authors: [
#       "Robert C. Martin",
#       "Nicholas C. Zakas",
#       "Robert C. Martin",
#   ],
#   editors: [
#       "Yussef Miller"
#   ],
#   allNames: [
#       "Robert C. Martin",
#       "Nicholas C. Zakas",
#       "Robert C. Martin",
#       "Yussef Miller"
#   ],
#   bikeColour: "red",
# })
```

#### Providing fallback mappings

We can define any `jsonpath` expression as an array of strings that will attempt to find a value from the provided paths, searching each path sequentially until a value is found at one of the locations.

```
const imageMapping = {
  imageUri: [
    'overviewImage.asset.sys.uri',
    'overviewImageUri',
    'thumbnailImage.asset.sys.uri',
    'thumbnailImageUri',
  ],
};
```

We would expect this mapping to return an object with a single property - imageUri, that has a single value - a uri, if a value exists under any of the paths defined in the array:

```
const testObject = mapJson(entry, imageMapping);

console.log(testObject);

# Object({
#   imageUri: "/path/to/image.png"
# })
```

### Wire functions

Instead of using `jsonpath` to find our value, we can open a function on any property we define to 'wire' in our value using raw JavaScript.

This is useful for calling other JavaScript functions to enrich or transform our data, or a simple function that takes no arguments and returns a hard-coded value.

| Argument     | Type   | Description                                                                                            |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------ |
| root / value | object | The original object we are transforming / the scoped value for deeply nested objects or inner mappings |

```
const bookMapping = {
    bookTitle: book => book.title,
    isbn: book => {
        const isbns = ProductHelper.GetCodes(book.id);
        return isbns.join(', ') || 'n/a';
    },
    isBook: () => 'Yes',
}

const webProduct = mapJson(book, bookMapping);
```

That's great but now we can't harness `jsonpath` expressions to find the values inside our object?

### Refining values

Instead of defining a property value as a `jsonpath` expression or a wire function, we can create an object under a given property that can contain a combination of special reserved functions to do a series of operations to find and process our final returned value.

Take the following exampe which is mapping a simple search result from a returned entry. Let's say we need to truncate our description field to only show the first 1,000 characters, and we also need to append a different host address to our image uri...

```
const searchResult = {
    title: 'entryTitle',
    description: ['summary', 'leadIn', 'entryDescription'],
    thumbnail: 'image.asset.sys.uri',
    uri: 'sys.uri',
};
```

```
const searchResult = {
    title: 'entryTitle',
    description: {
        $path: ['summary', 'leadIn', 'entryDescription'],
        $formatting: description => description && description.substring(0, 1000),
    },
    thumbnail: {
        $path: 'image.asset.sys.uri',
        $formatting: uri => uri ? `https://images.mysite.com/${uri}` : null,
    },
    uri: 'sys.uri',
};
```

You can see instead of using `jsonpath` expressions or wire functions to map the `description` and `thumbnail` properties we have defined an object here instead with some quirky looking properties underneath?

#### \$path: string | Array

** You would generally use this in combination with one or more of the other special functions here. To use this functionality in isolation without any other special functions, you would just define a `jsonpath` expression as a string against the property. **

Adding a `$path` expression to the object will resolve any value(s) found at that location and scope any further processing directly to the found value(s)

#### \$formatting: function

** You would always use this in combination with a `$path` expression. To use this functionality in isolation without a `$path` we can just use a plain wire function instead. **

Adding a `$formatting` function to the object will take any value(s) found from the `$path` expression and will allow us to process them with a raw JavaScript function that is scoped to these value(s).

We can create the same (sometimes complex) functions here as we do with the bare wire functions, however this function is scoped to the value(s) found. A second argument exists here called `$root`, if for any reason we need to access the "original" unscoped object in a scoped function.

If an array of values is found and returned from the `$path` expression, the `$formatting` function will allow us to process each item/iteration in that array, returning a new value for each array item. This will not give us the final array.

| Argument | Type   | Description                                                                                                                                             |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value    | object | Any value(s) we have found from the `$path` expression                                                                                                  |
| root     | object | Optional: The original object we are transforming, this should only be needed in edge cases where the original object is needed as well as found values |

#### \$return: function

This does the same job as the `$formatting` function and really comes into play when `$path` has returned an array and we need to further process/refine the final returned array, and not the values inside each array item.

| Argument | Type   | Description                                                                                                                                             |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value    | object | Any value(s) we have found from the `$path` expression and returned from the `$formatting` function                                                     |
| root     | object | Optional: The original object we are transforming, this should only be needed in edge cases where the original object is needed as well as found values |

#### \$default: function

You can provide a function that returns a default value for the property if all of the above functions return a null or undefined value

| Argument | Type   | Description                                                                                                      |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| value    | object | Any value(s) we have found from the `$path` expression and returned from the `$formatting` or `$return` function |

```
const searchResult = {
    title: 'entryTitle',
    description: ['summary', 'leadIn', 'entryDescription'],
    thumbnail: {
        $path: 'image.asset.sys.uri',
        $formatting: uri => uri ? `https://images.mysite.com/${uri}` : null,
        $default: () => 'https://images.mysite.com/placeholder.png',
    },
    uri: 'sys.uri',
};
```

### \$disable: function

You can provide a function which returns a boolean value of whether or not to disable the property from being mapped this iteration.

| Argument | Type   | Description                                                                                                      |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| value    | object | Any value(s) we have found from the `$path` expression and returned from the `$formatting` or `$return` function |

In the example below instead of returning `description: false`, we would prefer to just not include this property in the final mapped object. We can create a function that checks the found value and ensure it returns true if the found value is falsy, we will effectively be saying `$disable: true`.

```
const searchResult = {
    title: 'entryTitle',
    description: {
        $path: ['summary', 'leadIn', 'entryDescription'],
        $formatting: description => description && description.substring(0, 1000),
        $disable: description => !description
    },
    thumbnail: 'image.asset.sys.uri',
    uri: 'sys.uri',
};
```

### Debugging complicated mappings

The examples here have been kept intentionally simple to keep the focus on the core functionality and any advanced processing can easily be achieved by combining some or all of these pieces as your mapping is scoped deeper and deeper inside a large/complex object.

You can use `debugger` statements and `console.log()` anywhere inside the wire functions to debug a complex mapping problem.

### Async mappings

There is a named export of `mapJsonAsync` where we can use all of the above functionality but we must decorate all mapping functions as `async`and append all mapper calls with `await` to ensure we are resolving any promises created by any of the mapping code.

This is not the usual path for objects transformation and again is should be used only for edge cases such as background processors which need to make use of async calls or promisified functions within the wire functions themselves.

Such examples could be: invoking an XML parsing library to take an XML string and return it as JSON, or downloading an image from a given url with an async `fetch` call and generating a hash from that downloaded file

## Mapping functions / React hooks

### useMapper / mapJson

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

## Other helper functions / hooks

### useEntriesMapper / mapEntries

Take a list of entries and transform each entry to a specific object based on the value inside a given field Id - default is `sys.contentTypeId` - to return an array of transformed objects

This is useful for normalising a list of different content type entries into a common format, such as result cards.

| Argument | Type     | Description                                                                                                                                                                               |
| -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| entries  | object[] | The array of entries we wish to transform into another format                                                                                                                             |
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

### useComposerMapper / mapComposer

Take a composer array and transform the `value` from each composer item into a specific object based on the value inside the `type` field.

| Argument | Type     | Description                                                                                                                                                                                                                                                                                            |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| composer | object[] | The array of composer items, with the `.value` of each item being the object we wish to transform into another format                                                                                                                                                                                  |
| mappers  | object   | A keyed object with a key for each content type we wish to transform into another format. The key will match the `.type` value of each composer item. The value is an object representing the object we wish to create for any composer item of the specified type (also see `template` in `mapJson`)) |

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

### jpath

This is really the most important function but we rarely need to invoke it as the `mapJson` function natively calls `jpath` on each string expression you supply in the properties of the template argument

This takes an object and looks for a value at a specific location inside that object, using a `jsonpath` expression

| Argument   | Type   | Description                                                                                  |
| ---------- | ------ | -------------------------------------------------------------------------------------------- |
| expression | string | The JsonPath expression we wish to apply to the supplied object and return the value(s) from |
| object     | object | The source object we will apply the supplied expression to in order to return value(s)       |

```
 const title = jpath('title', entry);
```

This is pointless, we could just say `const title = entry.title;` or `const { title } = entry;`

Consider this complex expression, an entry containing an array of related entries which has a component with a repeatable image field with the uri inside a deeply nested object that could be null or undefined at any level of the expression. How many lines of JavaScript would it take to work out the related image uris? :see-no-evil:

```
const relatedImages = jpath('relatedContent[*].heroBanner.images[0].asset.sys.uri', entry);
```
