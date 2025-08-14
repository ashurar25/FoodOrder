import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function ProfileEditDialog() {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>แก้ไขโปรไฟล์</DialogTitle>
        <DialogDescription>
          แก้ไขข้อมูลส่วนตัวของคุณ
        </DialogDescription>
      </DialogHeader>
      {/* Other dialog content would go here */}
    </DialogContent>
  );
}

export { ProfileEditDialog };
export default ProfileEditDialog;