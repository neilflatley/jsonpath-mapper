import {
  fromEntries,
  isArray,
  isWireFunction,
  isNullOrUndefined,
  isMapperFunctions,
  isString,
  isUndefined,
  jpath,
  tryMultiple,
  isObject,
} from './util';

import MappingTemplate, { MappingElement } from './models/Template';
import {
  FormatResult,
  HandleMapperFunctions,
  MapArrayFunction,
  MapElement,
  MapJson,
  MapObject,
} from './models/MapperFunctions';

const formatResult: FormatResult = (value, $formatting, $root) =>
  isWireFunction($formatting)
    ? $formatting(value, $root)
    : isObject($formatting)
    ? mapObject(value, $formatting, $root)
    : value;

const handleMapperFunctions: HandleMapperFunctions = ([k, v], json, $root) => {
  // store results from various stages of the evaluations
  // eventually reducing this to a finalVal
  let val, formatted, finalVal: any;
  // if (v) {
  // evaluate a given string as a jsonpath expression
  if (isString(v.$path)) {
    val = jpath(v.$path, json);
  }
  if (isArray(v.$path)) {
    val = tryMultiple(json, v.$path, $root, findMultiple);
  }
  if (!isUndefined(v.$formatting) && !isNullOrUndefined(val)) {
    if (isArray(val)) {
      formatted = val.map(
        (inner) =>
          !isUndefined(v.$formatting) &&
          formatResult(inner, v.$formatting, $root)
      );
    } else {
      formatted = formatResult(val, v.$formatting, $root);
    }
    val = formatted;
  }
  if (v.$return) {
    finalVal = formatResult(val, v.$return, $root);
  } else {
    finalVal = val;
  }
  if (!isUndefined(v.$default) && isNullOrUndefined(finalVal)) {
    if (isWireFunction(v.$default)) {
      finalVal = v.$default(json, $root);
    } else {
      finalVal = v.$default;
    }
  }
  if (v.$disable && isWireFunction(v.$disable) && v.$disable(finalVal, $root)) {
    return null;
  }
  return finalVal;
};

const mapElement: MapElement = ([k, v], json, $root) => {
  if (isNullOrUndefined(v) || v === '') return [k, undefined as any];

  // evaluate a given string as a jsonpath expression
  if (isString(v)) {
    return [k, jpath(v, json)];
  }

  // execute a given function
  if (isWireFunction(v)) {
    return [k, v(json, $root)];
  }

  // evaluate all the array strings as jsonpath
  // and then return the first match
  if (isArray(v)) {
    return [k, tryMultiple(json, v, $root, findMultiple)];
  }

  // if typeof Object, this could be a template object
  // look for reserved key $path and it can be combined with
  // any of $formatting, $return, $default, $disable
  // if not we will treat as plain object and call self recursively
  if (isMapperFunctions(v)) {
    return [k, handleMapperFunctions([k, v], json, $root)];
  }

  // Otherwise we have ourselves a nested object
  if (typeof v === 'object') return [k, mapObject(json, v, $root)];

  return [k, v];
};

const mapObject: MapObject = (json, obj, $root) => {
  // For each key value entry in the object, evaluate each entry
  // and make the mapping from the provided json according to the
  // supplied object template that follows a few simple principles
  const objectAsEntries = Object.entries(obj)
    .map(([k, v]) => mapElement([k, v], json, $root))
    .filter((obj) => isArray(obj) && obj[1] !== null);
  return fromEntries(objectAsEntries);
};

const mapArray: MapArrayFunction = <S, T>(
  json: S,
  arr: MappingTemplate<S>[],
  $root: S
) => {
  return (arr.map((v) => mapObject(json, v, $root)) as unknown) as T;
};

const findMultiple = <S>(
  json: S,
  arr: MappingElement<S>[],
  $root: S
): any[] => {
  const results = arr.map((inner, i) => {
    // evaluate any value supplied as string
    if (isString(inner)) return jpath(inner, json);

    // if typeof func
    if (isWireFunction(inner)) return inner(json, $root);

    // if typeof array
    if (isArray(inner)) return tryMultiple(json, inner, $root, findMultiple);

    // if typeof mapper functions
    if (isMapperFunctions(inner))
      return handleMapperFunctions([i.toString(), inner], json, $root);

    // if typeof plain object
    if (typeof inner === 'object')
      return mapObject(json, inner as MappingTemplate<S>, $root);
  });
  return results;
};

const mapJson: MapJson = (json, template) => {
  const $root = json;
  // console.log(template);
  if (typeof template === 'function') {
    return template(json);
  }
  if (isArray(template)) {
    // console.log(mapArray(json, template));
    return mapArray(json, template, $root);
  }
  // console.log(mapObject(json, template));
  return mapObject(json, template, $root);
};

export const useMapper: MapJson = (json, template) => {
  return mapJson(json, template);
};

export default mapJson;
