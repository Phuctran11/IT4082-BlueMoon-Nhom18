from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'apartments'

urlpatterns = [
    # Authentication
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/forgot-password/', views.forgot_password, name='forgot_password'),
    
    # Hộ khẩu
    path('ho-khau/', views.HoKhauListCreateView.as_view(), name='ho_khau_list'),
    path('ho-khau/<int:pk>/', views.HoKhauDetailView.as_view(), name='ho_khau_detail'),
    
    # Nhân khẩu
    path('nhan-khau/', views.NhanKhauListCreateView.as_view(), name='nhan_khau_list'),
    path('nhan-khau/<int:pk>/', views.NhanKhauDetailView.as_view(), name='nhan_khau_detail'),
    
    # Loại khoản thu
    path('loai-khoan-thu/', views.LoaiKhoanThuListCreateView.as_view(), name='loai_khoan_thu_list'),
    path('loai-khoan-thu/<int:pk>/', views.LoaiKhoanThuDetailView.as_view(), name='loai_khoan_thu_detail'),
    
    # Đợt thu
    path('dot-thu/', views.DotThuListCreateView.as_view(), name='dot_thu_list'),
    path('dot-thu/<int:pk>/', views.DotThuDetailView.as_view(), name='dot_thu_detail'),
    
    # Khoản thu
    path('khoan-thu/', views.KhoanThuListCreateView.as_view(), name='khoan_thu_list'),
    path('khoan-thu/<int:pk>/', views.KhoanThuDetailView.as_view(), name='khoan_thu_detail'),
    
    # Thanh toán
    path('thanh-toan/', views.ThanhToanListCreateView.as_view(), name='thanh_toan_list'),
    path('thanh-toan/<int:pk>/', views.ThanhToanDetailView.as_view(), name='thanh_toan_detail'),
    
    # User Management
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/<int:user_id>/lock-unlock/', views.lock_unlock_user, name='lock_unlock_user'),
    path('users/<int:user_id>/delete/', views.delete_user, name='delete_user'),
    
    # Statistics
    path('statistics/khoan-thu/', views.thong_ke_khoan_thu, name='thong_ke_khoan_thu'),
    path('statistics/nhan-khau/', views.thong_ke_nhan_khau, name='thong_ke_nhan_khau'),
    path('statistics/ho-khau/', views.thong_ke_ho_khau, name='thong_ke_ho_khau'),
    
    # Dashboard
    path('dashboard/', views.dashboard_data, name='dashboard'),
    
    # Citizen
    path('cu-dan/khoan-thu/', views.tra_cuu_khoan_thu_cu_dan, name='tra_cuu_khoan_thu_cu_dan'),
]