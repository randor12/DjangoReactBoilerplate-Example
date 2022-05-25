from django.test import TestCase
from api.views import check_password_strength

# Create your tests here.

class CheckPasswordStrengthTest(TestCase):
    
    def setUp(self):
        self.passwrd1 = 'g00dp@sswrd!'
        self.passwrd2 = 'notgoodpassword'
        self.passwrd3 = '12345678'
        self.passwrd4 = 'toosml'
        self.passwrd5 = 'abcd1234'
        
    def test_good(self):
        """
        Assert works
        """
        val = check_password_strength(self.passwrd1)
        assert val == 0
        
    def test_no_nums(self):
        val = check_password_strength(self.passwrd2)
        assert val == 2
        
    def test_no_letters(self):
        val = check_password_strength(self.passwrd3)
        assert val == 3
        
    def test_too_short(self):
        val = check_password_strength(self.passwrd4)
        assert val == 1
        
    def test_no_unique_chars(self):
        val = check_password_strength(self.passwrd5)
        assert val == 4