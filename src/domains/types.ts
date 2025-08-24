import { ApiProperty } from '@nestjs/swagger';

export class ResponsePayload {
  @ApiProperty({
    example: 'Action performed successfully',
    default: 'Action performed successfully',
  })
  message?: string;

  @ApiProperty({
    description: 'Data payload of action performed',
    example: {},
  })
  data?: any;
}
