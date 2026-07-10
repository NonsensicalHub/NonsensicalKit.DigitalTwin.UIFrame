// 图表颜色设置对象
const colors = {
	// 图例文字的颜色
	legendColor: '#D3E7FF',
	// x/y轴刻度的颜色
	axisColor: '#b5d3e7ff',
	// 灰色
	gray: '#869CC0',
	// color: '#869CC0',
}
// 图表tooltip配置
function tooltipConfig() {
	const tooltip = {
		//提示框组件
		trigger: 'axis',
		// formatter: '{b}<br />{a0}: {c0}',
		// axisPointer: {
		// 	type: 'shadow',
		// 	label: {
		// 		backgroundColor: '#6a7985',
		// 	},
		// },
		// backgroundColor: 'rgba(50,50,50,0.7)',
	}

	return tooltip
}
// 图表grid的配置
function gridConfig(gridConfig) {
	const grid = {
		left: '5%',
		right: '5%',
		bottom: '8%',
		top: '12%',
		//	padding:'0 0 10 0',
		containLabel: true,
	}
	const newGrid = {
		...grid,
		...gridConfig,
	}
	return newGrid
}
// 图表legend的配置
function legendConfig(legendConfig) {
	const legend = {
		//图例组件，颜色和名字
		left: 'center',
		top: '3%',
		itemGap: 16,
		itemWidth: 18,
		itemHeight: 10,
		textStyle: {
			color: colors.legendColor,
			fontSize: 12,
		},
	}
	const newLegend = {
		...legend,
		...legendConfig,
	}
	return newLegend
}
// 图表xAxis的配置

function xAxisConfig(xAxisConfig) {
	if (!xAxisConfig) {
		xAxisConfig = {}
	}
	const XAXIS = {
		type: 'category',
		// 			boundaryGap: true,//坐标轴两边留白
		data: [
			'22:18',
			'22:23',
			'22:25',
			'22:28',
			'22:30',
			'22:33',
			'22:35',
			'22:38',
			'22:41',
			'22:45',
			'22:48',
			'22:51',
		],
		axisLabel: {
			//坐标轴刻度标签的相关设置。
			//		interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
			//	margin:15,
			color: colors.axisColor,
			fontStyle: 'normal',
			fontFamily: '微软雅黑',
			fontSize: 12,
			// rotate: 50,
		},
		axisTick: {
			//坐标轴刻度相关设置。
			show: false,
		},
		axisLine: {
			//坐标轴轴线相关设置
			lineStyle: {
				color: '#fff',
				opacity: 0.2,
			},
		},
		splitLine: {
			//坐标轴在 grid 区域中的分隔线。
			show: false,
		},
	}
	const newXAxis = [{ ...XAXIS, ...xAxisConfig }]
	return newXAxis
}
// 图表yAxis的配置
function yAxisConfig(yAxisConfig) {
	if (!yAxisConfig) {
		yAxisConfig = {}
	}
	const yAxis = {
		type: 'value',
		splitNumber: 3,
		axisLabel: {
			color: colors.axisColor,
			fontStyle: 'normal',
			fontFamily: '微软雅黑',
			fontSize: 12,
		},
		axisLine: {
			show: false,
		},
		axisTick: {
			show: false,
		},
		splitLine: {
			show: true,
			lineStyle: {
				// color: ['#fff'],
				opacity: 0.06,
			},
		},
	}

	return [{ ...yAxis, ...yAxisConfig }]
}
// 图表series的配置

function seriesConfig(seriesConfig) {
	const SERIES = {
		name: '名称',
		type: 'bar',
		smooth: false,
		showBackground: true,
		data: [10, 15, 30, 45, 113, 60, 62, 80, 120, 62, 60, 55],
		barWidth: 15,
		barGap: 0, //柱间距离
		lineStyle: {
			width: 1,
		},
		itemStyle: {
			show: true,
			color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{
					offset: 0,
					color: '#35ecc4',
				},
				{
					offset: 1,
					color: '#388dfb',
				},
			]),
			borderRadius: 2,
			borderWidth: 0,
		},
	}
	console.log(seriesConfig, 'smooth: false')
	// 查看seriesConfig是不是数组
	if (Array.isArray(seriesConfig)) {
		const newSeries = seriesConfig.map((item) => {
			return {
				...SERIES,
				...item,
			}
		})
		return newSeries
	} else {
		const newSeries = [{ ...SERIES, ...seriesConfig }]
		return newSeries
	}
}
