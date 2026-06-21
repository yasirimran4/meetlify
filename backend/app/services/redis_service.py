from core.redis import redis_client
import secrets

class RedisService:

    def set_name(self,name:str):
        redis_client.set("name",name)

    def get_name(self):
        return redis_client.get("name")
    
    def increment_views(self):
        return redis_client.incr("views:views")
    
    def generate_otp(self):
        redis_client.expire("otp" , 300)

    def send_mock_email(self,email,link):
        print(f"Here is your email : {email} and link {link}")

    def confirm_reset_password(self,token:str,new_password):
        token_storage_key = f"password_reset_token:{token}"
        print("Secure Token = ",redis_client.get(token_storage_key))

    def request_password_reset(self,email):

        rate_limit_key =  f"rate_limit:reset_password:{email}"
        rate_limit_count = redis_client.incr(rate_limit_key)

        if rate_limit_count == 1:
            redis_client.expire(rate_limit_key,36000)

        if rate_limit_count > 3:
            print("Rate imit Crossed")

        secure_token = secrets.token_urlsafe(32)
        token_storage_key = f"password_reset_token:{secure_token}"

        redis_client.setex(name=token_storage_key,time=900,value=secure_token)

        reset_link = f"https://meetlify.com/{secure_token}"

        self.send_mock_email(email=email,link=reset_link)
        self.confirm_reset_password(secure_token,"56789")


redis_service=RedisService()         