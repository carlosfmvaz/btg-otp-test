import sinon from 'sinon';

import OTPMemoryDAO from '../../src/db/memory/otp-memory-dao';

import ValidateOTP from '../../src/use-cases/validate-otp';
import GenerateOTP from '../../src/use-cases/generate-otp';

const otpMemoryDAO = new OTPMemoryDAO();
const validateOTP = new ValidateOTP(otpMemoryDAO);
const generateOTP = new GenerateOTP(otpMemoryDAO);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

beforeEach(() => {
    sinon.restore();
});

it('Should generate an OTP and validation must succeeed', async () => {
    const expiresInSeconds = 20;
    const otpCreationResult = await generateOTP.execute({ expiresInSeconds });
    const validationResult = await validateOTP.execute({
        otp: otpCreationResult.otp,
        tokenId: otpCreationResult.tokenId
    });
    expect(validationResult.message).toBe("OTP validated successfully");
    expect(validationResult.isValid).toBe(true);
});

it('Should generate an OTP and validation must fail with wrong OTP', async () => {
    const expiresInSeconds = 5;
    const otpCreationResult = await generateOTP.execute({ expiresInSeconds });

    const validationResult = await validateOTP.execute({
        otp: 'wrong-otp',
        tokenId: otpCreationResult.tokenId
    });
    expect(validationResult.message).toBe("Invalid OTP");
    expect(validationResult.isValid).toBe(false);
});

it('Should generate an OTP and validation must fail with expired OTP', async () => {
    const expiresInSeconds = 1;
    const otpCreationResult = await generateOTP.execute({ expiresInSeconds });

    await sleep(2000); // Wait for the OTP to expire

    const validationResult = await validateOTP.execute({
        otp: otpCreationResult.otp,
        tokenId: otpCreationResult.tokenId
    });
    expect(validationResult.message).toBe("OTP has expired");
    expect(validationResult.isValid).toBe(false);
});

it('Should return invalid OTP information if tokenId not found', async () => {
    const otpCreationResult = await generateOTP.execute({ expiresInSeconds: 5 });

    await otpMemoryDAO.deleteById(otpCreationResult.tokenId);
    const validationResult = await validateOTP.execute({
        otp: otpCreationResult.otp,
        tokenId: otpCreationResult.tokenId
    });
    expect(validationResult.message).toBe("Invalid tokenId");
    expect(validationResult.isValid).toBe(false);
});