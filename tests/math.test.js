const {totalTip,fahrenheitToCelsius,celsiusToFahrenheit,add} = require('../src/math')


test('Test Total Tip',()=>{
    const  total = totalTip(10,.3)
    expect(total).toBe(13)
})

test('test celcius to fahernhite',()=>{
const temp = celsiusToFahrenheit(0);
expect(temp).toBe(32)
})


test('test fahernhite to celcius',()=>{
    const temp = fahrenheitToCelsius(32);
    expect(temp).toBe(0)
})


 