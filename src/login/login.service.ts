import { Injectable, BadRequestException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './login.interface';
import { CreateUserDto } from './create-user.dto';

//import { UserService } from '../user/user.service';

@Injectable()
export class LoginService {
  constructor(
    //private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email: { $regex: new RegExp(`^${email}$`), $options: 'i' }, }).exec();
    if (user && user.password === password) {
      const payload = { email: user.email, sub: user.id };
      return this.jwtService.sign(payload);
    }
    return null;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async addUser(userModel: CreateUserDto): Promise<User> {
    const hotelId = new mongoose.Types.ObjectId();
    const finalData = {
      _id: hotelId,
      ...userModel
    }
    const createdMyModel = new this.userModel(finalData);
    try {
      return createdMyModel.save();
    } catch (error) {
      throw new BadRequestException(
        'Something bad happened',
        { cause: new Error(), description: 'Some error description' })
    }
  }
}
