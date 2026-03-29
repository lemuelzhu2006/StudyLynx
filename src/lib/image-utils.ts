const TARGET_SIZE = 128

export function compressImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error("Failed to load image"))
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = TARGET_SIZE
        canvas.height = TARGET_SIZE
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Canvas not supported"))
          return
        }

        const s = Math.min(img.width, img.height)
        const sx = (img.width - s) / 2
        const sy = (img.height - s) / 2
        ctx.drawImage(img, sx, sy, s, s, 0, 0, TARGET_SIZE, TARGET_SIZE)

        resolve(canvas.toDataURL("image/jpeg", 0.7))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
