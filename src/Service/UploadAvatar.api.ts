import axiosInstance from 'src/Utils'

const uploadAvatar = (formData: FormData) => {
  return axiosInstance.post('http://localhost:3000/users', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export default uploadAvatar
