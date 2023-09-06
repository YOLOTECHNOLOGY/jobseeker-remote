
import { getClient } from 'bossjob-remote/dist/client'
import Script from 'next/script'

const client = getClient({
    parseScript: (script, baseUrl) => {
        return <Script
            key={script.src + script.contentText}
            type="module"
            async
            crossOrigin={'anonymous'}
            src={script.src ? `${baseUrl}${script.src}` : undefined}>
            {script?.contentText ?? ''}
        </Script>
    },
    parseLink: (link, baseUrl) => <link
        key={link.href}
        rel={link.rel}
        href={`${baseUrl}${link.href}`}>
    </link>
})

export default client