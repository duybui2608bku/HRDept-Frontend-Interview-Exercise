import axiosInstance from 'src/Utils'

const deleteUser = (id: string) => {
  return axiosInstance.delete(`http://localhost:3000/users/${id}`)
}

export default deleteUser
