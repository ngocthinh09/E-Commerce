import { DataSource } from 'typeorm';
import { User } from '../../../modules/user/user.entity';
import { defaultUsers } from '../data/users';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  for (const userData of defaultUsers) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      const user = userRepository.create({
        id: userData.id,
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
      });
      await userRepository.save(user);
    }
  }

  console.log('Users seeded successfully!');
}
