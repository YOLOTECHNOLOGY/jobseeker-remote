
const jobSource = ()=>{
    const page = (path=>{
        if(path.includes('jobs-hiring/')){
            return 'job_search'
        } else if(path.includes('job/')){
            return 'job_detail'
        } else if(path.includes('my-jobs/saved')){
            return 'saved_job'
        }
    })(window.location.pathname)
    const medium = window.innerWidth > 768 ? 'web' : 'mobile_web'
    return [page,medium,'chat_now'].join('_')
}
export default jobSource