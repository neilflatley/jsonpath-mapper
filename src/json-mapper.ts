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
} from './util';

import MappingTemplate from './models/Template';
import {
  FormatResult,
  MapArrayFunction,
  MapElement,
  MapObject,
  MapperFunction,
} from './models/MapperFunctions';

export const formatResult: FormatResult = (value, $formatting, $root) =>
  isMapperFunctions($formatting)
    ? mapObject(value, $formatting, $root)
    : isWireFunction($formatting)
    ? $formatting(value, $root)
    : value;

const mapElement: MapElement = ([k, v], json, $root) => {
  if (isNullOrUndefined(v)) return [k, v];

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
    return [k, tryMultiple(json, v, $root)];
  }

  // if typeof Object, this could be a template object
  // look for reserved key $path and it can be combined with
  // any of $formatting, $return, $default, $disable
  // if not we will treat as plain object and call self recursively
  if (isMapperFunctions(v)) {
    // store results from various stages of the evaluations
    // eventually reducing this to a finalVal
    let val, formatted, finalVal: any;
    // if (v) {
    // evaluate a given string as a jsonpath expression
    if (isString(v.$path)) {
      val = jpath(v.$path, json);
    }
    if (isArray(v.$path)) {
      val = tryMultiple(json, v.$path, $root);
    }
    if (!isUndefined(v.$formatting) && !isNullOrUndefined(val)) {
      if (isArray(val)) {
        formatted = val.map(
          inner =>
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
    if (
      v.$disable &&
      isWireFunction(v.$disable) &&
      v.$disable(finalVal, $root)
    ) {
      return [k, null];
    }
    return [k, finalVal];
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
    .filter(obj => isArray(obj) && obj[1] !== null);
  return fromEntries(objectAsEntries);
};

const mapArray: MapArrayFunction = <S, T>(
  json: S,
  arr: MappingTemplate<S>[],
  $root: S
) => {
  return (arr.map(v => mapObject(json, v, $root)) as unknown) as T;
};

const mapJson: MapperFunction = (json, template) => {
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

export const useMapper: MapperFunction = (json, template) => {
  return mapJson(json, template);
};

export default mapJson;
