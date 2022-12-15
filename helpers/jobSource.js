
const jobSource = ()=>{
    const page = (path=>{
        if(path.includes('jobs-hiring/')){
            return 'job-search'
        } else if(path.includes('job/')){
            return 'job-detail'
        } else if(path.includes('my-jobs/saved')){
            return 'saved-job'
        }
    })(window.location.pathname)
    const medium = window.innerWidth > 768 ? 'web' : 'mobile-web'
    return [page,medium,'chat-now'].join('-')
}
export default jobSource