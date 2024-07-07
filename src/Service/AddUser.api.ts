import { UserUpdate } from 'src/Types/User.type'
import axiosInstance from 'src/Utils'

const addUser = (body: UserUpdate) => {
  return axiosInstance.post(`http://localhost:3000/users`, body)
}

export default addUser
