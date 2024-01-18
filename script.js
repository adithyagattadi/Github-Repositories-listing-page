const repoListContainer = document.getElementById('repositories-list');
const paginationContainer = document.getElementById('pagination');

async function fetchRepositories() {
    const username = document.getElementById('username').value;
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    try {
        const response = await fetch(apiUrl);
        const repositories = await response.json();
        displayRepositories(repositories);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        repoListContainer.innerHTML = '<p>Error fetching repositories. Please try again.</p>';
    }
}

function displayRepositories(repositories) {
    repoListContainer.innerHTML = '';

    if (repositories.length === 0) {
        repoListContainer.innerHTML = '<p>No repositories found for the given user.</p>';
        return;
    }

    repositories.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');

        const repoName = document.createElement('h3');
        repoName.textContent = repo.name;

        const repoDescription = document.createElement('p');
        repoDescription.textContent = repo.description || 'No description available.';

        repoCard.appendChild(repoName);
        repoCard.appendChild(repoDescription);

        repoListContainer.appendChild(repoCard);
    });
    const pageCount = Math.ceil(repositories.length / 10);
    renderPagination(pageCount);
}
function renderPagination(pageCount) {
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => changePage(i));
        paginationContainer.appendChild(pageButton);
    }
}

function changePage(pageNumber) {
    const username = document.getElementById('username').value;
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(repositories => {
            const startIndex = (pageNumber - 1) * 10;
            const endIndex = startIndex + 10;
            const slicedRepositories = repositories.slice(startIndex, endIndex);

            displayRepositories(slicedRepositories);
        })
        .catch(error => {
            console.error('Error fetching repositories:', error);
            repoListContainer.innerHTML = '<p>Error fetching repositories. Please try again.</p>';
        });
}

