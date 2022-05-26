# DJANGO REACT APPLICATION

This is a boilerplate for an application using Django for the backend and React for the frontend of a web application. This displays a simple login page with a simple frontend with authentication. This is based on the tutorial from the following [site](https://testdriven.io/blog/django-spa-auth/). 

When creating web applications, there are multiple methods of authentication. One method is sessions (cookies), and another method is tokens (JWT). This sample gives a boiler for the session based authentication. This allows for DJANGO to handle backend api calls, while react is displayed and used for frontend. This provides a separation so that a frontend developer and a backend developer can work individually on each section simultaneously. 

This will likey be a good starting point for most websites that are needed. In the event a larger scale web application is required, it may be useful to look into token authentication, or one of the other session formats for cross domain authentication in the displayed website. 

It is typically recommended to use tools such as Firebase or JWT tokens for React Native applications if you wish to move the frontend to a mobile application. 

A major benefit of the curret boilerplate is the use of Django's Authentication, rather than needing to manage the authentications manually through a system such as the JWT tokens. 

## Requirements:

A requirement of this application is to create a `.env` file in the backend folder. 

This must include the `SECRET_KEY` which can be generated using the `secret_key_generator.py` file. Run as follows:

```
python3 secret_key_generator.py
```

Copy the key and add to the `.env` file as such:

```
SECRET_KEY="{ SECRET_KEY_HERE }"
```

When moving to production, add `PRODUCTION=1` to the `.env` file. 

The original code created by testdriven.io can be found [here](https://github.com/duplxey/django-spa-cookie-auth/tree/master/django_react_templates). 

## Getting Started:

In order to start using this template, perform the following to setup.

```
$ pip install -r requirements.txt
$ python manage.py migrate
$ cd frontend
$ npm install
$ npm run build
$ cd ..
$ python manage.py runserver
```

The website should then be viewable from [http://localhost:8000](http://localhost:8000)

## Updates

The original code was updated to include a sign up page. This was originally not included in the code. 

The primary dashboard page also collects all the information required and is able to display `whoami` information 
on load of the new dashboard. This can be updated further in the future to be used as the official "home page" for whatever
application is being worked on. With the current implementation, the website can't have multiple URL's. 

However, if multiple URLs are implemented, the backend code can be updated to reflect the following [code](https://github.com/duplxey/django-spa-cookie-auth/tree/master/django_react_same_origin) or a [DRF Approach](https://github.com/duplxey/django-spa-cookie-auth/tree/master/django_react_drf_same_origin).

Finally, if authentication someone wishes to authenticate once across mutliple domains, the following [code](https://github.com/duplxey/django-spa-cookie-auth/tree/master/django_react_cross_origin) would be useful. All of these codes are also found in the tutorial.