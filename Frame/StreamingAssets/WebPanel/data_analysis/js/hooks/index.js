/**
 * 数据分析图表配置模块
 * 优化目标：减少重复代码、提高性能、保持功能完整
 */
const APIURL = 'http://172.22.189.1'
const cycleType = { days: '日', months: '月', weeks: '周', years: '年' }
const loadTimeHours = 24

// 日期计算工具函数
const dateUtils = {
	// 计算A类时间范围（历史数据）
	getRecentPeriodsA: (dataType) => {
		const now = new Date()
		const startDate = new Date(now)
		const endDate = new Date(now)

		switch (dataType) {
			case 'days':
				startDate.setDate(now.getDate() - 7)
				endDate.setDate(now.getDate() - 1)
				return {
					startDate: startDate.toISOString().split('T')[0],
					endDate: endDate.toISOString().split('T')[0],
				}
			case 'months':
				startDate.setMonth(now.getMonth() - 12)
				endDate.setMonth(now.getMonth() - 1)
				const monthsDay = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0)
					.getDate()
					.toString()
					.padStart(2, '0')
				return {
					startDate: `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
						.toString()
						.padStart(2, '0')}-01`,
					endDate: `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
						.toString()
						.padStart(2, '0')}-${monthsDay}`,
				}
			case 'years':
				startDate.setFullYear(now.getFullYear() - 3)
				endDate.setFullYear(now.getFullYear() - 1)
				return {
					startDate: `${startDate.getFullYear()}-01-01`,
					endDate: `${endDate.getFullYear()}-12-31`,
				}
			default:
				return {
					startDate: startDate.toISOString().split('T')[0],
					endDate: endDate.toISOString().split('T')[0],
				}
		}
	},

	// 计算B类时间范围（当前周期）
	getRecentPeriodsB: (dataType) => {
		const now = new Date()
		const startDate = new Date(now)
		let endDate = new Date(now)

		switch (dataType) {
			case 'weeks':
				const dayOfWeek = now.getDay()
				const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
				startDate.setDate(now.getDate() + diffToMonday)
				endDate.setDate(startDate.getDate() + 6)
				break
			case 'months':
				startDate.setDate(1)
				endDate.setMonth(now.getMonth() + 1)
				endDate.setDate(0)
				break
		}

		if (endDate > now) endDate = new Date(now)
		return {
			start_Date: startDate.toISOString().split('T')[0],
			end_Date: endDate.toISOString().split('T')[0],
		}
	},
}

// 设备作业量数据缓存机制
const deviceWorkStatCache = {
	data: null,
	params: null,
	// 获取缓存或新数据
	async getData(dataType) {
		const params = {
			cycle: dataType === 'days' ? 'day' : dataType === 'weeks' ? 'week' : 'month',
			...dateUtils.getRecentPeriodsB(dataType),
		}

		if (this.data && this.params && JSON.stringify(this.params) === JSON.stringify(params)) {
			return this.data
		}
		// 	this.data = await getApiDataPost(
		// 	`http://172.22.189.6:9291/api/IntegrationDigitalTwin/GetDeviceWorkStat`,
		// 	params
		// )
		const [data1, data2, data3] = await Promise.all([
			getApiDataPost(`http://172.22.189.6:9291/api/IntegrationDigitalTwin/GetDeviceWorkStat`, params),
			getApiData(`http://172.22.189.4:30601/api/digital-twin/device-workload`, params),
			getApiDataPost(`http://172.22.189.9:5005/efork_api/timeRangeSC`, params),
		])
		// 合并相同类型设备
		const newData = []

		;['输送线', '提升机', '穿梭车'].forEach((type) => {
			const device1 = data1?.data.deviceData.find((item) => item.deviceType === type)
			const device2 = data2?.data.deviceData.find((item) => item.deviceType === type)
			const device3 = data3?.data.deviceData.find((item) => item.deviceType === type)

			// 合并设备数据，确保 devices 数组存在
			const allDevices = [
				...(device1?.devices || []),
				...(device2?.devices || []),
				...(device3?.devices || []),
			]

			// 按总作业量降序排列并取前6位
			const sortedDevices = allDevices
				.map((device) => ({
					...device,
					totalOperations: parseInt(device.inOperations || 0) + parseInt(device.outOperations || 0),
				}))
				.sort((a, b) => a.totalOperations - b.totalOperations)
				.slice(0, 6)

			newData.push({
				deviceType: type,
				devices: sortedDevices,
			})
		})

		this.data = { data: { deviceData: newData } }
		this.params = params
		return this.data
	},

	// 清除缓存
	clear() {
		this.data = null
		this.params = null
	},
}

