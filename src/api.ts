/*
 * @Author: gzq
 * @Date: 2018-12-14 16:27:05
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-19 15:42:20
 */

import { Context, Middleware } from 'koa';

declare module 'koa' {
  // tslint:disable-next-line:interface-name
  interface Context {
    /** 参数 */
    data: object;
  }
}

type PrimitiveType = number | boolean | string | null;

interface ISchema {
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

interface IApiParam {
  name: string;
  require: boolean;
  type: string;
  desc: string;
}

export interface IApiOption {
  /** 名称, 默认值methodName  */
  name?: string;
  /** 描述 */
  desc?: string;
  /** 地址, 默认值methodName */
  path?: string;
  /** http方法, 默认值GET */
  method?: string;
  /** 校验参数 */
  schema?: ISchema;
  /** 非校验参数 */
  params?: IApiParam[] | IApiParam;
  /** 返回示例 */
  return?: string;
  /** 返回参数说明 */
  retParams?: IApiParam[] | IApiParam;
  /** 使用中间件 */
  middlewares?: Middleware[];
}

/** 默认prefix '' */
interface IApiGroup {
  /** 名称， 默认值默认分组 */
  name?: string;
  prefix: string;
}

interface IApiUrl {
  func: (ctx: Context) => void;
  option: IApiOption;
}

export const apiUrls: { [method: string]: { [path: string]: IApiUrl } } = {
  CONNECT: {},
  DELETE: {},
  GET: {},
  HEAD: {},
  OPTIONS: {},
  PATCH: {},
  POST: {},
  PUT: {},
  TRACE: {},
};
export const apiGroups: {
  [name: string]: Array<{ name: string; value: IApiOption }>;
} = {};

export function api(option?: IApiOption) {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    /** IApiOption默认值 */
    const opt: IApiOption = Object.assign(
      {
        method: 'GET',
        name: methodName,
        path: methodName,
      },
      option,
    );
    const url: IApiUrl = { option: opt, func: descriptor.value };
    if (target.$Meta === undefined) {
      target.$Meta = [url];
    } else {
      target.$Meta.push(url);
    }
    return descriptor;
  };
}

export function cls(group?: IApiGroup) {
  return (target: any) => {
    /** IApiGroup默认值 */
    group = Object.assign({ name: '默认分组', prefix: '' }, group);
    for (const url of target.$Meta as IApiUrl[]) {
      const opt = url.option;
      opt.path = `/${group.prefix}/${opt.path}`.replace(/\/+/g, '/');

      if (opt.method in apiUrls) {
        if (opt.path in apiUrls[opt.method]) {
          throw Error(`${opt.method} ${opt.path} 地址重复定义`);
        }
      } else {
        throw Error(`${opt.path} ${opt.method} http方法不存在`);
      }

      apiUrls[opt.method][opt.path] = url;
      apiGroups[group.name] = apiGroups[group.name]
        ? apiGroups[group.name].concat({ name: opt.name, value: opt })
        : [{ name: opt.name, value: opt }];
    }
  };
}
