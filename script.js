document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gradientCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const lerp = (a, b, t) => a + (b - a) * t;
  const hue = (angle) => {
    const adjustedAngle = angle % 360;
    if (adjustedAngle >= 120 && adjustedAngle <= 180) {
      return `hsl(${lerp(adjustedAngle, adjustedAngle + 30, 0.5)}, 100%, 75%)`;
    } else {
      return `hsl(${adjustedAngle}, 100%, 75%)`;
    }
  };

  let targetX = canvas.width / 2;
  let targetY = canvas.height / 2;
  let currentX = targetX;
  let currentY = targetY;
  let lastX = currentX;
  let lastY = currentY;
  let angleOffset = 0;

  const drawGradient = (x, y) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * 0.8);

    for (let i = 210; i <= 330; i += 5) {
      const color = hue(angleOffset + i);
      gradient.addColorStop(lerp(0, 1, (i - 210) / 120), color);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const onMouseMove = (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  };

  const animate = () => {
    currentX = lerp(currentX, targetX, 0.05);
    currentY = lerp(currentY, targetY, 0.05);

    if (currentX.toFixed(2) !== lastX.toFixed(2) || currentY.toFixed(2) !== lastY.toFixed(2)) {
      angleOffset = (angleOffset + 1) % 360;
      drawGradient(currentX, currentY);
      lastX = currentX;
      lastY = currentY;
    }

    requestAnimationFrame(animate);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    targetX = canvas.width / 2;
    targetY = canvas.height / 2;
  });

  const handleInteraction = (e) => {
    targetX = e.clientX || e.touches[0].clientX;
    targetY = e.clientY || e.touches[0].clientY;
  };

  window.addEventListener('mousemove', handleInteraction);
  window.addEventListener('touchmove', handleInteraction);

  let interactionTimeout;

  const hideSmooshText = () => {
    const smooshText = document.getElementById('smooshText');
    smooshText.style.opacity = '0';
  };

  const handleSmooshText = () => {
    if (interactionTimeout) {
      clearTimeout(interactionTimeout);
    }
    interactionTimeout = setTimeout(hideSmooshText, 500);
  };

  window.addEventListener('mousemove', handleSmooshText);
  window.addEventListener('touchmove', handleSmooshText);

  drawGradient(currentX, currentY);
  animate();
});
