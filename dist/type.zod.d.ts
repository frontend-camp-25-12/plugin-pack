import { z } from "zod";
/**
 * 插件的plugin.json文件定义，由插件开发者按需求编写
 */
export declare const PluginDefinitionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    version: z.ZodString;
    logo: z.ZodOptional<z.ZodString>;
    preload: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    content: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    background: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    window: z.ZodOptional<z.ZodObject<{
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        disableTransition: z.ZodOptional<z.ZodBoolean>;
        frame: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        transparent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        resizable: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        alwaysOnTop: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        closeOnBlur: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        skipTaskbar: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        focusable: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        frame: boolean;
        transparent: boolean;
        resizable: boolean;
        alwaysOnTop: boolean;
        closeOnBlur: boolean;
        skipTaskbar: boolean;
        focusable: boolean;
        width?: number | undefined;
        height?: number | undefined;
        disableTransition?: boolean | undefined;
    }, {
        width?: number | undefined;
        height?: number | undefined;
        disableTransition?: boolean | undefined;
        frame?: boolean | undefined;
        transparent?: boolean | undefined;
        resizable?: boolean | undefined;
        alwaysOnTop?: boolean | undefined;
        closeOnBlur?: boolean | undefined;
        skipTaskbar?: boolean | undefined;
        focusable?: boolean | undefined;
    }>>;
    features: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        label: z.ZodString;
        hotKey: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        searchable: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        cmds: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            type: z.ZodLiteral<"regex">;
            match: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "regex";
            match: string;
        }, {
            type: "regex";
            match: string;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"any">;
        }, "strip", z.ZodTypeAny, {
            type: "any";
        }, {
            type: "any";
        }>]>, "many">;
    }, "strip", z.ZodTypeAny, {
        code: string;
        label: string;
        hotKey: boolean;
        searchable: boolean;
        cmds: (string | {
            type: "regex";
            match: string;
        } | {
            type: "any";
        })[];
    }, {
        code: string;
        label: string;
        cmds: (string | {
            type: "regex";
            match: string;
        } | {
            type: "any";
        })[];
        hotKey?: boolean | undefined;
        searchable?: boolean | undefined;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    version: string;
    preload: string;
    content: string;
    background: boolean;
    features: {
        code: string;
        label: string;
        hotKey: boolean;
        searchable: boolean;
        cmds: (string | {
            type: "regex";
            match: string;
        } | {
            type: "any";
        })[];
    }[];
    description?: string | undefined;
    logo?: string | undefined;
    window?: {
        frame: boolean;
        transparent: boolean;
        resizable: boolean;
        alwaysOnTop: boolean;
        closeOnBlur: boolean;
        skipTaskbar: boolean;
        focusable: boolean;
        width?: number | undefined;
        height?: number | undefined;
        disableTransition?: boolean | undefined;
    } | undefined;
}, {
    id: string;
    name: string;
    version: string;
    description?: string | undefined;
    logo?: string | undefined;
    preload?: string | undefined;
    content?: string | undefined;
    background?: boolean | undefined;
    window?: {
        width?: number | undefined;
        height?: number | undefined;
        disableTransition?: boolean | undefined;
        frame?: boolean | undefined;
        transparent?: boolean | undefined;
        resizable?: boolean | undefined;
        alwaysOnTop?: boolean | undefined;
        closeOnBlur?: boolean | undefined;
        skipTaskbar?: boolean | undefined;
        focusable?: boolean | undefined;
    } | undefined;
    features?: {
        code: string;
        label: string;
        cmds: (string | {
            type: "regex";
            match: string;
        } | {
            type: "any";
        })[];
        hotKey?: boolean | undefined;
        searchable?: boolean | undefined;
    }[] | undefined;
}>;
export type PluginDefinition = z.input<typeof PluginDefinitionSchema>;
//# sourceMappingURL=type.zod.d.ts.map