from django.db import models
from django.contrib.auth.models import UserManager, AbstractBaseUser,PermissionsMixin


class CustomeUserManager(UserManager):

    def create_user(self, email,password, **extra_fields):
        
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        
        return user
    
    def create_superuser(self, email, password, **extra_fields):

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(email, password, **extra_fields)
    

class CustomUser(AbstractBaseUser,PermissionsMixin):
    
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    objects = CustomeUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
       
    def __str__(self):
        return self.email    
    

class Document(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
   
    def __str__(self):
        return self.title

class OperationalLog(models.Model):

    CHOICES = (
        ('insert','Insert'),
        ('delete','Delete')
    )
    document = models.ForeignKey(Document, on_delete=models.CASCADE,related_name='logs')
    operation = models.CharField(max_length=255,choices=CHOICES)
    version = models.IntegerField(default=1)
    updated_content = models.TextField()

    def save(self, *args, **kwargs):
        if self.pk:
            self.version += 1
        super().save(*args, **kwargs)