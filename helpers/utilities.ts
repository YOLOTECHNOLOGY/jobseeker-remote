export const transState = (time: string | number) => {
  const nowDate = new Date().getTime()
  const lastTime = new Date(time).getTime()
  if (nowDate - lastTime < 1000 * 60 * 60) {
    return {
      state: 1,
      text: 'Online'
    }
  } else if (nowDate - lastTime < 1000 * 60 * 60 * 8) {
    return {
      state: 0,
      text: 'Active just now'
    }
  } else if (nowDate - lastTime < 1000 * 60 * 60 * 24) {
    return {
      state: 0,
      text: 'Active today'
    }
  } else if (nowDate - lastTime < 1000 * 60 * 60 * 168) {
    return {
      state: 0,
      text: 'Active this week'
    }
  } else {
    return {
      state: 0,
      text: 'Active this month'
    }
  }
}
 
export const isSameDay = (startTime?:string, endTime?:string) => {
  if (!endTime) return false
  const startTimeMs = new Date(startTime).setHours(0, 0, 0, 0);
  const endTimeMs = new Date(endTime).setHours(0, 0, 0, 0);
  return startTimeMs === endTimeMs
}
