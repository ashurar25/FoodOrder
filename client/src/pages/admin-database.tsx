import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Database, Upload, Download, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface DatabaseConfig {
  type: 'local' | 'external';
  host?: string;
  port?: string;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
}

export default function AdminDatabase() {
  const { toast } = useToast();
  const [config, setConfig] = useState<DatabaseConfig>({
    type: 'local'
  });

  const { data: currentConfig } = useQuery<DatabaseConfig>({
    queryKey: ["/api/admin/database/config"],
  });

  const { data: databaseStatus } = useQuery({
    queryKey: ["/api/admin/database/status"],
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig: DatabaseConfig) => {
      return apiRequest("/api/admin/database/config", "POST", newConfig);
    },
    onSuccess: () => {
      toast({
        title: "สำเร็จ",
        description: "อัปเดตการตั้งค่าฐานข้อมูลแล้ว",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/database"] });
    },
    onError: (error: any) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถอัปเดตการตั้งค่าได้",
        variant: "destructive",
      });
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/admin/database/export", "POST");
    },
    onSuccess: (data: any) => {
      // Create download link
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `restaurant-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "สำเร็จ",
        description: "ดาวน์โหลดข้อมูลแล้ว",
      });
    },
  });

  const importDataMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/admin/database/import", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "สำเร็จ",
        description: "นำเข้าข้อมูลแล้ว",
      });
      queryClient.invalidateQueries();
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          importDataMutation.mutate(data);
        } catch (error) {
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไฟล์ไม่ถูกต้อง",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen bg-soft-mint">
      <div className="mb-6">
        <Link href="/admin">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับสู่แผงควบคุม
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">การตั้งค่าฐานข้อมูล</h1>
      </div>

      {/* Database Status */}
      <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>สถานะฐานข้อมูล</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>ประเภทฐานข้อมูล:</span>
              <span className="font-medium">
                {currentConfig?.type === 'external' ? 'ฐานข้อมูลภายนอก' : 'ฐานข้อมูลในเครื่อง'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>สถานะการเชื่อมต่อ:</span>
              <span className={`font-medium ${(databaseStatus as any)?.connected ? 'text-green-600' : 'text-red-600'}`}>
                {(databaseStatus as any)?.connected ? 'เชื่อมต่อสำเร็จ' : 'ไม่สามารถเชื่อมต่อได้'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Configuration */}
      <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl mb-6">
        <CardHeader>
          <CardTitle>การตั้งค่าฐานข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>ประเภทฐานข้อมูล</Label>
              <div className="flex space-x-4 mt-2">
                <Button
                  type="button"
                  variant={config.type === 'local' ? 'default' : 'outline'}
                  onClick={() => setConfig(prev => ({ ...prev, type: 'local' }))}
                >
                  ฐานข้อมูลในเครื่อง
                </Button>
                <Button
                  type="button"
                  variant={config.type === 'external' ? 'default' : 'outline'}
                  onClick={() => setConfig(prev => ({ ...prev, type: 'external' }))}
                >
                  ฐานข้อมูลภายนอก
                </Button>
              </div>
            </div>

            {config.type === 'external' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    กรุณากรอกข้อมูลการเชื่อมต่อฐานข้อมูล PostgreSQL ภายนอก
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="host">Host</Label>
                    <Input
                      id="host"
                      placeholder="localhost"
                      value={config.host || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      placeholder="5432"
                      value={config.port || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, port: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="database">Database Name</Label>
                  <Input
                    id="database"
                    placeholder="restaurant_db"
                    value={config.database || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={config.username || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={config.password || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={() => updateConfigMutation.mutate(config)}
              disabled={updateConfigMutation.isPending}
              className="w-full"
            >
              {updateConfigMutation.isPending && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              บันทึกการตั้งค่า
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl">
        <CardHeader>
          <CardTitle>จัดการข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => exportDataMutation.mutate()}
              disabled={exportDataMutation.isPending}
              variant="outline"
              className="h-20 flex flex-col space-y-2"
            >
              <Download className="w-6 h-6" />
              <span>ส่งออกข้อมูล</span>
            </Button>
            
            <div>
              <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('import-file')?.click()}
                disabled={importDataMutation.isPending}
                variant="outline"
                className="h-20 flex flex-col space-y-2 w-full"
              >
                <Upload className="w-6 h-6" />
                <span>นำเข้าข้อมูล</span>
              </Button>
            </div>
          </div>
          
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              การนำเข้าข้อมูลจะแทนที่ข้อมูลที่มีอยู่ทั้งหมด กรุณาส่งออกข้อมูลสำรองก่อนดำเนินการ
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}