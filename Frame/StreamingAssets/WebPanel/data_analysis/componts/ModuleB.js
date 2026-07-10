// ModuleB.js 模块B组件
const { defineComponent, ref, onMounted, onBeforeUnmount } = Vue
export const ModuleB = defineComponent({
	props: {
		obj: {
			type: Array,
			default() {
				return [
					{
						title: '累计入库托盘数',
						value: 268500,
					},
					{
						title: '累计出库托盘数',
						value: 368500,
					},
					{
						title: '累计入库库存数',
						value: 468500,
					},
					{
						title: '累计出库库存数',
						value: 468500,
					},
				]
			},
		},
		span: {
			type: Number,
			default: 6,
		},
	},
	setup(props) {
		onMounted(() => {
			if (props.name) {
				initChart(dataType[0])
			}
		})

		onBeforeUnmount(() => {
			// 清理资源
		})

		return {}
	},
	template: `<el-row>
                <el-col :span="span" v-for="(item, index) in obj" :key="index">
                    <el-statistic class='statistic' :title="item.title" :value="item.value" />
                </el-col>
             </el-row>`,
})
// 将 ModuleB 暴露到全局
// 导出组件（普通JS文件不需要export，但保持模块化习惯）
// if (typeof module !== 'undefined' && module.exports) {
// 	module.exports = ModuleB
// } else {
// 	window.ModuleB = ModuleB
// }
