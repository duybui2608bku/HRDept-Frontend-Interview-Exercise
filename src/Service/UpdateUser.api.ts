import axiosInstance from 'src/Utils'
import { UserUpdate } from 'src/Types/User.type'

const updateUser = (body: UserUpdate) => {
  const { id, ...data } = body
  return axiosInstance.patch(`http://localhost:3000/users/${id}`, data)
}

export default updateUser
