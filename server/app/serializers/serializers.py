from rest_framework import serializers
from app.models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def validate_marks(self, value):
        if not isinstance(value, int):
            raise serializers.ValidationError("Marks must be an integer.")
        if value < 0 or value > 100:
            raise serializers.ValidationError("Marks must be between 0 and 100.")
        return value

    def validate_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("Name must contain only alphabetic characters.")
        return value.capitalize()

    def validate_subject(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("Subject must contain only alphabetic characters.")
        return value.capitalize()

    def validate(self, attrs):
        user = self.context.get('request').user if 'request' in self.context else None
        name = attrs.get('name')
        subject = attrs.get('subject')
        queryset = Student.objects.filter(
            created_by=user,
            name__iexact=name,
            subject__iexact=subject
        )

        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)

        if queryset.exists():
            raise serializers.ValidationError("A student with this name and subject already exists for this user.")

        return attrs

