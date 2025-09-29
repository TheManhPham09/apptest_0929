import { headers } from "next/headers"
import SuccessPage from "../success-page"
import AccessLimiter from "../components/access-limiter"

export default function Page() {
  const headersList = headers()
  const host = headersList.get("host") || "localhost"

  // --- BẮT ĐẦU KHU VỰC CÓ THỂ CHỈNH SỬA NỘI DUNG ---
  // Đây là tên hiển thị mặc định. Bạn có thể thay đổi nó tại đây.
  let userName = "V24040025(Phạm Thế Mạnh)"
  // --- KẾT THÚC KHU VỰC CÓ THỂ CHỈNH SỬA NỘI DUNG ---

  // Logic để xác định tên người dùng dựa trên tên miền
  // Bạn có thể mở rộng phần này với nhiều tên miền và tên khác nhau
  switch (host) {
    case "your-domain-1.com": // Thay thế bằng tên miền thực tế của bạn
    case "www.your-domain-1.com":
      userName = "Người dùng A (Domain 1)"
      break
    case "your-domain-2.com": // Thay thế bằng tên miền thực tế khác
    case "www.your-domain-2.com":
      userName = "Người dùng B (Domain 2)"
      break
    // Thêm các trường hợp khác nếu cần
    default:
      // Nếu không khớp với tên miền nào, sẽ sử dụng giá trị mặc định đã định nghĩa ở trên.
      // Không cần gán lại userName ở đây vì nó đã được khởi tạo với giá trị mặc định.
      break
  }

  return (
    <AccessLimiter>
      <SuccessPage userName={userName} />
    </AccessLimiter>
  )
}