// 通用图表配置生成器
const chartConfigFactory = {
	// 基础配置
	base: () => ({ tooltip: tooltipConfig(), grid: gridConfig() }),
	// 坐标轴配置
	axis: { x: (config) => xAxisConfig(config), y: (config) => yAxisConfig(config) },
	// 系列配置
	series: (config) => seriesConfig(config),
}

// 图表配置函数
const chartOptions = {
	// 设备综合故障强度率
	async chartA(dataType) {
		try {
			const chartData = await getApiData(`${APIURL}/dataclean-api/data-clean/fault-intensity-rate`, {
				cycle: cycleType[dataType],
				loadTimeHours,
				...dateUtils.getRecentPeriodsA(dataType),
			})
			const xData = chartData.data.faultIntensityRateData.map((item) => item.date)
			const yData = chartData.data.faultIntensityRateData.map((item) => item.rate)

			return {
				...chartConfigFactory.base(),
				xAxis: chartConfigFactory.axis.x({ data: xData }),
				yAxis: chartConfigFactory.axis.y(),
				series: chartConfigFactory.series({
					type: 'line',
					smooth: true,
					name: '设备综合故障强度率',
					data: yData,
					areaStyle: { opacity: 0.1 },
				}),
			}
		} catch (error) {
			console.log(error)
		}
	},

	// 设备MTBF指标
	async chartB(dataType) {
		const chartData = await getApiData(`${APIURL}/dataclean-api/data-clean/mtbf-statistics`, {
			cycle: cycleType[dataType],
			loadTimeHours,
			...dateUtils.getRecentPeriodsA(dataType),
		})
		const xData = chartData.data.mtbfData.map((item) => item.date)
		const yData = chartData.data.mtbfData.map((item) => item.mtbf)

		return {
			...chartConfigFactory.base(),
			xAxis: chartConfigFactory.axis.x({ data: xData }),
			yAxis: chartConfigFactory.axis.y(),
			series: chartConfigFactory.series({ type: 'bar', data: yData }),
		}
	},

	// 设备MTTR指标
	async chartC(dataType) {
		const chartData = await getApiData(`${APIURL}/dataclean-api/data-clean/mttr-statistics`, {
			cycle: cycleType[dataType],
			loadTimeHours,
			...dateUtils.getRecentPeriodsA(dataType),
		})
		const xData = chartData.data.mttrData.map((item) => item.date)
		const yData = chartData.data.mttrData.map((item) => item.mttr)

		return {
			...chartConfigFactory.base(),
			xAxis: chartConfigFactory.axis.x({ data: xData }),
			yAxis: chartConfigFactory.axis.y(),
			series: chartConfigFactory.series({ type: 'bar', data: yData }),
		}
	},

	// 故障次数/时长统计
	async chartD(dataType) {
		const [chartDataTime, chartDataCount] = await Promise.all([
			getApiData(`${APIURL}/dataclean-api/data-clean/fault-time-statistics`, {
				cycle: cycleType[dataType],
				...dateUtils.getRecentPeriodsA(dataType),
			}),
			getApiData(`${APIURL}/dataclean-api/data-clean/fault-count-statistics`, {
				cycle: cycleType[dataType],
				...dateUtils.getRecentPeriodsA(dataType),
			}),
		])

		const xData = chartDataTime.data.faultTimeData.map((item) => item.date)
		const yData1 = chartDataTime.data.faultTimeData.map((item) => item.totalFaultTime)
		const yData2 = chartDataCount.data.faultCountData.map((item) => item.totalFaultCount)

		return {
			...chartConfigFactory.base(),
			legend: legendConfig(),
			xAxis: chartConfigFactory.axis.x({ data: xData }),
			yAxis: chartConfigFactory.axis.y(),
			series: chartConfigFactory.series([
				{ type: 'line', name: '故障时长', data: yData1, itemStyle: { color: '#35EEC4' } },
				{ type: 'line', name: '故障次数', data: yData2, itemStyle: { color: '#FFB65F' } },
			]),
		}
	},

	// 设备故障分类
	async chartE(dataType, dateTemp) {
		const endDate = new Date(dateTemp)
		if (dataType === 'months') {
			endDate.setMonth(new Date(dateTemp).getMonth() + 1)
			endDate.setDate(0)
		} else if (dataType === 'years') {
			endDate.setFullYear(new Date(dateTemp).getFullYear() + 1)
			endDate.setMonth(0)
			endDate.setDate(0)
		}

		if (endDate >= new Date()) {
			endDate.setDate(new Date().getDate())
			endDate.setMonth(new Date().getMonth())
			endDate.setFullYear(new Date().getFullYear())
		}

		const chartData = await getApiData(`${APIURL}/dataclean-api/data-clean/fault-classification`, {
			cycle: cycleType[dataType],
			startDate: dateTemp,
			endDate: endDate.toISOString().split('T')[0],
		})
		if (!chartData?.data?.faultTypeData) {
			chartData.data = {
				faultTypeData: [
					{
						type: '未知',
						totalFaultTime: 0,
						faultProportion: '0',
					},
				],
			}
		}

		const xData = chartData.data.faultTypeData.map((item) => item.type)
		const yData1 = chartData.data.faultTypeData.map((item) =>
			parseFloat((item.totalFaultTime / (60 * 60)).toFixed(2))
		) // 转换为小时
		const yData2 = chartData.data.faultTypeData.map((item) => parseFloat(item.faultProportion))

		return {
			...chartConfigFactory.base(),
			grid: { top: '20%' },
			legend: legendConfig(),
			xAxis: chartConfigFactory.axis.x({ data: xData }),
			yAxis: [
				{
					name: '故障时长(小时)',
					nameTextStyle: { color: '#D3E7FF', fontSize: 12 },
					axisLine: { show: true },
					axisLabel: {
						color: colors.axisColor,
						fontStyle: 'normal',
						fontFamily: '微软雅黑',
						fontSize: 12,
					},
					axisTick: { show: true },
					splitLine: { show: false, lineStyle: { opacity: 0.06 } },
				},
				{
					min: 0,
					max: 100,
					axisTick: { show: true },
					splitLine: { show: false, lineStyle: { opacity: 0.06 } },
					axisLine: { show: true },
					axisLabel: {
						color: colors.axisColor,
						fontStyle: 'normal',
						fontFamily: '微软雅黑',
						fontSize: 12,
						formatter: '{value} %',
					},
				},
			],
			series: chartConfigFactory.series([
				{ type: 'bar', name: '实际故障时间', data: yData1, showBackground: false },
				{
					type: 'line',
					name: '故障时间累计占比',
					yAxisIndex: 1,
					tooltip: { valueFormatter: (value) => parseFloat(value) + ' %' },
					data: yData2,
					itemStyle: { color: '#FFB65F' },
				},
			]),
		}
	},

	// 能耗数据
	chartF(dataType) {
		const xData = getRecentPeriods(dataType)
		return {
			...chartConfigFactory.base(),
			xAxis: chartConfigFactory.axis.x({ data: xData }),
			yAxis: chartConfigFactory.axis.y(),
			series: chartConfigFactory.series({ type: 'bar' }),
		}
	},

	// 实时货位信息
	async chartG() {
		const chartData = await getApiData(`${APIURL}/admin-api/wms/api/warehouse-position-status`)
		const colorList = [
			{ name: '有货', color1: '#35EEC44D', color2: 'rgba(53, 238, 196, 1.0)' },
			{ name: '无货', color1: '#FFB65F4D', color2: 'rgba(255, 182, 95,1)' },
			{ name: '禁用', color1: '#FF56564D', color2: 'rgba(255, 86, 86, 1.0)' },
		]

		const data = chartData.data.positionStatus.map((item) => ({
			name: item.status,
			value: item.count,
		}))

		const [dataA, dataB] = data.reduce(
			(acc, item, index) => {
				acc[0].push({ ...item, itemStyle: { color: colorList[index].color1 } })
				acc[1].push({ ...item, itemStyle: { color: colorList[index].color2 } })
				return acc
			},
			[[], []]
		)

		const total = data.reduce((sum, item) => sum + item.value, 0)
		const rich = { white: { color: '#fff', fontSize: 12 } }

		return {
			tooltip: {
				show: true,
				trigger: 'item',
				formatter: (data) => `${data.name}<br/>数量：${data.value}<br/> 占比：${data.percent}%`,
			},
			legend: {
				orient: 'vertical',
				top: 'middle',
				right: '5%',
				itemGap: 30,
				data: colorList.map((item, index) => ({
					name: item.name,
					textStyle: { color: item.color2 },
					itemStyle: { color: item.color2 },
				})),
				textStyle: { fontSize: 12, color: 'auto', rich },
				formatter: (name) => {
					const target = data.find((item) => item.name === name)
					return `${name}  {white|占用${target?.value || 0}}  ${
						target ? ((target.value / total) * 100).toFixed(2) : '0.00'
					}%`
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
				textStyle: { color: '#f2f2f2', fontSize: 14 },
				subtextStyle: { fontSize: 12, color: '#869CC0' },
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
					data: dataA,
					padAngle: 2,
					label: {
						show: true,
						formatter: '{b}',
						fontSize: 12,
						color: '#ffffff',
						position: 'inside',
					},
					emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#ffffff' } },
				},
				{
					hoverOffset: 0,
					startAngle: 90,
					type: 'pie',
					radius: [30, 34],
					center: ['25%', '50%'],
					tooltip: { show: false },
					labelLine: { show: false },
					label: { show: false },
					data: dataB,
				},
			],
		}
	},

	// 仓库作业效率
	async chartH(dataType) {
		const chartData = await getApiData(`${APIURL}/admin-api/wms/api/weekly-workload`)
		const processData = chartData.data.dailyData.map((item) => ({
			date: item.date,
			inStock: item.inStock,
			outStock: item.outStock,
			avg: (item.inStock + item.outStock) / 2,
		}))

		return {
			...chartConfigFactory.base(),
			grid: gridConfig({ top: '20%' }),
			legend: legendConfig(),
			xAxis: chartConfigFactory.axis.x({ data: processData.map((item) => item.date) }),
			yAxis: chartConfigFactory.axis.y(),
			series: chartConfigFactory.series([
				{
					type: 'bar',
					name: '入库',
					data: processData.map((item) => item.inStock),
					showBackground: false,
					itemStyle: { color: '#3985FE' },
					barGap: 0.2,
					barWidth: 6,
				},
				{
					type: 'bar',
					name: '出库',
					data: processData.map((item) => item.outStock),
					itemStyle: { color: '#35EEC4' },
					showBackground: false,
					barGap: 0.2,
					barWidth: 6,
				},
				{
					type: 'line',
					name: '平均',
					data: processData.map((item) => item.avg),
					itemStyle: { color: '#FFB65F' },
					barGap: 0.2,
				},
			]),
		}
	},

	// 近一期工作量
	async chartI() {
		const chartData = await getApiData(`${APIURL}/admin-api/wms/api/weekly-workload`)
		const processData = chartData.data.dailyData.map((item) => ({
			date: item.date,
			pallets: item.inPallets + item.outPallets,
			stock: item.inStock + item.outStock,
		}))

		return {
			...chartConfigFactory.base(),
			grid: gridConfig({ top: '30%' }),
			legend: legendConfig(),
			xAxis: chartConfigFactory.axis.x({ data: processData.map((item) => item.date) }),
			yAxis: chartConfigFactory.axis.y(),
			series: chartConfigFactory.series([
				{
					type: 'line',
					name: '托盘数',
					smooth: true,
					areaStyle: { opacity: 0.1 },
					data: processData.map((item) => item.pallets),
					itemStyle: { color: '#35EEC4' },
				},
				{
					type: 'line',
					name: '库存数',
					data: processData.map((item) => item.stock),
					smooth: true,
					areaStyle: { opacity: 0.1 },
					itemStyle: { color: '#FFB65F' },
				},
			]),
		}
	},

	// 通用设备作业量图表配置
	async getDeviceWorkStatOption(dataType, deviceIndex) {
		try {
			const chartData = await deviceWorkStatCache.getData(dataType)
			// 确保有数据
			if (!chartData.data.deviceData[deviceIndex].devices.length) {
				return this.getEmptyChartOption(chartData.data.deviceData[deviceIndex].deviceType) // 返回空图表
			}
			const chartDataTemp = chartData.data.deviceData[deviceIndex]
			const xData = chartDataTemp.devices.map((item) => item.deviceName) || ['']
			const yData = chartDataTemp.devices.map((item) => item.inOperations + item.outOperations) || [0]
			return {
				...chartConfigFactory.base(),
				grid: gridConfig({ top: '15%', bottom: '5%' }),
				xAxis: chartConfigFactory.axis.x({
					type: 'value',
					axisLabel: { color: '#D3E7FF', rotate: -45, align: 'right', margin: 35 },
				}),
				yAxis: chartConfigFactory.axis.y({
					type: 'category',
					data: xData,
					splitLine: { show: false },
					name: chartDataTemp.deviceType,
					nameGap: 13,
					nameTextStyle: { color: '#D3E7FF', fontSize: 12 },
					axisLabel: {
						color: '#D3E7FF',
						formatter: (value) => (value.length > 4 ? value.substring(0, 3) + '...' : value),
					},
				}),
				series: chartConfigFactory.series({
					type: 'bar',
					data: yData,
					name: '设备作业量',
					markLine: {
						data: [{ type: 'average', name: '平均值' }],
						lineStyle: { color: '#FFB800', type: 'solid', width: 1 },
						label: { formatter: '{b}: {c}', color: '#b5d3e7ff', position: 'end', offset: [0, 8] },
					},
					itemStyle: {
						normal: {
							show: true,
							color: (params) => {
								const colorArray = [
									{ top: '#FF5656', bottom: '#FF565600' },
									{ top: '#3985FF', bottom: '#3985FF00' },
									{ top: '#35EEC4', bottom: '#35EEC400' },
									{ top: '#4f9aff', bottom: 'rgba(11,42,84,.3)' },
									{ top: '#b250ff', bottom: 'rgba(11,42,84,.3)' },
								]
								const num = colorArray.length
								return {
									type: 'linear',
									colorStops: Array(8)
										.fill()
										.map((_, index) => ({
											offset: index % 2,
											color: colorArray[params.dataIndex % num][
												index % 2 === 0 ? 'bottom' : 'top'
											],
										})),
								}
							},
						},
					},
				}),
			}
		} catch (error) {
			console.error('Error in getDeviceWorkStatOption:', error)
			return this.getEmptyChartOption()
		}
	},
	// 添加一个返回空图表的辅助方法
	getEmptyChartOption(yAxisName = '设备名称') {
		return {
			...chartConfigFactory.base(),
			grid: gridConfig({ top: '15%' }),
			xAxis: chartConfigFactory.axis.x({ type: 'value' }),
			yAxis: chartConfigFactory.axis.y({
				name: yAxisName,
				type: 'category',
				nameGap: 13,
				nameTextStyle: { color: '#D3E7FF', fontSize: 12 },
				data: ['暂无数据'],
			}),
			series: chartConfigFactory.series({
				type: 'bar',
				data: [0],
				itemStyle: { color: '#3985FF' },
			}),
		}
	},
}

// 图表J和K的专用函数
const chartOptionJ = (dataType) => chartOptions.getDeviceWorkStatOption(dataType, 0)
const chartOptionK = (dataType) => chartOptions.getDeviceWorkStatOption(dataType, 1)
const chartOptionL = (dataType) => chartOptions.getDeviceWorkStatOption(dataType, 2)

// 主入口函数：根据图表名称返回对应配置
async function getChartOption(chartName, dataType, dateTemp = null) {
	const chartMap = {
		chartA: () => chartOptions.chartA(dataType),
		chartB: () => chartOptions.chartB(dataType),
		chartC: () => chartOptions.chartC(dataType),
		chartD: () => chartOptions.chartD(dataType),
		chartE: () => chartOptions.chartE(dataType, dateTemp),
		chartF: () => chartOptions.chartF(dataType),
		chartG: () => chartOptions.chartG(dataType),
		chartH: () => chartOptions.chartH(dataType),
		chartI: () => chartOptions.chartI(dataType),
		chartJ: () => chartOptionJ(dataType),
		chartK: () => chartOptionK(dataType),
		chartL: () => chartOptionL(dataType),
	}

	const chartFunc = chartMap[chartName] || chartMap['chartA']
	return await chartFunc()
}
