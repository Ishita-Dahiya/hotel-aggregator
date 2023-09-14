import { Test, TestingModule } from '@nestjs/testing';
import { HotelResolver } from './hotel.resolver';
import { HotelService } from './hotel.service';
import { Hotel } from './hotel.schema';
import { BadRequestException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateHotelDto } from './dtos/create-hotel.dto';
import { UpdateHotelDto } from './dtos/update-hotel.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';


describe('HotelResolver', () => {
  let resolver: HotelResolver;
  let service: HotelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelResolver,
        ConfigService,
        {
          provide: HotelService,
          useValue: {
            getAllHotels: jest.fn(),
            getLocations: jest.fn(),
            getHotelByLocation: jest.fn(),
            getHotelByName: jest.fn(),
            addHotel: jest.fn(),
            updateHotel: jest.fn(),
            deleteHotel: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<HotelResolver>(HotelResolver);
    service = module.get<HotelService>(HotelService);
  });

  describe('getAllHotels', () => {
    it('should return an array of hotels', async () => {
      const hotels: Hotel[] = [
        {
          _id: '1',
          hotelTitle: 'Hotel A',
          hotelAddress: 'Address A',
          location: 'Location A',
          rating: '4.5',
          phoneNo: '1234567890',
          emailID: 'hotelA@example.com',
          hotelType: 'Type A',
          reviews: ['Review 1', 'Review 2'],
          hotelDescription: ['Description 1', 'Description 2'],
        },
        {
          _id: '2',
          hotelTitle: 'Hotel B',
          hotelAddress: 'Address B',
          location: 'Location B',
          rating: '4.0',
          phoneNo: '0987654321',
          emailID: 'hotelB@example.com',
          hotelType: 'Type B',
          reviews: ['Review 3', 'Review 4'],
          hotelDescription: ['Description 3', 'Description 4'],
        },
      ];
      jest.spyOn(service, 'getAllHotels').mockResolvedValue(hotels);
  
      expect(await resolver.getAllHotels()).toBe(hotels);
    });
  
    it('should throw a BadRequestException if an error occurs', async () => {
      jest.spyOn(service, 'getAllHotels').mockRejectedValue(new Error());
  
      await expect(resolver.getAllHotels()).rejects.toThrow(Error);
    });
  });

  it('should return an array of locations', async () => {
    // Mock the getLocations method of hotelService to return some sample data
    const mockLocations = ['Location A', 'Location B'];
    jest.spyOn(service, 'getLocations').mockResolvedValue(mockLocations);

    // Call the resolver function
    const result = await resolver.getLocations();

    // Expect the result to match the mockLocations array
    expect(result).toEqual(mockLocations);
  });

  it('should throw a BadRequestException when an error occurs', async () => {
    // Mock the getLocations method of hotelService to throw an error
    jest.spyOn(service, 'getLocations').mockRejectedValue(new Error('Some error'));

    // Use try-catch to catch the thrown exception
    try {
      await resolver.getLocations();
    } catch (error) {
      // Expect the caught error to be an instance of BadRequestException
      expect(error).toBeInstanceOf(Error)
    }
  });

  it('should return a hotel by location', async () => {
    // Mock the getHotelByLocation method of hotelService to return some sample data
    const mockLocation = 'Location A';
    const hotel: Hotel = 
      {
        _id: '1',
        hotelTitle: 'Hotel A',
        hotelAddress: 'Address A',
        location: 'Location A',
        rating: '4.5',
        phoneNo: '1234567890',
        emailID: 'hotelA@example.com',
        hotelType: 'Type A',
        reviews: ['Review 1', 'Review 2'],
        hotelDescription: ['Description 1', 'Description 2'],
      }
    ;
    jest.spyOn(service, 'getHotelByLocation').mockResolvedValue(hotel);

    // Call the resolver function
    const result = await resolver.getHotelByLocation(mockLocation);

    // Expect the result to match the mockHotel
    expect(result).toEqual(hotel);
  });

  it('should throw a BadRequestException when an error occurs', async () => {
    // Mock the getHotelByLocation method of hotelService to throw an error
    const mockLocation = 'Location A';
    jest.spyOn(service, 'getHotelByLocation').mockRejectedValue(new Error('Some error'));

    // Use try-catch to catch the thrown exception
    try {
      await resolver.getHotelByLocation(mockLocation);
    } catch (error) {
      // Expect the caught error to be an instance of BadRequestException
      expect(error).toBeInstanceOf(BadRequestException);

      // Expect the error message and description to match
      expect(error.message).toBe('Some error occurred');
      expect(error.getResponse()).toEqual({
        cause: new Error(),
        description: 'Some error occurred.Please Try again.',
      });
    }
  });


  it('should return a hotel by name', async () => {
    // Mock the getHotelByName method of hotelService to return some sample data
    const mockHotelTitle = 'Hotel A';
    const hotel: Hotel = 
      {
        _id: '1',
        hotelTitle: 'Hotel A',
        hotelAddress: 'Address A',
        location: 'Location A',
        rating: '4.5',
        phoneNo: '1234567890',
        emailID: 'hotelA@example.com',
        hotelType: 'Type A',
        reviews: ['Review 1', 'Review 2'],
        hotelDescription: ['Description 1', 'Description 2'],
      }
    ; // Replace with your sample hotel object
    jest.spyOn(service, 'getHotelByName').mockResolvedValue(hotel);

    // Call the resolver function
    const result = await resolver.getHotelByName(mockHotelTitle);

    // Expect the result to match the mockHotel
    expect(result).toEqual(hotel);
  });

  it('should throw a BadRequestException when an error occurs', async () => {
    // Mock the getHotelByName method of hotelService to throw an error
    const mockHotelTitle = 'Hotel A';
    jest.spyOn(service, 'getHotelByName').mockRejectedValue(new Error('Some error'));

    // Use try-catch to catch the thrown exception
    try {
      await resolver.getHotelByName(mockHotelTitle);
    } catch (error) {
      // Expect the caught error to be an instance of BadRequestException
      expect(error).toBeInstanceOf(BadRequestException);

      // Expect the error message and description to match
      expect(error.message).toBe('Some error occurred');
      expect(error.getResponse()).toEqual({
        cause: new Error(),
        description: 'Some error occurred.Please Try again.',
      });
    }
  });


  it('should add a hotel and return true', async () => {
    // Mock the addHotel method of hotelService to succeed
    const mockInput: CreateHotelDto = {
      hotelTitle: 'Hotel A',
      hotelAddress: 'Address A',
      location: 'Location A',
      rating: '4.5',
      phoneNo: '1234567890',
      emailID: 'hotelA@example.com',
      hotelType: 'Type A',
      reviews: ['Review 1', 'Review 2'],
      hotelDescription: ['Description 1', 'Description 2'],
    }; 
    jest.spyOn(service, 'addHotel').mockResolvedValue(undefined);

    // Call the resolver function
    const result = await resolver.addHotel(mockInput);

    // Expect the result to be true
    expect(result).toBe(true);
  });


  it('should throw an HttpException with FORBIDDEN status when an error occurs', async () => {
    // Mock the addHotel method of hotelService to throw an error
    const mockInput: CreateHotelDto = {
      hotelTitle: 'Hotel A',
      hotelAddress: 'Address A',
      location: 'Location A',
      rating: '4.5',
      phoneNo: '1234567890',
      emailID: 'hotelA@example.com',
      hotelType: 'Type A',
      reviews: ['Review 1', 'Review 2'],
      hotelDescription: ['Description 1', 'Description 2'],
    }; 
    const mockError = new Error('Some error');
    jest.spyOn(service, 'addHotel').mockRejectedValue(mockError);

    // Use try-catch to catch the thrown exception
    try {
      await resolver.addHotel(mockInput);
    } catch (error) {
      // Expect the caught error to be an instance of HttpException with FORBIDDEN status
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);

      // Expect the error response to match the provided structure
      expect(error.getResponse()).toEqual({
        status: HttpStatus.FORBIDDEN,
        error: 'This is an error while fetching data',
      });

      // Expect the cause to be the mockError
      expect(error.getCause()).toBe(mockError);
    }
  });

  it('should update a hotel and return the updated hotel', async () => {
    // Mock the updateHotel method of hotelService to return some sample data
    const mockInput: UpdateHotelDto = {
      _id: 'someId',
      hotelTitle: 'Hotel A',
      hotelAddress: 'Address A',
      location: 'Location A',
      rating: '4.5',
      phoneNo: '1234567890',
      emailID: 'hotelA@example.com',
      hotelType: 'Type A',
      reviews: ['Review 1', 'Review 2'],
      hotelDescription: ['Description 1', 'Description 2'],
    }; 
    const mockUpdatedHotel = {
      _id: 'someId',
      hotelTitle: 'Hotel A',
      hotelAddress: 'Address A',
      location: 'Location A',
      rating: '4.9',
      phoneNo: '1234567890',
      emailID: 'hotelA@example.com',
      hotelType: 'Type A',
      reviews: ['Review 1', 'Review 2'],
      hotelDescription: ['Description 1', 'Description 2'],
    };
    jest.spyOn(service, 'updateHotel').mockResolvedValue(mockUpdatedHotel);

    // Call the resolver function
    const result = await resolver.updateHotel(mockInput);

    // Expect the result to match the mockUpdatedHotel
    expect(result).toEqual(mockUpdatedHotel);
  });

  it('should delete a hotel and return true', async () => {
    // Mock the deleteHotel method of hotelService to succeed
    const mockId = 'someId';
    jest.spyOn(service, 'deleteHotel').mockResolvedValue(true);

    // Call the resolver function
    const result = await resolver.deleteHotel(mockId);

    // Expect the result to be true
    expect(result).toBe(true);
  });

  it('should log in a user and return user details with a token', async () => {
    // Mock the login method of hotelService to return some sample data
    const mockCredentials: CreateUserDto = { email: 'test@example.com', password: 'password123' }; // Replace with your sample DTO
    const mockResult = {
      user: {
        email: 'test@example.com',
        password: 'password123', // You should avoid returning the password in a real-world scenario
      },
      token: 'someAuthToken',
    };
    jest.spyOn(service, 'login').mockResolvedValue(mockResult);

    // Call the resolver function
    const result = await resolver.login(mockCredentials);

    // Expect the result to match the mockResult
    expect(result).toEqual({
      email: mockResult.user.email,
      password: mockResult.user.password, // You should avoid returning the password in a real-world scenario
      token: mockResult.token,
    });
  });

  it('should throw an UnauthorizedException when login fails', async () => {
    // Mock the login method of hotelService to return null, indicating login failure
    const mockCredentials: CreateUserDto = { email: 'test@example.com', password: 'password123' }; // Replace with your sample DTO
    jest.spyOn(service, 'login').mockResolvedValue(null);

    // Use try-catch to catch the thrown exception
    try {
      await resolver.login(mockCredentials);
    } catch (error) {
      // Expect the caught error to be an instance of UnauthorizedException
      expect(error).toBeInstanceOf(UnauthorizedException);

      // Expect the error message to match
      expect(error.message).toBe('User is not registered with the App');
    }
  });





  
  

  // Write similar test cases for other resolver functions

});
