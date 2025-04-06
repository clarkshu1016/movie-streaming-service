# Android Integration Guide

## Overview

This guide provides instructions for integrating the Movie Streaming Service API with an Android application using Jetpack Compose.

## Requirements

- Android Studio Arctic Fox (2020.3.1) or later
- Android API Level 21 or higher
- Kotlin 1.5 or later
- Jetpack Compose 1.0 or later

## Project Setup

### Create a New Compose Project

1. Open Android Studio and select "New Project"
2. Choose "Empty Compose Activity" and click "Next"
3. Enter your project details:
   - Name: MovieStreamingApp
   - Package name: com.yourcompany.moviestreamingapp
   - Language: Kotlin
   - Minimum API level: 21 (Android 5.0)
4. Click "Finish"

### Add Dependencies

Update your app-level build.gradle file to include the following dependencies:

```gradle
dependencies {
    // Compose
    implementation "androidx.compose.ui:ui:1.3.2"
    implementation "androidx.compose.material:material:1.3.1"
    implementation "androidx.compose.ui:ui-tooling-preview:1.3.2"
    implementation "androidx.activity:activity-compose:1.6.1"
    implementation "androidx.lifecycle:lifecycle-viewmodel-compose:2.5.1"
    implementation "androidx.navigation:navigation-compose:2.5.3"
    implementation "io.coil-kt:coil-compose:2.2.2"
    
    // Network
    implementation "com.squareup.retrofit2:retrofit:2.9.0"
    implementation "com.squareup.retrofit2:converter-gson:2.9.0"
    implementation "com.squareup.okhttp3:okhttp:4.10.0"
    implementation "com.squareup.okhttp3:logging-interceptor:4.10.0"
    
    // Video Player
    implementation "com.google.android.exoplayer:exoplayer:2.18.2"
    implementation "com.google.android.exoplayer:exoplayer-ui:2.18.2"
    
    // Authentication
    implementation "androidx.security:security-crypto:1.1.0-alpha04"
    
    // Dependency Injection
    implementation "com.google.dagger:hilt-android:2.44"
    kapt "com.google.dagger:hilt-android-compiler:2.44"
    implementation "androidx.hilt:hilt-navigation-compose:1.0.0"
}
```

## Authentication Implementation

### AuthViewModel.kt

```kotlin
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val tokenManager: TokenManager
) : ViewModel() {

    private val _loginState = MutableStateFlow<AuthUiState>(AuthUiState.Initial)
    val loginState: StateFlow<AuthUiState> = _loginState

    private val _registerState = MutableStateFlow<AuthUiState>(AuthUiState.Initial)
    val registerState: StateFlow<AuthUiState> = _registerState

    fun login(email: String, password: String) {
        _loginState.value = AuthUiState.Loading

        viewModelScope.launch {
            try {
                val loginRequest = LoginRequest(email, password)
                val result = authRepository.login(loginRequest)

                result.fold(
                    onSuccess = { response ->
                        tokenManager.saveAccessToken(response.token)
                        tokenManager.saveRefreshToken(response.refreshToken)
                        _loginState.value = AuthUiState.Success
                    },
                    onFailure = { e ->
                        _loginState.value = AuthUiState.Error(e.message ?: "Login failed")
                    }
                )
            } catch (e: Exception) {
                _loginState.value = AuthUiState.Error(e.message ?: "Login failed")
            }
        }
    }

    fun register(name: String, email: String, password: String) {
        _registerState.value = AuthUiState.Loading

        viewModelScope.launch {
            try {
                val registerRequest = RegisterRequest(email, password, name)
                val result = authRepository.register(registerRequest)

                result.fold(
                    onSuccess = { _ ->
                        _registerState.value = AuthUiState.Success
                    },
                    onFailure = { e ->
                        _registerState.value = AuthUiState.Error(e.message ?: "Registration failed")
                    }
                )
            } catch (e: Exception) {
                _registerState.value = AuthUiState.Error(e.message ?: "Registration failed")
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            tokenManager.clearTokens()
        }
    }
}

sealed class AuthUiState {
    object Initial : AuthUiState()
    object Loading : AuthUiState()
    object Success : AuthUiState()
    data class Error(val message: String) : AuthUiState()
}
```

### LoginScreen.kt

