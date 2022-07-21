import { compressAccurately } from 'image-conversion'

// Specify compression size and width only, in order to maintain aspect ratio
// Other possible configurations: accuracy, type, scale, height
export async function compressImage(file, size) {
  const result = await compressAccurately(file, {
    size: size,
    type: 'image/jpeg',
    width: 1024,
  })
  return result
}
