import axios from 'axios'
import * as XLSX from 'xlsx'
const axiosInstance = axios.create({
  baseURL: 'https://668b6f290b61b8d23b098d25.mockapi.io/Users',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosInstance

export const exportToExcel = (data: any, fileName: any) => {
  // Tạo worksheet từ dữ liệu
  const ws = XLSX.utils.json_to_sheet(data)

  // Tạo workbook và thêm worksheet vào
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Users')

  // Xuất file Excel
  XLSX.writeFile(wb, `${fileName}.xlsx`)
}
