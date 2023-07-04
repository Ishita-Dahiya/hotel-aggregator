//import { ApiProperty } from "@nestjs/swagger";
import { Length, IsNotEmpty, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({
        message: 'name is required'
    })
    @Length(3, 20, {
        message: 'name must be between 3 and 20 characters'
    })
    name: String;
    @IsNotEmpty({
        message: 'password is required'
    })
    password: String;
    @IsNotEmpty({
        message: 'age is required'
    })
    age: Number;
    phoneNo: String;
    @IsNotEmpty({
        message: 'emailID is required'
    })
    @IsEmail({
    })
    email: String;
  }
      