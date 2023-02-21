

const type1 = e => e?.response?.data?.errors?.error?.[0]

const type2 = e => e?.response?.data?.errors?.errors?.[0]

const type3 = e => e?.response?.data?.errors?.phone_num?.[0]

const type4 = e => e?.response?.data?.errors?.[0]

const type5 = e => e?.response?.data?.data

const errorParser = e => [type1, type2, type3, type4, type5]
    .map(parser => parser(e))
    .reduce((p1, p2) => typeof p1 === 'string' ? p1 : p2)

export default errorParser