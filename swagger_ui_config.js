const swaggerJsDoc = require("swagger-jsdoc")
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NodeJS REST API template",
            version: "1.0.0",
            description: "REST APIs Library and Documentation"
        },
        servers: [
            {
                url: "http://localhost:7000"
            }
        ],

    },
    apis: ["./*.js"]
}
const specs = swaggerJsDoc(options);

//------User------//

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - id
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The auto-generated id of the user
 *              age:
 *                  type: integer
 *                  description: The user age
 *              location:
 *                  type: string
 *                  description: The user location
 *              gender:
 *                  type: string
 *                  description: The user gender
 *              nationality:
 *                  type: string
 *                  description: The user nationality
 *              language:
 *                  type: string
 *                  description: The user language
 *
 *          example:
 *              id: 43
 *              age: 25
 *              location: Nicosia
 *              gender: Male
 *              nationality: Cypriot
 *              language: Greek
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The Users managing API
 */

/**
 * @swagger
 * /users:
 *  get:
 *      summary: Returns the list of all users
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: The list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /user/create:
 *  post:
 *      summary: Creates a new user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: The user was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/User'
 *          500:
 *              description: Server error
 */

/**
 * @swagger
 * /user/update/{id}:
 *  put:
 *      summary: Updates a user by id
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The user id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/User'
 *      responses:
 *          200:
 *              description: The user was updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          404:
 *              description: The user was not found
 *
 */

/**
 * @swagger
 * /user/delete/{id}:
 *  delete:
 *      summary: Deletes a user by id
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The user id
 *      responses:
 *          200:
 *              description: The user was deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          404:
 *              description: The user was not found
 *
 */

module.exports = specs;
