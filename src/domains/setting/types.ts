import { ApiProperty } from '@nestjs/swagger';
import { CompanyProfileDto } from './dto/company-profile.dto';

export class CompanyProfileResponseDto extends CompanyProfileDto {
  @ApiProperty({
    description: 'The unique identifier of the company profile',
    example: '60c72b2f9b1d8c001f8e4a3a',
  })
  _id: string;

  @ApiProperty({
    description: 'The date and time the profile was last updated',
    example: '2023-01-02T12:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The ID of the admin who last updated the profile',
    example: '60c72b2f9b1d8c001f8e4a3b',
  })
  updatedBy: string;
}
