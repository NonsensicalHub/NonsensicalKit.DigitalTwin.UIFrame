// Chart.js 图表组件
const { defineComponent, ref, onMounted, onBeforeUnmount } = Vue
export const Chart = defineComponent({
	props: {
		name: {
			type: String,
			default: 'chartA',
		},
	},
	setup(props) {
		const chartRef = ref(null)
		let myChartA = null
		const initChart = async () => {
			myChartA = echarts.init(chartRef.value)
			myChartA.clear()
			myChartA.setOption(await getChartOption(props.name), true)
		}
		onMounted(() => {
			initChart()
		})

		onBeforeUnmount(() => {
			// 清理资源
			if (myChartA) {
				myChartA.dispose()
				myChartA = null
			}
		})

		return {
			chartRef,
		}
	},
	template: `
        <div class="chart" ref=chartRef></div>
    `,
})
// 将 moduleA 暴露到全局
// 导出组件（普通JS文件不需要export，但保持模块化习惯）
// if (typeof module !== 'undefined' && module.exports) {
// 	module.exports = Chart
// } else {
// 	window.Chart = Chart
// }
