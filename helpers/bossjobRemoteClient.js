
import { getClient } from 'bossjob-remote/dist/client'
import Script from 'next/script'

const client = getClient({
    parseScript: (script) => {
        console.log(script)
        return <Script
            key={script.src + script.textContent}
            type="module"
            // async
            // crossOrigin={'anonymous'}
            src={script.src}>
            {script?.textContent?.replaceAll('\n', ';') ?? ''}
        </Script>
    },
    parseLink: (link) => <link
        key={link.href}
        rel={link.rel}
        href={link.href}>
    </link>
})

export default client