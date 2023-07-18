import { getDictionary } from "get-dictionary"
import ResumeTemplate from "./ResumeTemplate"

export default async function Layout(props: any) {
    const { params } = props
    const lang = await getDictionary(params.lang)
    return (
        <ResumeTemplate {...props} lang={lang} query={params.lang} >
        </ResumeTemplate>
    )
}