/* eslint-disable import/no-anonymous-default-export */
// eslint-disable-next-line react/display-name
export default (props: any) => {
    const { children } = props

    return <html>
        <head></head>
        <body>
            <div id="root">{children}</div>
        </body>
    </html>
}