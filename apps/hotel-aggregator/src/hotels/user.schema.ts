import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Document } from 'mongoose';


@ObjectType()
export class User extends Document {

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  token?: string;
}

