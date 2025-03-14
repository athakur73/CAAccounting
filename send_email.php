<?php
header('Content-Type: application/json');

// Get form data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$service = $_POST['service'] ?? '';
$message = $_POST['message'] ?? '';

// Validate inputs
if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    exit;
}

// Email configuration
$to = 'casurajkumar1985@gmail.com';
$subject = 'New Contact Form Submission';
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// Email body
$email_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .label { font-weight: bold; }
    </style>
</head>
<body>
    <h2>New Contact Form Submission</h2>
    <p><span class='label'>Name:</span> $name</p>
    <p><span class='label'>Email:</span> $email</p>
    <p><span class='label'>Phone:</span> $phone</p>
    <p><span class='label'>Service:</span> $service</p>
    <p><span class='label'>Message:</span></p>
    <p>" . nl2br(htmlspecialchars($message)) . "</p>
</body>
</html>
";

// Send email
$mail_sent = mail($to, $subject, $email_body, $headers);

if ($mail_sent) {
    echo json_encode(['success' => true, 'message' => 'Thank you for your message. We will get back to you soon!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Sorry, there was an error sending your message. Please try again later.']);
}
?>
