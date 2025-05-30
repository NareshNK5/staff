from rest_framework import serializers
from ..models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'subject', 'marks', 'created_by']
        read_only_fields = ['created_by']
