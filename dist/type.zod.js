"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginDefinitionSchema = void 0;
const zod_1 = require("zod");
const compare_versions_1 = require("compare-versions");
/**
 * 插件的plugin.json文件定义，由插件开发者按需求编写
 */
exports.PluginDefinitionSchema = zod_1.z.object({
    id: zod_1.z.string(), // 插件的唯一标识符
    name: zod_1.z.string(), // 插件的名称
    description: zod_1.z.string().optional(), // 插件的描述信息
    version: zod_1.z.string().refine((version) => (0, compare_versions_1.validateStrict)(version), {
        message: "Invalid version format. Must follow semantic versioning (e.g., 1.0.0).",
    }), // 插件版本号，必须符合semver规范
    logo: zod_1.z.string().optional(), // 插件的logo图片路径，相对于插件根目录
    preload: zod_1.z.string().optional().default('preload.js'), // 插件的preload脚本路径，相对于插件根目录，默认为"preload.js"
    content: zod_1.z.string().optional().default('index.html'), // 插件的内容网页路径，相对于插件根目录，默认为"index.html"
    background: zod_1.z.boolean().optional().default(false), // 是否为后台插件，默认为false，如果为true，则即使窗口被关闭，也不会销毁preload.js
    window: zod_1.z
        .object({
        width: zod_1.z.number().optional(),
        height: zod_1.z.number().optional(),
        disableTransition: zod_1.z.boolean().optional(), // 是否禁用窗口进出时的过渡动画
        frame: zod_1.z.boolean().optional().default(true), // 是否启用窗口边框，默认为true
        transparent: zod_1.z.boolean().optional().default(false), // 是否启用透明窗口，默认为false，启用时需要同时设置frame为false
        resizable: zod_1.z.boolean().optional().default(true), // 是否允许窗口大小调整，默认为true
        alwaysOnTop: zod_1.z.boolean().optional().default(false), // 是否总在顶层显示，默认为false
        closeOnBlur: zod_1.z.boolean().optional().default(false), // 是否在失去焦点时关闭窗口，默认为false
        skipTaskbar: zod_1.z.boolean().optional().default(false), // 是否在任务栏中隐藏窗口，默认为false（windows和linux下有效）
        focusable: zod_1.z.boolean().optional().default(true), // 是否允许窗口获取焦点，默认为true。透明窗口时设置为false可以避免透明窗口上出现灰色背景的窗口标题
    }).optional(),
    features: zod_1.z.array(zod_1.z.object({
        code: zod_1.z.string(), // 功能代码，用于通过命令输入进入插件时，识别用户通过哪个feature进入。无code表明用户是通过“点击”进入插件的
        label: zod_1.z.string(), // 功能的显示名称，注意它会参与命令检索。可以通过cmds来定义这个feature其它的匹配指令。
        hotKey: zod_1.z.boolean().optional().default(false), // 是否可从热键进入，默认为false
        searchable: zod_1.z.boolean().optional().default(true), // 是否可被搜索到，默认为true。与hotkey结合可以提供仅能通过热键进入的功能/
        cmds: zod_1.z.array(zod_1.z.union([
            zod_1.z.string(),
            zod_1.z.object({
                type: zod_1.z.literal('regex'),
                match: zod_1.z.string() // 正则匹配字符串，如match: "\d+"，默认flag为gi，不要添加包围反斜杠和flag
            }),
            zod_1.z.object({
                type: zod_1.z.literal('any'), // 任意输入都会被匹配上
            })
        ])),
    })).optional().default([]),
});
//# sourceMappingURL=type.zod.js.map