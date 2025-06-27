#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const asar = __importStar(require("asar"));
const type_zod_js_1 = require("./type.zod.js");
// 定义颜色输出函数
const chalk = {
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    cyan: (text) => `\x1b[36m${text}\x1b[0m`,
};
const program = new commander_1.Command();
program
    .name('plugin-pack')
    .description('插件打包命令工具，用于将插件项目打包成 asar 格式')
    .version('1.0.0')
    .argument('<source>', '插件源码目录路径')
    .option('-p, --plugin <path>', 'plugin.json 文件路径 (可选，默认在当前目录查找)')
    .action(async (source, options) => {
    try {
        await packPlugin(source, options.plugin);
    }
    catch (error) {
        console.error(chalk.red('错误:'), error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
});
async function packPlugin(sourcePath, pluginJsonPath) {
    const cwd = process.cwd();
    // 验证源码目录是否存在
    const absoluteSourcePath = path.resolve(sourcePath);
    if (!fs.existsSync(absoluteSourcePath)) {
        throw new Error(`源码目录不存在: ${absoluteSourcePath}`);
    }
    if (!fs.statSync(absoluteSourcePath).isDirectory()) {
        throw new Error(`指定的路径不是目录: ${absoluteSourcePath}`);
    }
    // 查找 plugin.json 文件
    let pluginJsonFile;
    if (pluginJsonPath) {
        pluginJsonFile = path.resolve(pluginJsonPath);
        if (!fs.existsSync(pluginJsonFile)) {
            throw new Error(`plugin.json 文件不存在: ${pluginJsonFile}`);
        }
    }
    else {
        // 在当前工作目录查找 plugin.json
        pluginJsonFile = path.join(cwd, 'plugin.json');
        if (!fs.existsSync(pluginJsonFile)) {
            throw new Error(`在当前目录未找到 plugin.json 文件: ${pluginJsonFile}`);
        }
    }
    console.log(chalk.blue('正在读取插件配置...'));
    // 读取并解析 plugin.json
    let pluginConfig;
    try {
        const pluginJsonContent = fs.readFileSync(pluginJsonFile, 'utf-8');
        const pluginData = JSON.parse(pluginJsonContent);
        pluginConfig = type_zod_js_1.PluginDefinitionSchema.parse(pluginData);
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`plugin.json 文件格式错误: ${error.message}`);
        }
        throw new Error(`plugin.json schema 验证失败: ${error instanceof Error ? error.message : String(error)}`);
    }
    console.log(chalk.green(`插件配置验证通过: ${pluginConfig.name} (${pluginConfig.version})`));
    // 验证关键文件是否存在
    const preloadPath = path.join(absoluteSourcePath, pluginConfig.preload || 'preload.js');
    const contentPath = path.join(absoluteSourcePath, pluginConfig.content || 'index.html');
    if (!fs.existsSync(preloadPath)) {
        throw new Error(`pluginConfig.preload 文件不存在于打包目录: ${preloadPath}`);
    }
    if (!fs.existsSync(contentPath)) {
        throw new Error(`pluginConfig.content 文件不存在于打包目录: ${contentPath}`);
    }
    // 准备临时目录用于打包
    const tempDir = path.join(os.tmpdir(), `plugin-pack-${pluginConfig.id}-${Date.now()}`);
    // 清理可能存在的临时目录
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
    try {
        console.log(chalk.blue('正在复制源码文件...'));
        // 复制源码目录内容到临时目录
        await copyDirectory(absoluteSourcePath, tempDir);
        // 将 plugin.json 也复制到临时目录
        fs.copyFileSync(pluginJsonFile, path.join(tempDir, 'plugin.json'));
        // 生成 asar 文件
        const outputPath = path.join(cwd, `${pluginConfig.id}.asar`);
        console.log(chalk.blue('正在打包成 asar 文件...'));
        await asar.createPackage(tempDir, outputPath);
        console.log(chalk.green(`✅ 插件打包完成！`));
        console.log(chalk.cyan(`输出文件: ${outputPath}`));
        console.log(chalk.cyan(`插件 ID: ${pluginConfig.id}`));
        console.log(chalk.cyan(`插件名称: ${pluginConfig.name}`));
        console.log(chalk.cyan(`版本: ${pluginConfig.version}`));
    }
    finally {
        // 清理临时目录
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    }
}
async function copyDirectory(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            await copyDirectory(srcPath, destPath);
        }
        else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
program.parse();
//# sourceMappingURL=index.js.map