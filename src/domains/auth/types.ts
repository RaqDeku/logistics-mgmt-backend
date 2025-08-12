import { ApiProperty } from "@nestjs/swagger";

export class Admin {
    @ApiProperty({
        description: 'The admin email',
        example: "admin@example.com",
    })
    email: string

    @ApiProperty({
        description: 'The admin full name',
        example: "John Doe",
    })
    name: string
}

export class AuthenticatedAdmin {
  @ApiProperty({
    description: 'The authentication token for the admin',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'The admin user details',
    type: Admin,
  })
  user: Admin;
}

