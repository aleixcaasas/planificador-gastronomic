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
            'false-blue': '#57BEE6',
            'false-orange': '#FEAE49',
            'false-dark-gray': '#3D424A',
            'false-light-gray': '#C0C0BE',
            'false-white': '#E6E5DE'
        },
        fontFamily: {
            sans: ['"Inter"', 'sans-serif'],
            poppins: ['Poppins', 'sans-serif'],
            raleway: ['Raleway', 'sans-serif']
        },
        extend: {}
    },
    darkMode: 'class',
    plugins: [
        nextui({
            themes: {
                light: {
                    colors: {
                        secondary: '#57BEE6',
                        primary: 'rgb(254, 174, 73)',
                        'false-light-gray': '#C0C0BE',
                        'false-dark-gray': '#3D424A',
                        'false-white': '#E6E5DE',
                        danger: 'rgb(254, 174, 73)'
                    }
                }
            }
        })
    ]
}
