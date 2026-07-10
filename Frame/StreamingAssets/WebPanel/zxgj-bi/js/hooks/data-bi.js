/**
 * 实时货位信息
 */
function getChartDataA() {
	let data = [
		{
			name: '有货',
			value: 215,
		},
		{
			name: '无货',
			value: 168,
		},
		{
			name: '禁用',
			value: 84,
		},
	]
	// 求echartData中value的和
	let total = data.reduce((a, b) => a + b.value, 0)

	let colorList = ['#35EEC44D', '#FFB65F4D', '#FF56564D']
	let colorListLine = ['rgba(255, 182, 95,1)', 'rgba(53, 238, 196, 1.0)', 'rgba(255, 86, 86, 1.0)']
	let option = {
		tooltip: {
			show: true,
			trigger: 'item',
			formatter: function (data) {
				return (
					data.name +
					'：' +
					'<br/>' +
					' 数量： ' +
					data.value +
					'<br/> 占比： ' +
					data.percent +
					'%'
				)
			},
		},
		legend: {
			orient: 'vertical',
			top: 'middle',
			right: '5%',
			itemGap: 50,
			data: [
				{
					name: '有货',
					textStyle: {
						color: colorListLine[0],
					},

					itemStyle: {
						color: colorListLine[0],
					},
				},
				{
					name: '无货',
					textStyle: {
						color: colorListLine[1],
					},
					itemStyle: {
						color: colorListLine[1],
					},
				},
				{
					name: '禁用',
					textStyle: {
						color: colorListLine[2],
					},
					itemStyle: {
						color: colorListLine[2],
					},
				},
			],
			textStyle: {
				fontSize: 12,
				padding: 5,
				color: 'auto',
			},

			formatter: function (name) {
				let target
				for (let i = 0, l = data.length; i < l; i++) {
					if (data[i].name == name) {
						target = data[i].value
					}
				}

				return `${name}    ${target}占用${((target / total) * 100).toFixed(2)}%`
				//   return `{a| ${name}}{b${index}| ${target}}个`
			},

			itemWidth: 8,
			itemHeight: 8,
		},
		title: {
			text: total,
			subtext: '货位总量',
			textAlign: 'center',
			padding: 5,
			itemGap: 5,
			textStyle: {
				color: '#f2f2f2',
				fontSize: 16,
			},
			subtextStyle: {
				fontSize: 12,
				color: '#FF869CC0',
			},
			x: '24%',
			y: '40%',
		},
		series: [
			{
				hoverOffset: 1,
				startAngle: 90,
				type: 'pie',
				radius: [35, 65],
				center: ['25%', '50%'],
				color: colorList,
				data: data,
				padAngle: 2,
				label: {
					normal: {
						show: true,
						formatter: '{b}',
						textStyle: {
							fontSize: 12,
							color: '#ffffff',
						},
						position: 'inside',
					},
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 14,
						fontWeight: 'bold',
						color: '#ffffff',
					},
				},
			},
			{
				hoverOffset: 0,
				startAngle: 90,
				type: 'pie',
				radius: [30, 34],
				color: colorList,
				center: ['25%', '50%'],
				tooltip: {
					show: false,
				},
				labelLine: {
					show: false,
				},
				label: {
					show: false,
				},
				data: data,
			},
		],
	}
	return option
}

/**
 * 仓库作业图表
 */
