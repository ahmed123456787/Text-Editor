from django.db import models
from django.contrib.auth.models import UserManager, AbstractBaseUser,PermissionsMixin
from django.db.models import JSONField
from multiselectfield import MultiSelectField


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
    content = JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    current_version = models.IntegerField(default=1)
   
    def __str__(self):
        return self.title


class OperationalLog(models.Model):
    CHOICES = (
        ('insert', 'Insert'),
        ('delete', 'Delete'),
        ('undo', 'Undo'),
        ('redo', 'Redo'),
        ('image_insert', 'Image Insert'),
        ('image_delete', 'Image Delete')
    )

    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='logs')
    operation = models.CharField(max_length=255, choices=CHOICES)
    version = models.IntegerField(default=1)
    updated_content = JSONField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    position = models.IntegerField(null=True, blank=True)
    operation_data = JSONField(null=True, blank=True)

    class Meta:
        ordering = ['version']

    def __str__(self):
        return f"{self.document.title} - v{self.version} - {self.operation}"

    @staticmethod
    def create_log(document, operation, position=None, operation_data=None, updated_content=None):
        """
        Helper method to create an OperationalLog entry.
        """
        return OperationalLog.objects.create(
            document=document,
            operation=operation,
            version=document.current_version + 1,
            position=position,
            operation_data=operation_data,
            updated_content=updated_content
        )
    

class DocumentAccessToken(models.Model):
    PERMISSIONS = (
        ('read', 'Read'),
        ('write', 'Write'),
    )
    document = models.OneToOneField(Document, on_delete=models.CASCADE)
    shared_id = models.CharField(max_length=10, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    permissions = MultiSelectField(choices=PERMISSIONS)


    def __str__(self):
        return f"{self.shared_id}"