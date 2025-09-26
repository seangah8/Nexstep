export const utilService = {
    describeArc,
    createId,
    uploadImg,
    delay,
    getCirclePoint,
}

function describeArc(cx : number, cy : number, r : number, startAngle : number, endAngle : number) {
    const start = _polarToCartesian(cx, cy, r, endAngle);
    const end = _polarToCartesian(cx, cy, r, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", start.x, start.y,
        "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ")
}

function createId(length = 8) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

async function uploadImg(target: HTMLInputElement) {
  const CLOUD_NAME = 'dwql9coem'
  const UPLOAD_PRESET = 'sean_preset'
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  try {
    const file = target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('file', file)

    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    console.log('Uploaded image:', data.secure_url)
    return data.secure_url // the permanent URL saved in MongoDB
  } catch (err) {
    console.error('Failed to upload image:', err)
    throw err
  }
}

function delay(ms: number) : Promise<void>{
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getCirclePoint(
  circleSize: number,
  angleDeg: number,
  centerX: number = circleSize / 2,
  centerY: number = circleSize / 2
): { x: number; y: number } {

  const radius = circleSize / 2
  const angleRad = (angleDeg * Math.PI) / 180
  const x = centerX + radius * Math.cos(angleRad)
  const y = centerY + radius * Math.sin(angleRad)
  return { x, y }
}


// private functions

function _polarToCartesian(cx : number, cy : number, r: number, angleDeg : number) {
    const angleRad = (angleDeg - 90) * (Math.PI / 180)
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad)
    }
}
     