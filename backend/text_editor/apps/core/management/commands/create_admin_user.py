from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a superuser for CI/CD pipeline'

    def handle(self, *args, **kwargs):
        email = 'admin@gmail.com'
        password = 'admin123'

        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Superuser {email} created successfully'))
        else:
            self.stdout.write(self.style.WARNING(f'Superuser {email} already exists'))