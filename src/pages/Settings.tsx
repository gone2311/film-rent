
import React, { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useCompany } from "@/context/CompanyContext";
import { Upload } from "lucide-react";

const Settings = () => {
  const { companyName, setCompanyName, companyLogo, setCompanyLogo } = useCompany();
  const { toast } = useToast();
  const [tempName, setTempName] = useState(companyName);
  const [logoPreview, setLogoPreview] = useState<string | null>(companyLogo);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Lỗi",
          description: "Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 2MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setCompanyName(tempName);
    setCompanyLogo(logoPreview);
    toast({
      title: "Thành công",
      description: "Đã cập nhật thông tin công ty",
    });
  };

  return (
    <div>
      <Navbar />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Cài đặt công ty</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin doanh nghiệp</CardTitle>
            <CardDescription>
              Cài đặt thông tin và logo công ty của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="company-name">
                Tên công ty
              </label>
              <Input
                id="company-name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Nhập tên công ty"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Logo công ty</label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div className="relative w-20 h-20 border rounded-md overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="Company logo"
                      className="w-full h-full object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0 w-6 h-6 p-0"
                      onClick={() => setLogoPreview(null)}
                    >
                      ×
                    </Button>
                  </div>
                )}
                
                <div className="flex-1">
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50"
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="mt-2 text-sm text-muted-foreground">
                        Tải lên logo (tối đa 2MB)
                      </span>
                    </div>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>Lưu thay đổi</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