function getChartDataB() {
	let color = ['#35EEC4 ', '#3985FF', '#E680FF']
	let xAxisData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']
	let yAxisData1 = [100, 138, 350, 173, 180, 150, 180, 230]
	let yAxisData2 = [233, 233, 200, 180, 199, 233, 210, 180]
	let yAxisData3 = [253, 283, 250, 80, 159, 203, 110, 280]
	option = {
		color: color,
		legend: {
			icon: 'circle',
			top: 15,
			right: '5%',
			itemWidth: 7,
			itemHeight: 7,
			textStyle: {
				color: '#D3E7FF',
				fontSize: 10,
			},
		},
		tooltip: {
			trigger: 'axis',
			formatter: function (params) {
				let html = ''
				params.forEach((v) => {
					html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
					color[v.componentIndex]
				};"></span>
                ${v.seriesName}  
                <span style="color:${
					color[v.componentIndex]
				};font-weight:700;font-size: 18px;margin-left:5px">${v.value}</span>`
				})
				return html
			},
			backgroundColor: 'rgba(6, 21, 50,1)',
			borderColor: '#385077',
			textStyle: {
				color: '#fff',
			},

			// extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			top: '15%',
			bottom: '10%',
			left: '6%',
			right: '5%',
			containLabel: true,
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				axisLabel: {
					formatter: '{value}',
					textStyle: {
						color: '#b5d3e7ff',
					},
				},
				axisLine: {
					lineStyle: {
						color: '#b5d3e7ff',
					},
				},
				data: xAxisData,
			},
		],
		yAxis: [
			{
				type: 'value',
				name: '托',
				axisLabel: {
					textStyle: {
						color: '#b5d3e7ff',
					},
				},
				nameTextStyle: {
					color: '#b5d3e7ff',
					fontSize: 12,
					lineHeight: 40,
				},
				// 分割线
				splitLine: {
					lineStyle: {
						type: 'dashed',
						color: '#7893B6DA',
					},
				},
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
			},
		],
		series: [
			{
				// name: "2018",
				name: '入库',
				type: 'line',
				smooth: true,
				showSymbol: false,
				lineStyle: {
					width: 1,
				},
				data: yAxisData1,
			},
			{
				name: '出库',
				type: 'line',
				smooth: true,
				showSymbol: false,
				lineStyle: {
					width: 1,
				},
				data: yAxisData2,
			},
			{
				name: '移库',
				type: 'line',
				smooth: true,
				showSymbol: false,
				lineStyle: {
					width: 1,
				},
				data: yAxisData3,
			},
		],
	}
	return option
}
/**
 * 仓库作业数据
 * @returns total
 */
function getDataB() {
	let data1 = [
		{
			name: '入库量',
			value: 570,
		},
		{
			name: '出库量',
			value: 570,
		},
		{
			name: '移库量',
			value: 570,
		},
	]
	return data1
}
/**
 * 近一周工作量
 */
function getChartDataC() {
	let color = ['rgba(53, 238, 196, 1) ', 'rgba(255, 182, 95, 1)']
	let xAxisData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']
	let yAxisData1 = [100, 138, 350, 173, 180, 150, 180, 230]
	let yAxisData2 = [233, 233, 200, 180, 199, 233, 210, 180]
	option = {
		color: color,
		legend: {
			icon: 'circle',
			top: 15,
			right: '5%',
			itemWidth: 7,
			itemHeight: 7,
			textStyle: {
				color: '#D3E7FF',
				fontSize: 10,
			},
		},
		tooltip: {
			trigger: 'axis',
			formatter: function (params) {
				let html = ''
				params.forEach((v) => {
					html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
					color[v.componentIndex]
				};"></span>
                ${v.seriesName}  
                <span style="color:${
					color[v.componentIndex]
				};font-weight:700;font-size: 18px;margin-left:5px">${v.value}</span>`
				})
				return html
			},
			backgroundColor: 'rgba(6, 21, 50,1)',
			borderColor: '#385077',
			textStyle: {
				color: '#fff',
			},

			// extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			top: '15%',
			bottom: '10%',
			left: '6%',
			right: '5%',
			containLabel: true,
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				axisLabel: {
					formatter: '{value}',
					textStyle: {
						color: '#b5d3e7ff',
					},
				},
				axisLine: {
					lineStyle: {
						color: '#b5d3e7ff',
					},
				},
				data: xAxisData,
			},
		],
		yAxis: [
			{
				type: 'value',
				name: '托/小时',
				nameGap: 0,
				axisLabel: {
					textStyle: {
						color: '#b5d3e7ff',
					},
				},
				nameTextStyle: {
					color: '#b5d3e7ff',
					fontSize: 12,
					lineHeight: 40,
				},
				// 分割线
				splitLine: {
					lineStyle: {
						type: 'dashed',
						color: '#7893B6DA',
					},
				},
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
			},
			{
				type: 'value',
				nameGap: 0,
				axisLabel: {
					textStyle: {
						color: '#b5d3e7ff',
					},
				},
				nameTextStyle: {
					color: '#b5d3e7ff',
					fontSize: 12,
					lineHeight: 40,
				},
				// 分割线
				splitLine: {
					lineStyle: {
						type: 'dashed',
						color: '#7893B6DA',
					},
				},
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
			},
		],
		series: [
			{
				// name: "2018",
				name: '托盘数',
				type: 'line',
				smooth: true,
				showSymbol: false,
				lineStyle: {
					width: 1,
				},
				data: yAxisData1,
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: 'rgba(53, 238, 196, 0.4)', //   0% 处的颜色
							},
							{
								offset: 1,

								color: 'rgba(53, 238, 196, 0)', // 100% 处的颜色
							},
						],
						global: false, // 缺省为 false
					},
				},
			},
			{
				name: '库存量',
				type: 'line',
				smooth: true,
				yAxisIndex: 1,
				showSymbol: false,
				lineStyle: {
					width: 1,
				},
				data: yAxisData2,
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: 'rgba(255, 182, 95, 0.4)', //   0% 处的颜色
							},
							{
								offset: 1,
								color: 'rgba(255, 182, 95, 0)', // 100% 处的颜色
							},
						],
						global: false, // 缺省为 false
					},
				},
			},
		],
	}
	return option
}
/**
 * 近一周工作量 四个小图
 */
