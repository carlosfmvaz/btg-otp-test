import express, { Response, Request } from 'express';
import OTPFactory from './factories/otp-factory';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.get('/health-check', (req, res) => {
  res.status(200).send({ status: 'OK' });
});

app.post('/generate-otp', async (req: Request, res: Response) => {
  await OTPFactory.create().generateOTP(req, res);
});

app.post('/validate-otp', async (req: Request, res: Response) => {
  await OTPFactory.create().verifyOTP(req, res);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});