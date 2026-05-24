export const permissionLabelMap = {
  create_ticket: "สร้างรายการแจ้งซ่อม",
  view_own_ticket: "ดูรายการแจ้งซ่อมของตนเอง",
  view_all_ticket: "ดูรายการแจ้งซ่อมทั้งหมด",
  view_assigned_ticket: "ดูงานซ่อมที่ได้รับมอบหมาย",
  assign_ticket: "มอบหมายงานซ่อมให้ช่าง",
  update_ticket_status: "อัปเดตสถานะงานซ่อม",
  add_resolution_note: "บันทึกผลการซ่อม",
  confirm_repair: "ยืนยันผลการซ่อม",
  manage_users: "จัดการผู้ใช้งาน",
  manage_roles: "จัดการบทบาทและสิทธิ์",
  manage_departments: "จัดการแผนก",
  view_devices: "ดูข้อมูลอุปกรณ์",
  manage_devices: "จัดการอุปกรณ์",
  manage_issue_categories: "จัดการประเภทปัญหา",
  manage_ticket_statuses: "จัดการสถานะงานซ่อม",
};

export const permissionDescriptionMap = {
  create_ticket: "สร้างคำขอแจ้งซ่อมใหม่ในระบบ",
  view_own_ticket: "ดูประวัติและสถานะงานซ่อมที่ตนเองแจ้ง",
  view_all_ticket: "ดูรายการแจ้งซ่อมของทุกคนในระบบ",
  view_assigned_ticket: "ดูงานซ่อมที่ถูกมอบหมายให้รับผิดชอบ",
  assign_ticket: "เลือกช่างและมอบหมายงานซ่อม",
  update_ticket_status: "เปลี่ยนสถานะ เช่น เริ่มงาน หรือรออะไหล่",
  add_resolution_note: "บันทึกรายละเอียดผลการซ่อมเมื่อปิดงาน",
  confirm_repair: "ยืนยันการซ่อมหรือส่งกลับให้ตรวจสอบอีกครั้ง",
  manage_users: "เพิ่ม แก้ไข ระงับ หรือลบผู้ใช้งาน",
  manage_roles: "เพิ่ม แก้ไข ลบบทบาท และกำหนดสิทธิ์",
  manage_departments: "เพิ่ม แก้ไข หรือลบข้อมูลแผนก",
  view_devices: "ดูข้อมูลอุปกรณ์และประวัติอุปกรณ์",
  manage_devices: "เพิ่ม แก้ไข หรือลบข้อมูลอุปกรณ์",
  manage_issue_categories: "เพิ่ม แก้ไข หรือลบประเภทปัญหา",
  manage_ticket_statuses: "เพิ่ม แก้ไข หรือลบสถานะงานซ่อม",
};

export const getPermissionLabel = (permissionName) => {
  return permissionLabelMap[permissionName] ?? permissionName;
};

export const getPermissionDescription = (permission) => {
  return (
    permissionDescriptionMap[permission.name] ??
    permission.description ??
    "ไม่มีคำอธิบาย"
  );
};