function getChartDataC1() {
	let color = ['rgba(53, 238, 196, 1) ', 'rgba(255, 182, 95, 1)']
	let xAxisData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']
	let yAxisData1 = [100, 138, 350, 173, 180, 150, 180, 230]
	option = {
		backgroundColor: 'RGBA(23, 44, 83, 1)',
		color: color,
		title: {
			text: '222',
			textStyle: {
				fontWeight: 'bold',
				fontSize: '12px',
				color: '#FFFFFF',
			},

			padding: [30, 0, 0, 12],
		},

		legend: {
			icon: 'circle',
			top: 5,
			left: '5%',
			itemWidth: 7,
			itemHeight: 7,
			textStyle: {
				color: 'rgba(255, 255, 255, 0.5)',
				fontSize: 10,
			},
		},
		grid: {
			top: '45%',
			bottom: '0',
			left: '1%',
			right: '1%',
		},
		xAxis: [
			{
				type: 'category',
				data: xAxisData,
				show: false,
			},
		],
		yAxis: [
			{
				type: 'value',
				show: false,
			},
		],
		series: [
			{
				name: '累计入库托盘数',
				type: 'line',
				smooth: true,
				showSymbol: false,
				lineStyle: {
					width: 1,
				},
				data: yAxisData1,
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: 'rgba(53, 238, 196, 0.4)', //   0% 处的颜色
							},
							{
								offset: 1,

								color: 'rgba(53, 238, 196, 0)', // 100% 处的颜色
							},
						],
						global: false, // 缺省为 false
					},
				},
			},
		],
	}
	return option
}

/**
 * 设备作业量 穿梭车
 */
