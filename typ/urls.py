from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from accounts.views import login_student, logout_student, register_student, student_profile_create, login_qadmin
from qasa_app.views import send_ux_email

urlpatterns = [
                  path('send_ux_email/', send_ux_email, name='send_ux_email'),
                  path('admin/', admin.site.urls),
                  path('', include('core.urls')),
                  path('accounts/', include('django.contrib.auth.urls')),
                  path('register', register_student, name="register_student"),
                  path('login-qadmin', login_qadmin, name="login_qadmin"),

                  path('evaluation-admin/', include('qasa_app.urls')),
                  path('profile/student/<int:pk>/create', student_profile_create, name="student_profile_create"),

                  # path('__debug__/', include('debug_toolbar.urls')),

              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

handler404 = "pages.views.page_not_found_view"