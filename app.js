/*
Initially created from chatGPT with prompt:
Create a lookalike clone of the visual studio code editor interface using HTML and CSS.
It should have the ability to switch between fake source code tabs which actually just
display images instead of source code.
*/

// Get all tabs and contents
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');

// Add click event to each tab
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove 'active' class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));

        // Add 'active' class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });
});
