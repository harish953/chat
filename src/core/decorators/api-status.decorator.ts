import { SetMetadata } from '@nestjs/common';

export const ApiStatus = (statusCode: number) => SetMetadata('statusCode', statusCode);
