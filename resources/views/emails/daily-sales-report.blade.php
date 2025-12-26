<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #1f2937;
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
        .summary-box {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 20px 0;
        }
        .summary-card {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #e5e7eb;
            text-align: center;
        }
        .summary-label {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .summary-value {
            color: #1f2937;
            font-size: 28px;
            font-weight: bold;
        }
        table {
            width: 100%;
            background-color: white;
            border-collapse: collapse;
            margin: 20px 0;
            border-radius: 5px;
            overflow: hidden;
        }
        th {
            background-color: #1f2937;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        tr:last-child td {
            border-bottom: none;
        }
        tr:hover {
            background-color: #f9fafb;
        }
        .no-data {
            text-align: center;
            padding: 40px;
            color: #6b7280;
            background-color: white;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">📊 Daily Sales Report</h1>
        <p style="margin: 10px 0 0 0;">{{ $salesData['date'] }}</p>
    </div>
    <div class="content">
        <p>Hello Admin,</p>
        
        <p>Here is your daily sales summary for {{ \Carbon\Carbon::parse($salesData['date'])->format('F j, Y') }}:</p>
        
        <div class="summary-box">
            <div class="summary-card">
                <div class="summary-label">Total Orders</div>
                <div class="summary-value">{{ $salesData['total_orders'] }}</div>
            </div>
            <div class="summary-card">
                <div class="summary-label">Total Revenue</div>
                <div class="summary-value">${{ number_format($salesData['total_revenue'], 2) }}</div>
            </div>
        </div>
        
        @if($salesData['products_sold']->count() > 0)
            <h3>Products Sold Today</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th style="text-align: center;">Quantity Sold</th>
                        <th style="text-align: right;">Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($salesData['products_sold'] as $product)
                    <tr>
                        <td>{{ $product->name }}</td>
                        <td style="text-align: center;">{{ $product->total_quantity }}</td>
                        <td style="text-align: right;">${{ number_format($product->total_revenue, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <div class="no-data">
                <p>No sales were recorded today.</p>
            </div>
        @endif
        
        <p style="margin-top: 30px;">This report was generated on {{ now()->format('F j, Y \a\t g:i A') }}.</p>
        
        <p>Best regards,<br>
        Shopping Cart System</p>
    </div>
</body>
</html>

