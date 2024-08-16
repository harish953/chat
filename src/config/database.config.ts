import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.DATABASE_URI || 'mongodb://localhost/nestjs',
  // You can add more environment-specific configurations here
}));
