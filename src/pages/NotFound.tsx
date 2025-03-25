
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Không tìm thấy trang</p>
        <p className="text-gray-500 mb-6">
          Đường dẫn "{location.pathname}" không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link to="/">Về trang chủ</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Bảng điều khiển</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
