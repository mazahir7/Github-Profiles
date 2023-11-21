"use strict";

const searchUser = document.getElementById("search-name");
const userDetails = document.querySelector(".github-card");

const togglerBg = document.querySelector(".toggler");
const modeToggler = document.querySelector(".switch");
const htmlEl = document.documentElement;

const APIURL = "https://api.github.com/users/";


searchUser.addEventListener("keydown", (e) => {

  if (e.key === "Enter") {
    const user = searchUser.value;

    if (user) {
      getUserData(user);
      userDetails.style.padding = "2.6rem";
    }
    searchUser.value = "";
  }
});

async function getUserData(username) {

  try {
    const { data } = await axios(APIURL + username);
    showUserData(data);
    getRepos(username);
  }
  catch (err) {
    if (err.response.status == 404) {
      showNoUserFound("No profile with this username");
    }
    else if (err.response.status == 403) {
      showNoUserFound("Github API limit exceeded. Try again after 30-60 minutes");
    }
  }

}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    addReposToUserDetails(data);

  }
  catch (err) {

    showNoUserFound("No profile with this username");
  }

}

function showUserData(user) {

  const userInfo = `
    <div class="profile-image">
      <img src="${user.avatar_url}" alt="${user.name}">
    </div>

    <div class="profile-details">
      <h2 class="username">${user.name}</h2>
      <p class="user-desc">${user.bio}</p>
      <div class="user-metrics">
        <div>
          <span class="follower-count">${user.followers}</span>
          <span>Followers</span>
        </div>
        <div>
          <span class="following-count">${user.following}</span>
          <span>Following</span>
        </div>
        <div>
          <span class="repo-count">${user.public_repos}</span>
          <span>Repos</span>
        </div>
      </div>

      <div class="repo-section">
      </div>
    </div>
  `;

  userDetails.innerHTML = userInfo;
}

function addReposToUserDetails(repos) {

  const userReposContainer = document.querySelector(".repo-section");

  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    userReposContainer.appendChild(repoEl);
  });

}

function showNoUserFound(msg) {
  userDetails.innerHTML = `<h1>${msg}</h1>`;
}




modeToggler.addEventListener("click", () => {
  togglerBg.classList.toggle("dark");
  modeToggler.classList.toggle("dark");
  htmlEl.classList.toggle("light");
});