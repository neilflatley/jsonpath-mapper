import jsonpath from 'simple-jsonpath';
import {
  DefaultFunction,
  DisableFunction,
  MapperFunctions,
  MappingElement,
  Path,
  WireFunction,
} from './models/Template';

export { default as fromEntries } from 'fromentries';

export const jpath = <S, T>(query: string, json: S): T | T[] => {
  const result = jsonpath.query(
    json,
    `$${query.startsWith('.') ? '' : '.'}${query}`
  );
  if (
    result.length > 1 ||
    (query.match(/\[.*?\]/) && !query.match(/\[[0-9]\]/))
  )
    return result;
  return result[0];
};

export const isArray = (val: any): val is any[] => val && Array.isArray(val);

export const isMultiplePaths = (val: Path): val is string[] =>
  Array.isArray(val);

export const isWireFunction = <S>(
  val:
    | MappingElement<S>
    | WireFunction<S>
    | DisableFunction<S>
    | DefaultFunction<S>
): val is WireFunction<S> => typeof val === 'function';

export const isNull = (val: any): val is null => val === null;
export const isUndefined = (val: any): val is undefined =>
  typeof val === 'undefined';

export const isNullOrUndefined = (val: any) => {
  if (isUndefined(val)) return true;
  if (isNull(val)) return true;
  return false;
};

export const isNumber = (val: any): val is number => typeof val === 'number';

export const isMapperFunctions = <S>(
  val: MappingElement<S>
): val is MapperFunctions<S> => typeof val === 'object' && '$path' in val;

export const isObject = <S>(val: MappingElement<S>): val is MappingElement<S> =>
  typeof val === 'object';

export const isString = <S>(val: MappingElement<S>): val is string =>
  typeof val === 'string';

export const isStringArray = <S>(val: MappingElement<S>): val is string[] =>
  Array.isArray(val) && val.every(it => typeof it === 'string');

export const tryMultiple = <S>(json: S, arr: MappingElement<S>[], $root: S) => {
  const result = findMultiple(json, arr, $root).filter(r => isNumber(r) || r);
  return result.length > 0 ? result[0] : null;
};

const findMultiple = <S>(
  json: S,
  arr: MappingElement<S>[],
  $root: S
): any[] => {
  const results = arr.map(inner => {
    // evaluate any value supplied as string
    if (isString(inner)) {
      return jpath(inner, json);
    }
    // if typeof func
    if (isWireFunction(inner)) return inner(json, $root);
  });
  return results;
};
