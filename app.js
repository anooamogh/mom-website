const paintings = [
  "paintings/starry-night.jpg",
  "paintings/olive-trees.jpg",
  "paintings/cafe-terrace-at-night.jpg",
  "paintings/the-harvest.jpg"
];

const dayIndex = Math.floor(Date.now() / 86400000) % paintings.length;

document.body.style.backgroundImage = `url('${paintings[dayIndex]}')`;

fetch("message.json")
  .then(res => res.json())
  .then(data => {
    // Check if message_file exists (new structure)
    if (data.message_file) {
      return fetch(data.message_file).then(res => res.text());
    } else if (data.message) {
      // Fallback to old structure
      return Promise.resolve(data.message);
    }
    throw new Error('No message found');
  })
  .then(message => {
    document.getElementById("message").textContent = message;
  })
  .catch(() => {
    document.getElementById("message").textContent = "Hope you have an amazing day ❤️";
  });

// Make the heart button clickable to navigate to message input page
document.getElementById("heartBtn").addEventListener("click", () => {
  window.location.href = "/message-input";
});
