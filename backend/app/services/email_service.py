# from email.message import EmailMessage
# import aiosmtplib
# from core.config import settings

# class EmailService:
#     async def send_email(self,email_to,subject:str,body:str):
#         message = EmailMessage()
#         message["From"] = settings.EMAIL_FROM
#         message["To"] = email_to
#         message["Subject"] = subject
#         message.add_alternative(body,subtype="html")

#         await aiosmtplib.send(message,hostname=settings.SMTP_HOST,password=settings.SMTP_PASSWORD,port=int(settings.SMTP_PORT),username=settings.SMTP_USERNAME,start_tls=True,timeout=30)

# email_service = EmailService()        