// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyChb3uPMOAVpPE0LNYAYLsK1-oT94cFtmk",
    authDomain: "multiplayer-webapp-game.firebaseapp.com",
    projectId: "multiplayer-webapp-game",
    storageBucket: "multiplayer-webapp-game.appspot.com",
    messagingSenderId: "494051390021",
    appId: "1:494051390021:web:83cf4a229122f80d6ee92c",
    measurementId: "G-4Y4RWH5MZB"
  };
  
firebase.initializeApp(firebaseConfig);

// Get form elements
const form = document.querySelector("#login-form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const error = document.querySelector("#error");

// Add submit event listener to the form
form.addEventListener("submit", function(event) {
    console.log("login intiaited")
  event.preventDefault();

  // Get the email and password values
  const emailValue = email.value;
  const passwordValue = password.value;

  // Reference to the users collection in Firebase
  var usersRef = firebase.firestore().collection("users");

  // Query the users collection for a user with the matching email
  usersRef.where("email", "==", emailValue)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(user) {
        // Get the user data
        var userData = user.data();

        // Check if the password matches
        if (userData.password === passwordValue) {
          // Redirect to home page on successful login
          window.location.href = "../html/main.html";
        } else {
          // Show error message if password doesn't match
          error.innerHTML = "Incorrect email or password.";
        }
      });
    })
    .catch(function(error) {
      // Show error message if there's an issue with the query
      error.innerHTML = error.message;
    });
});