import OTPController from "../controllers/otp-controller";
import OTPDAO from "../db/memory/otp-memory-dao";
import OTPHandler from "../gateways/otp-handler";
import GenerateOTP from "../use-cases/generate-otp";
import ValidateOTP from "../use-cases/validate-otp";

export default class OTPFactory {
    static create(): OTPController {
        const otpDAO = new OTPDAO();
        const otpHandler = new OTPHandler();
        const generateOTPUseCase = new GenerateOTP(otpHandler, otpDAO);
        const validateOTPUseCase = new ValidateOTP(otpHandler, otpDAO);
    
        return new OTPController(generateOTPUseCase, validateOTPUseCase);
    }
}