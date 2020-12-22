import MappingTemplate, {
  MappingElement,
  PureJsFunction,
  ResultFormatter,
} from './Template';

export type MapJson = <S, T>(
  json: S,
  template: MappingTemplate<S> | PureJsFunction<S>
) => T;

export type MapJsonAsync = <S, T>(
  json: S,
  template: MappingTemplate<S> | PureJsFunction<S>
) => Promise<T>;

export type MapArrayFunction = <S, T>(
  json: S,
  arr: MappingTemplate<S>[],
  $root: S
) => T | Promise<T>;

export type FormatResult = <S>(
  value: S,
  $formatting: ResultFormatter<S>,
  $root: S
) => any | Promise<any>;

export type MapObject = <S, T>(
  json: S,
  obj: MappingTemplate<S> | ResultFormatter<S>,
  $root: S
) => T | Promise<T>;

type ElementKeyValue<S> = [string, MappingElement<S>];

export type MapElement = <S>(
  keyValue: ElementKeyValue<S>,
  json: S,
  $root: S
) => ElementKeyValue<S> | Promise<ElementKeyValue<S>>;
