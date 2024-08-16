import { registerAs } from '@nestjs/config';

export default registerAs('environment', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
}));
