from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid

class User(AbstractUser):
    """Mở rộng User model với các trường bổ sung"""
    ROLE_CHOICES = [
        ('to_truong', 'Tổ trưởng'),
        ('to_pho', 'Tổ phó'), 
        ('ke_toan', 'Kế toán'),
        ('cu_dan', 'Cư dân'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='cu_dan')
    phone = models.CharField(max_length=15, blank=True)
    is_active_account = models.BooleanField(default=True)
    password_reset_token = models.CharField(max_length=100, blank=True, null=True)
    token_expires_at = models.DateTimeField(blank=True, null=True)
    force_password_change = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"


class HoKhau(models.Model):
    """Model cho thông tin hộ khẩu"""
    ma_ho_khau = models.CharField(max_length=20, unique=True)
    chu_ho = models.CharField(max_length=100)
    dia_chi = models.CharField(max_length=255)
    so_can_ho = models.CharField(max_length=10)
    tang = models.IntegerField()
    dien_tich = models.FloatField()
    ngay_dang_ky = models.DateTimeField(default=timezone.now)
    ghi_chu = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ho_khau'
        verbose_name = 'Hộ khẩu'
        verbose_name_plural = 'Hộ khẩu'

    def __str__(self):
        return f"{self.ma_ho_khau} - {self.chu_ho}"


class NhanKhau(models.Model):
    """Model cho thông tin nhân khẩu"""
    GIOI_TINH_CHOICES = [
        ('nam', 'Nam'),
        ('nu', 'Nữ'),
    ]
    
    QUAN_HE_CHU_HO_CHOICES = [
        ('chu_ho', 'Chủ hộ'),
        ('vo_chong', 'Vợ/Chồng'),
        ('con', 'Con'),
        ('cha_me', 'Cha/Mẹ'),
        ('anh_chi_em', 'Anh/Chị/Em'),
        ('khac', 'Khác'),
    ]

    ho_khau = models.ForeignKey(HoKhau, on_delete=models.CASCADE, related_name='thanh_vien')
    ho_ten = models.CharField(max_length=100)
    cccd = models.CharField(max_length=12, unique=True)
    ngay_sinh = models.DateField()
    gioi_tinh = models.CharField(max_length=5, choices=GIOI_TINH_CHOICES)
    noi_sinh = models.CharField(max_length=255)
    que_quan = models.CharField(max_length=255)
    quan_he_chu_ho = models.CharField(max_length=20, choices=QUAN_HE_CHU_HO_CHOICES)
    nghe_nghiep = models.CharField(max_length=100, blank=True)
    noi_lam_viec = models.CharField(max_length=255, blank=True)
    tam_tru = models.BooleanField(default=False)
    tam_vang = models.BooleanField(default=False)
    ngay_tam_tru = models.DateField(blank=True, null=True)
    ngay_tam_vang = models.DateField(blank=True, null=True)
    ghi_chu = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'nhan_khau'
        verbose_name = 'Nhân khẩu'
        verbose_name_plural = 'Nhân khẩu'

    def __str__(self):
        return f"{self.ho_ten} - {self.cccd}"


class LoaiKhoanThu(models.Model):
    """Model cho loại khoản thu"""
    ten_loai = models.CharField(max_length=100, unique=True)
    mo_ta = models.TextField(blank=True)
    don_gia = models.DecimalField(max_digits=10, decimal_places=2)
    don_vi_tinh = models.CharField(max_length=50)  # VD: m2, người, căn hộ
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'loai_khoan_thu'
        verbose_name = 'Loại khoản thu'
        verbose_name_plural = 'Loại khoản thu'

    def __str__(self):
        return self.ten_loai


class DotThu(models.Model):
    """Model cho đợt thu phí"""
    TRANG_THAI_CHOICES = [
        ('chua_bat_dau', 'Chưa bắt đầu'),
        ('dang_thu', 'Đang thu'),
        ('ket_thuc', 'Kết thúc'),
        ('tam_dung', 'Tạm dừng'),
    ]

    ten_dot_thu = models.CharField(max_length=200)
    mo_ta = models.TextField(blank=True)
    ngay_bat_dau = models.DateTimeField()
    ngay_ket_thuc = models.DateTimeField()
    trang_thai = models.CharField(max_length=20, choices=TRANG_THAI_CHOICES, default='chua_bat_dau')
    nguoi_tao = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'dot_thu'
        verbose_name = 'Đợt thu'
        verbose_name_plural = 'Đợt thu'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.ten_dot_thu} ({self.get_trang_thai_display()})"


