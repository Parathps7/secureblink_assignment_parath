# Secure-Blink assignment & documentation for backend intern role by Parath Safaya

This repository contains an application with robust user authentication and authorization functionalities, distinguishing between users and administrators with varying permissions. Administrators can add, delete, and view images along with their captions, while users can only view images. The application implements multiple security measures, safeguarding against XML, CSRF, NoSQL query injections, HTTP security header vulnerabilities, and Denial of Service (DOS) attacks. Developed using Node.js and Express.js, the application relies on MongoDB as its database backend.
## Project Structure

```plaintext
securelink_assignment_parath/
|-- config/
|   |-- dbConnection.js
|   |-- loggerModel.js
|-- controllers/
|   |-- imageControllers.js
|   |-- userControllers.js
|-- middleware/
|   |-- userAuth.js
|   |-- validateTokenHandler.js
|-- models/
|   |-- imageModel.js
|   |-- userModel.js
|-- Postman-export/
|   |-- secureblink_assignment.postman_collection.json
|-- routes/
|   |-- imageRoute.js
|   |-- userRoute.js
|-- test/
|   |-- app.test.js
|-- index.js
```

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd securelink_assignment_parath
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables by creating a `.env` file in the root directory:

   ```plaintext
   PORT=<port-number>
   CONNECTION_STRING=<mongodb-connection-string>
   ACCESS_TOKEN_SECRET=<access-token-secret-key-for jwt>
   EMAIL_USER=<email from which email is to be sent token after forgot password>
   EMAIL_PASSWORD=<password-of-EMAIL_PASSWORD(If gmail,do two way verification and generate custom app key)>
   ADMIN_PASS=<Password to give a user admin privelidges while registering >
   ```

4. Run the application:

   ```bash
   npm start
   ```
   
6. Run test :

   ```bash
   npm test
   ```

## API Usage

### Users API

- **POST /api/users/register**
  - Register a user
  - Body's JSON should contain: username, email, password, role, adminpass
  
    Example:
    ```plaintext
    POST /api/users/register
    ```
    
- **POST /api/users/login**
  - Login to a user
  - Body's JSON should contain: = email, password
  
    Example:
    ```plaintext
    POST /api/users/login
    ```

- **POST /api/users/forget-password**
  - Get token for reset password in mail mentioned
  - Body's JSON should contain: = email
  
    Example:
    ```plaintext
    POST /api/users/forget-password
    ```
    
- **POST /api/users/reset-password/:token**
  - Reset the password of user 
  - Body's JSON should contain: =  password (new-password)
  
    Example:
    ```plaintext
    POST /api/users/reset-password/:token
    ```

### Users API

- **POST /api/images/add**
  - Add new image with caption in database
  - Body's form should contain: =  file : <image-uploaded> & text : string
  - Only admin has this permission
    Example:
    ```plaintext
    *POST /api/images/add
    ```

- **DELETE /api/images/delete/:id**
  - Delete image and caption from database(only admin authorized)
  
    Example:
    ```plaintext
    DELETE /api/images/delete/:id
    ```

- **GET /api/images/view**
  - Get all images and caption

    Example:
    ```plaintext
    GET /api/images/view
    ```


### imageRoute:
Each request is passed through 3 middlewares:

- parseForm:
This is implemented for security from CSRF vulnerability.
- validateToken:
This is used for authentication and uses JWT tokens for same.
- userAuth():
This is implemented for User Roles and Authorization.

### userRoute:
- Each route has implemented with parseForm for security from CSRF vulnerability.

### index.js (Entry points)
This Express.js application sets up a server with various security measures and routes for user authentication, image management, and more. Key features include:

1.Security Measures: Implemented protection against Cross-Site Scripting (XSS) attacks, rate limiting to prevent DoS attacks, and sanitation to prevent NoSQL injection attacks.
2.Routes Setup: Defines routes for user registration, login, and password recovery, as well as routes for image and blog management.
3.Middleware: Utilizes middleware like CORS for handling cross-origin requests and body-parser for parsing incoming request bodies.
Server Configuration: Binds the server to the specified port, with logging to indicate successful server startup.



### userModel.js

#### Description:
The `userModel.js` defines the schema for storing user data in the MongoDB database.

#### Schema:
- `username`: String - The username of the user.
- `email`: String - The email address of the user.
- `password`: String - The hashed password of the user.
- `role`: String - The role of the user, which can be either "user" or "admin".
- `token`: String - An optional token associated with the user.
- `timestamps`: Boolean - Indicates whether to include timestamps for document creation and modification.

### imageModel.js

#### Description:
The `imageModel.js` defines the schema for storing image data in the MongoDB database.

#### Schema:
- `image`: String - The URL or path of the image file.
- `text`: String - Additional text or description associated with the image.
- `timestamps`: Boolean - Indicates whether to include timestamps for document creation and modification.


