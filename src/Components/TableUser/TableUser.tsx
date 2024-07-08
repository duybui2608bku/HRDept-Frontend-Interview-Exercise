import './TableUser.scss'
import { Table } from '@radix-ui/themes'
import * as Dialog from '@radix-ui/react-dialog'
import { IoMdCloseCircle } from 'react-icons/io'
import { BsImageFill } from 'react-icons/bs'
import { useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import getUsers from 'src/Service/Users.api'
import addUser from 'src/Service/AddUser.api'
import { UserUpdate } from 'src/Types/User.type'
import { omit, sortBy } from 'lodash'
import deleteUser from 'src/Service/DeleteUser.api'
import { toast } from 'react-toastify'
import { queryClient } from 'src/main'
import updateUser from 'src/Service/UpdateUser.api'
import { exportToExcel } from 'src/Utils'
import getAllUsers from 'src/Service/GetAllUser.api'
import Pagination from 'src/Components/Pagination/Pagination'
import { FaArrowsAltV } from 'react-icons/fa'
// import uploadAvatar from 'src/Service/UploadAvatar.api'

const TableUser = () => {
  // State và custom hook
  const [open, setOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState('all')
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [idDelete, setIdDelete] = useState('')
  const [rowOfPage, setRowOfPage] = useState('5')
  const [imagePreview, setImagePreview] = useState('')
  const [search, setSearch] = useState('')
  const [querySort, setQuerySort] = useState('')
  const [orderSort, setOrderSort] = useState(true)
  const [dataUserUpdate, setDataUserUpdate] = useState({
    id: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    password: '',
    role: ''
  })
  // Form validation schema
  const formSchema = z
    .object({
      email: z.string().email({ message: 'Invalid email address' }),
      role: z.string().nonempty({ message: 'Role is required' }),
      phone: z.string().nonempty({ message: 'Phone number is required' }),
      firstName: z
        .string()
        .min(2, { message: 'First name must be at least 2 characters' })
        .max(256, { message: 'First name must be at most 256 characters' }),
      lastName: z
        .string()
        .min(2, { message: 'Last name must be at least 2 characters' })
        .max(256, { message: 'Last name must be at most 256 characters' }),
      password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(100, { message: 'Password must be at most 100 characters' }),
      confirmpassword: z.string().nonempty({ message: 'Confirm password is required' }),
      avatar: z.string()
    })
    .strict()
    .superRefine(({ password, confirmpassword }, ctx) => {
      if (password !== confirmpassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Passwords do not match',
          path: ['confirmpassword']
        })
      }
    })

  type FormValues = z.infer<typeof formSchema>

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    // watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: 'User',
      phone: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmpassword: '',
      avatar: ''
    }
  })

  useEffect(() => {
    if (dataUserUpdate) {
      setValue('email', dataUserUpdate.email || '')
      setValue('phone', dataUserUpdate.phone || '')
      setValue('lastName', dataUserUpdate.lastName || '')
      setValue('firstName', dataUserUpdate.lastName || '')
      setValue('password', dataUserUpdate.password || '')
      setValue('role', dataUserUpdate.role || '')
    }
  }, [dataUserUpdate, setValue])

  // Mutation hooks
  const addMutation = useMutation({
    mutationFn: (body: UserUpdate) => addUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Add User Success!')
      setOpen(false)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Delete User Success!')
    }
  })

  const updateMutation = useMutation({
    mutationFn: (body: UserUpdate) => updateUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Update User Success!')
      handleCloseDialog()
    }
  })

  // const uploadAvatarMutation = useMutation({
  //   mutationFn: async (formData: FormData) => {
  //     const response = await uploadAvatar(formData)
  //     return response.data
  //   },
  //   onSuccess: () => {
  //     toast.success('Avatar uploaded successfully')
  //   },
  //   onError: () => {
  //     toast.error('Failed to upload avatar')
  //   }
  // })

  // Handlers
  const handleOpenDialog = () => {
    setMode('add')
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleUpdate = (dataUserUpdate: UserUpdate) => {
    setMode('edit')
    setIdDelete(dataUserUpdate?.id as string)
    setDataUserUpdate({
      ...dataUserUpdate,
      id: dataUserUpdate?.id || ''
    })
    setOpen(true)
  }

  // const avatar = watch('avatar')

  const onSubmit = async (data: FormValues) => {
    const body: UserUpdate = {
      ...omit(data, ['confirmpassword']),
      id: mode === 'edit' ? idDelete : undefined
    }

    if (mode === 'add') {
      // const file = fileInputRef.current?.files?.[0]
      // let avataName = avatar
      // if (file) {
      //   const formData = new FormData()
      //   formData.append('avatar', file)
      //   const uploadResponse = await uploadAvatarMutation.mutateAsync(formData)
      //   avataName = uploadResponse.id
      //   setValue('avatar', avataName)
      // }
      addMutation.mutate(body)
    } else if (mode === 'edit') {
      // const file = fileInputRef.current?.files?.[0]
      // let avataName = avatar
      // if (file) {
      //   const formData = new FormData()
      //   formData.append('avatar', file)
      //   const uploadResponse = await uploadAvatarMutation.mutateAsync(formData)
      //   avataName = uploadResponse.id
      //   setValue('avatar', avataName)
      // }
      updateMutation.mutate(body)
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal) {
      setImagePreview(URL.createObjectURL(fileFromLocal))
    }
  }

  // Query hooks

  const page = location.search.split('=')[1]
  const paramsConfig = {
    page: page || '1',
    limit: rowOfPage ? rowOfPage : '5',
    sortBy: querySort ? querySort : '',
    order: orderSort ? 'asc' : 'desc'
  }

  const { data: listUser } = useQuery({
    queryKey: ['users', paramsConfig],
    queryFn: () => getUsers(paramsConfig)
  })

  const { data: totalUser } = useQuery({
    queryKey: ['usersList'],
    queryFn: getAllUsers
  })

  // Search và Filter

  const sortedUsers = listUser?.data
    ? // @ts-ignore
      [...listUser?.data]
        .filter((user) =>
          Object.values(user).some(
            (field) => typeof field === 'string' && field.toLowerCase().includes(search.toLowerCase())
          )
        )
        .filter((user) => roleFilter === 'all' || user.role === roleFilter)
    : []

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value)
  }

  // Export Excel
  const handleExport = () => {
    if (totalUser && totalUser.data) {
      const formattedData = totalUser.data.map((user) => ({
        ID: user.id,
        Email: user.email,
        'Phone Number': user.phone,
        'First Name': user.firstName,
        'Last Name': user.lastName,
        Role: user.role
      }))
      exportToExcel(formattedData, 'Users')
    }
  }

  // @ts-ignore
  const countUser = totalUser?.data.length
  const pageSize = Math.ceil(countUser / Number(rowOfPage))

  return (
    <div className='table'>
      <div className='table__feature'>
        <div className='table__feature__name'>User</div>
        <div className='table__feature__detail'>
          <div className='table__feature__detail__export' onClick={handleExport}>
            Export To Excel
          </div>
          <div className='table__feature__detail__add'>
            <Dialog.Root open={open}>
              <Dialog.Trigger asChild>
                <button onClick={handleOpenDialog}>Add User</button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className='DialogOverlay' />
                <Dialog.Content className='DialogContent'>
                  <Dialog.Title className='DialogTitle'>{mode === 'add' ? 'Add New User' : 'Edit User'}</Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='DialogContentContainer'>
                      <div className='DialogContentLeft'>
                        <div className='FieldInputOne'>
                          <div className='FieldInputOneCus'>
                            <label>Email :</label>
                            <input type='text' {...register('email', { required: true })} />
                            {errors.email && <p className='error'>{errors.email.message}</p>}
                          </div>
                          <div className='FieldInputOneCus'>
                            <label>Role :</label>
                            <select defaultValue={'user'} value={roleFilter} {...register('role', { required: true })}>
                              <option value='user'>User</option>
                              <option value='admin'>Admin</option>
                            </select>
                            {errors.role && <p className='error'>{errors.role.message}</p>}
                          </div>
                        </div>
                        <div className='FieldInputTwo'>
                          <label>Phone Number :</label>
                          <input type='text' {...register('phone', { required: true })} />
                          {errors.phone && <p className='error'>{errors.phone.message}</p>}
                        </div>
                        <div className='FieldInputOne'>
                          <div className='FieldInputOneCus'>
                            <label>First Name :</label>
                            <input type='text' {...register('firstName', { required: true })} />
                            {errors.firstName && <p className='error'>{errors.firstName.message}</p>}
                          </div>
                          <div className='FieldInputOneCus'>
                            <label>Last Name :</label>
                            <input type='text' {...register('lastName', { required: true })} />
                            {errors.lastName && <p className='error'>{errors.lastName.message}</p>}
                          </div>
                        </div>
                        <div className='FieldInputOne'>
                          <div className='FieldInputOneCus'>
                            <label>Password :</label>
                            <input type='password' {...register('password', { required: true })} />
                            {errors.password && <p className='error'>{errors.password.message}</p>}
                          </div>
                          <div className='FieldInputOneCus'>
                            <label>Confirm Password :</label>
                            <input type='password' {...register('confirmpassword', { required: true })} />
                            {errors.confirmpassword && <p className='error'>{errors.confirmpassword.message}</p>}
                          </div>
                        </div>
                      </div>
                      <div className='DialogContentRight'>
                        {imagePreview ? (
                          <img className='imgPreview' src={imagePreview} />
                        ) : (
                          <BsImageFill className='imageUser' />
                        )}
                        <div className='btnSelectImage'>
                          <label onClick={handleUpload} style={{ cursor: 'pointer' }} htmlFor='file'>
                            Select Image
                          </label>
                        </div>
                        <input
                          id='file'
                          style={{ display: 'none' }}
                          type='file'
                          onChange={onFileChange}
                          ref={fileInputRef}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                      <Dialog.Close asChild>
                        <button type='button' className='Button cancel' onClick={handleCloseDialog}>
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button type='submit' className='Button green'>
                        {mode === 'add' ? 'Add User' : 'Edit User'}
                      </button>
                    </div>
                  </form>
                  <Dialog.Close asChild>
                    <button className='IconButton' aria-label='Close' onClick={handleCloseDialog}>
                      <IoMdCloseCircle />
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>
      <div className='table__fillter'>
        <div className='table__fillter__input'>
          <input placeholder='Search User...' onChange={handleSearchChange} />
        </div>
        <div className='table__fillter__select'>
          <select name='Role' value={roleFilter} onChange={handleRoleFilterChange}>
            <option value='user'>User</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
        <div className='table__fillter__search'>Search</div>
      </div>
      <div className='table__user'>
        <Table.Root className='table__user__custome'>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Phone Number</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <div className='table__header-cell'>
                  First Name
                  <FaArrowsAltV
                    className='icon-sort'
                    size={20}
                    onClick={() => {
                      setQuerySort('firstName')
                      setOrderSort(!orderSort)
                    }}
                  />
                </div>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <div className='table__header-cell'>
                  Last Name
                  <FaArrowsAltV
                    size={20}
                    onClick={() => {
                      setQuerySort('lastName')
                      setOrderSort(!orderSort)
                    }}
                  />
                </div>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <div className='table__header-cell'>
                  Role User
                  <FaArrowsAltV
                    size={20}
                    onClick={() => {
                      setQuerySort('role')
                      setOrderSort(!orderSort)
                    }}
                  />
                </div>
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedUsers.map((user, index) => (
              <Table.Row key={index}>
                <Table.Cell>{user.id}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.phone}</Table.Cell>
                <Table.Cell>{user.firstName}</Table.Cell>
                <Table.Cell>{user.lastName}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell
                  style={{ cursor: 'pointer' }}
                  className='btn-handle'
                  onClick={() => handleUpdate(user || '')}
                >
                  Edit
                </Table.Cell>
                <Table.Cell
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => handleDelete(user.id || '')}
                >
                  Delete
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
      <div className='table__pagination'>
        <div className='table__pagination__rowofpage'>
          <div>Row of Page</div>
          <select defaultValue={5} onChange={(event) => setRowOfPage(event.target.value)} name='rowOfPage'>
            {Array(10)
              .fill(0)
              .map((_, index) => {
                return (
                  <>
                    <option key={index}>{index + 1}</option>
                  </>
                )
              })}
          </select>
        </div>
        <Pagination pageAgument={1} pageSize={pageSize ? pageSize : 5} />
      </div>
    </div>
  )
}

export default TableUser
