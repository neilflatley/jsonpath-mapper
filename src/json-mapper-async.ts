import {
  fromEntries,
  isArray,
  isMapperFunctions,
  isNullOrUndefined,
  isNumber,
  isObject,
  isString,
  isUndefined,
  isWireFunction,
  jpath,
} from './util';

import MappingTemplate, { MappingElement } from './models/Template';
import {
  FormatResult,
  HandleMapperFunctions,
  MapArrayFunction,
  MapElement,
  MapJsonAsync,
  MapObject,
} from './models/MapperFunctions';

const formatResult: FormatResult = (value, $formatting, $root) =>
  isWireFunction($formatting)
    ? $formatting(value, $root)
    : isObject($formatting)
      ? mapObject(value, $formatting, $root)
      : value;

const handleMapperFunctions: HandleMapperFunctions = async (
  [k, v],
  json,
  $root
) => {
  // store results from various stages of the evaluations
  // eventually reducing this to a finalVal
  let val, formatted, finalVal: any;
  // if (v) {
  // evaluate a given string as a jsonpath expression
  if (isString(v.$path)) {
    val = jpath(v.$path, json);
  }
  if (isArray(v.$path)) {
    val = await tryMultiple(json, v.$path, $root, findMultiple);
  }
  if (!isUndefined(v.$formatting) && !isNullOrUndefined(val)) {
    if (isArray(val)) {
      formatted = await Promise.all(
        val.map(
          async inner =>
            !isUndefined(v.$formatting) &&
            (await formatResult(inner, v.$formatting, $root))
        )
      );
    } else {
      formatted = await formatResult(val, v.$formatting, $root);
    }
    val = formatted;
  }
  if (v.$return) {
    finalVal = await formatResult(val, v.$return, $root);
  } else {
    finalVal = val;
  }
  if (!isUndefined(v.$default) && isNullOrUndefined(finalVal)) {
    if (isWireFunction(v.$default)) {
      finalVal = await v.$default(json, $root);
    } else {
      finalVal = v.$default;
    }
  }
  if (
    v.$disable &&
    isWireFunction(v.$disable) &&
    (await v.$disable(finalVal, $root))
  ) {
    return null;
  }
  return finalVal;
};

const mapElement: MapElement = async ([k, v], json, $root) => {
  if (isNullOrUndefined(v) || v === '') return [k, undefined as any];

  // evaluate a given string as a jsonpath expression
  if (isString(v)) {
    return [k, jpath(v, json)];
  }

  // execute a given function
  if (isWireFunction(v)) {
    return [k, await v(json, $root)];
  }

  // evaluate all the array strings as jsonpath
  // and then return the first match
  if (isArray(v)) {
    return [k, await tryMultiple(json, v, $root, findMultiple)];
  }

  // if typeof Object, this could be a template object
  // look for reserved key $path and it can be combined with
  // any of $formatting, $return, $default, $disable
  // if not we will treat as plain object and call self recursively
  if (isMapperFunctions(v)) {
    return [k, await handleMapperFunctions([k, v], json, $root)];
  }

  // Otherwise we have ourselves a nested object
  if (typeof v === 'object') return [k, await mapObject(json, v, $root)];

  return [k, v];
};

const mapObject: MapObject = async (json, obj, $root) => {
  const objectAsEntries = (
    await Promise.all(
      // For each key value entry in the object, evaluate each entry
      // and make the mapping from the provided json according to the
      // supplied object template that follows a few simple principles
      Object.entries(obj).map(
        async ([k, v]) => await mapElement([k, v], json, $root)
      )
    )
  ).filter(([, v]) => v !== null);

  return fromEntries(objectAsEntries);
};

const mapArray: MapArrayFunction = async <S, T>(
  json: S,
  arr: MappingTemplate<S>[],
  $root: S
) => {
  return ((await Promise.all(
    arr.map(async v => await mapObject(json, v, $root))
  )) as unknown) as T;
};

const findMultiple = <S>(
  json: S,
  arr: MappingElement<S>[],
  $root: S
): any[] => {
  const results = arr.map(async (inner, i) => {
    // evaluate any value supplied as string
    if (isString(inner)) return jpath(inner, json);

    // if typeof func
    if (isWireFunction(inner)) return await inner(json, $root);

    // if typeof array
    if (isArray(inner))
      return await tryMultiple(json, inner, $root, findMultiple);

    // if typeof mapper functions
    if (isMapperFunctions(inner))
      return await handleMapperFunctions([i.toString(), inner], json, $root);

    // if typeof plain object
    if (typeof inner === 'object')
      return await mapObject(json, inner as MappingTemplate<S>, $root);
  });
  return results;
};

const tryMultiple = async <S>(
  json: S,
  arr: MappingElement<S>[],
  $root: S,
  findMultiple: (json: S, arr: MappingElement<S>[], $root: S) => any[]
) => {
  const result = (await Promise.all(findMultiple(json, arr, $root)))
    .filter(r => isNumber(r) || r);
  if (arr.every((i) => typeof i === 'string'))
    return result.length > 0 ? result[0] : null;
  return result;
};

const mapJson: MapJsonAsync = async (json, template) => {
  const $root = json;
  // console.log(template);
  if (typeof template === 'function') {
    return await template(json);
  }
  if (isArray(template)) {
    // console.log(mapArray(json, template));
    return await mapArray(json, template, $root);
  }
  // console.log(mapObject(json, template));
  return await mapObject(json, template, $root);
};

export const useMapper: MapJsonAsync = async (json, template) => {
  return await mapJson(json, template);
};

export default mapJson;
