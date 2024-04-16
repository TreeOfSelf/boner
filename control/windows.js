// Select all elements with the 'window' class
const windows = document.querySelectorAll('.window');

// Loop through each window and add event listeners
windows.forEach(window => {
    const titleBar = window.querySelector('.title-bar');
    const resizeHandle = window.querySelector('.resize-handle');

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    titleBar.addEventListener('mousedown', startDrag);
    resizeHandle.addEventListener('mousedown', startResize);

    function startDrag(event) {
        isDragging = true;
        startX = event.clientX - window.getBoundingClientRect().left;
        startY = event.clientY - window.getBoundingClientRect().top;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    function startResize(event) {
        isDragging = true;
        startWidth = window.offsetWidth;
        startHeight = window.offsetHeight;
        startX = event.clientX;
        startY = event.clientY;

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopDrag);
    }

    function drag(event) {
        if (isDragging) {
            const newX = event.clientX - startX;
            const newY = event.clientY - startY;

            window.style.left = `${newX}px`;
            window.style.top = `${newY}px`;
        }
    }

    function resize(event) {
        if (isDragging) {
            const newWidth = startWidth + (event.clientX - startX);
            const newHeight = startHeight + (event.clientY - startY);

            window.style.width = `${newWidth}px`;
            window.style.height = `${newHeight}px`;
        }
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopDrag);
    }

    // Close button functionality for each window
    const closeButton = window.querySelector('.close-button');
    closeButton.addEventListener('click', () => window.style.display = 'none');
});
