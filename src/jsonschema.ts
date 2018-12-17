/*
 * @Author: gzq
 * @Date: 2018-12-17 11:24:40
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-17 11:28:03
 * 参考https://github.com/YousefED/typescript-json-schema
 */

type PrimitiveType = number | boolean | string | null;

export interface ISchema {
  $ref?: string;
  $schema?: string;
  $id?: string;
  description?: string;
  allOf?: ISchema[];
  oneOf?: ISchema[];
  anyOf?: ISchema[];
  title?: string;
  type?: string | string[];
  definitions?: { [key: string]: any };
  format?: string;
  items?: ISchema | ISchema[];
  minItems?: number;
  additionalItems?:
    | {
        anyOf: ISchema[];
      }
    | ISchema;
  enum?: PrimitiveType[] | ISchema[];
  default?: PrimitiveType | object;
  additionalProperties?: ISchema | boolean;
  required?: string[];
  propertyOrder?: string[];
  properties?: { [key: string]: any };
  defaultProperties?: string[];
  patternProperties?: { [pattern: string]: ISchema };
  typeof?: 'function';
}
