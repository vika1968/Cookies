
//--------Hide and show password------------------
let pwElement: HTMLInputElement;
function showPassword(event: any) {
  if (event.target.getAttribute("id") == `togglePasswordLogin`) {
    pwElement = document.getElementById("idPasswordLogin") as HTMLInputElement;
  }
  if (event.target.getAttribute("id") == `togglePasswordRegister`) {
    pwElement = document.getElementById("idPasswordRegister") as HTMLInputElement;
  }
  if (event.target.getAttribute("id") == `togglePasswordUpdate`) {
    pwElement = document.getElementById("idPasswordUpdate") as HTMLInputElement;
  }
  if (event.target.getAttribute("id") == `togglePasswordRemove`) {
    pwElement = document.getElementById("idPasswordRemove") as HTMLInputElement;
  }
  pwElement.type === "password" ? pwElement.type = "text" : pwElement.type = "password";
}


//-------User registration (client side)------------------
async function handleRegister(event: any) {
  try {

    event.preventDefault();

    const fname = event.target.elements.idFirstNameRegister.value;
    const lname = event.target.elements.idLastNameRegister.value;
    const password = event.target.elements.idPasswordRegister.value;
    const email = event.target.elements.idEmailRegister.value;

    //@ts-ignore
    const { data } = await axios.post("/api/v1/users/register", { firstname: fname, lastname: lname, email, password });

    if (!data.success) {
      throw new Error('Something went wrong.');
    }
    else {
      window.location.href = "./home.html";
    }

  } catch (error) {
    console.error(error);
  }
}

//-------User login (client side)------------------
async function handleLogin(event: any) {

  try {
    event.preventDefault();

    const password = event.target.elements.idPasswordLogin.value;
    const email = event.target.elements.idEmailLogin.value;

    //@ts-ignore
    const { data } = await axios.post("/api/v1/users/login", { email, password });
    const { success, userDB } = data;

    if (success) {
      window.location.href = "./home.html";
    }
    else
      alert("Email and Password don't match.");
  } catch (error) {
    console.error(error);
  }
}

//-------Identify user by cookie (client side)------------------
async function getUserFromCookie() {
  try {
    //@ts-ignore
    const { data } = await axios.get("/api/v1/users/get-user-by-cookie");
    const { userDB } = data;

    const user = document.querySelector(".userCookie") as HTMLHeadElement;
    if (userDB) {
      user.innerText = `Welcome Home : ${userDB.email}`;
    }
    else {     
      window.location.href = "./index.html";
      alert ("Sorry, we didn't recognize you.")
   
    }

  } catch (error) {
    console.error(error);
  }
}

//-------Identify user by cookie and prevent moving to 'login' and 'register' page (client side)------------------
async function handleCheckIfUserIsConnectedOrManualReload() {
  try {
    //@ts-ignore
    const { data } = await axios.get("/api/v1/users/get-user-by-cookie");
    const { userDB } = data;

    //@ts-ignore
    if (userDB && (performance.getEntriesByType("navigation")[0].type == "reload" || performance.getEntriesByType("navigation")[0].type == "navigate")) {
      console.log(`The page was manually reloaded or first using`);
      window.location.href = "./home.html";
      const user = document.querySelector(".userCookie") as HTMLHeadElement;
      user.innerText = `Welcome Home : ${userDB.email}`;
    }

  } catch (error) {
    console.error(error);
  }
}

//-------Logout User (client side)------------------
async function handleLogoutUser() {
  try {
    //@ts-ignore
    const { data } = await axios.get("/api/v1/users/logout");
    const { logout } = data;

    if (logout) window.location.href = "./index.html";
  } catch (error) {
    console.error(error);
  }
}
//-------Update User (client side)------------------
async function handleUpdateUser(event: any) {
  try {
    event.preventDefault();

    const email = (document.querySelector(`.clsEmailUpdate`) as HTMLInputElement).value;
    const password = (document.querySelector(`.clsPasswordUpdate`) as HTMLInputElement).value;

    if (email == ``) {
      alert(`Please, fill email field to update your password!`);
      return;
    }

    //@ts-ignore      
    const { data } = await axios.post(`/api/v1/users/update/${email}`, { password });
    const { success, userDB } = data;

    if (success) {
      alert(`Password updated!`);
      window.location.href = "./login.html";
    }
    else {
      alert(`No user found!`);
    }

  } catch (error) {
    console.error(error);
  }
}

//-------Remove User (client side)------------------
async function handleRemoveUser(event: any) {
  try {
    event.preventDefault();

    const email = (document.querySelector(`.clsEmailRemove`) as HTMLInputElement).value;

    if (email == ``) {
      alert(`Please, fill email field to remove user!`);
      return;
    }

    //@ts-ignore
    const { data } = await axios.delete(`/api/v1/users/${email}`);
    const { success, userDB } = data;

    if (success) {
      alert(`User removed!`);
      window.location.href = "./index.html";
    }

  } catch (error) {
    console.error(error);
  }
}
