# Movie Streaming Service

A Netflix-like streaming service with a REST API built on AWS infrastructure, designed for mobile clients built with SwiftUI and Jetpack Compose.

## Project Overview

This project provides a scalable, serverless backend for a movie streaming platform. It's built on modern AWS services to handle media storage, streaming, user authentication, and content management.

### Key Features

- **User Authentication**: Secure login/registration system with JWT tokens
- **Content Library**: Browse, search, and filter movies by various criteria
- **Video Streaming**: Adaptive quality streaming with signed URLs
- **User Interactions**: Watchlists, ratings, viewing history
- **Content Search**: Elasticsearch-powered search functionality
- **Mobile-First APIs**: Designed for native mobile apps

## Technical Architecture

### Backend Components

- **API Gateway**: RESTful API endpoints for client applications
- **Lambda Functions**: Serverless backend business logic
- **DynamoDB**: NoSQL database for metadata and user data
- **S3**: Storage for video content
- **CloudFront**: CDN for global content delivery
- **Cognito**: User authentication and authorization
- **MediaConvert**: Video transcoding for adaptive streaming
- **Elasticsearch**: Content search and discovery

### Mobile Clients

- **iOS**: Native SwiftUI application
- **Android**: Native Jetpack Compose application

## Getting Started

### Prerequisites

- AWS Account
- AWS CLI configured
- Node.js 14.x or later
- Terraform (for infrastructure deployment)
- Serverless Framework

### Setup and Deployment

1. Clone this repository:
   ```bash
   git clone https://github.com/clarkshu1016/movie-streaming-service.git
   cd movie-streaming-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy the infrastructure (Terraform option):
   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

4. Deploy the API (Serverless option):
   ```bash
   serverless deploy --stage dev
   ```

5. After deployment, make note of the generated API Gateway URL:
   ```
   https://<api-id>.execute-api.<region>.amazonaws.com/<stage>
   ```

### Mobile Client Integration

- For iOS integration, follow the guide at [iOS Integration Guide](docs/mobile-integration/ios.md)
- For Android integration, follow the guide at [docs/mobile-integration/android.md](docs/mobile-integration/android.md)

## API Documentation

Detailed API documentation can be found in the [API Documentation](docs/api.md) file.

The API provides endpoints for:

- Authentication (login/register)
- Content browsing and search
- Video streaming
- User interactions (ratings, watchlist)
- User profile management

## Data Models

- **Movies**: Title, description, genres, ratings, etc.
- **Users**: Profile information, preferences, subscription details
- **Watchlist**: User's saved content
- **Ratings**: User ratings and reviews
- **View History**: Viewing progress and history

See [Data Models](src/models/README.md) for full details.

## Infrastructure as Code

This project uses Infrastructure as Code with both:

- **Terraform**: For core AWS infrastructure setup
- **Serverless Framework**: For Lambda functions and API Gateway

## Development Workflow

1. Make changes to the source code
2. Run local tests: `npm test`
3. Deploy to development: `serverless deploy --stage dev`
4. Verify in the development environment
5. Deploy to production: `serverless deploy --stage prod`

## Contribution Guidelines

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests and ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.