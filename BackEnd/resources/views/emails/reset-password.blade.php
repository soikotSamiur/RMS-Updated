<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #f97316;
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .otp-box {
            background-color: #f97316;
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 20px;
            border-radius: 8px;
            display: inline-block;
            margin: 20px 0;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666666;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
        }
        .warning p {
            margin: 0;
            font-size: 14px;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 DineSmart Restaurant</h1>
            <p>Password Reset Request</p>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You have requested to reset your password. Use the OTP below to complete the process:</p>
            
            <div class="otp-box">{{ $otp }}</div>
            
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            
            <div class="warning">
                <p><strong>⚠️ Security Notice:</strong></p>
                <p>If you did not request this password reset, please ignore this email and ensure your account is secure.</p>
            </div>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} DineSmart Restaurant Management System</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
