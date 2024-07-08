export interface User {
  map(
    arg0: (user: any) => { ID: any; Email: any; 'Phone Number': any; 'First Name': any; 'Last Name': any; Role: any }
  ): unknown

  id?: string
  email: string
  phone: string
  firstName: string
  lastName: string
  password: string
  role: string
}

export interface UserUpdate {
  avatar: any
  id?: string
  email: string
  phone: string
  firstName: string
  lastName: string
  password: string
  role: string
}

export interface UserConfig {
  page?: string | number
  limit?: string | number
}
