# Sequence Diagrams

## UC01 เข้าสู่ระบบ

```mermaid
sequenceDiagram
    actor Aactor as ผู้ใช้งานระบบ
    participant Login as 3.2 หน้าเข้าสู่ระบบ
    participant Home as 3.5/3.6/3.7/3.8 หน้าหลัก
    participant DB as ฐานข้อมูล
    Aactor->>Login: กรอกข้อมูลผู้ใช้งาน
    Login->>DB: ส่งข้อมูลผู้ใช้งาน
    DB->>DB: ตรวจสอบข้อมูล
    DB-->>Login: ส่งผลการตรวจสอบ
    Login-->>Aactor: [ข้อมูลไม่ถูกต้อง] แจ้งเตือนข้อมูลไม่ถูกต้อง
    Login->>Home: [ข้อมูลถูกต้อง]เรียกหน้าหลักตามสิทธิ์ผู้ใช้
    Home-->>Aactor: แสดงหน้าหลักตามสิทธิ์ผู้ใช้
```

## UC02 ตั้งรหัสผ่านครั้งแรก

```mermaid
sequenceDiagram
    actor Aactor as ผู้ดูแลระบบ/ผู้ใช้งานระบบ
    participant Users as 3.40 หน้าจัดการสมาชิก
    participant SetPass as 3.4 หน้าตั้งรหัสผ่าน
    participant Login as 3.2 หน้าเข้าสู่ระบบ
    participant DB as ฐานข้อมูล
    Aactor->>Users: แอดมินเพิ่มผู้ใช้
    Users->>DB: บันทึกข้อมูลผู้ใช้ใหม่
    DB-->>Users: บันทึกสำเร็จ
    Users-->>Aactor: แจ้งเพิ่มผู้ใช้สำเร็จ
    Aactor->>SetPass: ผู้ใช้เปิดลิงก์ตั้งรหัส
    SetPass->>DB: ตรวจสอบ token
    SetPass->>DB: บันทึกรหัสผ่านครั้งแรก
    DB-->>SetPass: บันทึกสำเร็จ
    SetPass->>Login: กลับหน้าเข้าสู่ระบบ
    Login-->>Aactor: แสดงหน้าเข้าสู่ระบบ
```

## UC03 เปลี่ยนรหัสผ่าน

```mermaid
sequenceDiagram
    actor Aactor as ผู้ใช้งานระบบ
    participant Login as 3.2 หน้าเข้าสู่ระบบ
    participant Reset as 3.3 หน้ารีเซ็ตรหัสผ่าน
    participant SetPass as 3.4 หน้าตั้งรหัสผ่าน
    participant DB as ฐานข้อมูล
    Aactor->>Login: คลิกลืมรหัสผ่าน
    Login->>Reset: เปิดหน้ารีเซ็ตรหัสผ่าน
    Aactor->>Reset: กรอกข้อมูลอีเมล
    Reset->>DB: ส่งข้อมูลอีเมล์
DB->>DB:ตรวจสอบข้อมูล
DB-->>Reset:ส่งผลตรวจสอบข้อมูล
Reset-->>Aactor:ส่งอีเมล์เปลี่ยนรหัสผ่าน
Aactor->>SetPass:เรียกหน้าตั้งรหัสผ่านใหม่
SetPass-->>Aactor:แสดงหน้าตั้งรหัสผ่านใหม่
Aactor->>SetPass:กรอกรหัสผ่านใหม่
    SetPass->>DB: ส่งข้อมูลรหัสผ่านใหม่
DB->>DB:บันทึกข้อมูล
    DB-->>SetPass: ส่งผลการบันทึก
SetPass-->>Aactor:แสดงผลการบันทึก
```

## UC04 เพิ่มการแจ้งซ่อม

```mermaid
sequenceDiagram
    actor Aactor as ผู้ใช้ทั่วไป
    participant Home as 3.5 หน้าหลัก
    participant Repair as 3.9 หน้าแจ้งซ่อม
    participant DB as ฐานข้อมูล
    Aactor->>Home: เลือกเมนูแจ้งซ่อม
    Home->>Repair: เปิดหน้าแจ้งซ่อม
    Repair->>DB: โหลดหมวดหมู่ปัญหา
    DB-->>Repair: ส่งรายการหมวดหมู่
    Repair-->>Aactor: แสดงฟอร์ม
    Aactor->>Repair: กรอกข้อมูลและยืนยัน
    Repair->>DB: บันทึกรายการแจ้งซ่อม
    DB-->>Repair: บันทึกสำเร็จ
    Repair-->>Aactor: แสดงข้อความแจ้งผล
```

