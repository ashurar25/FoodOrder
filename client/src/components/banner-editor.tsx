
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Edit, Trash2, Save } from "lucide-react";
import type { Banner } from "@shared/schema";

interface BannerEditorProps {
  isOpen: boolean;
  onClose: () => void;
  banners: Banner[];
  restaurantId: string;
}

export default function BannerEditor({ isOpen, onClose, banners, restaurantId }: BannerEditorProps) {
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [newBanner, setNewBanner] = useState({ title: "", description: "", imageUrl: "", linkUrl: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

  const createBannerMutation = useMutation({
    mutationFn: async (banner: any) => {
      const response = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...banner, restaurantId }),
      });
      if (!response.ok) throw new Error('Failed to create banner');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      setNewBanner({ title: "", description: "", imageUrl: "", linkUrl: "" });
      setShowAddForm(false);
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: async ({ id, banner }: { id: string; banner: any }) => {
      const response = await fetch(`/api/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banner),
      });
      if (!response.ok) throw new Error('Failed to update banner');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      setEditingBanner(null);
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error('Failed to delete banner');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">จัดการแบนเนอร์</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Add New Banner Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มแบนเนอร์ใหม่</span>
            </button>
          </div>

          {/* Add New Banner Form */}
          {showAddForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-4">เพิ่มแบนเนอร์ใหม่</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="ชื่อแบนเนอร์"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                />
                <textarea
                  placeholder="คำอธิบาย"
                  value={newBanner.description}
                  onChange={(e) => setNewBanner(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border rounded-lg h-24"
                />
                <input
                  type="url"
                  placeholder="URL รูปภาพ"
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="url"
                  placeholder="URL ลิงก์ (ไม่บังคับ)"
                  value={newBanner.linkUrl}
                  onChange={(e) => setNewBanner(prev => ({ ...prev, linkUrl: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => createBannerMutation.mutate(newBanner)}
                    disabled={!newBanner.title || !newBanner.imageUrl || createBannerMutation.isPending}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 inline mr-2" />
                    บันทึก
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewBanner({ title: "", description: "", imageUrl: "", linkUrl: "" });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Existing Banners */}
          <div className="space-y-4">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white border rounded-lg p-4">
                {editingBanner?.id === banner.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingBanner.title}
                      onChange={(e) => setEditingBanner(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <textarea
                      value={editingBanner.description || ""}
                      onChange={(e) => setEditingBanner(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                      className="w-full p-3 border rounded-lg h-24"
                    />
                    <input
                      type="url"
                      value={editingBanner.imageUrl}
                      onChange={(e) => setEditingBanner(prev => prev ? ({ ...prev, imageUrl: e.target.value }) : null)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <input
                      type="url"
                      value={editingBanner.linkUrl || ""}
                      onChange={(e) => setEditingBanner(prev => prev ? ({ ...prev, linkUrl: e.target.value }) : null)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateBannerMutation.mutate({ id: banner.id, banner: editingBanner })}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        <Save className="w-4 h-4 inline mr-2" />
                        บันทึก
                      </button>
                      <button
                        onClick={() => setEditingBanner(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{banner.title}</h4>
                      {banner.description && (
                        <p className="text-sm text-gray-600">{banner.description}</p>
                      )}
                      {banner.linkUrl && (
                        <p className="text-xs text-blue-600 truncate">{banner.linkUrl}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingBanner(banner)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteBannerMutation.mutate(banner.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {banners.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">📢</p>
              <p>ยังไม่มีแบนเนอร์</p>
              <p className="text-sm">คลิกปุ่มเพิ่มแบนเนอร์ใหม่เพื่อเริ่มต้น</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
