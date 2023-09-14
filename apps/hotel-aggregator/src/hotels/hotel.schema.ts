import { Field, ObjectType, ID } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
//import { Document } from 'mongoose';


export const HotelSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    hotelTitle: String,
    hotelAddress: String,
    location: String,
    rating: String,
    phoneNo: String,
    emailID: String,
    hotelType: String,
    reviews: [String],
    hotelDescription: [String]
});

@ObjectType()
export class Hotel {

  @Field(() => ID)
  _id?: string;

  @Field()
  hotelTitle?: string;

  @Field()
  hotelAddress?: string;

  @Field()
  location: string;

  @Field(() => String, { nullable: true })
  rating?: string;

  @Field()
  phoneNo: string;

  @Field()
  emailID: string;

  @Field(() => String, { nullable: true })
  hotelType?: string;

  @Field(() => [String], { nullable: true })
  reviews: string[];

  @Field(() => [String], { nullable: true })
  hotelDescription: string[];

}

