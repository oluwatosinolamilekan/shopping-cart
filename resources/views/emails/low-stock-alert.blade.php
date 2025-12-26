<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Low Stock Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #dc2626;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }
        .product-details {
            background-color: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            border: 1px solid #e5e7eb;
        }
        .product-details h3 {
            margin-top: 0;
            color: #1f2937;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #6b7280;
        }
        .value {
            color: #1f2937;
        }
        .warning {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin: 20px 0;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">⚠️ Low Stock Alert</h1>
    </div>
    <div class="content">
        <p>Hello Admin,</p>
        
        <p>This is an automated notification to inform you that the following product is running low on stock:</p>
        
        <div class="product-details">
            <h3>{{ $product->name }}</h3>
            
            <div class="detail-row">
                <span class="label">Product ID:</span>
                <span class="value">{{ $product->id }}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Current Stock:</span>
                <span class="value" style="color: #dc2626; font-weight: bold;">{{ $product->stock_quantity }} units</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Price:</span>
                <span class="value">${{ number_format($product->price, 2) }}</span>
            </div>
            
            @if($product->description)
            <div class="detail-row">
                <span class="label">Description:</span>
                <span class="value">{{ $product->description }}</span>
            </div>
            @endif
        </div>
        
        <div class="warning">
            <strong>Action Required:</strong> Please restock this product to avoid running out of inventory.
        </div>
        
        <p>This alert was generated on {{ now()->format('F j, Y \a\t g:i A') }}.</p>
        
        <p>Best regards,<br>
        Shopping Cart System</p>
    </div>
</body>
</html>

