async function fetchData(): Promise<any> {
  const res = await fetch('https://dev.api.bossjob.com/config/list', { cache: 'no-store' })
  return res.json()
}

export default async function Data() {
  // Initiate both requests in parallel
  const artistData = fetchData()
  const albumsData = fetchData()

  // Wait for the promises to resolve
  const [artist] = await Promise.all([artistData, albumsData])
  const { company_sizes } = artist?.data?.filters

  return (
    <>
      {company_sizes.map((item) => (
        <div key={item.key}>{item.value}</div>
      ))}
    </>
  )
}
