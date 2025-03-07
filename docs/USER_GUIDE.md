# User Guide: InBody Measurement Tracker

This guide will help you get started with the InBody Measurement Tracker application and make the most of its features.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Uploading Measurements](#uploading-measurements)
4. [Dashboard Overview](#dashboard-overview)
5. [Understanding the Charts](#understanding-the-charts)
6. [Managing Measurements](#managing-measurements)
7. [Troubleshooting](#troubleshooting)

## Introduction

InBody Measurement Tracker is an application designed to help you track and visualize your body composition measurements over time. The application works with InBody measurement reports, which are commonly provided by fitness centers, clinics, and hospitals that use InBody body composition analyzers.

By digitizing and tracking these measurements, you can:
- Monitor changes in your body composition over time
- Visualize trends in weight, muscle mass, and body fat
- Track segmental analysis to see how different parts of your body are changing
- Make informed decisions about your fitness and nutrition plans

## Getting Started

1. **Access the Application**
   - Open your web browser and navigate to `http://localhost:3000`
   - You should see the main dashboard with upload functionality

2. **Application Layout**
   - The application consists of several main sections:
     - File upload area
     - Dashboard with charts
     - Measurement history table

## Uploading Measurements

### Supported File Types

The application supports the following file types for InBody measurement reports:
- PNG images
- JPEG/JPG images
- PDF documents

### How to Upload a File

1. **Prepare Your File**
   - Scan or take a clear photo of your InBody measurement report
   - Ensure all text is readable and the image is not blurry
   - Make sure the file size is under 10MB

2. **Upload the File**
   - Click the "Upload" button in the file upload area
   - Select your file from your computer
   - Alternatively, you can drag and drop the file into the upload area

3. **Processing**
   - The file will be uploaded and processed
   - This may take a few seconds as the AI extracts data from the image
   - A loading indicator will show the progress

4. **Confirmation**
   - Once processing is complete, you'll see a success message
   - The new measurement will be added to your dashboard and measurement history

### Tips for Good Results

- Ensure good lighting when taking photos of reports
- Capture the entire report in the image
- Avoid glare or shadows on the report
- If using a scanner, set it to at least 300 DPI for clear text

## Dashboard Overview

The dashboard provides a visual representation of your body composition data over time. It includes several charts and metrics:

1. **Weight Chart**
   - Shows your weight progression over time
   - Helps you track weight changes and identify trends

2. **Body Composition Breakdown**
   - Displays the proportion of different body components:
     - Fat mass
     - Muscle mass
     - Water content
     - Minerals

3. **Body Composition Timeline**
   - Shows how your body composition changes over time
   - Tracks muscle and fat mass changes

4. **Segmental Analysis**
   - Displays the distribution of muscle and fat across different body segments:
     - Left arm
     - Right arm
     - Trunk
     - Left leg
     - Right leg

## Understanding the Charts

### Weight Chart

The weight chart shows your weight measurements over time. This helps you track your progress toward weight goals.

**Key Features:**
- X-axis: Dates of measurements
- Y-axis: Weight in kilograms
- Line graph: Shows the trend of your weight changes
- Data points: Each point represents a specific measurement

### Body Composition Pie Chart

This pie chart shows the breakdown of your body composition from your most recent measurement.

**Components:**
- **Fat Mass**: The total amount of fat in your body
- **Skeletal Muscle Mass**: The amount of muscle attached to bones
- **Total Body Water**: The amount of water in your body
- **Minerals**: Bone minerals and other mineral content
- **Protein**: Protein content in your body

### Body Composition Timeline

This chart shows how your body composition changes over time, with stacked areas for different components.

**Key Features:**
- X-axis: Dates of measurements
- Y-axis: Mass in kilograms
- Stacked areas: Different colors represent different body components
- Hover information: Details about specific measurements

### Segmental Analysis Chart

This chart shows how muscle and fat are distributed across different body segments.

**Body Segments:**
- Left Arm
- Right Arm
- Trunk
- Left Leg
- Right Leg

**Key Features:**
- Bar chart: Compares muscle and fat mass across body segments
- Color coding: Different colors for muscle and fat
- Comparison: Easily see imbalances between left and right sides

## Managing Measurements

### Viewing Measurement History

1. Scroll down to the Measurement Table section
2. The table shows all your measurements with key metrics
3. Measurements are ordered by date, with the most recent at the top

### Editing a Measurement

If you need to correct or update measurement data:

1. Find the measurement in the Measurement Table
2. Click the "Edit" button for that measurement
3. The Measurement Editor will open with the current data
4. Make your changes to any fields
5. Click "Save" to update the measurement
6. The dashboard charts will automatically update with your changes

### Deleting a Measurement

To remove a measurement from your history:

1. Find the measurement in the Measurement Table
2. Click the "Delete" button for that measurement
3. Confirm the deletion when prompted
4. The measurement will be removed, and charts will update automatically

## Troubleshooting

### Common Issues

#### File Upload Problems

**Issue**: File upload fails or times out
**Solution**:
- Ensure your file is under 10MB
- Check that you're using a supported file format (PNG, JPEG, PDF)
- Try converting the file to a different format
- Ensure you have a stable internet connection

#### Data Extraction Issues

**Issue**: The application doesn't correctly extract all data from your file
**Solution**:
- Ensure the image is clear and all text is readable
- Try scanning the document instead of taking a photo
- Make sure the entire report is visible in the image
- Manually edit the measurement after upload to correct any errors

#### Chart Display Issues

**Issue**: Charts don't update after adding a new measurement
**Solution**:
- Refresh the page
- Check that the measurement was successfully added to your history
- Clear your browser cache and reload the application

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md) for more detailed solutions
2. Look for error messages in the application that might indicate the problem
3. Contact support with details about the issue you're experiencing

## Additional Tips

- **Regular Measurements**: For the best tracking experience, take measurements at regular intervals (e.g., weekly, monthly)
- **Consistent Conditions**: Try to take measurements under similar conditions (same time of day, similar hydration levels)
- **Data Backup**: Regularly export your data if that feature is available
- **Privacy**: Remember that your health data is sensitive information
