import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './login.interface';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';


describe('LoginController', () => {
  let controller: LoginController;
  let loginService: LoginService;
  const mockUserModel = {
  };
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [LoginService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        }, JwtService, ConfigService],
    }).compile();

    controller = module.get<LoginController>(LoginController);
    loginService = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addUser', () => {
    it('should add a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'usera@example.com',
        password: 'password a',
        name: 'User A',
        age: 22,
        phoneNo: '918907635424',
        role: 'hotelB@example.com'
      };

      const user: User = {
        email: createUserDto.email,
        password: createUserDto.password,
        name: createUserDto.name,
        age: createUserDto.age,
        phoneNo: createUserDto.phoneNo
      };

      jest.spyOn(loginService, 'addUser').mockResolvedValue(user);
      const result = await controller.addUser(createUserDto);
      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'usera@example.com',
        password: 'password a',
        name: 'User A',
        age: 22,
        phoneNo: '918907635424',
        role: 'hotelB@example.com'
      };
      jest.spyOn(loginService, 'addUser').mockResolvedValue(null);
      try {
        await controller.addUser(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('User already exists with this email id');
      }
    });
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const users: User[] = [
        {
          email: 'usera@example.com',
          password: 'password a',
          name: 'User A',
          age: 22,
          phoneNo: '918907635424',
        },
        {
          email: 'userb@example.com',
          password: 'password b',
          name: 'User B',
          age: 43,
          phoneNo: '918227635424',
        },
      ];
      jest.spyOn(loginService, 'getAllUsers').mockResolvedValue(users);
      const result = await controller.getAllUsers();
      expect(result).toBe(users);
    });
  });

  describe('addUser', () => {
    it('should add a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'usera@example.com',
        password: 'password a',
        name: 'User A',
        age: 22,
        phoneNo: '918907635424',
        role: 'Dealer'
      };

      const user = {
        id: '1',
        email: createUserDto.email,
        password: createUserDto.password,
      };

      jest.spyOn(loginService, 'addUser').mockResolvedValue(user);
      const result = await controller.addUser(createUserDto);
      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'usera@example.com',
        password: 'password a',
        name: 'User A',
        age: 22,
        phoneNo: '918907635424',
        role: 'Dealer'
      };

      jest.spyOn(loginService, 'addUser').mockResolvedValue(null);
      try {
        await controller.addUser(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('User already exists with this email id');
      }
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: CreateUserDto = {
        email: 'usera@example.com',
        password: 'password a',
        name: 'User A',
        age: 34,
        phoneNo: '918907635424',
        role: 'Dealer'
      };

      jest.spyOn(loginService, 'updateUser').mockResolvedValue({ id: userId, ...updateUserDto });
      const result = await controller.updateUser(userId, updateUserDto);
      expect(result).toEqual({ id: userId, ...updateUserDto });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = '1';

      jest.spyOn(loginService, 'deleteUser').mockResolvedValue({ id: userId });
      const result = await controller.deleteUser(userId);
      expect(result).toEqual({ id: userId });
    });
  });
});