## UC05 ติดตามสถานะการแจ้งซ่อม

```mermaid
sequenceDiagram
    actor Aactor as ผู้ใช้ทั่วไป
    participant Home as 3.5 หน้าหลัก
    participant Track as 3.10 หน้าติดตามสถานะ
    participant DB as ฐานข้อมูล
    Aactor->>Home: เลือกติดตามสถานะ
    Home->>Track: เปิดหน้าติดตามสถานะ
    Track->>DB: ค้นหารายการของผู้ใช้
    DB-->>Track: ส่งรายการและสถานะ
    Track-->>Aactor: แสดงสถานะการแจ้งซ่อม
    Aactor->>Track: เลือกตัวกรองสถานะ
    Track-->>Aactor: แสดงรายการตามสถานะ
```

## UC06 ดูประวัติการแจ้งซ่อม

```mermaid
sequenceDiagram
    actor Aactor as ผู้ใช้ทั่วไป
    participant MainPage as 3.6 หน้าหลัก(ผู้ใช้ทั่วไป)
    participant History as 3.11 หน้าติดตามสถานะและประวัติการแจ้งซ่อม
    participant DB as ฐานข้อมูล
Aactor->>MainPage:เลือกเมนูประวัติการซ่อมของฉัน
MainPage->>History:เรียกหน้าติดตามสถานะและปรวัติการแจ้งซ่อม
History->>DB:เรียกข้อมูลการประวัติการแจ้งซ่อมของผู้ใช้
DB->>DB:ดึงข้อมูล
DB-->>History:ส่งข้อมูลประวัติการแจ้งซ่อมของผู้ใช้
History-->>Aactor:แสดงผลประวัติการแจ้งซ่อมของผู้ใช้
```

## UC07 ยืนยันผลการซ่อม

```mermaid
sequenceDiagram
    actor Aactor as ผู้ใช้ทั่วไป

    participant MainPage as 3.6 หน้าหลัก
    participant Track as 3.11 หน้าติดตามสถานะและประวัติการแจ้งซ่อม
    participant Detail as 3.12 หน้ารายละเอียดการซ่อม
    participant DB as ฐานข้อมูล
Aactor->>MainPage:เลือกเมนูประวัติการแจ้งซ่อม
MainPage->>Track:เรียกหน้าติดตามสถานะและประวัติการแจ้งซ่อม
Track->>DB:เรียกข้อมูลประวัติการแจ้งซ่อมของผู้ใช้
DB->>DB:ดึงข้อมูล
DB-->Track:ส่งข้อมูลประวัติการแจ้งซ่อมของผู้ใช้
Track-->>Aactor:แสดงหน้าติดตามสถานะและประวัติการแจ้งซ่อม
Aactor->>Track:เลือกข้อมูลการแจ้งซ่อมที่ต้องการยืนยัน
Track->>Detail:เรียกหน้ารายละเอียดการซ่อม
Detail->>DB:เรียกข้อมูการแจ้งซ่อมที่ต้องการยืนยัน
DB->>DB:ดึงข้อมูล
DB-->>Detail:ส่งข้อมูลการแจ้งซ่อม
Detail-->>Aactor:แสดงหน้ารายละเอียดการซ่อม
Aactor->>Detail:กดปุ่มยืนยันการซ่อม
Detail->>DB:ส่งผลการยืนยัน
DB->>DB:บันทึกผล
DB-->>Detail:ส่งผลการบันทึก
Detail-->>Aactor:แสดงผลการบันทึก

```

## UC08 ดูหน้าประวัติส่วนตัว

```mermaid
sequenceDiagram
    actor Aactor as ผู้ใช้งานระบบ
    participant MainPage as 3.6/3.7/3.8/3.9 หน้าหลักตามสิทธิ์
    participant Profile as 3.26 หน้าประวัติส่วนตัว
    participant DB as ฐานข้อมูล
    Aactor->>MainPage: เลือกเมนูโปรไฟล์
Profile->>DB:เรียกข้อมูลประวัติส่วนตัว
DB->>DB:ดึงข้อมูล
DB-->>Profile:ส่งข้อมูลประวัติส่วนตัว
Profile-->>Aactor:แสดงหน้าประวัติส่วนตัว
```

