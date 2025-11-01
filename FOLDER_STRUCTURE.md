# Project Folder Structure

This document outlines the folder structure of the Learning Hub Platform, a full-stack educational platform built with a microservices architecture.

## Root Directory

```
.
├── backend/
├── frontend/
├── jenkins-shared-library/
├── ANALYSIS.md
├── ARCHITECTURE_SUMMARY.md
├── AWS_DEVOPS_ARCHITECTURE.md
├── DEVOPS_PIPELINE.md
├── JENKINS_SETUP.md
├── LICENSE.txt
├── MICROSERVICES_AWS_ARCHITECTURE.md
└── README.md
```

## Backend Structure

The backend is organized as a NestJS monorepo with multiple microservices.

```
backend/
├── apps/
│   ├── admin-service/
│   ├── api-gateway/
│   ├── assessment-service/
│   ├── auth-service/
│   ├── certificate-service/
│   ├── content-service/
│   ├── course-service/
│   ├── enrollment-service/
│   ├── gamification-service/
│   ├── media-service/
│   ├── notification-service/
│   ├── payment-service/
│   ├── progress-service/
│   ├── review-service/
│   └── user-service/
├── libs/
│   └── shared/
│       ├── constants/
│       ├── dto/
│       └── src/
├── k8s/
├── prisma/
├── dist/
├── node_modules/
├── .env
├── DEVELOPMENT_SETUP.md
├── README.md
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── test-api.js
└── tsconfig.json
```

### Backend Microservices

Each microservice follows a similar structure:

```
{service-name}/
├── src/
└── README.md
```

Services with additional configurations may include:
- `Dockerfile` for containerization
- `tsconfig.app.json` for TypeScript configuration
- Database schemas in the `prisma` directory

## Frontend Structure

The frontend is built with React/Vite and uses TailwindCSS for styling.

```
frontend/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── assessment/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── course/
│   │   ├── dashboard/
│   │   ├── gamification/
│   │   ├── instructor/
│   │   ├── BlogSection.tsx
│   │   ├── CareerFinder.tsx
│   │   ├── ChatBot.tsx
│   │   ├── CourseCategories.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── InstructorSpotlight.tsx
│   │   ├── MobileAppPromo.tsx
│   │   ├── NewsletterSignup.tsx
│   │   ├── PricingPlans.tsx
│   │   ├── ProfessionalCertificates.tsx
│   │   ├── ResumeBuilder.tsx
│   │   ├── SkillTracker.tsx
│   │   ├── SupportCenter.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Topbar.tsx
│   │   ├── TrendingCourses.tsx
│   │   └── TrustedBy.tsx
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── dist/
├── node_modules/
├── .env
├── Dockerfile
├── index.html
├── nginx.conf
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── yarn.lock
```

## Jenkins Shared Library

Contains reusable Jenkins pipeline components:

```
jenkins-shared-library/
├── src/
│   └── org/
│       └── example/
│           └── deployment/
└── vars/
```

## Key Documentation Files

- `ANALYSIS.md`: Project analysis and requirements
- `ARCHITECTURE_SUMMARY.md`: High-level architecture overview
- `AWS_DEVOPS_ARCHITECTURE.md`: AWS deployment architecture
- `DEVOPS_PIPELINE.md`: DevOps pipeline documentation
- `JENKINS_SETUP.md`: Jenkins configuration guide
- `MICROSERVICES_AWS_ARCHITECTURE.md`: Detailed microservices architecture on AWS
- `README.md`: Main project documentation