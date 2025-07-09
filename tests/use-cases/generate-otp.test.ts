import sinon from 'sinon';

import GenerateOTP from '../../src/use-cases/generate-otp';
import OTPHandler from '../../src/gateways/otp-handler';
import OTPMemoryDAO from '../../src/db/memory/otp-memory-dao';

const otpHandler = new OTPHandler();
const otpMemoryDAO = new OTPMemoryDAO();
const generateOTP = new GenerateOTP(otpHandler, otpMemoryDAO);

beforeEach(() => {
    sinon.restore();
});

it('Should generate a valid OTP and store it on DB', async () => {
    const expiresInSeconds = 10;
    const result = await generateOTP.execute({ expiresInSeconds });
    
    const otpFromDB = await otpMemoryDAO.getById(result.tokenId);
    expect(otpFromDB).not.toBeNull();
    expect(otpFromDB?.otp).toBe(result.otp);
    expect(otpFromDB?.expiresAt.getTime()).toBe(result.expiresAt.getTime());
    expect(result.otp).toHaveLength(6);
    expect(result.tokenId).toHaveLength(36);
    expect(Object.keys(result).length).toBe(3);
});

it('Should throw an error if OTP data is not generated correctly', async () => {
    const expiresInSeconds = 10;
    sinon.stub(otpHandler, 'generateOTP').resolves(null); 
    expect(generateOTP.execute({ expiresInSeconds })).rejects.toThrow("Failed to generate OTP data");
});

it('Should throw an error if OTP data is not saved correctly', async () => {
    const expiresInSeconds = 10;
    sinon.stub(otpHandler, 'generateOTP').resolves({
        otp: '123456',
        tokenId: 'test-token-id',
        secret: 'secret-key',
        expiresAt: new Date(Date.now() + expiresInSeconds * 1000)
    });
    sinon.stub(otpMemoryDAO, 'save').resolves(false);
    expect(generateOTP.execute({ expiresInSeconds })).rejects.toThrow("Failed to save OTP data");
});