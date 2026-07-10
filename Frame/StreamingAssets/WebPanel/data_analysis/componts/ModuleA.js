// ModuleA.js 模块A组件
const { defineComponent, ref, onMounted, onBeforeUnmount } = Vue
export const ModuleA = defineComponent({
	props: {
		title: {
			type: String,
			required: true,
		},
		show: {
			type: Boolean,
			default: true,
		},
		buttons: {
			type: Array,
			default: () => ['日', '月', '年'],
		},
		name: {
			type: String,
			default: '',
		},
		customcontent: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const chartRef = ref(null)
		const activeButton = ref(0)
		const dataType = ['days', 'months', 'years']
		const setActive = (index) => {
			activeButton.value = index
			// 根据 index 初始化不同的图表数据
			initChart(dataType[index])
		}
		if (typeof props.charttype !== 'string') {
			console.warn('chartType should be a string, defaulting to "line"')
			props.charttype = 'line'
		}
		const initChart = async (dataType) => {
			let myChartA = echarts.init(chartRef.value)
			myChartA.clear()
			myChartA.setOption(await getChartOption(props.name, dataType), true)
		}
		onMounted(() => {
			if (props.name) {
				initChart(dataType[0])
			}
		})

		onBeforeUnmount(() => {
			// 清理资源
		})

		return {
			chartRef,
			activeButton,
			setActive,
		}
	},
	template: `
        <div class="model m-t-5">
            <!-- model的头部 -->
            <div class="model-header">
                <div class="header-left">
                    <p>{{ title }}</p>
                </div>
               
                <div class="header-right">
                 <slot name="header-right"></slot>
                 <slot v-if="show">
                    <el-button-group class="btns">
                        <el-button
                            v-for="(button, index) in buttons"
                            :key="index"
                            size="small"
                            :class="['button', { active: activeButton === index }]"
                            @click="setActive(index)">
                            {{ button }}
                        </el-button>
                    </el-button-group>
                 </slot>
                    
                </div>
            </div>
            <!-- model的内容部分-->
            <div class="model-content m-t-5">
                <slot v-if='customcontent' name="content"></slot>
                <div v-else class="chart" ref=chartRef></div>
            </div>
        </div>
    `,
})
// 将 ModuleA 暴露到全局
// 导出组件（普通JS文件不需要export，但保持模块化习惯）
// if (typeof module !== 'undefined' && module.exports) {
// 	module.exports = ModuleA
// } else {
// 	window.ModuleA = ModuleA
// }