function getChartDataD1() {
	let colorArr = [
		{
			top: 'rgba(255, 86, 86, 0)', //红色
			bottom: 'rgba(255, 86, 86, 1)',
		},
		{
			top: 'rgba(57, 229, 255, 0)', //蓝色
			bottom: 'rgba(57, 133, 255, 1)',
		},
		// {
		// 	top: 'rgba(53, 238, 196, 0)', //绿色
		// 	bottom: 'rgba(53, 238, 196, 1)',
		// },
	]
	let data = randomArr(5, 100)
	let sum = data.reduce((a, b) => a + b, 0)
	let average = sum / data.length
	let option = {
		grid: {
			top: '15%',
			right: '10%',
			left: '35%',
			bottom: '12%',
		},
		yAxis: [
			{
				name: '穿梭车',
				nameGap: 20,
				nameTextStyle: {
					color: '#b5d3e7ff',
					fontWeight: 'bold',
					fontSize: '12px',
				},
				type: 'category',

				data: ['3号', '4号', '5号', '6号', '12号'],
				axisLabel: {
					margin: 20,
					color: '#b5d3e7ff',
					textStyle: {
						fontSize: 10,
					},
				},
				axisLine: {
					lineStyle: {
						color: 'rgba(107,107,107,0.37)',
					},
				},
			},
		],
		xAxis: [
			{
				axisLabel: {
					color: '#b5d3e7ff',
					textStyle: {
						fontSize: 10,
					},
				},
				splitLine: {
					lineStyle: {
						color: '#7893B6DA',
						type: 'dashed',
					},
				},
				axisLine: {
					show: true,
				},
			},
		],
		series: [
			{
				type: 'bar',
				data: data,
				markLine: {
					data: [
						{
							type: 'average',

							name: 'Avg',
							label: {
								textStyle: {
									color: 'rgba(255, 184, 0, 1)', //平均值文字颜色
								},
								formatter: '平均值{c}',
							},
							lineStyle: {
								color: 'rgba(255, 184, 0, 1)', //平均值线的颜色颜色
								type: 'solid',
								width: 2,
							},
						},
					],
				},
				barWidth: '60%',
				itemStyle: {
					normal: {
						color: function (params) {
							console.log(params, 'paramsparamsparams********')
							let num = colorArr.length

							return new echarts.graphic.LinearGradient(
								0,
								0,
								1,
								0,
								[
									{
										offset: 0,
										color: params.value > average ? colorArr[0].top : colorArr[1].top, // 0% 处的颜色
									},
									{
										//可根据具体情况决定哪根柱子显示哪种颜色
										offset: 1,
										color:
											params.value > average ? colorArr[0].bottom : colorArr[1].bottom, // 100% 处的颜色, // 100% 处的颜色
									},
								],
								false
							)
						},
					},
				},
				label: {
					normal: {
						show: true,
						fontSize: 10,
						fontWeight: 'bold',
						color: '#fff',
						position: 'right',
					},
				},
			},
		],
	}
	return option
}
/**
 * 设备作业量 库口
 */
function getChartDataD2() {
	let colorArr = [
		{
			top: 'rgba(255, 86, 86, 0)', //红色
			bottom: 'rgba(255, 86, 86, 1)',
		},
		{
			top: 'rgba(57, 229, 255, 0)', //蓝色
			bottom: 'rgba(57, 133, 255, 1)',
		},
		// {
		// 	top: 'rgba(53, 238, 196, 0)', //绿色
		// 	bottom: 'rgba(53, 238, 196, 1)',
		// },
	]
	let data = randomArr(5, 100)
	let sum = data.reduce((a, b) => a + b, 0)
	let average = sum / data.length
	let option = {
		grid: {
			top: '15%',
			right: '10%',
			left: '35%',
			bottom: '12%',
		},
		yAxis: [
			{
				name: '库口',
				nameGap: 20,
				nameTextStyle: {
					color: '#b5d3e7ff',
					fontWeight: 'bold',
					fontSize: '12px',
				},
				type: 'category',

				data: ['3号', '4号', '5号', '6号', '12号'],
				axisLabel: {
					margin: 20,
					color: '#b5d3e7ff',
					textStyle: {
						fontSize: 10,
					},
				},
				axisLine: {
					lineStyle: {
						color: 'rgba(107,107,107,0.37)',
					},
				},
			},
		],
		xAxis: [
			{
				axisLabel: {
					color: '#b5d3e7ff',
					textStyle: {
						fontSize: 10,
					},
				},
				splitLine: {
					lineStyle: {
						color: '#7893B6DA',
						type: 'dashed',
					},
				},
				axisLine: {
					show: true,
				},
			},
		],
		series: [
			{
				type: 'bar',
				data: data,
				markLine: {
					data: [
						{
							type: 'average',
							name: 'Avg',
							label: {
								formatter: '平均值{c}',
								textStyle: {
									color: 'rgba(255, 184, 0, 1)', //平均值文字颜色
								},
							},
							lineStyle: {
								color: 'rgba(255, 184, 0, 1)', //平均值线的颜色颜色
								type: 'solid',
								width: 2,
							},
						},
					],
				},
				barWidth: '60%',
				itemStyle: {
					normal: {
						color: function (params) {
							console.log(params, 'paramsparamsparams********')
							let num = colorArr.length

							return new echarts.graphic.LinearGradient(
								0,
								0,
								1,
								0,
								[
									{
										offset: 0,
										color: params.value > average ? colorArr[0].top : colorArr[1].top, // 0% 处的颜色
									},
									{
										//可根据具体情况决定哪根柱子显示哪种颜色
										offset: 1,
										color:
											params.value > average ? colorArr[0].bottom : colorArr[1].bottom, // 100% 处的颜色, // 100% 处的颜色
									},
								],
								false
							)
						},
					},
				},
				label: {
					normal: {
						show: true,
						fontSize: 10,
						fontWeight: 'bold',
						color: '#fff',
						position: 'right',
					},
				},
			},
		],
	}
	return option
}
/**
 * 设备作业量 提升机
 */
