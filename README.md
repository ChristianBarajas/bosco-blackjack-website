# Bosco Blackjack

A production website built for **Bosco Blackjack**, a private blackjack entertainment service serving parties, birthdays, corporate events, casino nights, and private events throughout Southern California.

The project was built as a real client-facing application with a responsive React frontend, Firebase backend services, custom domain deployment, media optimization, and a Firestore-powered booking workflow.

## Live Website

**https://boscoblackjack.com**

---

## Overview

Bosco Blackjack provides an on-location blackjack experience for private events.

The service includes:

* Professional blackjack dealer
* Blackjack table
* Casino chips and cards
* Setup and breakdown
* Hourly event packages
* Transportation to event locations

The goal of the website was to give the business a polished online presence while keeping the customer experience extremely simple:

**Learn about the service → View pricing → See real event media → Submit a booking request**

---

## Core Features

### Responsive Business Website

The interface was built using React and custom CSS with layouts designed for both desktop and mobile browsers.

The desktop experience uses a wider premium layout, while responsive breakpoints automatically reorganize content for smaller screens without creating a separate mobile application.

### Modern Casino UI

The visual system combines a traditional casino aesthetic with a modern high-tech interface.

Design elements include:

* Black and deep-green backgrounds
* Metallic gold accents
* Casino-inspired serif typography
* Animated gold text effects
* Floating card-suit graphics
* Glass and bordered interface elements
* Interactive hover states
* Smooth navigation
* Scroll-triggered reveal animations
* Animated event ticker
* Responsive pricing cards

The objective was to avoid an overly traditional or exaggerated Las Vegas look while still making the blackjack identity immediately recognizable.

---

## Booking System

Customers can submit booking requests directly through the website.

The form collects:

* Full name
* Phone number
* Email address
* Event date
* Number of hours requested
* Event location
* Additional event information

Booking data is stored securely inside **Firebase Firestore**.

### Booking Flow

```text
Customer
   ↓
React Booking Form
   ↓
Firebase Firestore
   ↓
bookingRequests Collection
   ↓
Business Booking Record
```

Each booking submission is stored with its event information, status, and server-generated timestamp.

This allows the website to function as more than a static landing page—it actively collects and persists real customer inquiries.

---

## Firebase Integration

Firebase provides the backend and production infrastructure for the project.

### Firestore

Firestore stores booking request data submitted through the website.

Example booking data:

```text
name
phone
email
eventDate
hours
location
notes
status
createdAt
```

### Firebase Hosting

The production build is deployed through Firebase Hosting.

The original Firebase deployment is available through:

```text
bosco-blackjack.web.app
```

A custom business domain was later configured:

```text
boscoblackjack.com
```

### Custom Domain & DNS

The custom domain was purchased through Namecheap and connected to Firebase Hosting using DNS configuration.

The deployment process included:

* Custom domain ownership verification
* A record configuration
* TXT verification records
* ACME certificate verification
* SSL certificate provisioning
* HTTPS configuration

Firebase now serves the production application securely through:

**https://boscoblackjack.com**

---

## Media Gallery

The website includes a custom event gallery containing real photos and videos from Bosco Blackjack events.

Users can cycle through media using navigation controls rather than loading a large collection of media onto the page at once.

Features include:

* Image and video carousel
* Previous/next navigation
* Media position indicator
* Lazy-loaded images
* Video metadata preloading
* Mobile responsive presentation

### Video Performance Optimization

Original event videos were large `.mov` files that created slow page loads.

The media was converted and optimized into significantly smaller `.mp4` files for web delivery.

The gallery only creates the active video element when the user selects it, reducing unnecessary network usage and improving page performance.

---

## Scroll & UI Animation

The website uses the browser's `IntersectionObserver` API to trigger animations as content enters the viewport.

Sections smoothly transition into view rather than loading as a static stack of content.

Additional interface animation includes:

* Hero image floating animation
* Animated gold text
* Moving event ticker
* Floating casino suits
* Button shine effects
* Pricing card hover states
* Navigation underline animations
* Gallery transitions

