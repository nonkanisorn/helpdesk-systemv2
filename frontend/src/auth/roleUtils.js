/**
 * แปลงและจัดรูปแบบชื่อตำแหน่ง/บทบาทผู้ใช้ตามข้อมูลในระบบ
 * @param {string} roleName - ชื่อบทบาทจาก state.user.role_name
 * @param {number|string} roleId - รหัสบทบาทจาก state.user.role_id
 * @returns {string} ชื่อบทบาทที่ฟอร์แมตแล้ว
 */
export const formatRoleName = (roleName, roleId) => {
  if (roleName && typeof roleName === "string" && roleName.trim()) {
    const trimmed = roleName.trim();
    const standardMap = {
      admin: "Administrator",
      manager: "Manager",
      technician: "Technician",
      user: "User",
    };
    const lower = trimmed.toLowerCase();
    if (standardMap[lower]) {
      return standardMap[lower];
    }
    // หากเป็นชื่อภาษาไทยหรือชื่อเฉพาะ ให้คงรูปแบบเดิมไว้
    return trimmed;
  }

  // Fallback ตาม role_id
  const idMap = {
    1: "Administrator",
    2: "Manager",
    3: "Technician",
    4: "User",
  };

  return idMap[Number(roleId)] || "User";
};
