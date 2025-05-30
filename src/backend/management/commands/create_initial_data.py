management/commands/create_initial_data.py
from django.core.management.base import BaseCommand
from apartments.models import User, ChucNang, VaiTro, PhanQuyen

class Command(BaseCommand):
    help = 'Tạo dữ liệu khởi tạo cho hệ thống'

    def handle(self, *args, **options):
        # Tạo user admin
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@bluemoon.com',
                password='admin123',
                first_name='Admin',
                last_name='System',
                role='to_truong'
            )
            self.stdout.write('Đã tạo tài khoản admin')

        # Tạo các chức năng
        chuc_nang_list = [
            ('quan_ly_ho_khau', 'Quản lý hộ khẩu'),
            ('quan_ly_nhan_khau', 'Quản lý nhân khẩu'),
            ('quan_ly_khoan_thu', 'Quản lý khoản thu'),
            ('quan_ly_dot_thu', 'Quản lý đợt thu'),
            ('quan_ly_thanh_toan', 'Quản lý thanh toán'),
            ('quan_ly_nguoi_dung', 'Quản lý người dùng'),
            ('thong_ke_bao_cao', 'Thống kê báo cáo'),
            ('tra_cuu_thong_tin', 'Tra cứu thông tin'),
        ]

        for ma_chuc_nang, ten_chuc_nang in chuc_nang_list:
            ChucNang.objects.get_or_create(
                ma_chuc_nang=ma_chuc_nang,
                defaults={'ten_chuc_nang': ten_chuc_nang}
            )

        # Tạo vai trò
        vai_tro_list = [
            ('to_truong', 'Tổ trưởng'),
            ('to_pho', 'Tổ phó'),
            ('ke_toan', 'Kế toán'),
            ('cu_dan', 'Cư dân'),
        ]

        for ten_vai_tro, mo_ta in vai_tro_list:
            VaiTro.objects.get_or_create(
                ten_vai_tro=ten_vai_tro,
                defaults={'mo_ta': mo_ta}
            )

        self.stdout.write('Đã tạo dữ liệu khởi tạo thành công')