function getChartDataD3() {
	let colorArr = [
		{
			top: 'rgba(255, 86, 86, 0)', //红色
			bottom: 'rgba(255, 86, 86, 1)',
		},
		{
			top: 'rgba(57, 229, 255, 0)', //蓝色
			bottom: 'rgba(57, 133, 255, 1)',
		},
		// {
		// 	top: 'rgba(53, 238, 196, 0)', //绿色
		// 	bottom: 'rgba(53, 238, 196, 1)',
		// },
	]
	let data = randomArr(5, 100)
	let sum = data.reduce((a, b) => a + b, 0)
	let average = sum / data.length
	let option = {
		grid: {
			top: '15%',
			right: '10%',
			left: '35%',
			bottom: '12%',
		},
		yAxis: [
			{
				name: '提升机',
				nameGap: 20,
				nameTextStyle: {
					color: '#b5d3e7ff',
					fontWeight: 'bold',
					fontSize: '12px',
				},
				type: 'category',

				data: ['3号', '4号', '5号', '6号', '12号'],
				axisLabel: {
					margin: 20,
					color: '#b5d3e7ff',
					textStyle: {
						fontSize: 10,
					},
				},
				axisLine: {
					lineStyle: {
						color: 'rgba(107,107,107,0.37)',
					},
				},
			},
		],
		xAxis: [
			{
				axisLabel: {
					color: '#b5d3e7ff',
					textStyle: {
						fontSize: 10,
					},
				},
				splitLine: {
					lineStyle: {
						color: '#7893B6DA',
						type: 'dashed',
					},
				},
				axisLine: {
					show: true,
				},
			},
		],
		series: [
			{
				type: 'bar',
				data: data,
				markLine: {
					data: [
						{
							type: 'average',

							name: 'Avg',
							label: {
								textStyle: {
									color: 'rgba(255, 184, 0, 1)', //平均值文字颜色
								},
								formatter: '平均值{c}',
							},
							lineStyle: {
								color: 'rgba(255, 184, 0, 1)', //平均值线的颜色颜色
								type: 'solid',
								width: 2,
							},
						},
					],
				},
				barWidth: '60%',
				itemStyle: {
					normal: {
						color: function (params) {
							console.log(params, 'paramsparamsparams********')
							let num = colorArr.length

							return new echarts.graphic.LinearGradient(
								0,
								0,
								1,
								0,
								[
									{
										offset: 0,
										color: params.value > average ? colorArr[0].top : colorArr[1].top, // 0% 处的颜色
									},
									{
										//可根据具体情况决定哪根柱子显示哪种颜色
										offset: 1,
										color:
											params.value > average ? colorArr[0].bottom : colorArr[1].bottom, // 100% 处的颜色, // 100% 处的颜色
									},
								],
								false
							)
						},
					},
				},
				label: {
					normal: {
						show: true,
						fontSize: 10,
						fontWeight: 'bold',
						color: '#fff',
						position: 'right',
					},
				},
			},
		],
	}
	return option
}

function randomArr(length, max) {
	let arr = []
	for (let index = 0; index < length; index++) {
		arr.push(Math.floor(Math.random() * max))
	}
	return arr
}
/**
 * 温湿度统计图表
 */
