/*
 * @Author: gzq
 * @Date: 2018-12-15 14:58:29
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-17 09:45:28
 */

import { apiGroups, IApiOption } from './api';

export function getDocs() {
  const docs: Array<{
    name: string;
    children: Array<{ name: string; value: IApiOption }>;
  }> = [];
  Object.keys(apiGroups).map(key => {
    docs.push({ name: key, children: apiGroups[key] });
  });
  return docs;
}
