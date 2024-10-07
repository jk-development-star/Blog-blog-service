/* eslint-disable indent */
module.exports = {
    INTERNAL_ERROR: 500,
    BUSINESS_ERROR_CODE: '0500',
    DATA_PROCESSING_ERROR: 'Data Processing',
    INVALID_REQUEST_ERROR_CODE: '0400',
    INVALID_REQUEST_ERROR_MESSAGE: "Invalid Request.",
    DATABASE_CONFIGS: {
        dbHostKey: 'dbhost',
        databaseKey: 'database',
        dbUserKey: 'dbusername',
        dbPasswordKey: 'dbpassword',
        dbPortKey: 'dbport'
    },
    SUPER_USER_GROUPS: ['App.Developer'],
    HEADERS: {
        "Acces-Control-Allow-Origin": "*",
        "Acess-Control-Allow-Headers": "Content-Type, Authorization",
        "Acess-Control-Allow-Methods": "GET,PUT,POST,DELETE,HEAD,OPTIONS",
        'Access-Control-Allow-Credentials': true,
    }
}