function getChartDataE(num) {
	let xData = ['周一', '周二', '周三', '周四', '周五', '周六', '周末']
	let yData1 = randomArr(7, 50)
	let yData2 = randomArr(7, 100)
	let borderData = []
	let legend = ['温度', '湿度']
	let normalColor = 'rgba(255,255,255,0.5)'
	//   var fontSize = 20;
	let seriesData = []
	let borderHeight = 4
	xData.forEach((element) => {
		borderData.push(borderHeight)
	})
	;[yData1, yData2].forEach((item, index) => {
		if (index < 1) {
			seriesData.push({
				name: legend[index],
				type: 'bar',
				stack: legend[index],
				data: item,
				barWidth: '15%',
				itemStyle: {
					normal: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: 'rgba(241, 80, 80, 1)',
								},
								{
									offset: 0.5,
									color: 'rgba(248, 217, 95, 1)',
								},
								{
									offset: 0.75,
									color: 'rgba(62, 185, 215, 1)',
								},
								{
									offset: 1,
									color: 'rgba(0, 174, 255, 1)',
								},
							],
							globalCoord: false,
						},
					},
				},
			})
		} else {
			seriesData.push({
				name: legend[index],
				type: 'line',
				yAxisIndex: 1,
				smooth: false,
				symbol: 'circle',
				// symbolSize: 10,
				lineStyle: {
					normal: {
						width: 2,
					},
				},
				itemStyle: {
					normal: {
						color: '#00FFDA',
						borderColor: '#fff',
						borderWidth: 1,
					},
				},
				data: item,
				label: {
					normal: {
						show: false,
					},
				},
			})
		}
	})
	let option = {
		grid: {
			left: '3%',
			top: '28%',
			right: '3%',
			bottom: '5%',
			containLabel: true,
		},
		legend: {
			show: true,
			itemWidth: 16,
			itemHeight: 8,
			left: '20%',
			top: '0%',
			textStyle: {
				color: '#fff',
			},
			data: legend,
		},
		tooltip: {
			trigger: 'axis',
			formatter: function (params) {
				var str = ''
				for (var i = 0; i < params.length; i++) {
					if (params[i].seriesName !== '') {
						str += params[i].name + ':' + params[i].seriesName + params[i].value + '<br/>'
					}
				}
				return str
			},
		},
		xAxis: [
			{
				type: 'category',
				data: xData,
				axisPointer: {
					type: 'shadow',
				},
				axisLabel: {
					textStyle: {
						color: normalColor,
						fontSize: 12,
					},
				},
				axisLine: {
					lineStyle: {
						color: normalColor,
					},
				},
				axisTick: {
					show: false,
				},
				splitLine: {
					show: false,
				},
			},
		],
		yAxis: [
			{
				type: 'value',
				name: '℃',
				nameTextStyle: {
					color: normalColor,
					fontSize: 12,
				},
				nameGap: 5,
				min: 0,
				max: 50,
				axisLabel: {
					formatter: '{value}',
					textStyle: {
						color: normalColor,
						fontSize: 12,
					},
				},
				axisLine: {
					lineStyle: {
						color: normalColor,
					},
				},
				axisTick: {
					show: false,
				},
				splitLine: {
					show: false,
					lineStyle: {
						type: 'dashed',
						color: normalColor,
					},
				},
			},
			{
				type: 'value',
				name: '%rh',
				nameGap: 5,
				nameTextStyle: {
					color: normalColor,
					fontSize: 12,
				},
				min: 0,
				max: 100,
				axisLabel: {
					formatter: '{value}',
					textStyle: {
						color: normalColor,
						fontSize: 12,
					},
				},
				axisLine: {
					lineStyle: {
						color: normalColor,
					},
				},
				axisTick: {
					show: false,
				},
				splitLine: {
					show: true,
					lineStyle: {
						type: 'dashed',
						color: 'rgba(255,255,255,0.2)',
					},
				},
			},
		],
		series: seriesData,
	}
	return option
}
// 温湿度数据
function getDataE() {
	let data = [
		{
			name: '温度',
			value: 24,
		},
		{
			name: '湿度',
			value: 56,
		},
	]
	return data
}
/**
 * 设备健康监控
 */