class KhoanThu(models.Model):
    """Model cho khoản thu cụ thể"""
    dot_thu = models.ForeignKey(DotThu, on_delete=models.CASCADE, related_name='khoan_thu')
    ho_khau = models.ForeignKey(HoKhau, on_delete=models.CASCADE)
    loai_khoan_thu = models.ForeignKey(LoaiKhoanThu, on_delete=models.CASCADE)
    so_luong = models.DecimalField(max_digits=10, decimal_places=2, default=1)  # Số lượng tính phí
    don_gia = models.DecimalField(max_digits=10, decimal_places=2)  # Đơn giá tại thời điểm thu
    thanh_tien = models.DecimalField(max_digits=12, decimal_places=2)  # Thành tiền = số_lượng * đơn_giá
    ghi_chu = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeThField(auto_now=True)

    class Meta:
        db_table = 'khoan_thu'
        verbose_name = 'Khoản thu'
        verbose_name_plural = 'Khoản thu'
        unique_together = ['dot_thu', 'ho_khau', 'loai_khoan_thu']

    def save(self, *args, **kwargs):
        # Tự động tính thành tiền
        self.thanh_tien = self.so_luong * self.don_gia
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ho_khau.ma_ho_khau} - {self.loai_khoan_thu.ten_loai} - {self.thanh_tien}"


class ThanhToan(models.Model):
    """Model cho thanh toán"""
    PHUONG_THUC_CHOICES = [
        ('tien_mat', 'Tiền mặt'),
        ('chuyen_khoan', 'Chuyển khoản'),
        ('the_atm', 'Thẻ ATM'),
    ]

    TRANG_THAI_CHOICES = [
        ('chua_thanh_toan', 'Chưa thanh toán'),
        ('da_thanh_toan', 'Đã thanh toán'),
        ('thanh_toan_1_phan', 'Thanh toán một phần'),
    ]

    khoan_thu = models.ForeignKey(KhoanThu, on_delete=models.CASCADE, related_name='thanh_toan')
    so_tien_da_thu = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    so_tien_con_lai = models.DecimalField(max_digits=12, decimal_places=2)
    phuong_thuc = models.CharField(max_length=20, choices=PHUONG_THUC_CHOICES, default='tien_mat')
    ngay_thanh_toan = models.DateTimeField(default=timezone.now)
    nguoi_thu = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    trang_thai = models.CharField(max_length=20, choices=TRANG_THAI_CHOICES, default='chua_thanh_toan')
    ghi_chu = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'thanh_toan'
        verbose_name = 'Thanh toán'
        verbose_name_plural = 'Thanh toán'

    def save(self, *args, **kwargs):
        # Tự động tính số tiền còn lại và trạng thái
        self.so_tien_con_lai = self.khoan_thu.thanh_tien - self.so_tien_da_thu
        
        if self.so_tien_da_thu == 0:
            self.trang_thai = 'chua_thanh_toan'
        elif self.so_tien_da_thu < self.khoan_thu.thanh_tien:
            self.trang_thai = 'thanh_toan_1_phan'
        else:
            self.trang_thai = 'da_thanh_toan'
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.khoan_thu} - {self.get_trang_thai_display()}"


class ChucNang(models.Model):
    """Model cho chức năng hệ thống"""
    ten_chuc_nang = models.CharField(max_length=100, unique=True)
    ma_chuc_nang = models.CharField(max_length=50, unique=True)
    mo_ta = models.TextField(blank=True)
    url_pattern = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chuc_nang'
        verbose_name = 'Chức năng'
        verbose_name_plural = 'Chức năng'

    def __str__(self):
        return self.ten_chuc_nang


class VaiTro(models.Model):
    """Model cho vai trò"""
    ten_vai_tro = models.CharField(max_length=50, unique=True)
    mo_ta = models.TextField(blank=True)
    chuc_nang = models.ManyToManyField(ChucNang, through='PhanQuyen')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'vai_tro'
        verbose_name = 'Vai trò'
        verbose_name_plural = 'Vai trò'

    def __str__(self):
        return self.ten_vai_tro


class PhanQuyen(models.Model):
    """Model cho phân quyền vai trò - chức năng"""
    vai_tro = models.ForeignKey(VaiTro, on_delete=models.CASCADE)
    chuc_nang = models.ForeignKey(ChucNang, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'phan_quyen'
        verbose_name = 'Phân quyền'
        verbose_name_plural = 'Phân quyền'
        unique_together = ['vai_tro', 'chuc_nang']

    def __str__(self):
        return f"{self.vai_tro.ten_vai_tro} - {self.chuc_nang.ten_chuc_nang}"


class NguoiDungVaiTro(models.Model):
    """Model cho phân vai trò cho người dùng"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vai_tro = models.ForeignKey(VaiTro, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'nguoi_dung_vai_tro'
        verbose_name = 'Người dùng - Vai trò'
        verbose_name_plural = 'Người dùng - Vai trò'
        unique_together = ['user', 'vai_tro']

    def __str__(self):
        return f"{self.user.username} - {self.vai_tro.ten_vai_tro}"