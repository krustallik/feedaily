// Mock nodemailer so we don't send real emails
jest.mock('nodemailer', () => {
    const sendMail = jest.fn().mockResolvedValue({ messageId: 'msg-1' })
    const createTransport = jest.fn(() => ({ sendMail }))
    return { __esModule: true, default: { createTransport }, createTransport }
})

const nodemailer = require('nodemailer')
const { sendEmail } = require('../emailService.js')

describe('emailService.sendEmail', () => {
    test('creates transporter with SMTP config', async () => {
        await sendEmail('a@b.c', 'Subject', 'Body')

        expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
        expect(nodemailer.createTransport.mock.calls[0][0]).toMatchObject({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false
        })
    })

    test('calls sendMail with expected fields', async () => {
        await sendEmail('a@b.c', 'Subject', 'Body')

        const transporter = nodemailer.createTransport.mock.results[0].value
        expect(transporter.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: 'a@b.c',
                subject: 'Subject',
                text: 'Body'
            })
        )
    })

    test('propagates sendMail error', async () => {
        const transporter = nodemailer.createTransport()
        transporter.sendMail.mockRejectedValueOnce(new Error('fail'))

        await expect(sendEmail('x@y.z', 'S', 'B')).rejects.toThrow('fail')
    })
})
