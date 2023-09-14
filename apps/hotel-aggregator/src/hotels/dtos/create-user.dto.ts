import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}