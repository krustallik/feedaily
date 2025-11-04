const express = require('express')
const request = require('supertest')

// --- Stripe mock (test double). We intercept Stripe and provide our own session.create. ---
const mockCreateSession = jest.fn()
jest.mock('stripe', () =>
    jest.fn().mockImplementation(() => ({
        checkout: {
            sessions: {
                create: mockCreateSession,
                retrieve: jest.fn()
            }
        }
    }))
)

// --- Fake DB / email / OTP so that tests do not touch real services or disk. ---
jest.mock('../database.js', () => ({
    __esModule: true,
    default: { get: jest.fn(), run: jest.fn() }
}))

jest.mock('../emailService.js', () => ({
    __esModule: true,
    sendEmail: jest.fn().mockResolvedValue()
}))

jest.mock('../otpService.js', () => ({
    __esModule: true,
    generateOtp: jest.fn().mockReturnValue('123456')
}))

// createCheckoutSession.js exports an Express router as default
const router = require('../createCheckoutSession.js').default

describe('POST /create-checkout-session', () => {
    beforeEach(() => {
        mockCreateSession.mockReset()
    })

    test('responds 400 when donationId is missing', async () => {
        const app = express()
        app.use(express.json())
        app.use(router)

        const res = await request(app)
            .post('/create-checkout-session')
            .send({
                amount: 10,
                productName: 'X',
                receiverEmail: 'a@b.c'
            })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error')
    })

    test('responds 200 and returns Stripe checkout URL when session is created', async () => {
        const app = express()
        app.use(express.json())
        app.use(router)

        mockCreateSession.mockResolvedValueOnce({
            id: 'cs_123',
            url: 'https://example.test/checkout/cs_123',
            metadata: {}
        })

        const res = await request(app)
            .post('/create-checkout-session')
            .send({
                amount: 10,
                productName: 'X',
                donationId: 1,
                receiverEmail: 'a@b.c'
            })

        expect(res.status).toBe(200)
        expect(res.body.url).toMatch(/^https?:\/\//)
        expect(mockCreateSession).toHaveBeenCalled()
    })
})
