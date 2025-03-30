from flask import Flask, request, jsonify, send_from_directory
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables
load_dotenv()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/send_email', methods=['POST'])
def send_email():
    try:
        # Get form data
        data = request.form
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        service = data.get('service')
        message = data.get('message')

        # Validate required fields
        if not all([name, email, phone, message]):
            return jsonify({
                'success': False,
                'message': 'Please fill in all required fields'
            }), 400

        # Create email content
        msg = MIMEMultipart()
        sender_email = os.getenv('SMTP_USERNAME')  # Use SMTP username as sender
        msg['From'] = f'Suraj Kumar & Co <{sender_email}>'
        msg['To'] = 'casurajkumar1985@gmail.com'
        msg['Subject'] = 'New Contact Form Submission'

        # Email body
        body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .label {{ font-weight: bold; }}
            </style>
        </head>
        <body>
            <h2>New Contact Form Submission</h2>
            <p><span class='label'>Name:</span> {name}</p>
            <p><span class='label'>Email:</span> {email}</p>
            <p><span class='label'>Phone:</span> {phone}</p>
            <p><span class='label'>Service:</span> {service}</p>
            <p><span class='label'>Message:</span></p>
            <p>{message}</p>
        </body>
        </html>
        """

        msg.attach(MIMEText(body, 'html'))

        # SMTP Configuration
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        smtp_username = os.getenv('SMTP_USERNAME', 'your-email@gmail.com')
        smtp_password = os.getenv('SMTP_PASSWORD', 'your-app-password')

        # Send email
        try:
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.ehlo()  # Identify ourselves to the SMTP server
                server.starttls()  # Enable TLS encryption
                server.ehlo()  # Re-identify ourselves over TLS connection
                server.login(smtp_username, smtp_password)
                server.send_message(msg)
        except smtplib.SMTPAuthenticationError as auth_error:
            raise Exception("Email authentication failed. Please make sure you're using an App Password if 2-Step Verification is enabled.")
        except smtplib.SMTPException as smtp_error:
            raise Exception(f"SMTP error: {str(smtp_error)}")

        return jsonify({
            'success': True,
            'message': 'Thank you for your message. We will get back to you soon!'
        })

    except Exception as e:
        error_msg = f"Error sending email: {str(e)}"
        print(error_msg)
        return jsonify({
            'success': False,
            'message': error_msg if app.debug else 'Sorry, there was an error sending your message. Please try again later.'
        }), 500

if __name__ == '__main__':
    app.debug = True  # Enable debug mode to see detailed errors
    app.run(port=8080)
