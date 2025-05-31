from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from app.models import Student
from rest_framework import status

class StudentTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(username='admin', password='pass')
        self.client.force_authenticate(user=self.user)
        self.url = "/api/students/"

    def test_create_student_success(self):
        data = {"name": "Arun", "subject": "Math", "marks": 90}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.count(), 1)

    def test_create_student_duplicate(self):
        Student.objects.create(name="Arun", subject="Math", marks=90, created_by=self.user)
        data = {"name": "Arun", "subject": "Math", "marks": 85}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_student_invalid_marks(self):
        data = {"name": "Kavi", "subject": "Science", "marks": "ninety"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_student_missing_fields(self):
        data = {"name": "Kavi"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_student_negative_marks(self):
        data = {"name": "Bob", "subject": "History", "marks": -10}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_students_list(self):
        Student.objects.create(name="Eva", subject="English", marks=75, created_by=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("results" in response.data)
        self.assertGreaterEqual(len(response.data["results"]), 1)

    def test_unauthorized_post(self):
        self.client.force_authenticate(user=None)
        data = {"name": "Arun", "subject": "Math", "marks": 90}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_get(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_student(self):
        student = Student.objects.create(name="Liam", subject="Science", marks=80, created_by=self.user)
        update_data = {"name": "Liam", "subject": "Science", "marks": 95}
        response = self.client.put(f"{self.url}{student.id}/", update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["marks"], 95)

    def test_delete_student(self):
        student = Student.objects.create(name="Mia", subject="Biology", marks=88, created_by=self.user)
        response = self.client.delete(f"{self.url}{student.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Student.objects.count(), 0)

    def test_update_student_unauthorized(self):
        student = Student.objects.create(name="Noah", subject="Physics", marks=70, created_by=self.user)
        self.client.force_authenticate(user=None)
        update_data = {"name": "Noah", "subject": "Physics", "marks": 100}
        response = self.client.put(f"{self.url}{student.id}/", update_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
