
import { getClient } from 'bossjob-remote/dist/client'
import Script from 'next/script'

const client = getClient({
    parseScript: (script, baseUrl) => {
        console.log(script)
        return <Script
            key={script.src + script.textContent}
            type="module"
            async
            crossOrigin={'anonymous'}
            src={script.src ? `${baseUrl}${script.src}` : undefined}>
            {script?.textContent?.replaceAll('\n', ';') ?? ''}
        </Script>
    },
    parseLink: (link, baseUrl) => <link
        key={link.href}
        rel={link.rel}
        href={`${baseUrl}${link.href}`}>
    </link>
})

export default client