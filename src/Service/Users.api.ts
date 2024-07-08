import { UserConfig, User } from 'src/Types/User.type'
import axiosInstance from 'src/Utils'

const getUsers = (params: UserConfig) => {
  return axiosInstance.get<User>(`/`, {
    params
  })
}

export default getUsers
