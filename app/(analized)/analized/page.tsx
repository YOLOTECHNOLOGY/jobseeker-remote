
// import { keys } from 'lodash-es'
// 'use server'
// const style = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }
const Analize = async () => {
    const cache = globalThis.recordCache ?? {}
    return <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
        <h2>requests time cost.  unit : ms</h2>
        <br />
        <br />
        {
            Object.keys(cache).map(key => {
                const list = cache[key].array().map(item => item.duration)
                return <div key={key}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                    {key}
                    <table border={1}>
                        <tr>

                            <td>max</td>
                            <td>min</td>
                            <td>avg</td>
                        </tr>
                        <tr>

                            <td>{Math.max(...list)}</td>
                            <td>{Math.min(...list)}</td>
                            <td>{list.reduce((a, b) => a + b, 0) / list.length}</td>
                        </tr>
                    </table>

                    {list.join(' , ')}
                    <br />
                    <br />
                </div>
            })
        }
    </div>
}
export default Analize