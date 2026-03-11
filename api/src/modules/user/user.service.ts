import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists!');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.findByEmail(loginUserDto.email);
    const isValid =
      user && (await bcrypt.compare(loginUserDto.password, user.password));
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    return user;
  }

  async updateVerificationStatus(userId: string, token: string): Promise<User> {
    const user = await this.findById(userId);
    if (
      !user ||
      user.verificationToken !== token ||
      !user.verificationTokenExpiry ||
      user.verificationTokenExpiry < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    user.isEmailVerified = true;
    return this.userRepository.save(user);
  }

  async updateVerificationToken(
    userId: string,
    token: string,
    expiration: Date,
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.verificationToken = token;
    user.verificationTokenExpiry = expiration;
    return this.userRepository.save(user);
  }

  async updateResetPasswordToken(
    userId: string,
    token: string,
    expiration: Date,
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiry = expiration;
    return this.userRepository.save(user);
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    return this.userRepository.save(user);
  }
}
