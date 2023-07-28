import React, { useEffect, useMemo, useState } from 'react'
import QRCodeUtil from 'qrcode'
const SmallAppLogo =
  'data:image/png;base64,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'
const generateMatrix = (value: string, errorCorrectionLevel: any) => {
  const arr = Array.prototype.slice.call(
    QRCodeUtil.create(value, { errorCorrectionLevel }).modules.data,
    0
  )
  const sqrt = Math.sqrt(arr.length)
  return arr.reduce(
    (rows, key, index) =>
      (index % sqrt === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows,
    []
  )
}
function makeQrcodeSvgStr({
  text,
  size = 160,
  logo = SmallAppLogo,
  logoSize = 46,
  ecl = 'M'
}: QrcodeProps): string {
  const dots: any = []
  const matrix = generateMatrix(text, ecl)
  const cellSize = size / matrix.length
  const qrList = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 }
  ]
  qrList.forEach(({ x, y }) => {
    const x1 = (matrix.length - 7) * cellSize * x
    const y1 = (matrix.length - 7) * cellSize * y
    for (let i = 0; i < 3; i++) {
      dots.push(`<rect
        fill="${i % 2 !== 0 ? 'white' : 'black'}"
        height="${cellSize * (7 - i * 2)}"
        rx="${(i - 0.5) * -6 + (i === 0 ? 2 : 0)}"
        ry="${(i - 0.5) * -6 + (i === 0 ? 2 : 0)}"
        width="${cellSize * (7 - i * 2)}"
        x="${x1 + cellSize * i}"
        y="${y1 + cellSize * i}"
      />`)
    }
  })
  const clearArenaSize = Math.floor((logoSize + 3) / cellSize)
  const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2
  const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 2
  matrix.forEach((row: any, i: any) => {
    row.forEach((_: any, j: any) => {
      if (matrix[i][j]) {
        if (
          !(
            (i < 7 && j < 7) ||
            (i > matrix.length - 8 && j < 7) ||
            (i < 7 && j > matrix.length - 8)
          )
        ) {
          if (
            !(
              i > matrixMiddleStart &&
              i < matrixMiddleEnd &&
              j > matrixMiddleStart &&
              j < matrixMiddleEnd &&
              i < j + clearArenaSize / 2 &&
              j < i + clearArenaSize / 2 + 1
            )
          ) {
            dots.push(`<circle
              cx="${i * cellSize + cellSize / 3}"
              cy="${j * cellSize + cellSize / 3}"
              fill="black"
              r="${cellSize / 3}"
            />`)
          }
        }
      }
    })
  })
  const logoPosition = size / 2 - logoSize / 2 - 0
  const svgstr = `<svg xmlns="http://www.w3.org/2000/svg" height="${size}" width="${size}" viewBox="0 0 ${size} ${size}">
    <defs><clipPath id="clip-logo"><rect x="${logoPosition}" y="${logoPosition}" height="${logoSize}" width="${logoSize}" /></clipPath></defs>
    ${dots.join('')}
    ${
      logo &&
      `<image
        clipPath="url(#clip-logo)"
        x="${logoPosition}" y="${logoPosition}"
        height="${logoSize}"
        href="${logo}"
        width="${logoSize}"
      />`
    }
  </svg>`
  return svgstr
}

function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

async function makeQrcodeUrl(props: QrcodeProps): Promise<string> {
  const { size = 500 } = props
  // logo && (props.logo = await downloadByData(logo))
  props.logo = SmallAppLogo
  const svgstr = makeQrcodeSvgStr(props)
  const img = new Image()
  const canvas = document.createElement('canvas')
  canvas.width = size * 2
  canvas.height = size * 2
  img.src = `data:image/svg+xml;base64, ${window.btoa(svgstr)}`
  return new Promise((resolve) => {
    img.onload = async () => {
      await delay(100)
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      const url = canvas.toDataURL('image/jpeg')
      resolve(url)
    }
  })
}

function loadImage(url: string): Promise<string> {
  return new Promise((resolve) => {
    fetch(url)
      .then((res) => {
        res.blob().then((blob) => {
          const fileReader = new FileReader()
          fileReader.addEventListener('load', function (e) {
            const base64 = e.target?.result as string
            resolve(base64 || '')
          })
          fileReader.readAsDataURL(blob)
        })
      })
      .catch(() => resolve(''))
  })
}
async function makeBaseQrcodeUrl({ text, size = 500 }: QrcodeProps) {
  return QRCodeUtil.toDataURL(text, {
    type: 'image/jpeg',
    width: size,
    margin: 2
  })
}
export default React.memo(function Qrcode({
  text,
  size,
  logo,
  logoSize,
  ecl,
  type,
  ...props
}: QrcodeProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  const url = useQrcodeUrl({ text, size, logo, logoSize, ecl, type })
  if (!url) return null
  return <img {...props} src={url} alt='qr' />
})
export function useCircleQrcodeSvgStr(props: QrcodeProps) {
  return useMemo(() => {
    return makeQrcodeSvgStr(props)
  }, [props])
}
export function useQrcodeUrl({ text, size, logo, logoSize, ecl, type = 'circle' }: QrcodeProps) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const qrcodeProps = { text, size, logo, logoSize, ecl }
    if (text) {
      if (type === 'circle') {
        makeQrcodeUrl(qrcodeProps).then((res) => {
          setUrl(res)
        })
      } else {
        makeBaseQrcodeUrl(qrcodeProps).then((res) => {
          setUrl(res)
        })
      }
    }
  }, [text, type, size, logoSize, logo, ecl])
  if (!url) return null
  return url
}
interface QrcodeProps {
  text: string
  size?: number
  logo?: string
  logoSize?: number
  ecl?: string
  type?: 'circle' | 'base'
}
