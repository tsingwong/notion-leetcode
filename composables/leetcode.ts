/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-07-20 17:41:09
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-07-21 15:46:24
 */
import { ILeetcodeSerach } from "~~/types/leetcode"

export const useSearch = async (params: ILeetcodeSerach) => {
  const { data } = await useAsyncData<any>(
    "search",
    () =>
      $fetch("/api/leetcode", {
        method: "GET",
        params,
      }),
    { initialCache: false },
  )
  return data
}

export const useQuestionData = async (titleSlug: string) => {
  const { data } = await useAsyncData<any>(
    "search",
    () =>
      $fetch("/api/leetcode/info", {
        method: "GET",
        params: {
          titleSlug,
        },
      }),
    { initialCache: false },
  )
  return data
}
