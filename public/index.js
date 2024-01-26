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

function fetchSubscriptions(pageToken) {
  const authToken = sessionStorage.getItem("authToken");

  if (!authToken) {
    console.error("No auth token found");
    return;
  }

  let url = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet,contentDetails&mine=true&maxResults=50`;

  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }

  fetch(url, {
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
      return response.json();
    })
    .then((data) => {
      displaySubscriptions(data.items);
      nextPageToken = data.nextPageToken || "";
    })
    .catch((error) => {
      console.error("Error fetching subscriptions:", error);
    });
}

// Call this function to fetch the next set of results
function fetchNextPage() {
  if (nextPageToken) {
    fetchSubscriptions(nextPageToken);
  } else {
    console.log("No more pages to fetch");
  }
}

function displaySubscriptions(subscriptions) {
  const list = document.getElementById("posts");
  list.innerHTML = ""; // Clear existing list

  subscriptions.forEach((sub) => {
    const listItem = document.createElement("section");
    //listItem.textContent = sub.snippet.title;
    listItem.id = sub.id;
    listItem.className = "card";
    listItem.innerHTML = `
                    <span class="icon">💕</span>
                    <h1 class='title'>foo</h1>
                    <a class="link">Go to the channel</a>
                `;
    // move the textContent above to inside the element with class = title
    const titleElement = listItem.querySelector("h1.title");
    titleElement.textContent = sub.snippet.title;
    const imageElement = document.createElement("img");
    imageElement.src = sub.snippet.thumbnails.default.url;
    imageElement.alt = sub.snippet.title;
    // imageElement.width = 100;
    // imageElement.height = 100;
    imageElement.className = "thumbnail";
    titleElement.appendChild(imageElement);
    const linkElement = listItem.querySelector("a.link");
    linkElement.href = `https://youtube.com/channel/${sub.snippet.resourceId.channelId}`;
    linkElement.target = "_blank";
    linkElement.rel = "noopener noreferrer";
    // link color should be blue and bold
    linkElement.style.color = "blue";
    linkElement.style.fontWeight = "bold";
    if (sub.contentDetails.newItemCount > 0) {
      linkElement.textContent = `🆕 Recently released ${sub.contentDetails.newItemCount} videos`;
    }
    // show the span.icon only if contentDetails.totalItemCount is greater than 3000
    const iconElement = listItem.querySelector("span.icon");
    iconElement.style.display =
      sub.contentDetails.totalItemCount >= 10000 ? "unset" : "none";
    const unsubscribeElement = document.createElement("button");
    unsubscribeElement.textContent = sub.id;
    unsubscribeElement.dataset.subscriptionId = sub.id;
    unsubscribeElement.onclick = function () {
      const subId = this.dataset.subscriptionId;
      // const authToken = sessionStorage.getItem("authToken");
      // unsubscribe(authToken, subId);
      unsubscribe(subId);
    };
    listItem.appendChild(unsubscribeElement);
    list.appendChild(listItem);
  });
}

function unsubscribe(id) {
  // console.log(id, auth);
  try {
    fetch("https://api.codein.ca/unsubscribe", {
      method: "POST",
      headers: {
        //Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      // body must be deserialized/unpacked in the destination.
      // the body content is a string
      // body: JSON.stringify({ auth, id }),
      body: JSON.stringify({ id }),
    })
      .then((response) => {
        console.log("all NOT good YET with unsubscription", response);
        if (!response.ok) {
          throw new Error(JSON.stringify(response));
        }
        return response.json();
      })
      .then((data) => {
        console.log("all good with unsubscription", data);
        document.getElementById(id).style.display = "none";
        return "all good";
      })
      .catch((error) => {
        console.error("Error FETCH subscriptions:", error);
      });
  } catch (error) {
    console.error("Error TRY/CATCH fetching subscriptions:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (sessionStorage.getItem("authToken")) {
    //    fetchUserProfile();
    fetchSubscriptions();
    document.getElementById("logout").style.display = "block";
  } else {
    document.getElementById("load-more").style.display = "none";
    document.getElementById("logout").style.display = "none";
  }
});
