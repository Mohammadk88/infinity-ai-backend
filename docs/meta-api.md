# Meta API Integration Guide — Infinity AI System

> 📅 آخر تحديث: April 5, 2025  
> 📦 النسخة الحالية: MVP  

---

## ✅ الصلاحيات الأساسية (MVP Phase)

**نهدف حالياً إلى:**
- ربط حسابات Facebook Pages مع النظام
- جدولة ونشر المنشورات تلقائيًا

### 🔐 الصلاحيات المستخدمة:

| Permission | الغرض |
|------------|--------|
| `pages_manage_posts` | نشر منشورات على الصفحات |
| `pages_show_list`    | جلب الصفحات المرتبطة بحساب المستخدم |
| `pages_read_engagement` | قراءة التفاعل على المنشورات |
| `public_profile`     | معلومات عامة عن المستخدم (اسم، صورة...) |

> ✅ يتم الحصول عليها من خلال Facebook Login بعد موافقة المستخدم.

---

## 🧱 المنتجات المفعّلة حالياً:

- [x] Facebook Login  
- [ ] Marketing API ❌ (غير مفعل حاليًا)

---

## 📈 الصلاحيات المستقبلية (PRO / AI Campaigns Phase)

**عند التوسع نحو إدارة الحملات الإعلانية داخل النظام، سنحتاج إلى:**

### 🔐 صلاحيات إضافية:

| Permission | الغرض |
|------------|--------|
| `ads_management` | إنشاء وتعديل وإدارة الحملات الإعلانية |
| `ads_read` | جلب بيانات الأداء والتكلفة والتحليلات |
| `business_management` | ربط صفحات وبيزنسات متعددة من خلال Business Manager |

---

## 🛠 خطوات الترقية مستقبلاً:

1. تفعيل منتج **Marketing API** في تطبيقك.
2. تقديم وصف مفصل إلى Meta حول كيف سيتم استخدام هذه الصلاحيات.
3. ربط التطبيق مع حساب **Business Manager موثق**.
4. إرسال الطلب إلى **App Review** مع فيديو توضيحي أو صور.
5. تفعيل Live Mode بعد الموافقة.

---

## 🧠 ملاحظات مهمة:

- لا حاجة لحذف التطبيق أو إعادة إنشائه لإضافة صلاحيات جديدة.
- كل الصلاحيات تضاف من لوحة تحكم التطبيق:  
  `App Review → Permissions and Features`
- النظام مرن ويتيح التطوير خطوة بخطوة دون تعطيل الإنتاج.

---

## 🧩 مراجع:

- Meta for Developers: https://developers.facebook.com/
- Permissions Reference: https://developers.facebook.com/docs/permissions/reference/

---

🚀 *Infinity AI System is built for scale, and this integration grows with it.*  
🧠 *Plan smart. Build big. Stay connected.*