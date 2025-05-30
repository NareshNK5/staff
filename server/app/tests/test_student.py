from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from app.models import Student

class StudentTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(username='admin', password='pass')
        self.client.login(username='admin', password='pass')

    def test_create_student(self):
        self.client.force_authenticate(user=self.user)
        data = {"name": "John", "subject": "Math", "marks": 90}
        response = self.client.post("/api/students/", data)
        self.assertEqual(response.status_code, 201)
