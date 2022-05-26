import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from django.core.validators import validate_email

@require_POST
def login_view(request):
    """
    Login new user 

    :param request: request information 
    :return: return JSON response
    """
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in.'})



def normalize_email(email):
    """
    Normalazing email addres. An email address
    has following properties:
    1) It is case-insensitive
    2) "." characters on username part of email address is ommited.
    For instance foobar@gmail.com and foo.bar@gmail.com are the
    same address.
    3) Anything after "+" sign is ommited. foo@gmail.com and
    foo+bar@gmail.com are same email address.
    This code does not really validate email address. Make sure given
    string is a valid email address before using this.
    If You are using django you can use
    django.core.validators.validate_email
    for validation.
    """
    # remove spaces at start and end of the and lowercase email address
    email = email.strip().lower()
    # split email into username and domain information
    username, domain = email.split('@')
    # remove . characters from username
    username = username.replace('.', '')
    #remove everything after +
    username = username.split('+')[0]

    return "%s@%s" % (username, domain)


def check_username(username):
    """
    Ensure username not already exists

    :param username: username
    :type username: str
    :return: return true if username exists, else false 
    :rtype: bool
    """
    return User.objects.filter(username=username).exists()


def check_password_strength(passwrd):
    """
    Ensure password is good strength 

    :param passwrd: password to be checked 
    :type passwrd: str
    :return: return 0 if good strength, else return a different value
    :rtype: int
    """
    MIN_LENGTH = 8
    if len(passwrd) < MIN_LENGTH:
        # ensure password length is good 
        return 1
    
    if not any(char.isdigit() for char in passwrd):
        # Must contain digit 
        return 2
    
    if not any(char.isalpha() for char in passwrd):
        # Must contain characters 
        return 3
    
    if all(char.isalnum() for char in passwrd):
        # Must contain one special character
        return 4 
    
    return 0

@require_POST
def register_view(request):
    """
    Register a new user 

    :param request: request information
    :return: return the JSON response 
    """
    # register new user 
    if request.method == 'POST':
        # ensure only post request 
        print('Registering...')
        data = json.loads(request.body)
        username = data.get('username')
        password1 = data.get('password1')
        password2 = data.get('password2')
        email = data.get('email')
        
        print('Loaded all data...')
        
        if username is None:
            # validate username
            print('Bad Username')
            return JsonResponse({'detail': 'Must create username.'}, status=200)
        
        if check_username(username):
            # ensure username does not already exist
            print('username exists')
            return JsonResponse({'detail': 'Username already exists.'}, status=200)
            
        
        if email is None:
            # check email exists
            print('Email failed')
            return JsonResponse({'detail': 'Must enter email.'}, status=200)
        
        try:
            # validate the email is an email
            validate_email(email)
            email = normalize_email(email)
        except Exception as e:
            print('validation failed')
            return JsonResponse({'detail': 'Must be a valid email'}, status=200)
        
        if password1 is None:
            # validate password 
            print('Bad password')
            return JsonResponse({'detail': 'Must create password'}, status=200)
        
        if password1 != password2:
            # ensure passwords match 
            print('Password does not match')
            return JsonResponse({'detail': 'Passwords must match'}, status=200)
        
        check_passwrd_str = check_password_strength(password1)
        print('Checking password strength')
        # ensure the password strength is high enough
        if check_passwrd_str == 1:
            return JsonResponse({'detail': 'Password must have at least 8 characters.'}, status=200)
        elif check_passwrd_str == 2:
            return JsonResponse({'detail': 'Password must contain at least one number'}, status=200)
        elif check_passwrd_str == 3:
            return JsonResponse({'detail': 'Password must contain at least one alphabetical character'}, status=200)
        elif check_passwrd_str == 4:
            return JsonResponse({'detail': 'Password must contain at least one non-alphanumeric character (!, _, @, etc...)'}, status=200)
        
        print('Verified all data')
        
        # create new user 
        new_user = User.objects.create_user(username=username, email=email)
        new_user.set_password(password1)
        new_user.save()
        
        print('Created new user')
        
        return JsonResponse({'detail': 'Successfully registered'}, status=200)
        
    print('Not a POST request')
    return JsonResponse({'detail': "Only POST requests allowed"}, status=400)
    
def logout_view(request):
    """
    Logout of website 

    :param request: request
    :return: return Json Response
    """
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})


@ensure_csrf_cookie
def session_view(request):
    """
    Session view 

    :param request: request 
    :return: Return if is authenticated or not 
    """
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'isAuthenticated': True})


def whoami_view(request):
    """
    Return the user information 

    :param request: request information
    :type request: _type_
    :return: return who is the user if they exist, else not authenticated 
    """
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'username': request.user.username})