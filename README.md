[README.md](https://github.com/user-attachments/files/31673665/README.md)
# SentinelCore SecureOps

## Project Overview

SentinelCore SecureOps is a cloud-native enterprise security operations
and infrastructure monitoring platform. This frontend implements
**Milestone 1 -- Infrastructure Monitoring**, providing a modern
dashboard to monitor servers, cloud resources, and network devices.

## Milestone 1 Features

-   Infrastructure Monitoring Dashboard
-   Asset Inventory
-   Network Monitoring
-   Cloud Monitoring
-   Health Checks
-   Alert Management
-   Infrastructure Health Overview
-   Metric Cards & Charts
-   Search & Filtering
-   Responsive Enterprise UI

## Dashboard Modules

  Module                      Description
  --------------------------- ------------------------------------------------
  Dashboard                   Overall infrastructure health and KPIs
  Assets                      Asset inventory with status and resource usage
  Infrastructure Monitoring   CPU, Memory, Disk & Network metrics
  Network Monitoring          Devices, bandwidth & latency monitoring
  Cloud Monitoring            Cloud resource health overview
  Health Checks               Service availability and validation
  Alerts                      Critical, Warning and Info alerts

## Technology Stack

-   React
-   TypeScript
-   Vite
-   Enterprise Dark UI
-   Mock data (backend integration pending)

## Project Structure

``` text
src/
├── components/
├── pages/
│   ├── Dashboard
│   ├── Assets
│   ├── InfrastructureMonitoring
│   ├── NetworkMonitoring
│   ├── CloudMonitoring
│   ├── HealthChecks
│   └── Alerts
├── services/
├── data/
└── types/
```

## Getting Started

### Install dependencies

``` bash
npm install
```

### Run the development server

``` bash
npm run dev
```

Open the Vite URL shown in the terminal (usually
`http://localhost:5173`).

## Build for Production

``` bash
npm run build
```

## Preview Production Build

``` bash
npm run preview
```

## Current Backend Status

This frontend currently uses **mock/sample data** for infrastructure
monitoring. Backend APIs, authentication, and JWT integration will be
connected separately by the backend team.

## Team Responsibilities

### Frontend

-   Dashboard UI
-   Asset Inventory
-   Infrastructure Monitoring
-   Network Monitoring
-   Cloud Monitoring
-   Health Checks
-   Alert Management

### Backend

-   Spring Boot REST APIs
-   Database integration
-   Authentication & JWT
-   Real-time monitoring services

## Milestone 1 Validation Checklist

-   [x] Asset Inventory
-   [x] Health Monitoring
-   [x] Metric Collection UI
-   [x] Alert Management UI
-   [x] Infrastructure Monitoring Dashboard

## Future Milestones

  Milestone     Focus
  ------------- ------------------------------
  Milestone 2   Security Incident Management
  Milestone 3   Vulnerability Management
  Milestone 4   Audit & Compliance

------------------------------------------------------------------------

**SentinelCore SecureOps**\
*Milestone 1 -- Infrastructure Monitoring Frontend*
