const paintings = [
  "paintings/starry-night.jpg",
  "paintings/olive-trees.jpg",
  "paintings/cafe-terrace-at-night.jpg",
  "paintings/the-harvest.jpg",
  "paintings/monet1.jpg",
  "paintings/monet2.jpg",
  "paintings/monet3.jpg",
  "paintings/monet4.jpg",
  "paintings/monet5.jpg",
];

const chicagoNow = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
const dayIndex = Math.floor(chicagoNow.getTime() / 86400000) % paintings.length;

document.body.style.backgroundImage = `url('${paintings[dayIndex]}')`;

fetch("message.json")
  .then(res => res.json())
  .then(data => {
    document.getElementById("message").textContent = data.message;
  })
  .catch(() => {
    document.getElementById("message").textContent = "Hope you have an amazing day ❤️";
  });
