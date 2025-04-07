# Generated by Django 5.2 on 2025-04-06 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0003_task_due_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='category',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='task',
            name='progress',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='task',
            name='recurrence',
            field=models.CharField(choices=[('None', 'None'), ('Daily', 'Daily'), ('Weekly', 'Weekly'), ('Monthly', 'Monthly')], default='None', max_length=10),
        ),
    ]
