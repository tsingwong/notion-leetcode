/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-07-21 15:20:06
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-07-21 15:25:10
 */

import { getQuestionData } from "../utils/leetcode"

export default defineEventHandler(async (event) => {
  const { titleSlug } = useQuery(event)
  if (!titleSlug) {
    event.res.statusCode = 404
    return {
      errorMsg: "缺少 titleSlug 参数",
    }
  }
  return {
    ...(await getQuestionData(titleSlug as string)),
  }
})
