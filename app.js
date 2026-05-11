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
    document.getElementById("message").textContent = data.message;
  })
  .catch(() => {
    document.getElementById("message").textContent = "Hope you have an amazing day ❤️";
  });
