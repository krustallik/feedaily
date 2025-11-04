// Mock otp-generator so we fully control output
jest.mock('otp-generator', () => ({
    __esModule: true,
    default: {
        generate: jest.fn(() => '123456')
    }
}))

const otpGen = require('otp-generator').default
const { generateOtp } = require('../otpService.js')

describe('otpService.generateOtp', () => {
    test('returns 6 digits provided by mocked generator', () => {
        otpGen.generate.mockReturnValueOnce('987654')
        const otp = generateOtp()

        expect(otp).toBe('987654')
        expect(/^\d{6}$/.test(otp)).toBe(true)
    })

    test('has length 6', () => {
        otpGen.generate.mockReturnValueOnce('111111')
        expect(generateOtp()).toHaveLength(6)
    })

    test('two subsequent generated codes are different', () => {
        otpGen.generate
            .mockReturnValueOnce('111111')
            .mockReturnValueOnce('222222')

        const a = generateOtp()
        const b = generateOtp()

        expect(a).not.toBe(b)
    })
})
