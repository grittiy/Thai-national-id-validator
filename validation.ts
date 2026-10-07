/**
 * ลบอักขระที่ไม่ใช่ตัวเลขออกจากข้อความ
 *
 * ตัวอย่าง:
 * "1-2345-67890-12-3" -> "1234567890123"
 */
const digitsOnly = (value: string): string => {
  return value.replace(/\D/g, '')
}

/**
 * ตรวจสอบความถูกต้องของเลขประจำตัวประชาชนไทย
 *
 * เงื่อนไข:
 * 1. ต้องมีตัวเลขทั้งหมด 13 หลัก
 * 2. ต้องไม่เป็นตัวเลขเดียวกันทั้ง 13 หลัก เช่น 1111111111111
 * 3. หลักตรวจสอบ (Check Digit) ต้องถูกต้อง
 *
 * @param value เลขประจำตัวประชาชนที่ต้องการตรวจสอบ
 * @returns true เมื่อเลขบัตรผ่านการตรวจสอบ, false เมื่อไม่ผ่าน
 */
export const isValidThaiNationalId = (value: string): boolean => {
  const id = digitsOnly(value)

  // ตรวจสอบว่ามีตัวเลขครบ 13 หลัก
  if (!/^\d{13}$/.test(id)) {
    return false
  }

  // ป้องกันเลขที่เป็นตัวเดียวกันทั้งหมด
  // เช่น 1111111111111 หรือ 0000000000000
  if (/^(\d)\1{12}$/.test(id)) {
    return false
  }

  // นำเลข 12 หลักแรกมาคำนวณ
  // หลักที่ 1 คูณ 13
  // หลักที่ 2 คูณ 12
  // ...
  // หลักที่ 12 คูณ 2
  const sum = id
    .slice(0, 12)
    .split('')
    .reduce(
      (total, digit, index) =>
        total + Number(digit) * (13 - index),
      0
    )

  // คำนวณ Check Digit
  const checkDigit = (11 - (sum % 11)) % 10

  // เปรียบเทียบกับเลขหลักที่ 13
  return checkDigit === Number(id[12])
}
