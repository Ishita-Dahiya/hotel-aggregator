import { ApiProperty } from "@nestjs/swagger";
import { Length, IsNotEmpty, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({
        message: 'name is required'
    })
    @Length(3, 20, {
        message: 'name must be between 3 and 20 characters'
    })
    @ApiProperty({ example: 'John', description: 'Name of the User' })
    name: String;
    @IsNotEmpty({
        message: 'password is required'
    })
    @ApiProperty({ example: 'John', description: 'Password of the User' })
    password: String;
    @IsNotEmpty({
        message: 'age is required'
    })
    @ApiProperty({ example: 42, description: 'Age of the User' })
    age: Number;
    @ApiProperty({ example: '+91-2343344442', description: 'Phone Number of the Hotel' })
    phoneNo: String;
    @IsNotEmpty({
        message: 'emailID is required'
    })
    @IsEmail({
    })
    @ApiProperty({ example: 'abc@gmail.com', description: 'Email Id of the Hotel' })
    email: String;
  }
      