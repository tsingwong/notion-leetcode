/*
 * @Description: leetcode GET By ID
 * @Author: Tsingwong
 * @Date: 2022-07-20 14:47:06
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-07-20 16:38:04
 */

import { getByID, getByName } from "../utils/leetcode"

export default defineEventHandler(async (event) => {
  const { id, search } = useQuery(event)
  if (!search && !id) {
    event.res.statusCode = 404
    return {
      errorMsg: "缺少 id 或 search 参数",
    }
  }
  if (id) {
    return {
      ...(await getByID(Number(id))),
    }
  }
  return {
    ...(await getByName(search as string)),
  }
})