## UC09 ดูงานซ่อมที่ได้รับมอบหมาย

```mermaid
sequenceDiagram
    actor Aactor as ช่างเทคนิค
    participant Home as 3.7 หน้าหลัก
    participant Assigned as 3.15 หน้างานที่ได้รับมอบหมาย
    participant DB as ฐานข้อมูล
    Aactor->>Home: เลือกงานที่ได้รับมอบหมาย
    Home->>Assigned: เปิดหน้างานที่ได้รับมอบหมาย
    Assigned->>DB: ค้นหางานตามช่าง
    DB-->>Assigned: ส่งรายการงาน
    Assigned-->>Aactor: แสดงงานที่ได้รับมอบหมาย
    Aactor->>Assigned: เลือกจัดการงาน
    Assigned-->>Aactor: เปิดรายละเอียดงาน
```

## UC11 ดูประวัติการซ่อมของตนเอง

```mermaid
sequenceDiagram
    actor Aactor as ช่างเทคนิค
    participant MainPage as 3.8 หน้าหลัก(ข่างเทคนิค)
    participant History as 3.24 หน้าประวัติการซ่อม
    participant DB as ฐานข้อมูล
Aactor->>MainPage:เลือกเมนูประวัติการซ่อม
MainPage->>History:เรียกหน้าประวัติการซ่อม
History->>DB:เรียกข้อมูลประวัติการซ่อม
DB->>DB:ดึงข้อมูล
DB-->>History:ส่งข้อมูลประวัติการซ่อม
History-->>Aactor:แสดงหน้าประวัติการซ่อม

```

## UC12 จัดการรายการอุปกรณ์

```mermaid
sequenceDiagram
    actor Aactor as ผู้จัดการ/ช่างเทคนิค
    participant Device as 3.14 หน้ารายการอุปกรณ์
    participant DB as ฐานข้อมูล
    Aactor->>Device: เปิดรายการอุปกรณ์
    Device->>DB: อ่านรายการอุปกรณ์
    DB-->>Device: ส่งรายการอุปกรณ์
    Device-->>Aactor: แสดงรายการอุปกรณ์
    Aactor->>Device: เพิ่ม/แก้ไข/ลบอุปกรณ์
    Device->>DB: บันทึกข้อมูลอุปกรณ์
    DB-->>Device: ส่งข้อมูลล่าสุด
    Device-->>Aactor: แสดงข้อมูลล่าสุด
```

## UC13 ดูรายการแจ้งซ่อมทั้งหมด

```mermaid
sequenceDiagram
    actor Aactor as ผู้จัดการ
    participant Home as 3.6 หน้าหลัก
    participant List as 3.12 หน้าดูรายการแจ้งซ่อมทั้งหมด
    participant DB as ฐานข้อมูล
    Aactor->>Home: เลือกรายการแจ้งซ่อม
    Home->>List: เปิดหน้ารายการแจ้งซ่อม
    List->>DB: ค้นหางานรอมอบหมาย
    DB-->>List: ส่งรายการแจ้งซ่อม
    List-->>Aactor: แสดงรายการแจ้งซ่อมทั้งหมด
    Aactor->>List: เลือกดูรายละเอียด
    List-->>Aactor: เปิดรายละเอียดงาน
```

## UC17 จัดการข้อมูลสถานะการซ่อม

```mermaid
sequenceDiagram
    actor Aactor as ผู้จัดการ
    participant Home as 3.6 หน้าหลัก
    participant Status as 3.13 หน้าติดตามสถานะการซ่อมทั้งหมด
    participant DB as ฐานข้อมูล
    Aactor->>Home: เลือกสถานะการซ่อม
    Home->>Status: เปิดหน้าติดตามสถานะทั้งหมด
    Status->>DB: อ่านข้อมูลสถานะงาน
    DB-->>Status: ส่งรายการและสถานะ
    Status-->>Aactor: แสดงสถานะการซ่อมทั้งหมด
    Aactor->>Status: ค้นหาหรือกรองสถานะ
    Status-->>Aactor: แสดงรายการตามเงื่อนไข
```

