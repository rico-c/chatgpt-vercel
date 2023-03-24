export const setting = {
  continuousDialogue: true,
  archiveSession: false,
  openaiAPIKey: "",
  openaiAPITemperature: 60,
  password: "",
  systemRule: ""
}

export const message = `Powered by OpenAI
- 本站仅作为BuyGPT用户购买的账户使用。
- 请点击设置按钮，并输入您购买的\`API Key\`，即可开始使用。
- [[Shift]] + [[Enter]] 换行。[[Enter]]发送。`

export type Setting = typeof setting

export const resetContinuousDialogue = false
