from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

app = Flask(__name__)
CORS(app)

EMAIL_ADDRESS = "pronostico936@gmail.com"
EMAIL_PASSWORD = "frfh ockk nqwf zdeu"

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    recipient_email = data.get('recipientEmail')
    subject = data.get('subject')
    text = data.get('text')
    attachment_content = data.get('attachment')

    if not recipient_email or not subject or not text or not attachment_content:
        return jsonify({"error": "Faltan datos requeridos"}), 400

    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = recipient_email
        msg['Subject'] = subject

        msg.attach(MIMEText(text, 'plain'))

        attachment = MIMEBase('application', 'octet-stream')
        attachment.set_payload(attachment_content.encode('utf-8'))
        encoders.encode_base64(attachment)
        attachment.add_header('Content-Disposition', 'attachment', filename='pronostico.csv')
        msg.attach(attachment)

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)

        return jsonify({"message": "Correo enviado exitosamente"}), 200

    except Exception as e:
        print(f"Error al enviar el correo: {e}")
        return jsonify({"error": "Error al enviar el correo"}), 500

if __name__ == '__main__':
    app.run(port=3000)