## UC10 บันทึกผลการซ่อม

```mermaid
sequenceDiagram
    actor Aactor as ช่างเทคนิค
    participant MainPage as หน้าหลัก
    participant Assigned as 3.15 หน้างานที่ได้รับมอบหมาย
    participant Record as 3.38 หน้าบันทึกการซ่อม
    participant DB as ฐานข้อมูล
    Aactor->>MainPage:เลือกเมนูงานที่ได้รับมอบหมาย
    MainPage->>Assigned:เรียกหน้างานที่ได้รับมอบหมาย
    Assigned->>DB:เรียกข้อมูลงานที่ได้รับมอบหมาย
    DB->>DB:ดึงข้อมูล
    DB-->>Assigned:ส่งผลข้อมูลงานที่ได้รับมอบหมาย
    Assigned->>Aactor:แสดงหน้างานที่ได้รับมอบหมาย
    Aactor->>Assigned: เลือกงานที่ต้องการบันทึกผล
    Assigned->>Record:เรียกหน้าบันทึกผลการซ่อม
    Record->>DB:ร้องขอข้อมูลที่ต้องการบันทึกผล
    DB->>DB:ดึงข้อมูล
    DB-->>Record:ส่งข้อมูลที่ต้องการบันทึกผล
    Record-->>Aactor:แสดงหน้าบันทึกผลการซ่อม
    Aactor->>Record: กรอกข้อมูลผลการซ่อม
    Record->>DB: ส่งข้อมูลผลการซ่อม
    DB->>DB:บันทึกข้อมูล
    DB-->>Record: บันทึกสำเร็จ
    Record-->>Aactor: แสดงผลการบันทึก
```

## UC14 มอบหมายงานให้ช่าง

```mermaid
sequenceDiagram
    actor Aactor as ผู้จัดการ
    participant MainPage as หน้าหลัก
    participant List as 3.13 หน้าดูรายการแจ้งซ่อมทั้งหมด
    participant Assign as 3.14 หน้ามอบหมายช่าง
    participant DB as ฐานข้อมูล
    Aactor->>MainPage: เลือกเมนูรายการแจ้งซ่อม
    MainPage->>List:เรียกหน้าดูรายการแจ้งซ่อมทั้งหมด
List->>DB: เรียกข้อมูลรายการแจ้งซ่อมทั้งหมด
DB->>DB:ดึงข้อมูล
DB-->List:ส่งข้อมูลรายการแจ้งซ่อมทั้งหมด
List-->>Aactor:แสดงหน้ารายการแจ้งซ่อมทั้งหมด
Aactor->>List:เลือกข้อมูลการแจ้งซ่อมที่ต้องการมอบหมายงาน
    List->>Assign: เรียกหน้ามอบหมายช่าง
Assign->>DB:เรียกข้อมูลการซ่อมที่ต้องการมอบหมายช่าง
DB->>DB:ดึงข้อมูล
DB-->>Assign:ส่งผลข้อมูลการซ่อมที่ต้องการมอบหมายช่าง
Assign->>DB:เรียกข้อมูลช่าง
DB->>DB:ดึงข้อมูล
DB-->>Assign:ส่งผลข้อมูลช่าง
Assign-->>Aactor:แสดงหน้ามอบหมายช่าง
Aactor->>Assign:เลือกข้อมูลช่าง
    Assign->>DB: ส่งข้อมูลช่าง
DB->>DB:บันทึกข้อมูล
    DB-->>Assign: ส่งผลบันทึกข้อมูล
Assign-->>Aactor:แสดงผลการบันทึกข้อมูล
```

## UC15 จัดการข้อมูลผู้ใช้

```mermaid
sequenceDiagram
    actor Aactor as ผู้ดูแลระบบ
    participant Home as 3.8 หน้าหลักผู้ดูแลระบบ
    participant Users as 3.40 หน้าจัดการสมาชิก
    participant DB as ฐานข้อมูล
    Aactor->>Home: เลือกจัดการสมาชิก
    Home->>Users: เปิดหน้าจัดการสมาชิก
    Users->>DB: อ่านข้อมูลผู้ใช้
    DB-->>Users: ส่งรายการผู้ใช้
    Users-->>Aactor: แสดงรายการผู้ใช้
    Aactor->>Users: เพิ่ม/แก้ไข/ลบผู้ใช้
    Users->>DB: บันทึกข้อมูลผู้ใช้
    DB-->>Users: บันทึกสำเร็จ
    Users-->>Aactor: แสดงข้อมูลล่าสุด
```

