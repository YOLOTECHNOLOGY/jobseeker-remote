import { compressAccurately } from 'image-conversion'

// Other possible configurations: accuracy, type, scale, height
export async function compressImage(file, size = 100, aspectRatio = 1, dimension = 400) {
  let width
  let height
  if (aspectRatio > 1) { // landscape
    width = dimension
  } else { // portrait
    height = dimension
  }
  const result = await compressAccurately(file, {
    size,
    width,
    height
  })
  return result
}
