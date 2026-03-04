import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { defaultUsers } from '../../../database/seeds/data/users';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '../dtos/login-user.dto';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUsers = defaultUsers.map((user) => ({
    ...user,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUsername', () => {
    it('should return user when username exist', async () => {
      const mockUser = mockUsers[0];
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByUsername('admin');
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { username: 'admin' },
      });
    });

    it('should return null when username does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByUsername('anonymous');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when id exist', async () => {
      const mockUser = mockUsers[0];
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should return null when id does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByUsername('anonymous-id');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      mockRepository.find.mockResolvedValue(mockUsers);
      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(3);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return empty array when no users', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        username: 'new-user',
        password: 'new-password',
        name: 'New User',
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: 'new-id',
        ...createUserDto,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);

      const result = await service.createUser(createUserDto);

      expect(result).toBe(createdUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(repository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should throw ConflictException when username already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'admin',
        password: 'password123',
        name: 'Admin User',
      };

      mockRepository.findOne.mockResolvedValue(mockUsers[0]);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.createUser(createUserDto)).rejects.toThrow(
        'Username already exists!',
      );
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'admin',
        password: 'admin123',
      };

      const mockUser = mockUsers[0];
      mockRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(loginUserDto);

      expect(result).toEqual(mockUser);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'admin123',
        mockUser.password,
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'admin',
        password: 'wrongpassword',
      };

      const mockUser = mockUsers[0];
      mockRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser(loginUserDto)).rejects.toThrow(
        'Username or password is unvalid.',
      );
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'nonexistent',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUser(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser(loginUserDto)).rejects.toThrow(
        'Username or password is unvalid.',
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });
});
