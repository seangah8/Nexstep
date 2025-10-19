
export const utilService = {
    uploadBase64Images,
    
}

async function uploadBase64Images(base64Images: string[]): Promise<string[]> {
  const CLOUD_NAME = 'dwql9coem'
  const UPLOAD_PRESET = 'sean_preset'
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  const uploads = base64Images.map(async (b64) => {
    // Ensure the string starts with the proper data URI prefix
    const fileData = b64.startsWith("data:image")
      ? b64
      : `data:image/png;base64,${b64}`

    const formData = new FormData()
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('file', fileData)

    const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })
    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`❌ Failed to upload image: ${errText}`)
    }

    const data = await res.json()
    return data.secure_url as string
  })

  return Promise.all(uploads)
}
