import jp from 'simple-jsonpath';

export const jpath = (query, json) => {
  const result = jp.query(json, `$${query.startsWith('.') ? '' : '.'}${query}`);
  if (
    result.length > 1 ||
    (query.match(/\[.*?\]/) && !query.match(/\[[0-9]\]/))
  )
    return result;
  return result[0];
};

export const isArray = val => Array.isArray(val);
export const isFunc = val => typeof val === 'function';
export const isNullOrUndefined = val =>
  typeof val === 'undefined' || val === null;
export const isNumber = val => typeof val === 'number';
export const isObject = val => typeof val === 'object';
export const isString = val => typeof val === 'string';

export const tryMultiple = (json, arr) => {
  const result = findMultiple(json, arr).filter(r => isNumber(r) || r);
  return result.length > 0 && result[0];
};

const findMultiple = (json, arr) => {
  const results = arr.map(inner => {
    // evaluate any value supplied as string
    if (isString(inner)) {
      return jpath(inner, json);
    }
    // if typeof func
    return inner(json);
  });
  return results;
};
