
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <section className="py-12 md:py-24 lg:py-32 xl:py-40 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Giải pháp quản lý cho thuê thiết bị ngành phim
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Quản lý thiết bị, đơn hàng và khách hàng một cách hiệu quả với FilmRent - nền tảng quản lý doanh nghiệp cho thuê thiết bị ngành phim.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/dashboard">
                  <Button size="lg" className="rounded-full">
                    Bắt đầu ngay
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="rounded-full">
                  Tìm hiểu thêm
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tính năng chính</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Tất cả những gì bạn cần để quản lý doanh nghiệp cho thuê thiết bị
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-2 p-6 bg-card rounded-lg shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.29 7 12 12 20.71 7"></polyline>
                    <line x1="12" y1="22" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Quản lý thiết bị</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Quản lý danh sách thiết bị, trạng thái, lịch sử thuê và bảo trì.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 bg-card rounded-lg shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Quản lý khách hàng</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Lưu trữ thông tin khách hàng, lịch sử thuê và thống kê tương tác.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 bg-card rounded-lg shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Lên lịch thuê</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Quản lý lịch thuê, xem tính khả dụng và giải quyết xung đột lịch.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 bg-card rounded-lg shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Quản lý đơn hàng</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Theo dõi đơn hàng, tạo báo giá và hóa đơn tự động.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 bg-card rounded-lg shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Báo cáo phân tích</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Xem báo cáo doanh thu, thiết bị phổ biến và dự báo nhu cầu.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 bg-card rounded-lg shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Bảo mật cao</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Bảo vệ dữ liệu với các tính năng bảo mật tiên tiến và sao lưu.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">
                  Tại sao chọn chúng tôi
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Tối ưu hóa hoạt động kinh doanh cho thuê thiết bị ngành phim
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Giải pháp quản lý toàn diện giúp bạn tiết kiệm thời gian, giảm thiểu sai sót và tối đa hóa lợi nhuận. Tập trung vào phát triển kinh doanh thay vì đau đầu với công việc quản lý hàng ngày.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/dashboard">
                    <Button size="lg">Dùng thử miễn phí</Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="m12 14 4-4" />
                        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Tăng 40%</h3>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Hiệu quả quản lý thiết bị
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Giảm 60%</h3>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Thời gian xử lý đơn hàng
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Tiết kiệm 30%</h3>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Chi phí quản lý
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">98%</h3>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Khách hàng hài lòng
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
