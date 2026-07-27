/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                "12": "repeat(12, minmax(0, 1fr))",
                custom: "1fr 1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
            },
        },
    },
    plugins: [],
};