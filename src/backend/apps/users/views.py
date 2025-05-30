from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.db.models import Q, Sum, Count
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import datetime, timedelta
import uuid

from .models import *
from .serializers import *

class IsToTruongOrToPho(permissions.BasePermission):
    """Permission cho tổ trưởng và tổ phó"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['to_truong', 'to_pho']

class IsKeToan(permissions.BasePermission):
    """Permission cho kế toán"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ke_toan'

class IsKeToanOrToTruongOrToPho(permissions.BasePermission):
    """Permission cho kế toán, tổ trưởng và tổ phó"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['ke_toan', 'to_truong', 'to_pho']

# Authentication Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """API đăng nhập"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        login(request, user)
        
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'message': 'Đăng nhập thành công'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    """API đăng xuất"""
    if request.user.is_authenticated:
        Token.objects.filter(user=request.user).delete()
        logout(request)
    return Response({'message': 'Đăng xuất thành công'})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def forgot_password(request):
    """API quên mật khẩu"""
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        token = str(uuid.uuid4())
        user.password_reset_token = token
        user.token_expires_at = timezone.now() + timedelta(hours=24)
        user.save()
        
        # Gửi email (cần cấu hình SMTP)
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{token}"
        send_mail(
            'Khôi phục mật khẩu - BlueMoon Apartment',
            f'Vui lòng click vào link sau để khôi phục mật khẩu: {reset_link}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        return Response({'message': 'Email khôi phục mật khẩu đã được gửi'})
    except User.DoesNotExist:
        return Response({'error': 'Email không tồn tại'}, status=status.HTTP_404_NOT_FOUND)

# Hộ khẩu Views
class HoKhauListCreateView(generics.ListCreateAPIView):
    """API danh sách và tạo hộ khẩu"""
    queryset = HoKhau.objects.all()
    serializer_class = HoKhauSerializer
    permission_classes = [IsToTruongOrToPho]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(ma_ho_khau__icontains=search) |
                Q(chu_ho__icontains=search) |
                Q(so_can_ho__icontains=search)
            )
        return queryset.order_by('-created_at')

class HoKhauDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API chi tiết, cập nhật và xóa hộ khẩu"""
    queryset = HoKhau.objects.all()
    serializer_class = HoKhauSerializer
    permission_classes = [IsToTruongOrToPho]

# Nhân khẩu Views
class NhanKhauListCreateView(generics.ListCreateAPIView):
    """API danh sách và tạo nhân khẩu"""
    queryset = NhanKhau.objects.all()
    serializer_class = NhanKhauSerializer
    permission_classes = [IsToTruongOrToPho]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        ho_khau_id = self.request.query_params.get('ho_khau', None)
        
        if search:
            queryset = queryset.filter(
                Q(ho_ten__icontains=search) |
                Q(cccd__icontains=search)
            )
        if ho_khau_id:
            queryset = queryset.filter(ho_khau_id=ho_khau_id)
            
        return queryset.order_by('-created_at')

class NhanKhauDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API chi tiết, cập nhật và xóa nhân khẩu"""
    queryset = NhanKhau.objects.all()
    serializer_class = NhanKhauSerializer
    permission_classes = [IsToTruongOrToPho]

# Loại khoản thu Views
class LoaiKhoanThuListCreateView(generics.ListCreateAPIView):
    """API danh sách và tạo loại khoản thu"""
    queryset = LoaiKhoanThu.objects.all()
    serializer_class = LoaiKhoanThuSerializer
    permission_classes = [IsKeToan]

class LoaiKhoanThuDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API chi tiết, cập nhật và xóa loại khoản thu"""
    queryset = LoaiKhoanThu.objects.all()
    serializer_class = LoaiKhoanThuSerializer
    permission_classes = [IsKeToan]

# Đợt thu Views
class DotThuListCreateView(generics.ListCreateAPIView):
    """API danh sách và tạo đợt thu"""
    queryset = DotThu.objects.all()
    serializer_class = DotThuSerializer
    permission_classes = [IsKeToanOrToTruongOrToPho]
    
    def perform_create(self, serializer):
        if self.request.user.role == 'ke_toan':
            serializer.save(nguoi_tao=self.request.user)
        else:
            return Response({'error': 'Chỉ kế toán mới có quyền tạo đợt thu'}, 
                          status=status.HTTP_403_FORBIDDEN)

class DotThuDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API chi tiết, cập nhật và xóa đợt thu"""
    queryset = DotThu.objects.all()
    serializer_class = DotThuSerializer
    permission_classes = [IsKeToanOrToTruongOrToPho]
    
    def perform_update(self, serializer):
        if self.request.user.role != 'ke_toan':
            return Response({'error': 'Chỉ kế toán mới có quyền sửa đợt thu'}, 
                          status=status.HTTP_403_FORBIDDEN)
        serializer.save()

# Khoản thu Views
class KhoanThuListCreateView(generics.ListCreateAPIView):
    """API danh sách và tạo khoản thu"""
    queryset = KhoanThu.objects.all()
    serializer_class = KhoanThuSerializer
    permission_classes = [IsKeToanOrToTruongOrToPho]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        dot_thu_id = self.request.query_params.get('dot_thu', None)
        ho_khau_id = self.request.query_params.get('ho_khau', None)
        
        if dot_thu_id:
            queryset = queryset.filter(dot_thu_id=dot_thu_id)
        if ho_khau_id:
            queryset = queryset.filter(ho_khau_id=ho_khau_id)
            
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        if self.request.user.role != 'ke_toan':
            return Response({'error': 'Chỉ kế toán mới có quyền tạo khoản thu'}, 
                          status=status.HTTP_403_FORBIDDEN)
        serializer.save()

class KhoanThuDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API chi tiết, cập nhật và xóa khoản thu"""
    queryset = KhoanThu.objects.all()
    serializer_class = KhoanThuSerializer
    permission_classes = [IsKeToanOrToTruongOrToPho]
    
    def perform_update(self, serializer):
        if self.request.user.role != 'ke_toan':
            return Response({'error': 'Chỉ kế toán mới có quyền sửa khoản thu'}, 
                          status=status.HTTP_403_FORBIDDEN)
        serializer.save()

# Thanh toán Views
class ThanhToanListCreateView(generics.ListCreateAPIView):
    """API danh sách và tạo thanh toán"""
    queryset = ThanhToan.objects.all()
    serializer_class = ThanhToanSerializer
    permission_classes = [IsKeToan]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        khoan_thu_id = self.request.query_params.get('khoan_thu', None)
        trang_thai = self.request.query_params.get('trang_thai', None)
        
        if khoan_thu_id:
            queryset = queryset.filter(khoan_thu_id=khoan_thu_id)
        if trang_thai:
            queryset = queryset.filter(trang_thai=trang_thai)
            
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(nguoi_thu=self.request.user)

class ThanhToanDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API chi tiết, cập nhật và xóa thanh toán"""
    queryset = ThanhToan.objects.all()
    serializer_class = ThanhToanSerializer
    permission_classes = [IsKeToan]

