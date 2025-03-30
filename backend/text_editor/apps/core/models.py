from django.db import models
from django.contrib.auth.models import UserManager, AbstractBaseUser,PermissionsMixin
from django.db.models import JSONField


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
    current_version = models.IntegerField(default=1)
   
    def __str__(self):
        return self.title

    def reconstruct_content(self, target_version=None):
        """
        Reconstruct document content using the logs up to a specific version.
        If target_version is None, it will reconstruct to the latest version.
        """
        # Start with the base content from the most recent version
        if not target_version:
            # Return current content if no target version specified
            return self.content
            
        # Get the log entries in chronological order
        base_logs = self.logs.filter(is_base_version=True).order_by('-version')
        
        if not base_logs.exists():
            return self.content

        # Find the appropriate base version to start with
        base_log = None
        for log in base_logs:
            if log.version <= target_version:
                base_log = log
                break
                
        if not base_log:
            return ""  # No base version found
            
        # Start with the base content
        reconstructed_content = base_log.updated_content
        
        # Apply all operations after the base version up to the target version
        operations = self.logs.filter(
            version__gt=base_log.version,
            version__lte=target_version,
            is_base_version=False
        ).order_by('version')
        
        for op in operations:
            if op.operation == 'insert':
                # For insert operations, apply the changes
                op_data = op.operation_data
                reconstructed_content = reconstructed_content[:op_data['position']] + op_data['text'] + reconstructed_content[op_data['position']:]
            elif op.operation == 'delete':
                # For delete operations, apply the changes
                op_data = op.operation_data
                start = op_data['position']
                end = start + op_data['length']
                reconstructed_content = reconstructed_content[:start] + reconstructed_content[end:]
                
        return reconstructed_content


class OperationalLog(models.Model):
    CHOICES = (
        ('insert','Insert'),
        ('delete','Delete'),
        ('undo','Undo')  # Add undo operation type
    )

    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='logs')
    operation = models.CharField(max_length=255, choices=CHOICES)
    version = models.IntegerField(default=1)
    updated_content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    position = models.IntegerField()

    class Meta:
        ordering = ['version']

    def __str__(self):
        return f"{self.document.title} - v{self.version} - {self.operation}"