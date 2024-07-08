import { User } from 'src/Types/User.type'
import axiosInstance from 'src/Utils'

const getAllUsers = () => {
  return axiosInstance.get<User>(`/`)
}

export default getAllUsers
