import axiosInstance from 'src/Utils'

const uploadAvatar = (formData: FormData) => {
  return axiosInstance.post('/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export default uploadAvatar
