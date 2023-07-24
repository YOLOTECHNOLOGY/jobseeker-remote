
export const recordTime = name => {
    const startTimeStamp = new Date().getTime()

    return () => {
        const endTimeStamp = new Date().getTime()
        console.log(`时间记录：${name}`, endTimeStamp - startTimeStamp)
    }
}