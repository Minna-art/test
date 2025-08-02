// Google OAuth service
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';

class GoogleAuthService {
  constructor() {
    this.isInitialized = false;
    this.gapi = null;
  }

  // Initialize Google API
  async initialize() {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        resolve();
        return;
      }

      // Load Google API script
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('auth2', async () => {
          try {
            await window.gapi.auth2.init({
              client_id: GOOGLE_CLIENT_ID,
              scope: 'profile email'
            });
            this.gapi = window.gapi;
            this.isInitialized = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Sign in with Google
  async signIn() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const authInstance = this.gapi.auth2.getAuthInstance();
      const result = await authInstance.signIn();
      
      const profile = result.getBasicProfile();
      const authResponse = result.getAuthResponse();

      return {
        success: true,
        user: {
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          picture: profile.getImageUrl(),
          given_name: profile.getGivenName(),
          family_name: profile.getFamilyName()
        },
        token: authResponse.id_token,
        accessToken: authResponse.access_token
      };
    } catch (error) {
      console.error('Google sign in error:', error);
      return {
        success: false,
        error: error.error || 'Đăng nhập Google thất bại'
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      if (this.isInitialized && this.gapi) {
        const authInstance = this.gapi.auth2.getAuthInstance();
        await authInstance.signOut();
      }
      return { success: true };
    } catch (error) {
      console.error('Google sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is signed in
  isSignedIn() {
    if (!this.isInitialized || !this.gapi) {
      return false;
    }
    const authInstance = this.gapi.auth2.getAuthInstance();
    return authInstance.isSignedIn.get();
  }

  // Get current user
  getCurrentUser() {
    if (!this.isSignedIn()) {
      return null;
    }
    
    const authInstance = this.gapi.auth2.getAuthInstance();
    const user = authInstance.currentUser.get();
    const profile = user.getBasicProfile();
    
    return {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      picture: profile.getImageUrl()
    };
  }
}

export default new GoogleAuthService();