import type { Accessor, Setter } from "solid-js"
import { createSignal, type JSXElement, Show } from "solid-js"
import { toBlob, toJpeg } from "html-to-image"
import { copyToClipboard, dateFormat, isMobile } from "~/utils"
import type { ChatMessage } from "~/types"
import type { Setting } from "~/system"
import { host, getHost } from "~/constants/host"

export default function SettingAction(props: {
  setting: Accessor<Setting>
  setSetting: Setter<Setting>
  clear: any
  reAnswer: any
  messaages: ChatMessage[]
}) {
  const [shown, setShown] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const [loginShown, setLoginShown] = createSignal(false)
  const [copied, setCopied] = createSignal(false)
  const [imgCopied, setIMGCopied] = createSignal(false)

  const handleLogin = () => {
    setLoading(true)
    fetch(
      `${getHost()}/api/login?email=${
        props.setting()?.memberEmail
      }&password=${encodeURIComponent(props.setting()?.memberPassword)}`
    )
      .then(r => r.json())
      .then(res => {
        const keyData = res
        if (keyData?.key) {
          props.setSetting({
            ...props.setting(),
            memberKey: keyData?.key,
            memberExpire: keyData?.expire_time
          })
          setLoginShown(false)
        } else {
          alert("登录失败，账号或密码错误")
        }
        setLoading(false)
      })
      .catch(e => {
        throw e
      })
  }

  return (
    <div class="text-sm text-slate-7 dark:text-slate mb-2">
      {/* 设置 */}
      <Show when={shown()}>
        <div class="border rounded p-2">
          <SettingItem icon="i-carbon:api" label="OpenAI API Key">
            <span>
              <a class="underline" href="https://buygpt.shop" target="__blank">
                (将购买的API Key输入到右侧 →)
              </a>
              <input
                type="password"
                value={props.setting().openaiAPIKey}
                class="max-w-150px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none"
                onInput={e => {
                  props.setSetting({
                    ...props.setting(),
                    openaiAPIKey: (e.target as HTMLInputElement).value
                  })
                }}
              />
            </span>
          </SettingItem>
          <SettingItem
            icon="i-carbon:machine-learning-model"
            label="OpenAI 模型"
          >
            <select
              name="model"
              class="max-w-150px w-full bg-slate bg-op-15 rounded-sm appearance-none accent-slate text-center  focus:bg-op-20 focus:ring-0 focus:outline-none"
              value={props.setting()?.model || "gpt-3.5-turbo"}
              onChange={e => {
                props.setSetting({
                  ...props.setting(),
                  model: (e.target as HTMLSelectElement).value as Model
                })
              }}
            >
              <option value="gpt-3.5-turbo">gpt-3.5</option>
              <option value="gpt-4">gpt-4</option>
            </select>
          </SettingItem>
          <SettingItem
            icon="i-carbon:save-image"
            label="记录对话内容，刷新不会消失"
          >
            <label class="relative inline-flex items-center cursor-pointer ml-1">
              <input
                type="checkbox"
                checked={props.setting().archiveSession}
                class="sr-only peer"
                onChange={e => {
                  props.setSetting({
                    ...props.setting(),
                    archiveSession: (e.target as HTMLInputElement).checked
                  })
                }}
              />
              <div class="w-9 h-5 bg-slate bg-op-15 peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate"></div>
            </label>
          </SettingItem>
          <SettingItem icon="i-carbon:3d-curve-auto-colon" label="开启连续对话">
            <label class="relative inline-flex items-center cursor-pointer ml-1">
              <input
                type="checkbox"
                checked={props.setting().continuousDialogue}
                class="sr-only peer"
                onChange={e => {
                  props.setSetting({
                    ...props.setting(),
                    continuousDialogue: (e.target as HTMLInputElement).checked
                  })
                }}
              />
              <div class="w-9 h-5 bg-slate bg-op-15 peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate"></div>
            </label>
          </SettingItem>
        </div>
      </Show>
      {/* 会员登录================================= */}
      <Show when={loginShown()}>
        <div class="border rounded p-2">
          <SettingItem icon="i-carbon:user-avatar-filled" label="会员邮箱">
            <span>
              <input
                placeholder="请输入您的会员邮箱"
                value={props.setting().memberEmail}
                class="max-w-200px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none"
                onInput={e => {
                  props.setSetting({
                    ...props.setting(),
                    memberEmail: (e.target as HTMLInputElement).value
                  })
                }}
              />
            </span>
          </SettingItem>
          <SettingItem icon="i-carbon:password" label="会员密码">
            <input
              type="password"
              placeholder="请输入您设置的密码"
              value={props.setting().memberPassword}
              class="max-w-200px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none"
              onInput={e => {
                props.setSetting({
                  ...props.setting(),
                  memberPassword: (e.target as HTMLInputElement).value
                })
              }}
            />
          </SettingItem>
          <Show when={props.setting().memberKey}>
            <SettingItem icon="i-carbon:password" label="会员截止日期">
              {props.setting().memberExpire}
            </SettingItem>
          </Show>
          <Show when={!props.setting().memberKey}>
            <div class="flex justify-center">
              <button class="border-1 px-5" onClick={handleLogin}>
                {loading() ? "登录中..." : "登录"}
              </button>
            </div>
          </Show>
        </div>
      </Show>
      <div class="mt-2 flex items-center justify-between">
        <div class="flex">
          <ActionItem
            onClick={() => {
              setShown(!shown())
              setLoginShown(false)
            }}
            icon="i-carbon:settings"
            label="设置"
            text="设置"
          ></ActionItem>
          <ActionItem
            onClick={() => {
              setLoginShown(!loginShown())
              setShown(false)
            }}
            icon="i-carbon:login"
            label={props.setting().memberKey ? "会员已登录" : "会员登录"}
            text={props.setting().memberKey ? "会员已登录" : "会员登录"}
          ></ActionItem>
        </div>
        <div class="flex">
          <ActionItem
            onClick={async () => {
              await exportJpg()
              setIMGCopied(true)
              setTimeout(() => setIMGCopied(false), 1000)
            }}
            icon={
              imgCopied()
                ? "i-ri:check-fill dark:text-yellow text-yellow-6"
                : "i-carbon:image"
            }
            label="导出图片"
          />
          <ActionItem
            label="导出 Markdown"
            onClick={async () => {
              await exportMD(props.messaages)
              setCopied(true)
              setTimeout(() => setCopied(false), 1000)
            }}
            icon={
              copied()
                ? "i-ri:check-fill dark:text-yellow text-yellow-6"
                : "i-ri:markdown-line"
            }
          />
          <ActionItem
            onClick={props.reAnswer}
            icon="i-carbon:reset"
            label="重新回答"
          />
          <ActionItem
            onClick={props.clear}
            icon="i-carbon:trash-can"
            label="清空对话"
          />
        </div>
      </div>
    </div>
  )
}

