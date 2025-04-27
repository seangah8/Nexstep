export const utilService = {
    describeArc,
    createId
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

// private functions

function _polarToCartesian(cx : number, cy : number, r: number, angleDeg : number) {
    const angleRad = (angleDeg - 90) * (Math.PI / 180)
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad)
    }
}
     