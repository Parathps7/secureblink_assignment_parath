const {createLogger, transports, format} = require('winston')
require('winston-mongodb') 
require('dotenv').config()

const logger = createLogger({
    transports: [
        new transports.File(
            {
                filename: 'info.log',
                level: 'info',
                format: format.combine(format.timestamp(),format.json())
            }
        ),
        new transports.MongoDB({
            level: 'error',
            options: { useUnifiedTopology: true },
            db: process.env.CONNECTION_STRING,
            collection: 'logged_assignment_data',
            format: format.combine(format.timestamp(),format.json())
        })
    ]
})

module.exports = logger