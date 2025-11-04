// We mock both global fetch and node-fetch fallback.
// getPlaceNameFromCoords tries to use fetch, so we fully control responses.
jest.mock('node-fetch', () => jest.fn())

const fetchModule = (() => {
    try {
        return require('node-fetch')
    } catch {
        return null
    }
})()

global.fetch = jest.fn()

const {
    calculateDistance,
    getPlaceNameFromCoords
} = require('../geocodeHelper.js')

describe('calculateDistance (Haversine)', () => {
    test('same point -> distance 0', () => {
        expect(calculateDistance(0, 0, 0, 0)).toBeCloseTo(0, 6)
    })

    test('is symmetric (A->B equals B->A)', () => {
        const ab = calculateDistance(48.8566, 2.3522, 51.5074, -0.1278)
        const ba = calculateDistance(51.5074, -0.1278, 48.8566, 2.3522)

        expect(ab).toBeCloseTo(ba, 6)
    })

    test('Paris–London ~343 ±10 km', () => {
        const d = calculateDistance(48.8566, 2.3522, 51.5074, -0.1278)
        expect(d).toBeGreaterThan(333)
        expect(d).toBeLessThan(353)
    })

    test('antipodes ~20,015 km (half Earth circumference)', () => {
        const d = calculateDistance(0, 0, 0, 180)
        expect(d).toBeGreaterThan(19900)
        expect(d).toBeLessThan(20100)
    })
})

describe('getPlaceNameFromCoords', () => {
    // silence console.error in tests to keep output clean
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    afterAll(() => errSpy.mockRestore())

    beforeEach(() => {
        global.fetch.mockReset()
        if (fetchModule && fetchModule.mockReset) {
            fetchModule.mockReset()
        }
    })

    test('returns formatted place name when API responds OK', async () => {
        const okResponse = {
            ok: true,
            json: async () => ({
                features: [
                    { properties: { formatted: 'Kyiv, Ukraine' } }
                ]
            })
        }

        if (fetchModule) {
            fetchModule.mockResolvedValueOnce(okResponse)
        }
        global.fetch.mockResolvedValueOnce(okResponse)

        await expect(
            getPlaceNameFromCoords(50.45, 30.52)
        ).resolves.toBe('Kyiv, Ukraine')
    })

    test('returns null when API response is not ok', async () => {
        const badResponse = {
            ok: false,
            json: async () => ({})
        }

        if (fetchModule) {
            fetchModule.mockResolvedValueOnce(badResponse)
        }
        global.fetch.mockResolvedValueOnce(badResponse)

        await expect(
            getPlaceNameFromCoords(0, 0)
        ).resolves.toBeNull()
    })
})
