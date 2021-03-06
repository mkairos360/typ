# Generated by Django 4.0.1 on 2022-03-19 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_alter_user_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='course_group',
            field=models.CharField(choices=[('day', 'Day'), ('evening', 'Evening'), ('weekend', 'Weekend')], default='day', max_length=30),
        ),
        migrations.AlterField(
            model_name='student',
            name='level',
            field=models.CharField(choices=[('100', 'Level 100'), ('200', 'Level 200'), ('300', 'Level 300'), ('400', 'Level 400'), ('600', 'Level 600'), ('700', 'Level 700'), ('800', 'Level 800')], max_length=30),
        ),
    ]
