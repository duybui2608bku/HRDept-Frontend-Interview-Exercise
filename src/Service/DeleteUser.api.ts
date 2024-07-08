import axiosInstance from 'src/Utils'

const deleteUser = (id: string) => {
  return axiosInstance.delete(`/${id}`)
}

export default deleteUser
