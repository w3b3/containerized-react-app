'use strict';

function fetchUserProfile() {
  if (sessionStorage.getItem("userName")) {
    // console.error("User already authenticated");
    // how to handle when the token expires?
    return;
  }
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
    .then((response) => response.json())
    .then((data) => {
      console.log("User Info:", data);
      // save the user's name to sessionStorage
      sessionStorage.setItem("userName", data.name);
      sessionStorage.setItem("userEmail", data.email);
      document.getElementById("login").textContent = data.email;
      document.getElementById("logout").style.display = "initial";
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
    list.appendChild(listItem);
  });
}

if (sessionStorage.getItem("authToken")) {
  fetchUserProfile();
  fetchSubscriptions();
  document.getElementById("logout").style.display = "block";
} else {
  document.getElementById("logout").style.display = "none";
}
