/*
 * @Author: gzq
 * @Date: 2018-12-14 16:27:05
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-17 15:11:50
 */

import { Context, Middleware } from 'koa';
import { ISchema } from './jsonschema';

export interface IApiContext extends Context {
  /** 参数 */
  data?: object;
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
export interface IApiGroup {
  group?: {
    /** 名称， 默认值默认分组 */
    name?: string;
    prefix: string;
  };
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
  return (
    target: IApiGroup,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) => {
    /** IApiGroup默认值 */
    const group: IApiGroup['group'] = Object.assign(
      { name: '默认分组', prefix: '' },
      target.group,
    );
    /** IApiOption默认值 */
    const opt: IApiOption = Object.assign(
      {
        method: 'GET',
        name: methodName,
        path: methodName,
      },
      option,
    );
    opt.path = `/${group.prefix}/${opt.path}`.replace(/\/+/g, '/');
    console.log(opt.path);

    if (opt.method in apiUrls) {
      if (opt.path in apiUrls[opt.method]) {
        throw Error(`${opt.method} ${opt.path} 地址重复定义`);
      }
    } else {
      throw Error(`${opt.path} ${opt.method} http方法不存在`);
    }

    apiUrls[opt.method][opt.path] = {
      func: descriptor.value,
      option: opt,
    };

    apiGroups[group.name] = apiGroups[group.name]
      ? apiGroups[group.name].concat({ name: opt.name, value: opt })
      : [{ name: opt.name, value: opt }];
    return descriptor;
  };
}
