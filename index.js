const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler")
const app = express();
const cors = require('cors');
const connectDb = require('./config/dbConnection')
const port = process.env.PORT || 3000;
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cron = require('node-cron');
const {updateDataFromBhavcopy} = require('./script');

//using middleware
app.use(express.json());
app.use(cors());
//connect to db
connectDb();
// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
        title: "Stock Price View Application API",
        version: "1.0.0",
        description: "API documentation for the Stock Price View Application",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    in: 'header',
                    name: 'Authorization',
                    description: 'Bearer Token',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        servers: [
        {
            url: `http://localhost:${port}`,
            description: "Development server",
        },
        ],
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//uncomment and set time accordingly
// cron.schedule("* * * * 2 *", async ()=> {
//     await updateDataFromBhavcopy();
//     console.log("Updating DB every 2 years");
// });


//routes setup
app.get('/',(req,res)=>{res.send("hey")});
const equityRoute = require('./routes/equityRoutes');
app.use('/api/stocks',equityRoute)
const favouriteRoute = require('./routes/favouriteRoutes');
app.use('/api/fav',favouriteRoute)
const userRoute = require("./routes/userRoutes");
app.use('/api/users',userRoute)

/**Your error handler should always be at the end of 
 * your application stack. Apparently it means not only after all
 *  app.use() but also after all your app.get() and app.post() 
 * calls. */
app.use(errorHandler);
app.listen(port,()=>{console.log(`Server is runnning on port ${port}`)})