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
    mutationFn: async (config: any) => {
      const response = await fetch('/api/admin/database/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update config: ${errorData}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/database/config'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/database/status'] });
      toast({
        title: "สำเร็จ",
        description: "อัพเดตการตั้งค่าฐานข้อมูลแล้ว",
      });
    },
    onError: (error: any) => {
      console.error('Database config error:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: error.message || "ไม่สามารถอัพเดตการตั้งค่าฐานข้อมูลได้",
        variant: "destructive",
      });
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: async (format: 'json' | 'csv' = 'json') => {
      return apiRequest(`/api/admin/database/export?format=${format}`, "POST");
    },
    onSuccess: (data: any, format: 'json' | 'csv' = 'json') => {
      const timestamp = new Date().toISOString().split('T')[0];

      if (format === 'csv') {
        // Handle CSV download
        const blob = new Blob([data.csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `restaurant-data-${timestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Handle JSON download
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `restaurant-data-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      toast({
        title: "สำเร็จ",
        description: `ดาวน์โหลดข้อมูล ${format.toUpperCase()} แล้ว`,
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

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">คำแนะนำการเชื่อมต่อ</h4>
                  <div className="space-y-3 text-sm text-blue-700">
                    <div>
                      <strong>Neon Database:</strong>
                      <ul className="ml-4 mt-1 space-y-1 list-disc">
                        <li>Host: [project-name].us-east-2.aws.neon.tech</li>
                        <li>Port: 5432</li>
                        <li>Database: [database-name]</li>
                        <li>Username: [your-username]</li>
                        <li>Password: [your-password]</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Supabase:</strong>
                      <ul className="ml-4 mt-1 space-y-1 list-disc">
                        <li>Host: db.[project-ref].supabase.co</li>
                        <li>Port: 5432</li>
                        <li>Database: postgres</li>
                        <li>Username: postgres</li>
                        <li>Password: [your-password]</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Railway:</strong>
                      <ul className="ml-4 mt-1 space-y-1 list-disc">
                        <li>Host: [service].railway.app</li>
                        <li>Port: [assigned-port]</li>
                        <li>Database: railway</li>
                        <li>Username: postgres</li>
                        <li>Password: [generated-password]</li>
                      </ul>
                    </div>
                  </div>
                </div>

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
                  <Label htmlFor="database">ชื่อฐานข้อมูล</Label>
                  <Input
                    id="database"
                    placeholder="restaurant_db หรือ postgres"
                    value={config.database || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Neon: ใช้ชื่อฐานข้อมูลที่สร้าง, Supabase: ใช้ "postgres"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">ชื่อผู้ใช้</Label>
                    <Input
                      id="username"
                      placeholder="postgres หรือ username ของคุณ"
                      value={config.username || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      โดยทั่วไปจะเป็น "postgres"
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="password">รหัสผ่าน</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="รหัสผ่านของฐานข้อมูล"
                      value={config.password || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      รหัสผ่านที่ได้จากเจ้าให้บริการ
                    </p>
                  </div>
                </div>

                <div>
                  <Label>การตั้งค่าเพิ่มเติม</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id="ssl"
                      checked={config.ssl || false}
                      onChange={(e) => setConfig(prev => ({ ...prev, ssl: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="ssl" className="text-sm">เปิดใช้งาน SSL (แนะนำสำหรับ production)</Label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ฐานข้อมูลส่วนใหญ่ต้องการ SSL สำหรับการเชื่อมต่อภายนอก
                  </p>
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
            <div className="space-y-2">
              <Button
                onClick={() => exportDataMutation.mutate('json')}
                disabled={exportDataMutation.isPending}
                variant="outline"
                className="h-16 flex flex-col space-y-1 w-full"
              >
                <Download className="w-5 h-5" />
                <span className="text-xs">ส่งออก JSON</span>
              </Button>
              <Button
                onClick={() => exportDataMutation.mutate('csv')}
                disabled={exportDataMutation.isPending}
                variant="outline"
                className="h-16 flex flex-col space-y-1 w-full"
              >
                <Download className="w-5 h-5" />
                <span className="text-xs">ส่งออก CSV</span>
              </Button>
            </div>

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