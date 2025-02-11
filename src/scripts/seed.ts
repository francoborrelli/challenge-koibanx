import mongoose from 'mongoose';

// Config
import config from '../config';

// Importar seeders
import { seedUsers } from '../infraestructure/seeders/userSeeders';

const runSeeders = async (): Promise<void> => {
  try {
    // Conexión a la base de datos
    const mongoUri = config.mongoose.url;
    await mongoose.connect(mongoUri, {});
    console.log('✅ Conexión a la base de datos establecida.');

    // Ejecutar seeders
    await seedUsers();

    console.log('🎉 Seeders ejecutados exitosamente.');
  } catch (error) {
    console.error('❌ Error al ejecutar seeders:', error);
  } finally {
    // Cierra la conexión con la base de datos
    await mongoose.connection.close();
    console.log('🔒 Conexión a la base de datos cerrada.');
  }
};

// Ejecutar seeders
runSeeders();
