
const root = getComputedStyle(document.documentElement)
const colorBackground = root.getPropertyValue('--background')
const colorMain1 = root.getPropertyValue('--main1')
const colorMain1Dark1 = root.getPropertyValue('--main1-dark1')
const colorMain1Dark2 = root.getPropertyValue('--main1-dark2')
const colorMain1Dark3 = root.getPropertyValue('--main1-dark3')
const colorMain2 = root.getPropertyValue('--main2')
const colorMain2Dark1 = root.getPropertyValue('--main2-dark1')
const colorMain3 = root.getPropertyValue('--main3')
const colorMain3Dark1 = root.getPropertyValue('--main3-dark1')

export const colorService = {
    colorBackground,
    colorMain1,
    colorMain1Dark1,
    colorMain1Dark2,
    colorMain1Dark3,
    colorMain2,
    colorMain2Dark1,
    colorMain3,
    colorMain3Dark1,
} 