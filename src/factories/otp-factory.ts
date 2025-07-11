import OTPController from "../controllers/otp-controller";
import OTPDAO from "../db/dao/otp-redis-dao";
import GenerateOTP from "../use-cases/generate-otp";
import ValidateOTP from "../use-cases/validate-otp";

export default class OTPFactory {
    static create(): OTPController {
        const otpDAO = new OTPDAO();
        const generateOTPUseCase = new GenerateOTP(otpDAO);
        const validateOTPUseCase = new ValidateOTP(otpDAO);
    
        return new OTPController(generateOTPUseCase, validateOTPUseCase);
    }
}