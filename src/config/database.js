const { mongoose } = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('YOUR_MONGO_URI', {
            useUnifiedTopology: true,
        });
        console.log('Conexión a la base de datos exitosa');
    } catch(error) {
        console.log('Error al conectar a la base de datos');
        process.exit(1); 
    }
}

module.exports = connectDB;