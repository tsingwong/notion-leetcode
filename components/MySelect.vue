<template>
  <div>
    <div>
      <a-space text="center">
        <a-select
          v-model:value="state.value"
          label-in-value
          show-search
          placeholder="Select users"
          w="80"
          :filter-option="false"
          :not-found-content="state.fetching ? undefined : null"
          :options="state.data"
          @search="fetchQuestionList"
        >
          <template v-if="state.fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>

        <a-button type="primary" :loading="false" @click="fetchQuestionData">Loading</a-button>
      </a-space>
    </div>

    <div m="t-5">
      <template v-if="isDefined(questionInfo)">
        <div>
          <a-space id="status">
            <a-tag color="red" v-if="questionInfo.difficulty === 'Hard'">Hard</a-tag>
            <a-tag color="orange" v-else-if="questionInfo.difficulty === 'Medium'">Medium</a-tag>
            <a-tag color="green" v-else>Easy</a-tag>
            <span> likes: {{ questionInfo.likes }}</span>
            <a-switch v-model:checked="languageIsChinese" checked-children="中" un-checked-children="英" />
          </a-space>
        </div>

        <p>
          {{ questionInfo.questionFrontendId }}.
          {{ languageIsChinese ? questionInfo.translatedTitle : questionInfo.title }}
        </p>
        <a-tooltip placement="right">
          <template #title> 点击复制连接 </template>
          <span cursor="pointer" @click="copyLink">{{ link }}</span>
        </a-tooltip>
        <div bg="gray-300" m="t-5" p="10" pos="relative">
          <a-space pos="absolute right-10 top-5">
            <span cursor="pointer" @click="codeStatus = 'preview'">preview</span>
            |
            <span cursor="pointer" @click="codeStatus = 'code'">code</span>
            |
            <span cursor="pointer" @click="copyHTML">copy</span>
          </a-space>

          <div
            text="left"
            ref="sourceCode"
            v-if="codeStatus === 'preview'"
            v-html="languageIsChinese ? questionInfo.translatedContent : questionInfo.content"
          ></div>
          <div v-else text="left" whitespace="pre-line" ref="sourceCode">
            {{ prettify(languageIsChinese ? questionInfo.translatedContent : questionInfo.content) }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { notification } from "ant-design-vue"
  import "ant-design-vue/es/notification/style/css"
  import prettify from "html-prettify"
  import { useStorage } from "@vueuse/core"

  const notificationFlag = useStorage("notificationFlag", false)
  const state = reactive({
    data: [],
    value: undefined,
    fetching: false,
  })
  const sourceCode = ref(null)

  const questionInfo = useState<Record<string, any> | undefined>("questionInfo", () => undefined)
  const languageIsChinese = useState("languageIsChinese", () => true)
  const codeStatus = useState<"preview" | "code">("codeStatus", () => "preview")

  const fetchQuestionList = useDebounceFn(async (val: string) => {
    const n = Number(val)
    state.data = []
    state.fetching = true
    let res
    if (isNaN(n)) {
      res = await useSearch({
        search: val,
      })
    } else {
      res = await useSearch({
        id: n,
      })
    }
    if (res.value.data.problemsetQuestionList.questions.length > 0) {
      state.data = res.value.data.problemsetQuestionList.questions.map((question) => {
        question.value = question.frontendQuestionId
        question.label = question.titleCn
        return question
      })
    } else {
      state.data = []
    }

    state.fetching = false
  }, 1000)

  const fetchQuestionData = useThrottleFn(async () => {
    if (!state?.value?.option?.titleSlug) {
      return
    }
    const res = await useQuestionData(state.value.option.titleSlug)
    console.log(res.value)
    questionInfo.value = res.value.data.question || {}
  }, 1000)

  if (process.client && !unref(notificationFlag)) {
    notification.open({
      message: "提示",
      description: "当前支持搜索 ID 和关键词",
      onClick: () => {
        notificationFlag.value = true
      },
      duration: 0,
    })
  }

  watch(
    () => state.value,
    () => {
      state.data = []
      state.fetching = false
    },
  )
  const link = computed(() => {
    if (!questionInfo.value.titleSlug) {
      return ""
    }
    return `https://leetcode.cn/problems/${questionInfo.value.titleSlug}`
  })
  const copyLink = async () => {
    await navigator.clipboard.writeText(link.value)
    notification.success({
      message: "",
      description: "复制成功",
      duration: 1,
    })
  }

  const copyHTML = async () => {
    console.log(sourceCode.value)
    const range = document.createRange()
    range.selectNode(sourceCode.value)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    document.execCommand("copy")
    selection.removeAllRanges()
    notification.success({
      message: "",
      description: "复制成功",
      duration: 1,
    })
  }
</script>
