import path from "path"
import { fileURLToPath } from "url"
import bcrypt from 'bcrypt'

const __filename= fileURLToPath(import.meta.url)
const __dirname= path.dirname(__filename)


// bcrypt
// creacion del hash
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// validacion
export const isValidPassword=(user, password)=>{
    console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password)
}

export default __dirname
