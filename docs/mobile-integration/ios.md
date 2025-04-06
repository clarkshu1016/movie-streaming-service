# iOS Integration Guide

## Overview

This guide provides instructions for integrating the Movie Streaming Service API with an iOS application using SwiftUI.

## Requirements

- Xcode 14.0 or later
- iOS 15.0 or later
- Swift 5.7 or later

## Project Setup

### Create a New SwiftUI Project

1. Open Xcode and select "Create a new Xcode project"
2. Choose "App" template and click "Next"
3. Enter your project details:
   - Product Name: MovieStreamingApp
   - Interface: SwiftUI
   - Language: Swift
4. Click "Next" and choose a location to save your project

### Add Dependencies

Add the following dependencies to your project using Swift Package Manager:

1. In Xcode, go to File > Add Packages...
2. Add the following packages:
   - Alamofire (https://github.com/Alamofire/Alamofire)
   - Kingfisher (https://github.com/onevcat/Kingfisher)
   - SwiftUI Video Player (https://github.com/wxxsw/VideoPlayer)

## Key Components

### APIService

```swift
import Foundation
import Alamofire

class APIService {
    static let shared = APIService()
    
    private let baseURL = "https://your-api-gateway-url/"
    private let tokenManager = TokenManager.shared
    
    // MARK: - Movies
    
    func fetchMovies(page: Int = 1, limit: Int = 20, genre: String? = nil, sortBy: String? = nil, completion: @escaping (Result<MoviesResponse, Error>) -> Void) {
        var parameters: [String: Any] = ["page": page, "limit": limit]
        
        if let genre = genre {
            parameters["genre"] = genre
        }
        
        if let sortBy = sortBy {
            parameters["sortBy"] = sortBy
        }
        
        let headers: HTTPHeaders = ["Authorization": "Bearer \(tokenManager.accessToken ?? "")"]
        
        AF.request(baseURL + "movies", parameters: parameters, headers: headers)
            .validate()
            .responseDecodable(of: MoviesResponse.self) { response in
                switch response.result {
                case .success(let moviesResponse):
                    completion(.success(moviesResponse))
                case .failure(let error):
                    completion(.failure(error))
                }
            }
    }
    
    func fetchMovieDetails(movieId: String, completion: @escaping (Result<Movie, Error>) -> Void) {
        let headers: HTTPHeaders = ["Authorization": "Bearer \(tokenManager.accessToken ?? "")"]
        
        AF.request(baseURL + "movies/\(movieId)", headers: headers)
            .validate()
            .responseDecodable(of: Movie.self) { response in
                switch response.result {
                case .success(let movie):
                    completion(.success(movie))
                case .failure(let error):
                    completion(.failure(error))
                }
            }
    }
    
    func getStreamingURL(movieId: String, quality: String = "medium", completion: @escaping (Result<StreamResponse, Error>) -> Void) {
        let headers: HTTPHeaders = ["Authorization": "Bearer \(tokenManager.accessToken ?? "")"]
        let parameters: [String: Any] = ["quality": quality]
        
        AF.request(baseURL + "movies/\(movieId)/stream", parameters: parameters, headers: headers)
            .validate()
            .responseDecodable(of: StreamResponse.self) { response in
                switch response.result {
                case .success(let streamResponse):
                    completion(.success(streamResponse))
                case .failure(let error):
                    completion(.failure(error))
                }
            }
    }
}
```

### TokenManager

```swift
import Foundation
import KeychainAccess

class TokenManager {
    static let shared = TokenManager()
    
    private let keychain = Keychain(service: "com.yourcompany.moviestreamingapp")
    
    var accessToken: String? {
        get {
            try? keychain.get("accessToken")
        }
        set {
            if let newValue = newValue {
                try? keychain.set(newValue, key: "accessToken")
            } else {
                try? keychain.remove("accessToken")
            }
        }
    }
    
    var refreshToken: String? {
        get {
            try? keychain.get("refreshToken")
        }
        set {
            if let newValue = newValue {
                try? keychain.set(newValue, key: "refreshToken")
            } else {
                try? keychain.remove("refreshToken")
            }
        }
    }
    
    var isLoggedIn: Bool {
        accessToken != nil
    }
    
    func clearTokens() {
        accessToken = nil
        refreshToken = nil
    }
}
```

### Movie Model

```swift
struct Movie: Identifiable, Codable {
    let id: String
    let title: String
    let description: String
    let releaseDate: String
    let duration: Int
    let director: String
    let actors: [String]
    let genres: [String]
    let rating: Double
    let ratingsCount: Int
    let thumbnailUrl: String
    let bannerUrl: String
    let maturityRating: String
    let languages: [String]
    let subtitles: [String]
    
    var formattedDuration: String {
        let hours = duration / 60
        let minutes = duration % 60
        return hours > 0 ? "\(hours)h \(minutes)m" : "\(minutes)m"
    }
}
```

## Main Application Structure

```swift
@main
struct MovieStreamingApp: App {
    @StateObject private var authViewModel = AuthViewModel()
    
    var body: some Scene {
        WindowGroup {
            if authViewModel.isAuthenticated {
                ContentView()
                    .environmentObject(authViewModel)
            } else {
                AuthView()
                    .environmentObject(authViewModel)
            }
        }
    }
}
```
