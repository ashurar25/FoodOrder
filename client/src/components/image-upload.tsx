import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  label = "รูปภาพ", 
  placeholder = "เลือกรูปภาพ...",
  className = ""
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณาเลือกไฟล์รูปภาพเท่านั้น",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "ข้อผิดพลาด",
        description: "ขนาดไฟล์ต้องไม่เกิน 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        const fileName = `${Date.now()}_${file.name}`;
        
        try {
          const response = await fetch('/api/upload/image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageData: base64Data,
              fileName: fileName,
            }),
          });

          if (!response.ok) {
            throw new Error('การอัพโหลดล้มเหลว');
          }

          const result = await response.json();
          const imageUrl = result.url;
          
          setPreview(imageUrl);
          onChange(imageUrl);
          
          toast({
            title: "สำเร็จ",
            description: "อัพโหลดรูปภาพแล้ว",
          });
          
        } catch (error) {
          console.error('Upload error:', error);
          toast({
            title: "ข้อผิดพลาด",
            description: "ไม่สามารถอัพโหลดรูปภาพได้",
            variant: "destructive",
          });
        } finally {
          setUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File read error:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถอ่านไฟล์ได้",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  const clearImage = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {/* URL Input */}
      <div className="flex space-x-2">
        <Input
          type="url"
          placeholder={placeholder}
          value={preview}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="whitespace-nowrap"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "กำลังอัพโหลด..." : "เลือกไฟล์"}
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview */}
      {preview && (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="ตัวอย่าง"
              className="w-full h-full object-cover"
              onError={() => {
                setPreview("");
                onChange("");
                toast({
                  title: "ข้อผิดพลาด",
                  description: "ไม่สามารถโหลดรูปภาพได้",
                  variant: "destructive",
                });
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 w-6 h-6 p-0"
              onClick={clearImage}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {!preview && (
        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Image className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs">ไม่มีรูปภาพ</p>
          </div>
        </div>
      )}
    </div>
  );
}