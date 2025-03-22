
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Package, 
  Users 
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Trang Chủ</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <OverviewCard
              title="Doanh thu tháng"
              value="45.231.000đ"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              description="+20.1% so với tháng trước"
            />
            <OverviewCard
              title="Đơn hàng"
              value="12"
              icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
              description="+180.1% so với tháng trước"
            />
            <OverviewCard
              title="Thiết bị đang thuê"
              value="25"
              icon={<Package className="h-4 w-4 text-muted-foreground" />}
              description="+19% so với tháng trước"
            />
            <OverviewCard
              title="Khách hàng mới"
              value="5"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              description="+201 so với tháng trước"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Tổng quan doanh thu</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center bg-muted/10 rounded">
                  <BarChart className="h-16 w-16 text-muted" />
                  <p className="ml-2 text-muted-foreground">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
                <CardDescription>
                  Có 12 đơn hàng trong tháng này
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Sản xuất phim "Hương vị tình yêu"</p>
                      <p className="text-sm text-muted-foreground">
                        Đoàn phim AAA
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+15.000.000đ</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Quay quảng cáo sữa Vinamilk</p>
                      <p className="text-sm text-muted-foreground">
                        Công ty BBB
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+8.500.000đ</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Sự kiện công ty CCC</p>
                      <p className="text-sm text-muted-foreground">
                        Công ty CCC
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+12.000.000đ</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Thiết bị đang thuê</CardTitle>
                <CardDescription>
                  Thiết bị đang được thuê và ngày dự kiến trả
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thiết bị</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Ngày trả</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Máy quay Canon C300</TableCell>
                      <TableCell>Đoàn phim AAA</TableCell>
                      <TableCell>15/08/2023</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                          Đang thuê
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bộ đèn LED Aputure</TableCell>
                      <TableCell>Công ty BBB</TableCell>
                      <TableCell>20/08/2023</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                          Đang thuê
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Gimbal DJI Ronin</TableCell>
                      <TableCell>Công ty CCC</TableCell>
                      <TableCell>25/08/2023</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                          Đang thuê
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Lịch thuê sắp tới</CardTitle>
                <CardDescription>
                  Các đơn đặt trước trong tháng này
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px]">
                  <Calendar className="h-16 w-16 text-muted" />
                  <p className="ml-2 text-muted-foreground">Lịch thuê sẽ hiển thị ở đây</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>Phân tích doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted/10 rounded">
                  <BarChart className="h-16 w-16 text-muted" />
                  <p className="ml-2 text-muted-foreground">Phân tích doanh thu sẽ hiển thị ở đây</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