function getChartDataF(angle) {
	//角度，用来做简单的动画效果的
	let echartData = [
		{
			name: '在线',
			value: 50,
		},
		{
			name: '离线',
			value: 50,
		},
	]
	// 求echartData中value的和
	let total = echartData.reduce((a, b) => a + b.value, 0)
	let option = {
		title: {
			text: total,
			subtext: '输送线',
			x: 'center',
			y: 'center',
			itemGap: 0,
			textStyle: {
				color: '#fff',
				fontSize: 22,
				fontWeight: 'normal',
				align: 'center',
			},
			subtextStyle: {
				color: 'rgba(134, 156, 192, 1)',
				fontSize: 12,
				fontWeight: 'bold',
				align: 'center',
			},
		},
		series: [
			{
				name: 'ring5',
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75,
							startAngle: ((0 + angle) * Math.PI) / 180,
							endAngle: ((90 + angle) * Math.PI) / 180,
						},
						style: {
							stroke: '#3B79FA',
							fill: 'transparent',
							lineWidth: 1.5,
						},
						silent: true,
					}
				},
				data: [0],
			},
			{
				name: 'ring5',
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75,
							startAngle: ((180 + angle) * Math.PI) / 180,
							endAngle: ((270 + angle) * Math.PI) / 180,
						},
						style: {
							stroke: '#3B79FA',
							fill: 'transparent',
							lineWidth: 1.5,
						},
						silent: true,
					}
				},
				data: [0],
			},
			{
				name: 'ring5',
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.8,
							startAngle: ((270 + -angle) * Math.PI) / 180,
							endAngle: ((40 + -angle) * Math.PI) / 180,
						},
						style: {
							stroke: '#3B79FA',
							fill: 'transparent',
							lineWidth: 1.5,
						},
						silent: true,
					}
				},
				data: [0],
			},
			{
				name: 'ring5',
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.8,
							startAngle: ((90 + -angle) * Math.PI) / 180,
							endAngle: ((220 + -angle) * Math.PI) / 180,
						},
						style: {
							stroke: '#3B79FA',
							fill: 'transparent',
							lineWidth: 1.5,
						},
						silent: true,
					}
				},
				data: [0],
			},
			{
				name: 'ring5',
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (params, api) {
					let x0 = api.getWidth() / 2
					let y0 = api.getHeight() / 2
					let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.8
					let point = getCirlPoint(x0, y0, r, 90 + -angle)
					return {
						type: 'circle',
						shape: {
							cx: point.x,
							cy: point.y,
							r: 4,
						},
						style: {
							stroke: '#3B79FA', //粉
							fill: '#3B79FA',
						},
						silent: true,
					}
				},
				data: [0],
			},
			{
				name: 'ring5', //绿点
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (params, api) {
					let x0 = api.getWidth() / 2
					let y0 = api.getHeight() / 2
					let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.8
					let point = getCirlPoint(x0, y0, r, 270 + -angle)
					return {
						type: 'circle',
						shape: {
							cx: point.x,
							cy: point.y,
							r: 4,
						},
						style: {
							stroke: '#3B79FA', //绿
							fill: '#3B79FA',
						},
						silent: true,
					}
				},
				data: [0],
			},
			{
				type: 'pie',
				center: ['50%', '50%'],
				radius: ['35%', '70%'],
				color: [
					'rgba(56, 241, 255, 1)',
					'rgba(255, 86, 86, 1)',
					'#00FFA8',
					'#9F17FF',
					'#FFE400',
					'#F76F01',
					'#01A4F7',
					'#FE2C8A',
				],
				startAngle: 135,
				labelLine: {
					normal: {
						length: 30,
						length2: 0,
					},
				},
				label: {
					normal: {
						// formatter: '{b|{b}} \n{per|{d}%} ',
						formatter: function (params, ticket, callback) {
							var total = 0 //考生总数量
							var percent = 0 //考生占比
							echartData.forEach(function (value, index, array) {
								total += value.value
							})
							percent = ((params.value / total) * 100).toFixed(1)
							if (params.name === '离线') {
								return (
									'{red|' +
									params.name +
									'}\n{hr|}\n{red|' +
									params.value +
									'}台{red|' +
									percent +
									'%}'
								)
							} else {
								return (
									'{blue|' +
									params.name +
									'}\n{hr|}\n{blue|' +
									params.value +
									'}台{blue|' +
									percent +
									'%}'
								)
							}
						},
						rich: {
							blue: {
								color: 'rgba(56, 241, 255, 1)',
								fontSize: 16,
								padding: [6, 5],
								align: 'center',
							},
							red: {
								color: 'rgba(255, 86, 86, 1)',
								fontSize: 16,
								padding: [6, 5],
								align: 'center',
							},
							white: {
								color: '#fff',
								align: 'center',
								fontSize: 16,
								padding: [6, 30],
							},
							hr: {
								borderColor: '#0b5263',
								width: '100%',
								borderWidth: 1,
								height: 0,
							},
						},
						textStyle: {
							color: '#fff',
							fontSize: 16,
						},
					},
				},
				data: echartData,
			},
		],
	}
	//获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
	function getCirlPoint(x0, y0, r, angle) {
		let x1 = x0 + r * Math.cos((angle * Math.PI) / 180)
		let y1 = y0 + r * Math.sin((angle * Math.PI) / 180)
		return {
			x: x1,
			y: y1,
		}
	}

	return option
}

