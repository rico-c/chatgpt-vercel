export const setting = {
  continuousDialogue: true,
  archiveSession: false,
  openaiAPIKey: "",
  openaiAPITemperature: 60,
  password: "",
  systemRule: ""
}

export const message = `Powered by OpenAI ，本站仅作为BuyGPT用户购买的账户使用。
- 请点击设置按钮，并输入您购买的\`API Key\`，即可开始使用。
- [[Shift]] + [[Enter]] 换行。[[Enter]]发送。开头输入 [[/]] 或者 [[空格]] 搜索 Prompt 预设。[[↑]] 可编辑最近一次提问。点击顶部名称滚动到顶部，点击输入框滚动到底部。`

export type Setting = typeof setting

export const resetContinuousDialogue = false
