const { mongoose } = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://usr-app:CoderPass2025@proyecto-final-coder-75.97ors.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=proyecto-final-coder-75245', {
            useUnifiedTopology: true,
        });
        console.log('Conexión a la base de datos exitosa');
    } catch(error) {
        console.log('Error al conectar a la base de datos');
        process.exit(1); 
    }
}

module.exports = connectDB;