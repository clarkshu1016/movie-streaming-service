# API Documentation

## Base URL

```
https://<api-gateway-id>.execute-api.<region>.amazonaws.com/<stage>
```

## Authentication

All API requests require authentication using JWT tokens issued by AWS Cognito.

Add the following header to your requests:

```
Authorization: Bearer <token>
```

## Endpoints

### User Management

#### Register User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "securePassword",
  "name": "User Name"
}
```

#### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "securePassword"
}
```

#### Get User Profile

- **URL**: `/users/profile`
- **Method**: `GET`
- **Auth Required**: Yes

### Content Management

#### Get Movies List

- **URL**: `/movies`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Results per page
  - `genre` (optional): Filter by genre
  - `sortBy` (optional): Sort field (title, releaseDate, rating)

#### Get Movie Details

- **URL**: `/movies/{movieId}`
- **Method**: `GET`
- **Auth Required**: Yes

#### Get Streaming URL

- **URL**: `/movies/{movieId}/stream`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `quality` (optional): video quality (low, medium, high)

### User Interaction

#### Add to Watchlist

- **URL**: `/users/watchlist`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:

```json
{
  "movieId": "123456"
}
```

#### Get Watchlist

- **URL**: `/users/watchlist`
- **Method**: `GET`
- **Auth Required**: Yes

#### Rate Movie

- **URL**: `/movies/{movieId}/rate`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:

```json
{
  "rating": 4.5
}
```

### Search

#### Search Content

- **URL**: `/search`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `query`: Search term
  - `type` (optional): Content type (movie, series)
  - `genre` (optional): Genre filter
