/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: process.env.MONGODB_URI || 'mongodb://root:root12@ds111455.mlab.com:11455/dictionary'
    },

    // Seed database on startup
    seedDB: true,
};
