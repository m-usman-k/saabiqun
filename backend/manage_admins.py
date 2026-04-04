import sys
import os
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_admin(username, password):
    db = SessionLocal()
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        print(f"Error: User '{username}' already exists.")
        return
    
    new_user = User(
        username=username,
        hashed_password=pwd_context.hash(password),
        is_admin=True
    )
    db.add(new_user)
    db.commit()
    print(f"Successfully created admin: {username}")
    db.close()

def delete_admin(username):
    db = SessionLocal()
    user = db.query(User).filter(User.username == username).first()
    if not user:
        print(f"Error: User '{username}' not found.")
        return
    
    db.delete(user)
    db.commit()
    print(f"Successfully deleted admin: {username}")
    db.close()

def change_password(username, new_password):
    db = SessionLocal()
    user = db.query(User).filter(User.username == username).first()
    if not user:
        print(f"Error: User '{username}' not found.")
        return
    
    user.hashed_password = pwd_context.hash(new_password)
    db.commit()
    print(f"Successfully changed password for: {username}")
    db.close()

def list_admins():
    db = SessionLocal()
    admins = db.query(User).filter(User.is_admin == True).all()
    print("Admin accounts:")
    for admin in admins:
        print(f"- {admin.username}")
    db.close()

def remove_all():
    db = SessionLocal()
    db.query(User).delete()
    db.commit()
    print("Successfully deleted all accounts.")
    db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python manage_admins.py [create|delete|passwd|list|clear_all] [username] [password]")
        sys.exit(1)
    
    action = sys.argv[1]
    
    if action == "create" and len(sys.argv) == 4:
        create_admin(sys.argv[2], sys.argv[3])
    elif action == "delete" and len(sys.argv) == 3:
        delete_admin(sys.argv[2])
    elif action == "passwd" and len(sys.argv) == 4:
        change_password(sys.argv[2], sys.argv[3])
    elif action == "list":
        list_admins()
    elif action == "clear_all":
        confirm = input("Are you sure you want to delete ALL users? (y/n): ")
        if confirm.lower() == 'y':
            remove_all()
    else:
        print("Invalid command or arguments.")