```kotlin
@Composable
fun LoginScreen(
    viewModel: AuthViewModel = hiltViewModel(),
    onNavigateToRegister: () -> Unit,
    onLoginSuccess: () -> Unit
) {
    val uiState by viewModel.loginState.collectAsState()
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isPasswordVisible by remember { mutableStateOf(false) }
    
    LaunchedEffect(key1 = uiState) {
        if (uiState is AuthUiState.Success) {
            onLoginSuccess()
        }
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Welcome Back",
            style = MaterialTheme.typography.h4,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = "Sign in to continue",
            style = MaterialTheme.typography.body1,
            color = MaterialTheme.colors.onSurface.copy(alpha = 0.6f)
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            leadingIcon = {
                Icon(Icons.Default.Email, contentDescription = "Email")
            }
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            modifier = Modifier.fillMaxWidth(),
            visualTransformation = if (isPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            leadingIcon = {
                Icon(Icons.Default.Lock, contentDescription = "Password")
            },
            trailingIcon = {
                IconButton(onClick = { isPasswordVisible = !isPasswordVisible }) {
                    Icon(
                        imageVector = if (isPasswordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                        contentDescription = if (isPasswordVisible) "Hide password" else "Show password"
                    )
                }
            }
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        if (uiState is AuthUiState.Error) {
            Text(
                text = (uiState as AuthUiState.Error).message,
                color = MaterialTheme.colors.error,
                style = MaterialTheme.typography.caption,
                modifier = Modifier.fillMaxWidth()
            )
            
            Spacer(modifier = Modifier.height(16.dp))
        }
        
        Button(
            onClick = { viewModel.login(email, password) },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            enabled = email.isNotEmpty() && password.isNotEmpty() && uiState !is AuthUiState.Loading
        ) {
            if (uiState is AuthUiState.Loading) {
                CircularProgressIndicator(
                    color = MaterialTheme.colors.onPrimary,
                    modifier = Modifier.size(24.dp)
                )
            } else {
                Text("Sign In")
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Don't have an account?")
            TextButton(onClick = onNavigateToRegister) {
                Text("Sign Up")
            }
        }
    }
}
```

## Main App Component

### MainActivity.kt

```kotlin
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MovieStreamingAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colors.background
                ) {
                    MovieApp()
                }
            }
        }
    }
}

@Composable
fun MovieApp() {
    val tokenManager: TokenManager = hiltViewModel<AuthViewModel>().tokenManager
    val isLoggedIn = remember { mutableStateOf(false) }
    
    // Check if user is logged in
    LaunchedEffect(key1 = Unit) {
        isLoggedIn.value = tokenManager.getAccessToken() != null
    }

    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = if (isLoggedIn.value) "main" else "auth"
    ) {
        // Authentication flow
        navigation(startDestination = "login", route = "auth") {
            composable("login") {
                LoginScreen(
                    onNavigateToRegister = { navController.navigate("register") },
                    onLoginSuccess = {
                        navController.navigate("main") {
                            popUpTo("auth") { inclusive = true }
                        }
                    }
                )
            }
            
            composable("register") {
                RegisterScreen(
                    onNavigateToLogin = { navController.navigate("login") },
                    onRegisterSuccess = { navController.navigate("login") }
                )
            }
        }
        
        // Main app flow
        navigation(startDestination = "movies", route = "main") {
            composable("movies") {
                MovieListScreen(
                    navigateToMovieDetail = { movieId ->
                        navController.navigate("movie_detail/$movieId")
                    }
                )
            }
            
            composable(
                route = "movie_detail/{movieId}",
                arguments = listOf(navArgument("movieId") { type = NavType.StringType })
            ) { backStackEntry ->
                val movieId = backStackEntry.arguments?.getString("movieId") ?: ""
                MovieDetailScreen(
                    movieId = movieId,
                    onNavigateUp = { navController.navigateUp() },
                    onPlayMovie = { movieId, title ->
                        navController.navigate("movie_player/$movieId/$title")
                    }
                )
            }
            
            composable(
                route = "movie_player/{movieId}/{title}",
                arguments = listOf(
                    navArgument("movieId") { type = NavType.StringType },
                    navArgument("title") { type = NavType.StringType }
                )
            ) { backStackEntry ->
                val movieId = backStackEntry.arguments?.getString("movieId") ?: ""
                val title = backStackEntry.arguments?.getString("title") ?: ""
                MoviePlayerScreen(
                    movieId = movieId,
                    title = title,
                    onBackPressed = { navController.navigateUp() }
                )
            }
            
            composable("search") {
                SearchScreen(
                    navigateToMovieDetail = { movieId ->
                        navController.navigate("movie_detail/$movieId")
                    }
                )
            }
            
            composable("watchlist") {
                WatchlistScreen(
                    navigateToMovieDetail = { movieId ->
                        navController.navigate("movie_detail/$movieId")
                    }
                )
            }
            
            composable("profile") {
                ProfileScreen(
                    onLogout = {
                        navController.navigate("auth") {
                            popUpTo("main") { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}
```