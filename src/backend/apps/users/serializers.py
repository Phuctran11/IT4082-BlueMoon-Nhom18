from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'role', 'phone', 'is_active_account', 'created_at']
        read_only_fields = ['id', 'created_at']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active_account:
                    raise serializers.ValidationError("Tài khoản đã bị khóa.")
                data['user'] = user
            else:
                raise serializers.ValidationError("Thông tin đăng nhập không chính xác.")
        else:
            raise serializers.ValidationError("Vui lòng nhập đầy đủ thông tin.")
        
        return data

class HoKhauSerializer(serializers.ModelSerializer):
    so_thanh_vien = serializers.SerializerMethodField()
    
    class Meta:
        model = HoKhau
        fields = '__all__'
        
    def get_so_thanh_vien(self, obj):
        return obj.thanh_vien.count()

class NhanKhauSerializer(serializers.ModelSerializer):
    ho_khau_info = serializers.SerializerMethodField()
    
    class Meta:
        model = NhanKhau
        fields = '__all__'
        
    def get_ho_khau_info(self, obj):
        return {
            'ma_ho_khau': obj.ho_khau.ma_ho_khau,
            'chu_ho': obj.ho_khau.chu_ho
        }

class LoaiKhoanThuSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoaiKhoanThu
        fields = '__all__'

class DotThuSerializer(serializers.ModelSerializer):
    nguoi_tao_name = serializers.SerializerMethodField()
    tong_khoan_thu = serializers.SerializerMethodField()
    
    class Meta:
        model = DotThu
        fields = '__all__'
        
    def get_nguoi_tao_name(self, obj):
        return obj.nguoi_tao.first_name + ' ' + obj.nguoi_tao.last_name if obj.nguoi_tao else ''
        
    def get_tong_khoan_thu(self, obj):
        return obj.khoan_thu.count()

class KhoanThuSerializer(serializers.ModelSerializer):
    ho_khau_info = serializers.SerializerMethodField()
    loai_khoan_thu_info = serializers.SerializerMethodField()
    trang_thai_thanh_toan = serializers.SerializerMethodField()
    so_tien_da_thu = serializers.SerializerMethodField()
    
    class Meta:
        model = KhoanThu
        fields = '__all__'
        
    def get_ho_khau_info(self, obj):
        return {
            'ma_ho_khau': obj.ho_khau.ma_ho_khau,
            'chu_ho': obj.ho_khau.chu_ho,
            'so_can_ho': obj.ho_khau.so_can_ho
        }
        
    def get_loai_khoan_thu_info(self, obj):
        return {
            'ten_loai': obj.loai_khoan_thu.ten_loai,
            'don_vi_tinh': obj.loai_khoan_thu.don_vi_tinh
        }
        
    def get_trang_thai_thanh_toan(self, obj):
        thanh_toan = obj.thanh_toan.first()
        return thanh_toan.trang_thai if thanh_toan else 'chua_thanh_toan'
        
    def get_so_tien_da_thu(self, obj):
        thanh_toan = obj.thanh_toan.first()
        return thanh_toan.so_tien_da_thu if thanh_toan else 0

class ThanhToanSerializer(serializers.ModelSerializer):
    khoan_thu_info = serializers.SerializerMethodField()
    nguoi_thu_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ThanhToan
        fields = '__all__'
        
    def get_khoan_thu_info(self, obj):
        return {
            'ho_khau': obj.khoan_thu.ho_khau.ma_ho_khau,
            'loai_thu': obj.khoan_thu.loai_khoan_thu.ten_loai,
            'thanh_tien': obj.khoan_thu.thanh_tien
        }
        
    def get_nguoi_thu_name(self, obj):
        return obj.nguoi_thu.first_name + ' ' + obj.nguoi_thu.last_name if obj.nguoi_thu else ''

class ChucNangSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChucNang
        fields = '__all__'

class VaiTroSerializer(serializers.ModelSerializer):
    chuc_nang_list = ChucNangSerializer(source='chuc_nang', many=True, read_only=True)
    
    class Meta:
        model = VaiTro
        fields = '__all__'