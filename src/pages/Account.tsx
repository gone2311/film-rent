
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { User, Key, LogOut, Mail, Edit } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  job_title: string;
  phone: string;
  avatar_url: string | null;
}

const Account = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    job_title: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          job_title: data.job_title || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: formData.full_name,
          job_title: formData.job_title,
          phone: formData.phone,
          updated_at: new Date(),
        });

      if (error) {
        throw error;
      }

      await fetchProfile();
      setEditMode(false);
      
      toast({
        title: "Thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin cá nhân",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '');
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Email đã gửi",
        description: "Vui lòng kiểm tra email để đổi mật khẩu",
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi email đổi mật khẩu",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tài khoản cá nhân</h2>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" /> Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="security"><Key className="mr-2 h-4 w-4" /> Bảo mật</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Quản lý thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!editMode ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{user?.email}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setEditMode(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Họ và tên</p>
                    <p>{profile?.full_name || "Chưa cập nhật"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Chức vụ</p>
                    <p>{profile?.job_title || "Chưa cập nhật"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                    <p>{profile?.phone || "Chưa cập nhật"}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email || ""} disabled />
                  </div>
                  
                  <div>
                    <Label htmlFor="full_name">Họ và tên</Label>
                    <Input 
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="job_title">Chức vụ</Label>
                    <Input
                      id="job_title"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={updateProfile} disabled={loading}>
                      {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>
                Quản lý mật khẩu và cài đặt bảo mật tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Đổi mật khẩu</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Gửi email hướng dẫn đổi mật khẩu đến địa chỉ email của bạn
                </p>
                <Button onClick={handleChangePassword}>
                  <Mail className="mr-2 h-4 w-4" /> Gửi email đổi mật khẩu
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium">Đăng xuất</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Đăng xuất khỏi tài khoản
                </p>
                <Button variant="destructive" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
