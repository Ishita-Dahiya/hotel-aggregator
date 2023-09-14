import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from './login.service';
import { Model, Query } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './login.interface';
import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import {UserSchema} from './login.schema';

const mockFind = jest.fn();
const mockDistinct = jest.fn();
const mockFindOne = jest.fn();
const mockUpdateOne = jest.fn();
const mockDeleteOne = jest.fn();

const mockJwtService = {
  sign: jest.fn(),
};

let userModel: Model<User>;

describe('LoginService', () => {
  let service: LoginService;
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
        LoginService,
        {
          provide: getModelToken('User'),
          useFactory: () => {
            return mongoose.model('User', UserSchema);
          },
          useValue: {
            find: mockFind as jest.Mock,
            distinct: mockDistinct as jest.Mock,
            findOne: mockFindOne as jest.Mock,
            updateOne: mockUpdateOne as jest.Mock,
            deleteOne: mockDeleteOne as jest.Mock
          },
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
    userModel = module.get<Model<User>>(getModelToken('User'));

  });

  describe('validateUser', () => {
    it('should return a token and user when valid credentials are provided', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      // Mock the UserModel.findOne to return a user
      const mockUser = {
        _id: 'mockedUserId',
        email,
        password,
      };
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as unknown as Query<User, User>);

      // Mock the JwtService.sign to return a token
      const mockToken = 'mockedToken';
      mockJwtService.sign.mockReturnValue(mockToken);

      // Call the validateUser method
      const result = await service.validateUser(email, password);

      // Expect the result to match the mocked token and user
      expect(result).toEqual({
        token: mockToken,
        user: mockUser,
      });
    });

    it('should return null when invalid credentials are provided', async () => {
      const email = 'test@example.com';
      const password = 'incorrectPassword';

      // Mock the UserModel.findOne to return null (no user found)
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<User, User>);

      // Call the validateUser method
      const result = await service.validateUser(email, password);

      // Expect the result to be null
      expect(result).toBeNull();
    });
  });


  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      // Mock the 'find' method to return an array of users
      const mockUsers: User[] = [
        {
          email: 'usera@example.com',
          password: 'password a',
          name: 'User A',
          age: 22,
          phoneNo: '918907635424'
        },
        {
          email: 'userb@example.com',
          password: 'password b',
          name: 'User B',
          age: 42,
          phoneNo: '918907225424'
        },
      ];

      mockFind.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUsers),
      } as unknown as Query<User[], User>);

      const result = await service.getAllUsers();

      expect(result).toEqual(mockUsers);

    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = 'mockedHotelId'; // Replace with a valid hotel ID
      const updateUserDto: CreateUserDto = {
        email: 'usera@example.com',
        password: 'password a',
        name: 'User A',
        age: 22,
        phoneNo: '918907635424',
        role: 'hotelB@example.com'
      };

      // Mock the 'findByIdAndUpdate' method to return the updated hotel
      const updatedUser = {
        _id: userId,
        ...updateUserDto,
      };
      mockUpdateOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as unknown as Query<User, User>);

      const result = await service.updateUser(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should return null if hotel not found', async () => {
      const userId = 'nonExistentHotelId'; // Replace with a non-existent hotel ID
      const updateUserDto: CreateUserDto = {
        email: 'usera@example.com',
        password: 'password a',
        name: 'User A',
        age: 22,
        phoneNo: '918907635424',
        role: 'hotelB@example.com'
      };

      // Mock the 'findByIdAndUpdate' method to return null (hotel not found)
      mockUpdateOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<User, User>);
      const result = await service.updateUser(userId, updateUserDto);
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete a hotel and return true', async () => {
      const userId = '64a2d1ea0f8267d59033ce8d'; // Replace with a valid hotel ID
      const deletedUser = {
        _id: userId,
      };
      mockDeleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deletedUser),
      } as unknown as Query<Boolean, boolean>);
      const result = await service.deleteUser(userId);
      expect(result).toStrictEqual({_id: userId});

    });

    it('should return false if hotel not found', async () => {
      const hotelId = 'nonExistentHotelId'; // Replace with a non-existent hotel ID

      // Mock the 'findByIdAndDelete' method to return null (hotel not found)
      mockDeleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<Boolean, boolean>);
      const result = await service.deleteUser(hotelId);
      expect(result).toBe(null);
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
