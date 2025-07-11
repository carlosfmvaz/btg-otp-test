import sinon from 'sinon';
import OTPController from '../../src/controllers/otp-controller';
import GenerateOTP from '../../src/use-cases/generate-otp';
import ValidateOTP from '../../src/use-cases/validate-otp';
import OTPHandler from '../../src/gateways/otp-handler';
import OTPMemory from '../../src/db/memory/otp-memory-dao';

beforeEach(() => {
    sinon.restore();
});

const otpHandler = new OTPHandler();
const otpDAO = new OTPMemory();
const generateOtpUseCase = new GenerateOTP(
    otpHandler,
    otpDAO
);
const validateOtpUseCase = new ValidateOTP(
    otpHandler,
    otpDAO
);
const otp_controller = new OTPController(
    generateOtpUseCase,
    validateOtpUseCase
);

it('Should return 200 and OTP data on generateOTP success', async () => {
    const input = {
        body: {
            expiresInSeconds: 300
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
    };
    await otp_controller.generateOTP(input as any, res as any);
    expect(res.status.calledWith(200)).toBeTruthy();
    expect(res.send.calledWithMatch({
        message: 'OTP generated successfully',
        data: {
            otp: sinon.match.string,
            tokenId: sinon.match.string,
            expiresAt: sinon.match.string
        }
    })).toBeTruthy();
});

it('Should return 400 if generateOTP input is invalid', async () => {
    const input = {
        body: {
            expiresInSeconds: -1
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
    };
    await otp_controller.generateOTP(input as any, res as any);
    expect(res.status.calledWith(400)).toBeTruthy();
    expect(res.send.calledWith({ error: 'Invalid expiresInSeconds value' })).toBeTruthy();
});

it('Should return 500 on generateOTP failure', async () => {
    const input = {
        body: {
            expiresInSeconds: 300
        }
    };
    sinon.stub(generateOtpUseCase, 'execute').throws(new Error('Internal error'));
    const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
    };
    await otp_controller.generateOTP(input as any, res as any);
    expect(res.status.calledWith(500)).toBeTruthy();
    expect(res.send.calledWith({ error: 'Internal server error' })).toBeTruthy();
});

it('Should return 200 and validation result on verifyOTP success', async () => {
    const otpData = await generateOtpUseCase.execute({ expiresInSeconds: 300 });
    const input = {
        body: {
            tokenId: otpData.tokenId,
            otp: otpData.otp
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
    };
    await otp_controller.verifyOTP(input as any, res as any);
    expect(res.status.calledWith(200)).toBeTruthy();
    expect(res.send.calledWith({
        message: 'OTP validated successfully',
        isValid: true
    })).toBeTruthy();
});

it('Should return 400 on verifyOTP if tokenId is invalid', async () => {
    const input = {
        body: {
            tokenId: 'invalid-token',
            otp: '123456'
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
    };
    await otp_controller.verifyOTP(input as any, res as any);
    expect(res.status.calledWith(400)).toBeTruthy();
    expect(res.send.calledWith({
        message: 'Invalid tokenId',
        isValid: false
    })).toBeTruthy();
});
