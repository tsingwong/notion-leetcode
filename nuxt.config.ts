import { defineNuxtConfig } from "nuxt"
import Components from "unplugin-vue-components/vite"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@unocss/nuxt", "@vueuse/nuxt"],
  vite: {
    plugins: [
      Components({
        resolvers: [AntDesignVueResolver()],
      }),
    ],
    // @ts-expect-error: Missing ssr key
    ssr: {
      noExternal: ["moment", "compute-scroll-into-view", "ant-design-vue"],
    },
  },
  unocss: {
    attributify: true,
    safelist: "prose prose-sm m-auto text-left".split(" "),
    shortcuts: [
      [
        "btn",
        "px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50",
      ],
      [
        "icon-btn",
        "inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600",
      ],
    ],
  },
})
