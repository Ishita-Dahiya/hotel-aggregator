//import { ApiProperty } from "@nestjs/swagger";
import { Length, IsNotEmpty, IsEmail } from "class-validator";

export class CreateHotelDto {
    @IsNotEmpty({
        message: 'hotelTitle is required'
    })
    @Length(3, 20, {
        message: 'Title must be between 3 and 20 characters'
    })
    hotelTitle: String;
    @IsNotEmpty({
        message: 'hotelAddress is required'
    })
    @IsNotEmpty({
        message: 'hotelAddress is required'
    })
    hotelAddress: String;
    @IsNotEmpty({
        message: 'location is required'
    })
    location: String;
    rating: Number;
    phoneNo: String;
    @IsNotEmpty({
        message: 'emailID is required'
    })
    @IsEmail({
    })
    emailID: String;
    @IsNotEmpty({
        message: 'roomType is required'
    })
    roomType: [
        {
            amenities: [String],
            price: Number,
            category: String,
            roomDimesation: String,
            totalCountOfRoom: Number,
            accomodation: Number,
            image: [String],
            roomPolicy: [String]
        }
    ];
    reviews: [String];
    hotelDescription: [String]
  }
  