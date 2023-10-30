/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react')

export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        colors: {
            primary: '#57BEE6',
            secondary: '#FEAE49',
            'false-dark-gray': '#3D424A',
            'false-light-gray': '#C0C0BE',
            'false-white': '#E6E5DE'
        },
        fontFamily: {
            sans: ['"Inter"', 'sans-serif'],
            poppins: ['Poppins', 'sans-serif']
        },
        extend: {}
    },
    darkMode: 'class',
    plugins: [
        nextui({
            colors: {
                primary: '#57BEE6',
                secondary: '#FEAE49',
                'false-dark-gray': '#3D424A',
                'false-light-gray': '#C0C0BE',
                'false-white': '#E6E5DE'
            }
        })
    ]
}