Reduced-motion accessibility settings are also respected.

---

## Branding

Bosco Blackjack uses a custom visual identity built around a simple:

**BB + Spade**

monogram.

The branding appears throughout the website and is also used as the browser favicon.

The final favicon was intentionally simplified so that the mark remains recognizable at very small browser-tab sizes.

---

## Technology Stack

| Technology         | Purpose                                  |
| ------------------ | ---------------------------------------- |
| React              | Frontend application                     |
| Vite               | Development and production build tooling |
| JavaScript         | Application logic                        |
| CSS3               | Responsive design and animations         |
| Firebase Firestore | Booking database                         |
| Firebase Hosting   | Production hosting                       |
| Firebase Functions | Serverless backend infrastructure        |
| Git                | Version control                          |
| GitHub             | Source-code hosting                      |
| Namecheap          | Domain registration and DNS management   |

---

## Project Structure

```text
blackjack-booking/
│
├── public/
│   ├── favicon assets
│   ├── event photos
│   └── optimized event videos
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
│
├── functions/
│   ├── index.js
│   └── package.json
│
├── firebase.json
├── .firebaserc
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The development environment can also be run explicitly on localhost:

```bash
npm run dev -- --host 127.0.0.1 --port 3000 --strictPort
```

---

## Production Build

Create the optimized Vite production build:

```bash
npm run build
```

Vite generates the production application inside:

```text
dist/
```

---

## Deployment

Deploy the production site through Firebase Hosting:

```bash
firebase deploy --only hosting
```

The deployment is automatically served through both Firebase Hosting and the connected custom domain.

---

## Version Control Workflow

Changes are tracked with Git and pushed to GitHub.

Typical production workflow:

```bash
git status

git add .

git commit -m "Describe production update"

git push
```

This keeps the deployed client website and public source repository synchronized.

---

## Email Notification Infrastructure

Firebase Cloud Functions infrastructure has been initialized for a planned automated booking-notification system.

The intended architecture is:

```text
Customer Booking
      ↓
Firestore
      ↓
Firebase Cloud Function
      ↓
Email Service
      ↓
Bosco Booking Inbox
```

Once finalized, the business owner will automatically receive an email containing the booking customer's:

* Name
* Phone number
* Email
* Event date
* Hours requested
* Event location
* Additional details

The email notification layer is being implemented server-side so private email-service credentials are never exposed inside the React frontend.

---

## Development Process

The project was developed iteratively from a simple booking landing page into a complete production business website.

Major development stages included:

1. React/Vite project initialization
2. Responsive landing-page design
3. Firebase project configuration
4. Firestore booking integration
5. Firebase Hosting deployment
6. Git/GitHub repository setup
7. Real client pricing and contact information integration
8. Real event photo/video integration
9. Media optimization
10. Custom media carousel
11. Custom domain configuration
12. HTTPS and SSL provisioning
13. Custom branding and favicon
14. Full desktop/mobile visual redesign
15. Scroll and interaction animations
16. Firebase Functions backend preparation

---

## What This Project Demonstrates

Bosco Blackjack demonstrates practical experience with:

* Production React development
* Responsive web design
* Client-focused UI/UX
* Form state management
* Cloud database integration
* Serverless architecture
* Firebase deployment
* DNS configuration
* Custom-domain deployment
* SSL/HTTPS provisioning
* Media optimization
* Web performance considerations
* Git/GitHub workflows
* Real-world client requirements

Unlike a tutorial or classroom project, Bosco Blackjack was designed, deployed, and maintained for an actual business with real users and real booking requests.

---

## Future Improvements

Potential future additions include:

* Automated booking email notifications
* Customer confirmation emails
* Spam protection
* Booking-management dashboard
* Calendar availability
* Google Analytics
* Search-engine optimization
* Customer testimonials
* Online event deposits or payments

---

## Developer

**Christian Barajas**

B.S. Computer Science
California State University, Fullerton

GitHub:
https://github.com/ChristianBarajas
