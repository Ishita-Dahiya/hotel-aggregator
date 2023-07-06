import { ApiProperty } from "@nestjs/swagger";
import { Length, IsNotEmpty, IsEmail } from "class-validator";

export class CreateHotelDto {
    @IsNotEmpty({
        message: 'hotelTitle is required'
    })
    @Length(3, 20, {
        message: 'Title must be between 3 and 20 characters'
    })
    @ApiProperty({ example: 'Hilton', description: 'Name of the Hotel' })
    hotelTitle: String;
    @IsNotEmpty({
        message: 'hotelAddress is required'
    })
    @ApiProperty({ example: '23, Main Street...', description: 'Address of the Hotel' })
    hotelAddress: String;
    @IsNotEmpty({
        message: 'location is required'
    })
    @ApiProperty({ example: 'Mumbai', description: 'Location of the Hotel' })
    location: String;
    @ApiProperty({ example: 2, description: 'Rating of the Hotel' })
    rating: Number;
    @ApiProperty({ example: '+91-2343344442', description: 'Phone Number of the Hotel' })
    phoneNo: String;
    @IsNotEmpty({
        message: 'emailID is required'
    })
    @IsEmail({
    })
    @ApiProperty({ example: 'abc@gmail.com', description: 'Email Id of the Hotel' })
    emailID: String;
    @IsNotEmpty({
        message: 'roomType is required'
    })
    @ApiProperty({ example: 'price, amenities, category etc..', description: 'Room Details of the Hotel' })
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
    @ApiProperty({ example: 'good ambience', description: 'Reviews of the Hotel' })
    reviews: [String];
    @ApiProperty({ example: 'hotel is located near ABC bank', description: 'Description of the Hotel' })
    hotelDescription: [String]
  }
  