## UC16 จัดการข้อมูลประเภทอุปกรณ์

```mermaid
sequenceDiagram
    actor Aactor as ผู้ดูแลระบบ
    participant Home as 3.8 หน้าหลักผู้ดูแลระบบ
    participant Types as 3.41 หน้าจัดการประเภทอุปกรณ์
    participant DB as ฐานข้อมูล
    Aactor->>Home: เลือกจัดการประเภทอุปกรณ์
    Home->>Types: เปิดหน้าจัดการประเภทอุปกรณ์
    Types->>DB: อ่านประเภทอุปกรณ์
    DB-->>Types: ส่งรายการประเภทอุปกรณ์
    Types-->>Aactor: แสดงรายการประเภทอุปกรณ์
    Aactor->>Types: เพิ่ม/แก้ไข/ลบประเภทอุปกรณ์
    Types->>DB: บันทึกข้อมูลประเภทอุปกรณ์
    DB-->>Types: บันทึกสำเร็จ
    Types-->>Aactor: แสดงข้อมูลล่าสุด
```

## UC18 จัดการข้อมูลบทบาท

```mermaid
sequenceDiagram
    actor Aactor as ผู้ดูแลระบบ
    participant Home as 3.8 หน้าหลักผู้ดูแลระบบ
    participant Roles as 3.42 หน้าจัดการบทบาท
    participant DB as ฐานข้อมูล
    Aactor->>Home: เลือกจัดการบทบาท
    Home->>Roles: เปิดหน้าจัดการบทบาท
    Roles->>DB: อ่านข้อมูลบทบาท
    DB-->>Roles: ส่งรายการบทบาท
    Roles-->>Aactor: แสดงรายการบทบาท
    Aactor->>Roles: เพิ่ม/แก้ไข/ลบบทบาท
    Roles->>DB: บันทึกข้อมูลบทบาท
    DB-->>Roles: บันทึกสำเร็จ
    Roles-->>Aactor: แสดงข้อมูลล่าสุด
```

## UC19 จัดการข้อมูลแผนก

```mermaid
sequenceDiagram
    actor Aactor as ผู้ดูแลระบบ
    participant Home as 3.8 หน้าหลักผู้ดูแลระบบ
    participant Departments as 3.43 หน้าจัดการแผนก
    participant DB as ฐานข้อมูล
    Aactor->>Home: เลือกจัดการแผนก
    Home->>Departments: เปิดหน้าจัดการแผนก
    Departments->>DB: อ่านข้อมูลแผนก
    DB-->>Departments: ส่งรายการแผนก
    Departments-->>Aactor: แสดงรายการแผนก
    Aactor->>Departments: เพิ่ม/แก้ไข/ลบแผนก
    Departments->>DB: บันทึกข้อมูลแผนก
    DB-->>Departments: บันทึกสำเร็จ
    Departments-->>Aactor: แสดงข้อมูลล่าสุด
```

## UC20 จัดการข้อมูลประเภทปัญหา

```mermaid
sequenceDiagram
    actor Aactor as ผู้ดูแลระบบ
    participant Home as 3.8 หน้าหลักผู้ดูแลระบบ
    participant Issues as 3.44 หน้าจัดการประเภทปัญหา
    participant DB as ฐานข้อมูล
    Aactor->>Home: เลือกจัดการประเภทปัญหา
    Home->>Issues: เปิดหน้าจัดการประเภทปัญหา
    Issues->>DB: อ่านข้อมูลประเภทปัญหา
    DB-->>Issues: ส่งรายการประเภทปัญหา
    Issues-->>Aactor: แสดงรายการประเภทปัญหา
    Aactor->>Issues: เพิ่ม/แก้ไข/ลบประเภทปัญหา
    Issues->>DB: บันทึกข้อมูลประเภทปัญหา
    DB-->>Issues: บันทึกสำเร็จ
    Issues-->>Aactor: แสดงข้อมูลล่าสุด
```
