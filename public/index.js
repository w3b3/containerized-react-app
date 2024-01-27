"use strict";

function fetchUserProfile() {
  // if (sessionStorage.getItem("userName")) {
  // console.error("User already authenticated");
  // how to handle when the token expires?
  // return;
  // }
  const authToken = sessionStorage.getItem("authToken");

  if (!authToken) {
    console.error("No auth token found");
    return;
  }

  fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      response.json();
    })
    .then((data) => {
      // console.log("User Info:", data);
      // save the user's name to sessionStorage
      sessionStorage.setItem("userName", data.name);
      sessionStorage.setItem("userEmail", data.email);
      document.getElementById("login").textContent = data.email;
      document.getElementById("logout").style.display = "block";
      // data.name for the user's name
      // data.email for the user's email
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
    });
}

let nextPageToken = "";

// Call this function to fetch the next set of results
function fetchNextPage() {
  if (nextPageToken) {
    // fetchSubscriptions(nextPageToken);
  } else {
    console.log("No more pages to fetch");
  }
}

function signup(email = "", password = "") {
  // console.log(id, auth);
  try {
    fetch("https://api.codein.ca/new", {
      method: "POST",
      headers: {
        //Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      // body must be deserialized/unpacked in the destination.
      // the body content is a string
      // body: JSON.stringify({ auth, id }),
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        // console.log("all NOT good YET with sign up", response);
        if (!response.ok) {
          const X = JSON.stringify(response);
          // const X = "something went wrong with sign up";
          console.error(X);
          showToast(X);
          throw new Error(X);
        }
        // showToast("sign up 1");
        return response.json();
      })
      .then((data) => {
        // console.log("sign up 2", data);
        // showToast("sign up 2");
        // document.getElementById(id).style.display = "none";
        return data;
      })
      .catch((error) => {
        showToast(error);
        console.error(error);
      });
  } catch (error) {
    const X = JSON.stringify(error);
    showToast(X);
    console.error(X);
  }
}

// show fixed toast message with message passed as parameter to this function
function showToast(message) {
  const base_toast = document.getElementById("toast");
  const new_toast = document.createElement("h2");
  new_toast.classList.add("my_toast");
  // new_toast.classList.add("show");

  new_toast.textContent = message;
  // new_toast.classList.add("show");
  // setTimeout(function () {
  // new_toast.style.display = "none";
  // }, 10000);
  base_toast.appendChild(new_toast);
}

document.addEventListener("DOMContentLoaded", function () {
  console.info("DOM loaded and parsed");
  // if (sessionStorage.getItem("authToken")) {
  //    fetchUserProfile();
  // fetchSubscriptions();
  // document.getElementById("logout").style.display = "block";
  // } else {
  // document.getElementById("load-more").style.display = "none";
  // document.getElementById("logout").style.display = "none";
  // }
});
