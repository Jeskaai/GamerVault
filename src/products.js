// Función para resolver la ruta de la imagen dinámicamente
const getImg = (path) => new URL(`./${path}`, import.meta.url).href;

export const products = [
    { id: 1, name: "RTX 5090 Ti FE", price: 2199, category: "GPU", image: getImg("assets/img/1.jpg") },
    { id: 2, name: "Ryzen 9 9950X", price: 699, category: "CPU", image: getImg("assets/img/2.jpg") },
    { id: 3, name: "32GB DDR5 7200MHz", price: 180, category: "RAM", image: getImg("assets/img/3.jpg") },
    { id: 4, name: "Monitor 4K 240Hz OLED", price: 1299, category: "DISPLAY", image: getImg("assets/img/4.jpg") },
    { id: 5, name: "SSD 4TB Gen5 NVMe", price: 450, category: "STORAGE", image: getImg("assets/img/5.jpg") },
    { id: 6, name: "Liquid Cooling 360mm", price: 220, category: "COOLING", image: getImg("assets/img/6.jpg") },
    { id: 7, name: "Keyboard HE Magnetic", price: 190, category: "PERIPHERALS", image: getImg("assets/img/7.jpg") },
    { id: 8, name: "Mouse Ultra-light 8K", price: 140, category: "PERIPHERALS", image: getImg("assets/img/8.jpg") },
    { id: 9, name: "Case Full Tower Glass", price: 280, category: "CASE", image: getImg("assets/img/9.jpg") }
];