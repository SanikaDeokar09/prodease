# ProdEase – AI-Based Employee Productivity & Stress Monitoring System

ProdEase is an AI-powered employee productivity and stress monitoring platform designed to help organizations understand workforce productivity, monitor work sessions, and gain insights into employee well-being through an interactive dashboard.

The system combines productivity analytics, facial expression analysis, employee feedback, and manager-level reporting to provide a centralized view of workplace performance.

## Features

* **Employee Dashboard:** View individual productivity information and work-session details.
* **Manager Dashboard:** Monitor employee activity and access workforce analytics.
* **AI-Based Facial Expression Analysis:** Uses Face-API.js to analyze facial expressions during a session.
* **Stress Indicator:** Displays emotion-based indicators to support workplace well-being observations.
* **Productivity Analytics:** Calculates productivity metrics and presents performance insights.
* **Interactive Charts:** Visualizes productivity and employee data through dynamic charts.
* **Employee Feedback:** Supports employee survey and feedback collection.
* **Session Tracking:** Tracks employee work sessions.
* **CSV Export:** Export available dashboard data for further analysis.

## Technology Stack

| Component                  | Technology              |
| -------------------------- | ----------------------- |
| Frontend                   | HTML, CSS, JavaScript   |
| Facial Expression Analysis | Face-API.js             |
| Data Visualization         | JavaScript-based charts |
| Data Storage               | Browser LocalStorage    |
| Model Loading              | Face-API.js CDN         |

## Project Structure

```text
ProdEase/
│
├── index.html
├── style.css
├── app.js
└── README.md
```

## Getting Started

### Prerequisites

* Modern web browser
* Visual Studio Code
* Live Server extension (recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/SanikaDeokar09/prodease.git
```

2. Navigate to the project directory:

```bash
cd prodease
```

3. Open the folder in Visual Studio Code.

4. Run `index.html` using the Live Server extension.

5. Allow camera access when prompted if you want to use the facial expression analysis feature.

## Application Modules

### Employee Module

* Employee dashboard
* Productivity information
* Work-session tracking
* Feedback and survey interface

### Manager Module

* Employee overview
* Productivity and salary-related analytics
* Dynamic dashboard charts
* CSV data export

### AI-Based Facial Expression Analysis

* Webcam-based facial expression detection
* Emotion categories such as happy, sad, angry, fearful, and neutral
* Visual display of detected expressions

**Note:** Facial expressions are not a clinically validated measure of stress. ProdEase is an academic prototype and should not be used for employment decisions or as a substitute for employee consent and well-being assessments.

## Future Enhancements

* Secure authentication and role-based access control
* Backend integration with a centralized database
* Improved productivity prediction models
* Privacy-focused employee consent management
* Advanced analytics and reporting
* Secure cloud deployment

## Contributors

Developed collaboratively as an academic project.

## Disclaimer

ProdEase is intended for educational and demonstration purposes. Facial expression analysis provides experimental indicators only and does not establish an employee's actual emotional or psychological state.

## License

This project is intended for academic and educational use. Please contact the contributors regarding reuse or distribution permissions.
