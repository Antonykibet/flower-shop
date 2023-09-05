let formDiv = document.getElementById('formDiv')
let altOptions = document.getElementById('altOptions')
function renderSignup(){
    formDiv.innerHTML=`
    <form id="loginForm" action="/signUp" method="post">
        <input class="formInput" type="text" name="firstname" id="firstname" placeholder="Firstname" required>
        <input class="formInput" type="text" name="lastname" placeholder="Lastname" id="lastname"  required>
        <input class="formInput" type="text" name="email" placeholder="Email" id="email"  required><br>
        <input class="formInput" type="text" name="password" placeholder="Password" id="password"  required><br>
        <input class="formInput" type="text" name="confirmPassword" placeholder="Confirm Password" id="confirmPassword"  required><br>
        <button class="submitBtn" id='signBtn' type="submit">Sign Up</button>
    </form>`
    altOptions.innerHTML=`
    <p>Or Sign up with</p>
    <button class="altButton" type="submit">
        <img class="icon" src="/icons/google Icon.png" alt="">
        Google
    </button>
    <button class="altButton" type="submit">
        <img id="facebook" class="icon" src="/icons/facebook icon.png" alt="">
        Facebook
    </button>
    <p></p>
    `
}