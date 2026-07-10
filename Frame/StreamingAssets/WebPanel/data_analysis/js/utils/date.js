// 获取最近N天的日期，返回一个数组，包含最近N天的日期，格式为2024-01-01
function getRecentDays(dayLength = 7) {
	const days = []
	const currentDate = new Date() // 使用当前日期

	for (let i = 0; i < dayLength; i++) {
		const date = new Date(currentDate)
		// 不包含当前日
		date.setDate(currentDate.getDate() - i - 1)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		days.push(`${year}-${month}-${day}`)
	}
	// 使用 reverse() 方法反转数组，确保最近的日期在数组的前面
	return days.reverse()
}
function getRecentWeeks(weekLength = 7) {
	const weeks = []
	const currentDate = new Date()

	for (let i = 0; i < weekLength; i++) {
		const startDate = new Date(currentDate)
		const endDate = new Date(currentDate)

		// 计算当前日期是星期几（0-6，0表示周日）
		const currentDay = currentDate.getDay()

		// 设置起始日期为本周的周一
		startDate.setDate(currentDate.getDate() - currentDay - 6 - i * 7)
		// 设置结束日期为本周的周日
		endDate.setDate(currentDate.getDate() - currentDay - i * 7)

		const startYear = startDate.getFullYear()
		const startMonth = String(startDate.getMonth() + 1).padStart(2, '0')
		const startDay = String(startDate.getDate()).padStart(2, '0')

		const endYear = endDate.getFullYear()
		const endMonth = String(endDate.getMonth() + 1).padStart(2, '0')
		const endDay = String(endDate.getDate()).padStart(2, '0')

		weeks.push({
			start: `${startYear}-${startMonth}-${startDay}`,
			end: `${endYear}-${endMonth}-${endDay}`,
		})
	}

	// 反转数组以确保最近的周在前面
	return weeks.reverse()
}
// 获取最近12个月的日期，返回一个数组，包含最近12个月的日期，格式为2024-01
function getRecentMonths(monthsLength = 12) {
	const months = []
	const currentDate = new Date()

	for (let i = 0; i < monthsLength; i++) {
		const year = currentDate.getFullYear()
		// 不包含当前月
		const month = currentDate.getMonth() - i - 1

		// 如果月份小于0，表示需要减去年份
		if (month < 0) {
			const previousYear = year - 1
			const adjustedMonth = 12 + month
			months.push(`${previousYear}-${String(adjustedMonth + 1).padStart(2, '0')}`)
		} else {
			months.push(`${year}-${String(month + 1).padStart(2, '0')}`)
		}
	}

	// 反转数组以确保最近的月份在前面
	return months.reverse()
}
function getRecentYears(yearsLength = 3) {
	const years = []
	const currentYear = new Date().getFullYear()

	for (let i = 0; i < yearsLength; i++) {
		years.push((currentYear - 1 - i).toString())
	}

	return years.reverse()
}

function getRecentPeriods(type, length) {
	switch (type) {
		case 'days':
			return getRecentDays(length)
		case 'weeks':
			return getRecentWeeks(length)
		case 'months':
			return getRecentMonths(length)
		case 'years':
			return getRecentYears(length)
		default:
			return getRecentDays(length)
	}
}
