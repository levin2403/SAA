const userRepository = require('../repository/user.repository');

/**
 * Main function that executes the neccesary steps to validate if
 * the user exist and returning his info.
 * @param {String} userId 
 * @param {String} password 
 */
exports.validateUserCredentials = async (userId, password) =>
{
    try
    {
        validateInput(userId, password);
        //search the user in the repository
        const user = await findUser(userId);
        await validateUser(user) // validate if user is not null
        // compare credentials
        await validateCredentials(user, userId, password)

        return {
            user: {
                id: user.id,
                name: user.name,
                rol: user.rol,
            }
        }
    }
    catch(error)
    {
        throw new Error(error.message);
    }
}

/**
 * Helper function to secure the existence of the data input.
 * @param {String} userId 
 * @param {String} password 
 */
function validateInput(userId, password) 
{
    if(!userId || !password){
        throw new Error('Porfavor proporcione el id y la contraseña');
    }
}

/**
 * Helper function to retrive from the repository the user
 * using his id.
 * @param {String} userId 
 * @returns 
 */
async function findUser(userId) 
{
    try
    {
        return await userRepository.getUserById(userId);
    }
    catch(error)
    {
        console.log(error.message);
        throw new Error('Error en el inicio de sesion, intente mas tarde');
    }
}

/**
 * Validate the existence of the retrived user.
 * @param {Object} user 
 */
async function validateUser(user) 
{
    if(!user) throw new Error('Usuario o contraseña incorrectos');
}

/**
 * Validate if the given credentials matches the ones saved in 
 * the database.
 * @param {Object} user 
 * @param {String} userId 
 * @param {String} password 
 */
async function validateCredentials(user, userId, password)
{
    if (userId !== user.id || password !== user.password) 
    {
        throw new Error('Usuario o contraseña incorrectos');
    }
}