import { Injectable, BadRequestException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './login.interface';
import { CreateUserDto } from './dtos/create-user.dto';


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
      const token =  this.jwtService.sign(payload);
      return {token, user}
    }
    return null;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async addUser(userModel: CreateUserDto): Promise<any> {
    console.log(userModel.email);
    const user = await this.userModel.findOne({email: userModel.email}).exec();
    console.log(user);
    if (user) {
      return null;
    } else {
      const hotelId = new mongoose.Types.ObjectId();
      const finalData = {
        _id: hotelId,
        ...userModel
      }
      const createdMyModel = new this.userModel(finalData);
      return createdMyModel.save();
    }
  }
}
