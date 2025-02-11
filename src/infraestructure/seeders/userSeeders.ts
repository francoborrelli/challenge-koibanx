import { UserModel } from '../models/userModel';

export const seedUsers = async (): Promise<void> => {
  try {
    const users = [
      {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hashedpassword123',
        role: 'admin',
      },
      {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'hashedpassword456',
        role: 'user',
      },
    ];

    // Limpia la colección antes de insertar datos
    await UserModel.deleteMany({});
    console.log('Colección User limpiada.');

    // Inserta los datos
    await UserModel.create(users);
    console.log('Usuarios insertados exitosamente.');
  } catch (error) {
    console.error('Error al insertar usuarios:', error);
  }
};
