export const transState = (time: string | number, translations: Record<string, any> = {}) => {
  const nowDate = new Date().getTime()
  const lastTime = new Date(time).getTime()
  if (nowDate - lastTime < 1000 * 60 * 60) {
    return {
      state: 1,
      text: translations?.online || 'Online'
    }
  } else if (nowDate - lastTime < 1000 * 60 * 60 * 8) {
    return {
      state: 0,
      text: translations?.now || 'Active just now'
    }
  } else if (nowDate - lastTime < 1000 * 60 * 60 * 24) {
    return {
      state: 0,
      text: translations?.withinToday || 'Active today'
    }
  } else if (nowDate - lastTime < 1000 * 60 * 60 * 168) {
    return {
      state: 0,
      text: translations?.withinWeek || 'Active this week'
    }
  } else {
    return {
      state: 0,
      text: translations?.withinMonth || 'Active this month'
    }
  }
}

export const isSameDay = (startTime?: string, endTime?: string) => {
  if (!endTime) return false
  const startTimeMs = new Date(startTime.replace(/-/g, '/')).setHours(0, 0, 0, 0);
  const endTimeMs = new Date(endTime.replace(/-/g, '/')).setHours(0, 0, 0, 0);
  return startTimeMs === endTimeMs
}

export const transDate = (date, allTime = null) => {
  if (!date) return ''
  const newDate = new Date(date.replace(/-/g, '/'));
  const chinaDate = newDate.toDateString();
  const chinaDateArray = chinaDate.split(' ');
  const englishTime = `${chinaDateArray[2]} ${chinaDateArray[1]}  ${chinaDateArray[3]}`
  if (allTime) {
    return `${englishTime}, ${chinaDateArray[0]}, ${date.substr(11, 5)}`
  }
  return englishTime
}