# User Management Views
class UserListView(generics.ListAPIView):
    """API danh sách người dùng"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsToTruongOrToPho]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        role = self.request.query_params.get('role', None)
        
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )
        if role:
            queryset = queryset.filter(role=role)
            
        return queryset.order_by('-created_at')

@api_view(['POST'])
@permission_classes([IsToTruongOrToPho])
def lock_unlock_user(request, user_id):
    """API khóa/mở khóa tài khoản người dùng"""
    try:
        user = User.objects.get(id=user_id)
        action = request.data.get('action')  # 'lock' or 'unlock'
        
        if action == 'lock':
            user.is_active_account = False
            message = f'Đã khóa tài khoản {user.username}'
        elif action == 'unlock':
            user.is_active_account = True
            message = f'Đã mở khóa tài khoản {user.username}'
        else:
            return Response({'error': 'Action không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)
            
        user.save()
        return Response({'message': message})
        
    except User.DoesNotExist:
        return Response({'error': 'Người dùng không tồn tại'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsToTruongOrToPho])
def delete_user(request, user_id):
    """API xóa tài khoản người dùng"""
    try:
        user = User.objects.get(id=user_id)
        username = user.username
        user.delete()
        return Response({'message': f'Đã xóa tài khoản {username}'})
        
    except User.DoesNotExist:
        return Response({'error': 'Người dùng không tồn tại'}, status=status.HTTP_404_NOT_FOUND)

# Statistics Views
@api_view(['GET'])
@permission_classes([IsKeToanOrToTruongOrToPho])
def thong_ke_khoan_thu(request):
    """API thống kê khoản thu"""
    dot_thu_id = request.query_params.get('dot_thu')
    
    if dot_thu_id:
        # Thống kê theo đợt thu cụ thể
        khoan_thu_list = KhoanThu.objects.filter(dot_thu_id=dot_thu_id)
    else:
        # Thống kê tổng quan
        khoan_thu_list = KhoanThu.objects.all()
    
    # Tính toán thống kê
    tong_khoan_thu = khoan_thu_list.count()
    tong_tien_phai_thu = khoan_thu_list.aggregate(Sum('thanh_tien'))['thanh_tien__sum'] or 0
    
    # Thống kê theo trạng thái thanh toán
    da_thu_full = ThanhToan.objects.filter(
        khoan_thu__in=khoan_thu_list,
        trang_thai='da_thanh_toan'
    ).count()
    
    chua_thu = ThanhToan.objects.filter(
        khoan_thu__in=khoan_thu_list,
        trang_thai='chua_thanh_toan'
    ).count()
    
    thu_1_phan = ThanhToan.objects.filter(
        khoan_thu__in=khoan_thu_list,
        trang_thai='thanh_toan_1_phan'
    ).count()
    
    tong_tien_da_thu = ThanhToan.objects.filter(
        khoan_thu__in=khoan_thu_list
    ).aggregate(Sum('so_tien_da_thu'))['so_tien_da_thu__sum'] or 0
    
    return Response({
        'tong_khoan_thu': tong_khoan_thu,
        'tong_tien_phai_thu': tong_tien_phai_thu,
        'tong_tien_da_thu': tong_tien_da_thu,
        'tong_tien_con_lai': tong_tien_phai_thu - tong_tien_da_thu,
        'da_thu_full': da_thu_full,
        'chua_thu': chua_thu,
        'thu_1_phan': thu_1_phan,
        'ty_le_hoan_thanh': round((da_thu_full / tong_khoan_thu * 100), 2) if tong_khoan_thu > 0 else 0
    })

@api_view(['GET'])
@permission_classes([IsToTruongOrToPho])
def thong_ke_nhan_khau(request):
    """API thống kê nhân khẩu"""
    tong_nhan_khau = NhanKhau.objects.count()
    nam = NhanKhau.objects.filter(gioi_tinh='nam').count()
    nu = NhanKhau.objects.filter(gioi_tinh='nu').count()
    tam_tru = NhanKhau.objects.filter(tam_tru=True).count()
    tam_vang = NhanKhau.objects.filter(tam_vang=True).count()
    
    # Thống kê theo độ tuổi
    hom_nay = timezone.now().date()
    tre_em = NhanKhau.objects.filter(
        ngay_sinh__gte=hom_nay - timedelta(days=18*365)
    ).count()
    
    nguoi_lon = NhanKhau.objects.filter(
        ngay_sinh__lt=hom_nay - timedelta(days=18*365),
        ngay_sinh__gte=hom_nay - timedelta(days=60*365)
    ).count()
    
    nguoi_gia = NhanKhau.objects.filter(
        ngay_sinh__lt=hom_nay - timedelta(days=60*365)
    ).count()
    
    return Response({
        'tong_nhan_khau': tong_nhan_khau,
        'nam': nam,
        'nu': nu,
        'tam_tru': tam_tru,
        'tam_vang': tam_vang,
        'tre_em': tre_em,
        'nguoi_lon': nguoi_lon,
        'nguoi_gia': nguoi_gia
    })

@api_view(['GET'])
@permission_classes([IsToTruongOrToPho])
def thong_ke_ho_khau(request):
    """API thống kê hộ khẩu"""
    tong_ho_khau = HoKhau.objects.count()
    
    # Thống kê theo số thành viên
    ho_khau_stats = HoKhau.objects.annotate(
        so_thanh_vien=Count('thanh_vien')
    ).values('so_thanh_vien').annotate(
        so_luong=Count('id')
    ).order_by('so_thanh_vien')
    
    return Response({
        'tong_ho_khau': tong_ho_khau,
        'phan_bo_theo_thanh_vien': list(ho_khau_stats)
    })

# Dashboard Views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_data(request):
    """API dữ liệu dashboard theo vai trò"""
    user = request.user
    data = {}
    
    if user.role in ['to_truong', 'to_pho']:
        data.update({
            'tong_ho_khau': HoKhau.objects.count(),
            'tong_nhan_khau': NhanKhau.objects.count(),
            'dot_thu_dang_hoat_dong': DotThu.objects.filter(trang_thai='dang_thu').count(),
        })
    
    if user.role == 'ke_toan':
        data.update({
            'tong_khoan_thu_thang': KhoanThu.objects.filter(
                created_at__month=timezone.now().month
            ).count(),
            'tong_tien_thu_thang': ThanhToan.objects.filter(
                created_at__month=timezone.now().month
            ).aggregate(Sum('so_tien_da_thu'))['so_tien_da_thu__sum'] or 0,
            'dot_thu_dang_hoat_dong': DotThu.objects.filter(trang_thai='dang_thu').count(),
        })
    
    if user.role == 'cu_dan':
        # Tìm hộ khẩu của cư dân (giả sử username = ma_ho_khau hoặc có liên kết)
        try:
            ho_khau = HoKhau.objects.get(ma_ho_khau=user.username)
            khoan_thu_chua_dong = KhoanThu.objects.filter(
                ho_khau=ho_khau,
                thanh_toan__trang_thai__in=['chua_thanh_toan', 'thanh_toan_1_phan']
            ).count()
            
            data.update({
                'thong_tin_ho_khau': HoKhauSerializer(ho_khau).data,
                'khoan_thu_chua_dong': khoan_thu_chua_dong,
            })
        except HoKhau.DoesNotExist:
            data.update({'message': 'Không tìm thấy thông tin hộ khẩu'})
    
    return Response(data)

# Citizen Views (Cư dân)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def tra_cuu_khoan_thu_cu_dan(request):
    """API tra cứu khoản thu cho cư dân"""
    if request.user.role != 'cu_dan':
        return Response({'error': 'Chỉ cư dân mới có quyền tra cứu'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    try:
        ho_khau = HoKhau.objects.get(ma_ho_khau=request.user.username)
        khoan_thu_list = KhoanThu.objects.filter(ho_khau=ho_khau).order_by('-created_at')
        
        dot_thu_id = request.query_params.get('dot_thu')
        if dot_thu_id:
            khoan_thu_list = khoan_thu_list.filter(dot_thu_id=dot_thu_id)
        
        serializer = KhoanThuSerializer(khoan_thu_list, many=True)
        return Response(serializer.data)
        
    except HoKhau.DoesNotExist:
        return Response({'error': 'Không tìm thấy thông tin hộ khẩu'}, 
                       status=status.HTTP_404_NOT_FOUND)