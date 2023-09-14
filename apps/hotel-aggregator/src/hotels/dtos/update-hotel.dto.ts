import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateHotelDto {

  @Field(() => String, { nullable: true })
  hotelTitle: string;

  @Field(() => String, { nullable: true })
  hotelAddress: string;

  @Field(() => String, { nullable: true })
  location: string;

  @Field(() => String, { nullable: true })
  rating: string;

  @Field(() => String, { nullable: true })
  phoneNo: string;

  @Field(() => String, { nullable: true })
  emailID: string;

  @Field(() => [String], { nullable: true })
  reviews: string[];

  @Field(() => [String], { nullable: true })
  hotelDescription: string[];

  @Field(() => String, { nullable: true })
  hotelType: string;

  @Field(() => ID)
  _id?: string;
}