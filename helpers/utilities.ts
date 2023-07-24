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
  const startTimeMs = new Date(startTime.replace(/-/g, '/')).setHours(0, 0, 0, 0)
  const endTimeMs = new Date(endTime.replace(/-/g, '/')).setHours(0, 0, 0, 0)
  return startTimeMs === endTimeMs
}

export const transDate = (date, allTime = null) => {
  if (!date) return ''
  const newDate = new Date(date.replace(/-/g, '/'))
  const chinaDate = newDate.toDateString()
  const chinaDateArray = chinaDate.split(' ')
  const englishTime = `${chinaDateArray[2]} ${chinaDateArray[1]}  ${chinaDateArray[3]}`
  if (allTime) {
    return `${englishTime}, ${chinaDateArray[0]}, ${date.substr(11, 5)}`
  }
  return englishTime
}

export const serveIsMobile = (userAgent: string) => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}



const rad = (d)=> {
  return d * Math.PI / 180.0; 
}


export const getDistance = (lat1, lng1, lat2, lng2)=> {

  const radLat1 = rad(lat1);
  const radLat2 = rad(lat2);
  const a = radLat1 - radLat2;
  const b = rad(lng1) - rad(lng2);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; // enput km

  const distance = s;
  let distance_str = "";

  if (distance >= 1) {
      distance_str = distance.toFixed(1) + "km";
  } else {
      distance_str = distance * 1000 + "m";
  }

  console.info(distance, distance_str);
  return distance_str;
}