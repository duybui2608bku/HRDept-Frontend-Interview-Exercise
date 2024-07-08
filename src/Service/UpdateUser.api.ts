import axiosInstance from 'src/Utils'
import { UserUpdate } from 'src/Types/User.type'

const updateUser = (body: UserUpdate) => {
  const { id, ...data } = body
  return axiosInstance.put(`/${id}`, data)
}

export default updateUser
