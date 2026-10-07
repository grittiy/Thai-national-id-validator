# Thai National ID Validation

ระบบตรวจสอบความถูกต้องของเลขประจำตัวประชาชนไทย 

## วัตถุประสงค์

ใช้สำหรับตรวจสอบเลขประจำตัวประชาชนที่กรอกเข้ามา ก่อนอนุญาตให้บันทึกหรือส่งข้อมูลเข้าสู่ระบบ

ระบบไม่ได้ตรวจสอบเพียงว่าผู้ใช้กรอกตัวเลขครบ 13 หลักเท่านั้น แต่จะตรวจสอบหลักตรวจสอบ (Check Digit) ของเลขประจำตัวประชาชนด้วย

---

## ขั้นตอนการตรวจสอบ

ระบบจะตรวจสอบตามลำดับดังนี้

### 1. ตรวจสอบค่าว่าง

หากผู้สมัครไม่ได้กรอกเลขประจำตัวประชาชน ระบบจะแสดงข้อความ

> กรุณากรอกเลขบัตรประชาชน

### 2. ตรวจสอบจำนวนหลัก

เลขประจำตัวประชาชนต้องประกอบด้วยตัวเลขจำนวน 13 หลัก

หากจำนวนหลักไม่ถูกต้อง ระบบจะแสดงข้อความ

> กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก

### 3. ตรวจสอบเลขซ้ำ

ระบบป้องกันค่าที่ใช้ตัวเลขเดียวกันทั้ง 13 หลัก เช่น

- `1111111111111`
- `0000000000000`
- `9999999999999`

ค่าดังกล่าวจะถือว่าไม่ผ่าน Validation

### 4. ตรวจสอบ Check Digit

เลข 12 หลักแรกจะถูกนำมาคำนวณเพื่อตรวจสอบเลขหลักที่ 13

รูปแบบการคำนวณคือ

เลขหลักที่ 1 × 13  
เลขหลักที่ 2 × 12  
เลขหลักที่ 3 × 11  
...  
เลขหลักที่ 12 × 2

จากนั้นนำผลรวมมาคำนวณด้วยสูตร

Check Digit = (11 - (ผลรวม mod 11)) mod 10

ค่าที่คำนวณได้จะต้องตรงกับเลขหลักที่ 13

หากไม่ตรงกัน ระบบจะแสดงข้อความ

> เลขบัตรประชาชนไม่ถูกต้อง

---

## ตัวอย่างการใช้งาน

```ts
const idCardNumber = digitsOnly(data.idCardNumber ?? '')

if (!idCardNumber) {
  errors.idCardNumber = 'กรุณากรอกเลขบัตรประชาชน'
} else if (idCardNumber.length !== 13) {
  errors.idCardNumber = 'กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก'
} else if (!isValidThaiNationalId(idCardNumber)) {
  errors.idCardNumber = 'เลขบัตรประชาชนไม่ถูกต้อง'
}

```

---------------------------------------------------------------------------------------------
# Thai National ID Validator

A lightweight TypeScript utility for validating 13-digit Thai National ID numbers using checksum verification.

## Features

- Validates Thai National ID numbers with 13 digits
- Supports formatted input containing spaces or hyphens
- Validates the checksum digit
- Rejects repeated-digit values such as `1111111111111`
- No external dependencies
- Can be used with TypeScript, JavaScript, React, Next.js, Node.js, and other applications

## Usage

Import the validator:

```ts
import { isValidThaiNationalId } from './thaiNationalId'
```

Validate a Thai National ID:

```ts
const isValid = isValidThaiNationalId('YOUR_13_DIGIT_ID')

if (isValid) {
  console.log('Valid Thai National ID')
} else {
  console.log('Invalid Thai National ID')
}
```

Formatted input is also supported:

```ts
isValidThaiNationalId('X-XXXX-XXXXX-XX-X')
```

Non-numeric characters are removed before validation.

## Validation

The validator performs the following checks:

1. Removes non-numeric characters.
2. Verifies that the ID contains exactly 13 digits.
3. Rejects values containing the same digit 13 times.
4. Calculates the checksum using the first 12 digits.
5. Compares the calculated check digit with the 13th digit.

## Checksum Calculation

For a 13-digit number:

```text
D1 D2 D3 D4 D5 D6 D7 D8 D9 D10 D11 D12 D13
```

The first 12 digits are multiplied by descending weights:

```text
D1  × 13
D2  × 12
D3  × 11
D4  × 10
D5  × 9
D6  × 8
D7  × 7
D8  × 6
D9  × 5
D10 × 4
D11 × 3
D12 × 2
```

The results are added together:

```text
sum = (D1 × 13) + (D2 × 12) + ... + (D12 × 2)
```

The check digit is calculated using:

```text
checkDigit = (11 - (sum % 11)) % 10
```

The calculated value must match `D13`.

## Form Validation Example

```ts
const nationalId = inputValue.trim()

if (!nationalId) {
  console.log('National ID is required')
} else if (nationalId.replace(/\D/g, '').length !== 13) {
  console.log('National ID must contain 13 digits')
} else if (!isValidThaiNationalId(nationalId)) {
  console.log('Invalid Thai National ID')
} else {
  console.log('Valid Thai National ID')
}
```

This example is intentionally framework-independent, so the validator can be integrated into any form validation system.

## Important

This utility validates the **format and checksum** of a Thai National ID only.

A successful validation does not confirm that the ID was actually issued to a person, is currently active, or matches a person's identity.

Do not commit real National ID numbers or other personally identifiable information (PII) to a public repository.

## License

MIT
