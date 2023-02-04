"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//--------Hide and show password------------------
let pwElement;
function showPassword(event) {
    if (event.target.getAttribute("id") == `togglePasswordLogin`) {
        pwElement = document.getElementById("idPasswordLogin");
    }
    if (event.target.getAttribute("id") == `togglePasswordRegister`) {
        pwElement = document.getElementById("idPasswordRegister");
    }
    if (event.target.getAttribute("id") == `togglePasswordUpdate`) {
        pwElement = document.getElementById("idPasswordUpdate");
    }
    if (event.target.getAttribute("id") == `togglePasswordRemove`) {
        pwElement = document.getElementById("idPasswordRemove");
    }
    pwElement.type === "password" ? pwElement.type = "text" : pwElement.type = "password";
}
//-------User registration (client side)------------------
function handleRegister(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            event.preventDefault();
            const fname = event.target.elements.idFirstNameRegister.value;
            const lname = event.target.elements.idLastNameRegister.value;
            const password = event.target.elements.idPasswordRegister.value;
            const email = event.target.elements.idEmailRegister.value;
            //@ts-ignore
            const { data } = yield axios.post("/api/v1/users/register", { firstname: fname, lastname: lname, email, password });
            if (!data.success) {
                throw new Error('Something went wrong.');
            }
            else {
                window.location.href = "./home.html";
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
//-------User login (client side)------------------
function handleLogin(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            event.preventDefault();
            const password = event.target.elements.idPasswordLogin.value;
            const email = event.target.elements.idEmailLogin.value;
            //@ts-ignore
            const { data } = yield axios.post("/api/v1/users/login", { email, password });
            const { success, userDB } = data;
            sessionStorage.setItem("id", userDB._id);
            if (success) {
                window.location.href = "./home.html";
            }
            else
                alert("Email and Password don't match.");
        }
        catch (error) {
            console.error(error);
        }
    });
}
function getUserFromCookie() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //@ts-ignore
            const { data } = yield axios.get("/api/v1/users/get-user-by-cookie");
            const { userDB } = data;
            console.log(userDB);
            //@ts-ignore
            console.log(performance.getEntriesByType("navigation")[0].type);
            const user = document.querySelector(".userCookie");
            if (userDB) {
                user.innerText = `Welcome Home : ${userDB.email}`;
            }
            else {
                user.innerText = `Welcome Home`;
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
function handleCheckIfUserIsConnectedOrManualReload() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //@ts-ignore
            const { data } = yield axios.get("/api/v1/users/get-user-by-cookie");
            const { userDB } = data;
            console.log(userDB);
            //@ts-ignore
            console.log(performance.getEntriesByType("navigation")[0].type);
            //@ts-ignore
            if (userDB && (performance.getEntriesByType("navigation")[0].type == "reload" || performance.getEntriesByType("navigation")[0].type == "navigate")) {
                console.log(`The page was manually reloaded or first using `);
                window.location.href = "./home.html";
                const user = document.querySelector(".userCookie");
                user.innerText = `Welcome Home : ${userDB.email}`;
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
function handleLogoutUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //@ts-ignore
            const { data } = yield axios.get("/api/v1/users/logout");
            const { logout } = data;
            sessionStorage.removeItem("id");
            if (logout)
                window.location.href = "./index.html";
        }
        catch (error) {
            console.error(error);
        }
    });
}
function handleUpdateUser(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            event.preventDefault();
            const email = document.querySelector(`.clsEmailUpdate`).value;
            const password = document.querySelector(`.clsPasswordUpdate`).value;
            if (email == ``) {
                alert(`Please, fill email field to update your password!`);
                return;
            }
            //@ts-ignore      
            const { data } = yield axios.post(`/api/v1/users/update/${email}`, { password });
            const { success, userDB } = data;
            if (success) {
                alert(`Password updated!`);
                window.location.href = "./login.html";
            }
            else {
                alert(`No user found!`);
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
function handleRemoveUser(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            event.preventDefault();
            const email = document.querySelector(`.clsEmailRemove`).value;
            if (email == ``) {
                alert(`Please, fill email field to remove user!`);
                return;
            }
            //@ts-ignore
            const { data } = yield axios.delete(`/api/v1/users/${email}`);
            const { success, userDB } = data;
            if (success) {
                alert(`User removed!`);
                window.location.href = "./index.html";
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
