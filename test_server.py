import unittest
from server import app

class TestServer(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_send_email_success(self):
        payload = {
            "recipientEmail": "test@example.com",
            "subject": "Test Subject",
            "text": "This is a test email.",
            "attachment": "Test,Data\nRow1,Value1\nRow2,Value2"
        }
        response = self.app.post('/send-email', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Correo enviado exitosamente", response.get_json().get("message"))

    def test_send_email_missing_fields(self):
        payload = {
            "recipientEmail": "test@example.com",
            "subject": "Test Subject",
            "text": "This is a test email."
        }
        response = self.app.post('/send-email', json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Faltan datos requeridos", response.get_json().get("error"))

    def test_send_email_invalid_email(self):
        payload = {
            "recipientEmail": "",
            "subject": "Test Subject",
            "text": "This is a test email.",
            "attachment": "Test,Data\nRow1,Value1\nRow2,Value2"
        }
        response = self.app.post('/send-email', json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Faltan datos requeridos", response.get_json().get("error"))

if __name__ == '__main__':
    unittest.main()
