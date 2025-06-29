import { match } from "assert";
import { features } from "process";
import { z } from "zod";

/**
 * 插件的plugin.json文件定义，由插件开发者按需求编写
 */
export const PluginDefinitionSchema = z.object({
  id: z.string(),  // 插件的唯一标识符
  name: z.string(), // 插件的名称
  description: z.string().optional(), // 插件的描述信息
  version: z.string(),
  logo: z.string().optional(), // 插件的logo图片路径，相对于插件根目录
  preload: z.string().optional().default('preload.js'), // 插件的preload脚本路径，相对于插件根目录，默认为"preload.js"
  content: z.string().optional().default('index.html'), // 插件的内容网页路径，相对于插件根目录，默认为"index.html"
  background: z.boolean().optional().default(false), // 是否为后台插件，默认为false，如果为true，则即使窗口被关闭，也不会销毁preload.js
  window: z
    .object({
      width: z.number().optional(),
      height: z.number().optional(),
      disableTransition: z.boolean().optional(), // 是否禁用窗口进出时的过渡动画
      frame: z.boolean().optional().default(true), // 是否启用窗口边框，默认为true
      transparent: z.boolean().optional().default(false), // 是否启用透明窗口，默认为false，启用时需要同时设置frame为false
      resizable: z.boolean().optional().default(true), // 是否允许窗口大小调整，默认为true
      alwaysOnTop: z.boolean().optional().default(false), // 是否总在顶层显示，默认为false
      closeOnBlur: z.boolean().optional().default(false), // 是否在失去焦点时关闭窗口，默认为false
    }).optional(),
  features: z.array(z.object({
    code: z.string(), // 功能代码，用于通过命令输入进入插件时，识别用户通过哪个feature进入。无code表明用户是通过“点击”进入插件的
    label: z.string(), // 功能的显示名称，注意它会参与命令检索。可以通过cmds来定义这个feature其它的匹配指令。
    hotKey: z.boolean().optional().default(false), // 是否可从热键进入，默认为false
    searchable: z.boolean().optional().default(true), // 是否可被搜索到，默认为true。与hotkey结合可以提供仅能通过热键进入的功能/
    cmds: z.array(z.union([
      z.string(),
      z.object({ // 定义命令列表，用于命令匹配方式地进入插件
        type: z.literal('regex'),
        match: z.string() // 正则匹配字符串，如match: "\d+"，默认flag为gi，不要添加包围反斜杠和flag
      }),
      z.object({
        type: z.literal('any'),  // 任意输入都会被匹配上
      })
    ])),
  })).optional().default([]),
});

export type PluginDefinition = z.input<typeof PluginDefinitionSchema>;
