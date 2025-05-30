from django.contrib import admin
from .models import User, HoKhau, NhanKhau, KhoanThu, DotThu, LoaiKhoanThu, ThanhToan

admin.site.register(User)
admin.site.register(HoKhau)
admin.site.register(NhanKhau)
admin.site.register(KhoanThu)
admin.site.register(DotThu)
admin.site.register(LoaiKhoanThu)
admin.site.register(ThanhToan)
