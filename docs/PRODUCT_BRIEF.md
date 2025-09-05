# Product Brief: Bill Splitting Application

## Project Overview / Description

A bill splitting application that allows users to divide expenses among multiple people based on a total bill amount. The application enables users to create bills with individual line items, each containing a name and amount to be paid, and automatically calculates how the total should be distributed among participants.

## Target Audience

- Groups of friends sharing expenses (dining out, travel, events)
- Roommates managing household expenses
- Colleagues splitting work-related costs
- Anyone who needs to track and split shared expenses fairly

## Primary Benefits / Features

- **Bill Creation**: Create bills with a total amount and individual line items
- **Item Management**: Add items with names and specific amounts to be paid
- **Automatic Calculation**: System calculates how the total bill should be split
- **Expense Tracking**: Keep track of who owes what amount
- **Fair Distribution**: Ensure accurate and transparent bill splitting

## High-Level Tech/Architecture

- **Backend**: Java Spring Boot application with RESTful API
- **Database**: Relational database for storing bills, items, and user data
- **API Design**: RESTful endpoints for bill management operations
- **Architecture**: Layered architecture with controllers, services, repositories, and DTOs
- **Exception Handling**: Global exception handling with proper error responses
