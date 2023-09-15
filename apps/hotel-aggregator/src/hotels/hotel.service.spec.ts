import { Test, TestingModule } from '@nestjs/testing';
import { HotelService } from './hotel.service';
import { Query } from 'mongoose';
import { UpdateHotelDto } from './dtos/update-hotel.dto';
import { Hotel } from './hotel.schema';
import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import {HotelSchema} from './hotel.schema';

const mockFind = jest.fn();
const mockDistinct = jest.fn();
const mockFindOne = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockSend = jest.fn();


describe('HotelService', () => {
  let service: HotelService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: await mongod.getUri(),
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }),
        }),
      ],
      providers: [
        HotelService,
        {
          provide: getModelToken('Hotel'),
          useFactory: () => {
            return mongoose.model('Hotel', HotelSchema);
          },
          useValue: {
            find: mockFind as jest.Mock,
            distinct: mockDistinct as jest.Mock,
            findOne: mockFindOne as jest.Mock,
            findByIdAndUpdate: mockFindByIdAndUpdate as jest.Mock,
            findByIdAndDelete: mockFindByIdAndDelete as jest.Mock
          },
        },
      ],
    }).compile();

    service = module.get<HotelService>(HotelService);
  });

  describe('getAllHotels', () => {
    it('should return an array of hotels', async () => {
      // Mock the 'find' method to return an array of hotels
      const mockHotels: Hotel[] = [
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

      mockFind.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockHotels),
      } as unknown as Query<Hotel[], Hotel>);

      const result = await service.getAllHotels();

      expect(result).toEqual(mockHotels);

    });
  });

  describe('getLocations', () => {
    it('should return an array of unique locations', async () => {
      // Mock the 'distinct' method to return an array of unique locations
      const mockLocations: string[] = ['Location A', 'Location B', 'Location C'];

      mockDistinct.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLocations),
      } as unknown as Query<string[], String>);

      const result = await service.getLocations();
      expect(result).toEqual(mockLocations);

      // Ensure that the 'distinct' method was called with the correct arguments ('location')
      expect(mockDistinct).toHaveBeenCalledWith('location');
    });
  });

  describe('getHotelByLocation', () => {
    it('should return a hotel by location', async () => {
      const location = 'Location B';

      // Mock the 'findOne' method to return a hotel
      const mockHotel: Hotel = {
         hotelTitle: 'Hotel B',
          hotelAddress: 'Address B',
          location: 'Location B',
          rating: '4.0',
          phoneNo: '0987654321',
          emailID: 'hotelB@example.com',
          hotelType: 'Type B',
          reviews: ['Review 3', 'Review 4'],
          hotelDescription: ['Description 3', 'Description 4'],
      };
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockHotel),
      } as unknown as Query<Hotel, Hotel>);

      const result = await service.getHotelByLocation(location);
      expect(result).toEqual(mockHotel);

    });

    it('should return null if no hotel found', async () => {
      const location = 'Non-existent Location';

      // Mock the 'findOne' method to return null
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<Hotel, Hotel>);

      const result = await service.getHotelByLocation(location);
      expect(result).toBeNull();
    });

  });

  describe('getHotelByName', () => {
    it('should return a hotel by name', async () => {
      const hotelTitle = 'Hotel B';

      // Mock the 'findOne' method to return a hotel
      const mockHotel: Hotel = {
        hotelTitle: 'Hotel B',
          hotelAddress: 'Address B',
          location: 'Location B',
          rating: '4.0',
          phoneNo: '0987654321',
          emailID: 'hotelB@example.com',
          hotelType: 'Type B',
          reviews: ['Review 3', 'Review 4'],
          hotelDescription: ['Description 3', 'Description 4'],
      };
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockHotel),
      } as unknown as Query<Hotel, Hotel>);

      const result = await service.getHotelByName(hotelTitle);
      expect(result).toEqual(mockHotel);
    });

    it('should return null if no hotel found', async () => {
      const hotelTitle = 'Non-existent Hotel';

      // Mock the 'findOne' method to return null
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<Hotel, Hotel>);

      const result = await service.getHotelByName(hotelTitle);
      expect(result).toBeNull();
    });
  
  });

  describe('updateHotel', () => {
    it('should update a hotel', async () => {
      const hotelId = 'mockedHotelId'; // Replace with a valid hotel ID
      const updateHotelDto: UpdateHotelDto = {
        hotelTitle: 'Hotel B',
        hotelAddress: 'Address B',
        location: 'Location B',
        rating: '4.0',
        phoneNo: '0987654321',
        emailID: 'hotelB@example.com',
        hotelType: 'Type B',
        reviews: ['Review 3', 'Review 4'],
        hotelDescription: ['Description 3', 'Description 4'],
      };

      // Mock the 'findByIdAndUpdate' method to return the updated hotel
      const updatedHotel = {
        _id: hotelId,
        ...updateHotelDto,
      };
      mockFindByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedHotel),
      } as unknown as Query<Hotel, Hotel>);

      const result = await service.updateHotel(hotelId, updateHotelDto);
      expect(result).toEqual(updatedHotel);
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        hotelId,
        updateHotelDto,
        { new: true }
      );
    });

    it('should return null if hotel not found', async () => {
      const hotelId = 'nonExistentHotelId'; // Replace with a non-existent hotel ID
      const updateHotelDto: UpdateHotelDto = {
        hotelTitle: 'Hotel B',
        hotelAddress: 'Address B',
        location: 'Location B',
        rating: '4.0',
        phoneNo: '0987654321',
        emailID: 'hotelB@example.com',
        hotelType: 'Type B',
        reviews: ['Review 3', 'Review 4'],
        hotelDescription: ['Description 3', 'Description 4'],
      };

      // Mock the 'findByIdAndUpdate' method to return null (hotel not found)
      mockFindByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<Hotel, Hotel>);
      const result = await service.updateHotel(hotelId, updateHotelDto);
      expect(result).toBeNull();
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        hotelId,
        updateHotelDto,
        { new: true }
      );
    });
  });

  describe('deleteHotel', () => {
    it('should delete a hotel and return true', async () => {
      const hotelId = '64a1af090f8267d59033ce88'; // Replace with a valid hotel ID

      // Mock the 'findByIdAndDelete' method to return a deleted hotel
      const deletedHotel = {
        _id: hotelId,
      };
      mockFindByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deletedHotel),
      } as unknown as Query<Boolean, boolean>);
      const result = await service.deleteHotel(hotelId);
      expect(result).toBe(true);
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(hotelId);
    });

    it('should return false if hotel not found', async () => {
      const hotelId = 'nonExistentHotelId'; // Replace with a non-existent hotel ID

      // Mock the 'findByIdAndDelete' method to return null (hotel not found)
      mockFindByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<Boolean, boolean>);
      const result = await service.deleteHotel(hotelId);
      expect(result).toBe(false);
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(hotelId);
    });
  });

  describe('login', () => {
    xit('should return user data when valid credentials are provided', async () => {
      const credentials = {
        email: 'chris@example.com',
        password: 'secret',
      };

      // Mock the 'send' method to return user data
      const userData = {
        user: {
          email: 'chris@example.com',
          password: 'secret',
        },
        token: 'mockedToken',
      };
      mockSend.mockResolvedValue(userData);

      // Call the 'login' method
      const result = await service.login(credentials);

      // Expect the result to match the mocked user data
      expect(result.user.email).toEqual('chris@example.com');
    });

    xit('should return null when invalid credentials are provided', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      const userData = {
        user: {
          email: 'test@example.com',
          password: 'password123',
        },
        token: 'mockedToken',
      };
      mockSend.mockResolvedValue(userData);
      const result = await service.login(credentials);
      expect(result).toEqual(null);
    });

  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(() => {
    // Clear mock function after all tests
    jest.clearAllMocks();
  });


});