function SettingItem(props: {
  children: JSXElement
  addon?: JSXElement
  icon: string
  label: string
}) {
  return (
    <div class="flex items-center p-1 justify-between hover:bg-slate hover:bg-op-10 rounded">
      <div class="flex items-center">
        <button class={props.icon} />
        <span ml-1>{props.label}</span>
        <span ml-1>{props.addon}</span>
      </div>
      {props.children}
    </div>
  )
}

function ActionItem(props: {
  onClick: any
  icon: string
  label?: string
  text?: string
}) {
  return (
    <div
      class="flex items-center cursor-pointer mx-1 p-2 hover:bg-slate hover:bg-op-10 rounded text-1.2em"
      onClick={props.onClick}
    >
      <button class={props.icon} title={props.label}></button>
      <span>{props.text}</span>
    </div>
  )
}

async function exportJpg() {
  if (typeof document === 'undefined') {
    return
  }
  const messageContainer = document.querySelector(
    "#message-container"
  ) as HTMLElement
  async function downloadIMG() {
    const url = await toJpeg(messageContainer)
    const a = document.createElement("a")
    a.href = url
    a.download = `ChatGPT-${dateFormat(new Date(), "HH-MM-SS")}.jpg`
    a.click()
  }
  if (!isMobile() && navigator.clipboard) {
    try {
      const blob = await toBlob(messageContainer)
      blob &&
        (await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]))
    } catch (e) {
      await downloadIMG()
    }
  } else {
    await downloadIMG()
  }
}

async function exportMD(messages: ChatMessage[]) {
  const role = {
    system: "系统",
    user: "我",
    assistant: "ChatGPT"
  }
  await copyToClipboard(
    messages
      .map(k => {
        return `### ${role[k.role]}\n\n${k.content.trim()}`
      })
      .join("\n\n\n\n")
  )
}
