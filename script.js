
window.addEventListener('load', function() {
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    
    
    let circles = [];
    let selectedCircle = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    
    const draw = function() {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        
        circles.forEach(function(circle) {
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            
            
            ctx.fillStyle = (circle === selectedCircle) ? 'red' : 'blue';
            
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        });
    };

    
    const isInsideCircle = function(mouseX, mouseY, circle) {
        const dx = mouseX - circle.x;
        const dy = mouseY - circle.y;
        
        return Math.sqrt(dx * dx + dy * dy) < circle.radius;
    };
    
   canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let clickedOnCircle = false;

    
    for (let i = circles.length - 1; i >= 0; i--) {
        if (isInsideCircle(mouseX, mouseY, circles[i])) {
            selectedCircle = circles[i]; // Turn it Red
            isDragging = true;
            dragOffset.x = mouseX - selectedCircle.x;
            dragOffset.y = mouseY - selectedCircle.y;
            clickedOnCircle = true;
            break; 
        }
    }

    
    if (!clickedOnCircle) {
        const newCircle = {
            x: mouseX,
            y: mouseY,
            radius: 20
        };
        circles.push(newCircle);
        selectedCircle = null;
    }

    draw();
});

    
    canvas.addEventListener('mousemove', function(e) {
        if (isDragging && selectedCircle) {
            const rect = canvas.getBoundingClientRect();
            selectedCircle.x = (e.clientX - rect.left) - dragOffset.x;
            selectedCircle.y = (e.clientY - rect.top) - dragOffset.y;
            draw();
        }
    });

    
    window.addEventListener('mouseup', function() {
        isDragging = false;
    });

    
    canvas.addEventListener('wheel', function(e) {
        if (selectedCircle) {
            e.preventDefault();

            
            if (e.deltaY < 0) {
                selectedCircle.radius += 2;
            } else {
                
                selectedCircle.radius = Math.max(5, selectedCircle.radius - 2);
            }
            draw();
        }
    }, { passive: false });

    
    window.addEventListener('keydown', function(e) {
        if ((e.key === 'Delete' || e.key === 'Backspace') && selectedCircle) {
            
            circles = circles.filter(function(c) {
                return c !== selectedCircle;
            });
            selectedCircle = null;
            draw();
        }
    });

    
    draw();
});