/**
 * 实时库存数据
 */
function getStock() {
	let data1 = [
		{
			name: '本月累计已入库',
			value: 4400,
		},
		{
			name: '本年累计已入库',
			value: 4400,
		},
		{
			name: '本月累计已出库',
			value: 400,
		},
		{
			name: '本年累计已出库',
			value: 214400,
		},
	]
	return data1
}

/**
 * 设备明细
 */
function getEquipmentDetail() {
	let data = [
		{
			name: '2#穿梭车',
			error: '位置未同步',
			electricity: 20,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
		{
			name: '1#穿梭车',
			error: '位置未同步',
			electricity: 52,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
		{
			name: '3#穿梭车',
			error: '位置未同步',
			electricity: 40,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
		{
			name: '3#穿梭车',
			error: '位置未同步',
			electricity: 90,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
		{
			name: '3#穿梭车',
			error: '位置未同步',
			electricity: 0,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
		{
			name: '3#穿梭车',
			error: '位置未同步',
			electricity: 40,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
		{
			name: '3#穿梭车',
			error: '位置未同步',
			electricity: 40,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
		{
			name: '3#穿梭车',
			error: '位置未同步',
			electricity: 40,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
		{
			name: '3#穿梭车',
			error: '位置未同步',
			electricity: 0,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
		{
			name: '3#穿梭车',
			error: '位置未同步',
			electricity: 40,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
		{
			name: '3#穿梭车',
			error: '位置未同步',
			electricity: 40,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
		{
			name: '3#穿梭车',
			error: '位置未同步',
			electricity: 40,
			// 工作时长的英文
			Worktime: '12h 0min',
		},
	]
	return data
}
/**
 * 设备健康
 */
function getgetEquipmentHealth() {
	let data = [
		{
			header: '紧急',
			name: '2号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '1号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '3号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '4号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '5号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '2号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '1号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '3号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '4号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '2号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '1号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '3号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
		{
			header: '紧急',
			name: '4号小车',
			time: '2024-02-08 14:52:00',
			error: '故障',
		},
	]
	return data
}

// css绘制圆形 及颜色块
function getClass(num) {
	return {
		backgroundColor: determineRange(num),
		width: '10px',
		height: '10px',
		margin: '0 6px',
		borderRadius: '50%',
	}
}
// 获取数字的范围
function determineRange(number) {
	if (number <= 0) {
		return 'rgba(186, 186, 186, 1)'
	} else if (number > 0 && number <= 50) {
		return 'rgba(255, 196, 23, 1)'
	} else if (number >= 51) {
		return 'rgba(23, 255, 122, 1)'
	}
}
function getImage(number) {
	if (number <= 0) {
		return '../img/data-bi/dl0.png'
	} else if (number > 0 && number <= 50) {
		return '../img/data-bi/dl60.png'
	} else if (number >= 51) {
		return '../img/data-bi/dl100.png'
	}
}
// 数字转千分位
function formatNumber(num) {
	let reg = /\d{1,3}(?=(\d{3})+$)/g
	return (num + '').replace(reg, '$&,')
}
// div自动滚动
function getScrollableDiv(scrollIntervalName, divRef, speed) {
	scrollIntervalName = setInterval(() => {
		if (divRef.value) {
			if (divRef.value.scrollTop + divRef.value.clientHeight >= divRef.value.scrollHeight) {
				divRef.value.scrollTop = 0 // 重置到顶部
			} else {
				divRef.value.scrollTop += 1 // 向下滚动
			}
		}
	}, speed) // 调整滚动速度
}
