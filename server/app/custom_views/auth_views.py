from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import UserRateThrottle

class SuperUserLoginThrottle(UserRateThrottle):
    scope = 'superuser_login'

@api_view(['POST'])
@throttle_classes([SuperUserLoginThrottle])
def superuser_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None and user.is_superuser:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username
        })

    return Response({"error": "Invalid credentials or not a superuser"}, status=status.HTTP_401_UNAUTHORIZED)
