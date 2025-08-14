function AdminPanel() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">แผงควบคุมผู้ดูแลระบบ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">จัดการแบนเนอร์</h3>
          <p className="text-sm text-gray-600">จัดการแบนเนอร์โฆษณาและโปรโมชั่น</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">จัดการอาหาร</h3>
          <p className="text-sm text-gray-600">เพิ่ม แก้ไข และลบรายการอาหาร</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">จัดการคำสั่งซื้อ</h3>
          <p className="text-sm text-gray-600">ดูและจัดการคำสั่งซื้อของลูกค้า</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">จัดการผู้ใช้</h3>
          <p className="text-sm text-gray-600">จัดการบัญชีผู้ใช้และสิทธิ์</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">รายงาน</h3>
          <p className="text-sm text-gray-600">ดูรายงานยอดขายและสถิติ</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">ฐานข้อมูล</h3>
          <p className="text-sm text-gray-600">จัดการฐานข้อมูลและการสำรองข้อมูล</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;