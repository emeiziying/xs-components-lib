import nodeResolve from '@rollup/plugin-node-resolve' // 告诉 Rollup 如何查找外部模块
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue' // 处理vue文件
import { readdirSync } from 'fs' // 写文件
import { resolve } from 'path'
const input = resolve(__dirname, '../packages/components') // 入口文件
const output = resolve(__dirname, '../lib') // 输出文件
const config = readdirSync(input)
	.filter((name) => !['theme-default', 'index.ts', 'types.ts'].includes(name)) //过滤当前目录下的目录和文件
	.map((name) => ({
		input: `${input}/${name}/index.ts`,
		external: ['vue'],
		plugins: [
			nodeResolve(),
			vue(),
			typescript({
				tsconfigOverride: {
					compilerOptions: {
						declaration: false,
					},
					exclude: ['node_modules', 'examples', 'mobile', 'tests'],
				},
				abortOnError: false,
				clean: true,
			}),
		],
		output: {
			name: 'index',
			file: `${output}/${name}/index.js`,
			format: 'umd',
			globals: {
				vue: 'vue', // 指明 global.vue 即是外部依赖 vue
			},
		},
	}))
config.push({
	input: `${input}/index.ts`,
	external: ['vue'],
	plugins: [
		nodeResolve(),
		vue(),
		typescript({
			tsconfigOverride: {
				compilerOptions: {
					declaration: false,
				},
				exclude: ['node_modules', 'examples', 'mobile', 'tests'],
			},
			abortOnError: false,
			clean: true,
		}),
	],
	output: {
		name: 'index',
		file: `${output}/index.js`,
		format: 'es',
	},
})
export default config
