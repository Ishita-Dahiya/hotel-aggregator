export interface Hotel {
  hotelTitle: String,
  hotelAddress: String,
  location: String,
  rating: Number,
  phoneNo: String,
  emailID: String,
  hotelType: String,
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
  ],
  reviews: [String],
  hotelDescription: [String]
}
