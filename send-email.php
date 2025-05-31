<?php
// Check if the form is submitted using the POST method
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize and validate the form inputs
    $name = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : '';
    $email = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : '';
    $message = isset($_POST["message"]) ? trim($_POST["message"]) : '';

    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400); // Bad request
        echo "Please fill out all fields.";
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400); // Bad request
        echo "Please provide a valid email address.";
        exit;
    }

    // Set recipient email
    $recipient = "oguz.gur.cs@gmail.com";  // Change to your email address

    // Email subject
    $subject = "New message from $name";

    // Email content (sanitize output)
    $email_content = "Name: " . htmlspecialchars($name) . "\n";
    $email_content .= "Email: " . htmlspecialchars($email) . "\n\n";
    $email_content .= "Message:\n" . htmlspecialchars($message) . "\n";

    // Email headers (sanitize and ensure proper format)
    $email_headers = "From: " . htmlspecialchars($name) . " <$email>";

    // Send email and handle success or failure
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200); // OK
        echo "Message sent successfully.";
    } else {
        http_response_code(500); // Internal Server Error
        echo "Oops! Something went wrong, please try again later.";
    }
} else {
    // Respond with an error if the request method is not POST
    http_response_code(403); // Forbidden
    echo "There was a problem with your submission.";
}
?>
