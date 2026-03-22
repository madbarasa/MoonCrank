// 获取 Canvas 和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置 Canvas 尺寸为全屏
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 游戏状态和对象 (由 resetGame 初始化)
let gameState;
let lander;
let terrain;

// 月球表面地形生成
function generateTerrain() {
    terrain = [];
    // 随机生成地形高度
    for (let i = 0; i <= CONFIG.TERRAIN_SEGMENTS; i++) {
        terrain.push({
            x: i * (canvas.width / CONFIG.TERRAIN_SEGMENTS),
            y: canvas.height - (CONFIG.TERRAIN_MIN_HEIGHT + Math.random() * (CONFIG.TERRAIN_MAX_HEIGHT - CONFIG.TERRAIN_MIN_HEIGHT))
        });
    }

    // 确保有多个平坦的着陆区域
    const numberOfLandingZones = 3; // Or any number you prefer
    let landingZones = [];
    for (let j = 0; j < numberOfLandingZones; j++) {
        const flatZoneStartSegment = Math.floor(Math.random() * (CONFIG.TERRAIN_SEGMENTS - 5)); // Ensure space for the zone
        const flatZoneY = canvas.height - (CONFIG.TERRAIN_MIN_HEIGHT + Math.random() * 20); // Landing zones are relatively low

        for (let i = flatZoneStartSegment; i < flatZoneStartSegment + 4; i++) {
            if (terrain[i]) {
                terrain[i].y = flatZoneY;
            }
        }
        // Store the start of the landing zone for McDonald's placement
        if (terrain[flatZoneStartSegment]) {
            landingZones.push({x: terrain[flatZoneStartSegment].x, y: flatZoneY});
        }
    }

    // Spawn McDonald's on a random landing zone
    if (Math.random() < CONFIG.MCDONALDS_SPAWN_CHANCE && landingZones.length > 0) {
        const zoneIndex = Math.floor(Math.random() * landingZones.length);
        const zone = landingZones[zoneIndex];
        mcdonalds.visible = true;
        mcdonalds.x = zone.x + 20; // Place it slightly into the zone
        mcdonalds.y = zone.y - mcdonalds.height;
    }
}

// 游戏重置或初始化函数
function resetGame() {
    lander = {
        x: canvas.width / 2, // 初始水平位置
        y: 50, // 初始垂直位置
        vx: 0, // 水平速度
        vy: 0, // 垂直速度
        fuel: CONFIG.MAX_FUEL, // 燃料
        angle: Math.PI / 2, // 角度 (90度向上)
        thrusting: false, // 是否正在推进
        rotatingLeft: false, // 是否正在向左旋转
        rotatingRight: false // 是否正在向右旋转
    };
    // Reset astronaut
    astronaut.visible = false;
    astronaut.flagPlanted = false;
    astronaut.animationFrame = 0;
    generateTerrain(); // 重新生成地形
    gameState = CONFIG.GAME_STATE_START; // 设置为开始状态
    // Reset camera
    camera.x = canvas.width / 2;
    camera.y = canvas.height / 2;
    camera.zoom = 1;
}

// 绘制文本的辅助函数
function drawText(text, x, y, color = CONFIG.TEXT_COLOR, align = 'left', baseline = 'top', font = `16px 'Courier New', Courier, monospace`) {
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.font = font;
    ctx.fillText(text, x, y);
}

let mcdonalds = {
    x: 0,
    y: 0,
    width: 50,
    height: 30,
    visible: false
};

let astronaut = {
    x: 0,
    y: 0,
    visible: false,
    flagPlanted: false,
    animationFrame: 0
};

let camera = {
    x: 0,
    y: 0,
    zoom: 1
};

// 绘制游戏元素
function draw() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    // 应用镜头变换
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);

    // 绘制月球表面 (矢量风格)
    ctx.strokeStyle = CONFIG.UI_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(terrain[0].x, terrain[0].y);
    for (let i = 1; i < terrain.length; i++) {
        ctx.lineTo(terrain[i].x, terrain[i].y);
    }
    ctx.stroke();

    // 只有在非开始状态下才绘制登月舱
    if (gameState !== CONFIG.GAME_STATE_START) {
        // 绘制登月舱 (矢量线框风格)
        ctx.strokeStyle = CONFIG.UI_COLOR;
        ctx.lineWidth = 1.5 / camera.zoom; // Keep line width consistent when zoomed
        ctx.save();
        ctx.translate(lander.x, lander.y);
        ctx.rotate(lander.angle - Math.PI / 2); // 旋转使底部朝下

        // 舱体线框
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(10, 5);
        ctx.lineTo(8, 10);
        ctx.lineTo(-8, 10);
        ctx.lineTo(-10, 5);
        ctx.closePath();
        ctx.stroke();

        // 腿
        ctx.beginPath();
        ctx.moveTo(8, 10);
        ctx.lineTo(15, 18);
        ctx.moveTo(-8, 10);
        ctx.lineTo(-15, 18);
        ctx.stroke();

        // 如果正在推进，绘制火焰 (矢量风格)
        if (lander.thrusting) {
            ctx.strokeStyle = '#0F0'; // Green flame
            ctx.lineWidth = 1 / camera.zoom;
            ctx.beginPath();
            ctx.moveTo(-6, 10);
            ctx.lineTo(0, 15 + Math.random() * 7);
            ctx.lineTo(6, 10);
            ctx.stroke();
        }

        ctx.restore();
    }

    // Draw McDonald's as 'M' if visible
    if (mcdonalds.visible) {
        ctx.save();
        // Adjust for camera zoom and pan for text that should scale
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(camera.zoom, camera.zoom);
        ctx.translate(-camera.x, -camera.y);

        // Draw the 'M'
        drawText('M', mcdonalds.x + mcdonalds.width / 2, mcdonalds.y + mcdonalds.height / 2, CONFIG.UI_COLOR, 'center', 'middle', `30px 'Courier New', Courier, monospace`);
        ctx.restore();
    }

    // Draw astronaut and flag if visible
    if (astronaut.visible) {
        // Astronaut
        ctx.strokeStyle = CONFIG.UI_COLOR;
        ctx.lineWidth = 1.5 / camera.zoom;
        ctx.beginPath();
        ctx.arc(astronaut.x, astronaut.y - 5, 5, 0, Math.PI * 2); // Head
        ctx.moveTo(astronaut.x, astronaut.y);
        ctx.lineTo(astronaut.x, astronaut.y + 10); // Body
        ctx.lineTo(astronaut.x - 5, astronaut.y + 15);
        ctx.moveTo(astronaut.x, astronaut.y + 10);
        ctx.lineTo(astronaut.x + 5, astronaut.y + 15); // Legs
        ctx.moveTo(astronaut.x - 5, astronaut.y + 5);
        ctx.lineTo(astronaut.x + 5, astronaut.y + 5); // Arms
        ctx.stroke();

        if (astronaut.flagPlanted) {
            // Flagpole
            ctx.beginPath();
            ctx.moveTo(astronaut.x + 10, astronaut.y + 10);
            ctx.lineTo(astronaut.x + 10, astronaut.y - 10);
            ctx.stroke();
            // Flag
            ctx.beginPath();
            ctx.moveTo(astronaut.x + 10, astronaut.y - 10);
            ctx.lineTo(astronaut.x + 15, astronaut.y - 8);
            ctx.lineTo(astronaut.x + 10, astronaut.y - 6);
            ctx.stroke();
        }
    }
    
    ctx.restore(); // 恢复镜头变换

    if (gameState === CONFIG.GAME_STATE_LANDED_SEQUENCE) {
        astronaut.animationFrame++;
        if (astronaut.animationFrame > 100 && astronaut.animationFrame < 200) {
            astronaut.x += 0.2;
        } 
        if (astronaut.animationFrame >= 200) {
            astronaut.flagPlanted = true;
        }
    }

    // 绘制UI信息 (不受镜头影响)
    if (gameState === CONFIG.GAME_STATE_PLAYING || gameState === CONFIG.GAME_STATE_ZOOMING) {
        // 绘制HUD (新布局, 严格按照截图)
        const hud_x = 20;
        const hud_y = 20;

        // Top info
        drawText(`${Math.round(canvas.height - lander.y)} HEIGHT`, hud_x, hud_y);
        drawText(`${Math.round(lander.x)} DISTANCE`, hud_x + 250, hud_y);
        drawText(`${Math.round(lander.vy * -100)} VER VEL`, hud_x + 500, hud_y);
        drawText(`${Math.round(lander.vx * 100)} HOR VEL`, hud_x + 750, hud_y);

        // Right fuel gauge
        const fuelGaugeX = canvas.width - 100;
        const fuelGaugeY = 50;
        const fuelGaugeWidth = 20;
        const fuelGaugeHeight = 150;
        const fuelPercent = lander.fuel / CONFIG.MAX_FUEL;

        ctx.strokeStyle = CONFIG.UI_COLOR;
        ctx.lineWidth = 2;
        ctx.strokeRect(fuelGaugeX, fuelGaugeY, fuelGaugeWidth, fuelGaugeHeight);

        ctx.fillStyle = CONFIG.UI_COLOR;
        ctx.fillRect(fuelGaugeX, fuelGaugeY + fuelGaugeHeight * (1 - fuelPercent), fuelGaugeWidth, fuelGaugeHeight * fuelPercent);

        drawText(`${Math.round(fuelPercent * 100)}%`, fuelGaugeX + fuelGaugeWidth + 5, fuelGaugeY, CONFIG.TEXT_COLOR);

        // Bottom right data display
        const dataLabelsX = canvas.width - 200; // Position from right edge
        let dataY = canvas.height - 250;
        const dataValuesX = canvas.width - 50; // Position from right edge

        function drawData(label, value) {
            drawText(label, dataLabelsX, dataY);
            drawText(value, dataValuesX, dataY, CONFIG.TEXT_COLOR, 'right'); // Align values to the right
            dataY += 20;
        }

        const verAcc = CONFIG.GRAVITY - (lander.thrusting && lander.fuel > 0 ? Math.sin(lander.angle) * CONFIG.THRUST_POWER : 0);
        const horAcc = -(lander.thrusting && lander.fuel > 0 ? Math.cos(lander.angle) * CONFIG.THRUST_POWER : 0);

        drawData('HEIGHT', Math.round(canvas.height - lander.y));
        drawData('ALTITUDE', Math.round(canvas.height - lander.y)); // Same as height in 2D
        drawData('DISTANCE', Math.round(lander.x));
        drawData('FUEL LE', Math.round(lander.fuel));
        drawData('WEIGHT', '5000'); // Placeholder
        drawData('THRUST', lander.thrusting && lander.fuel > 0 ? 'ON' : 'OFF');
        drawData('ANGLE', `${(lander.angle * 180 / Math.PI).toFixed(0)}`);
        drawData('VER VEL', `${(lander.vy * -100).toFixed(0)}`);
        drawData('HOR VEL', `${(lander.vx * 100).toFixed(0)}`);
        drawData('VER ACC', `${(verAcc * 10000).toFixed(0)}`);
        drawData('HOR ACC', `${(horAcc * 10000).toFixed(0)}`);
    }

    switch (gameState) {
        case CONFIG.GAME_STATE_START:
            // Playdate-style start screen
            // Title
            drawText('MOON LANDER', canvas.width / 2, canvas.height / 2 - 60, CONFIG.TEXT_COLOR, 'center', 'middle', `40px 'Courier New', Courier, monospace`);
            // Subtitle/Codename
            drawText('MOONCRANK', canvas.width / 2, canvas.height / 2 - 20, CONFIG.TEXT_COLOR, 'center', 'middle', `18px 'Courier New', Courier, monospace`);
            // Prompt to start
            drawText('PRESS ANY KEY TO START', canvas.width / 2, canvas.height / 2 + 30, CONFIG.TEXT_COLOR, 'center', 'middle', `16px 'Courier New', Courier, monospace`);
            // Controls
            drawText('UP: THRUST', canvas.width / 2, canvas.height / 2 + 70, CONFIG.TEXT_COLOR, 'center', 'middle', `14px 'Courier New', Courier, monospace`);
            drawText('LEFT/RIGHT: ROTATE', canvas.width / 2, canvas.height / 2 + 90, CONFIG.TEXT_COLOR, 'center', 'middle', `14px 'Courier New', Courier, monospace`);
            // Version
            drawText(`V${CONFIG.VERSION}`, canvas.width - 50, canvas.height - 20, CONFIG.TEXT_COLOR, 'right', 'bottom', `12px 'Courier New', Courier, monospace`);
            break;
        case CONFIG.GAME_STATE_LANDED_SEQUENCE:
            if (astronaut.flagPlanted) {
                drawText(`"That's one small step for a man, one giant leap for mankind."`, canvas.width / 2, canvas.height - 50, CONFIG.TEXT_COLOR, 'center', 'middle');
                drawText('PRESS \'R\' TO RESTART', canvas.width / 2, canvas.height - 20, CONFIG.TEXT_COLOR, 'center', 'middle');
            }
            break;
        case CONFIG.GAME_STATE_CRASHED:
            drawText('CRASHED!', canvas.width / 2, canvas.height / 2 - 20, CONFIG.TEXT_COLOR, 'center', 'middle', `30px 'Courier New', Courier, monospace`);
            drawText('PRESS \'R\' TO RESTART', canvas.width / 2, canvas.height / 2 + 20, CONFIG.TEXT_COLOR, 'center', 'middle');
            break;
        case CONFIG.GAME_STATE_OUT_OF_FUEL:
            drawText('OUT OF FUEL!', canvas.width / 2, canvas.height / 2 - 20, CONFIG.TEXT_COLOR, 'center', 'middle', `30px 'Courier New', Courier, monospace`);
            drawText('PRESS \'R\' TO RESTART', canvas.width / 2, canvas.height / 2 + 20, CONFIG.TEXT_COLOR, 'center', 'middle');
            break;
        case CONFIG.GAME_STATE_CRASHED_MCDONALDS:
            drawText('Well, you\'ve just destroyed the only MacDonald\'s on the moon. What a CLOD.', canvas.width / 2, canvas.height / 2, CONFIG.TEXT_COLOR, 'center', 'middle');
            drawText('PRESS \'R\' TO RESTART', canvas.width / 2, canvas.height / 2 + 40, CONFIG.TEXT_COLOR, 'center', 'middle');
            break;
        case CONFIG.GAME_STATE_LANDED_MCDONALDS:
            drawText('You got two cheeseburgers and a Big Mac. Takeout.', canvas.width / 2, canvas.height / 2, CONFIG.TEXT_COLOR, 'center', 'middle');
            drawText('PRESS \'R\' TO RESTART', canvas.width / 2, canvas.height / 2 + 40, CONFIG.TEXT_COLOR, 'center', 'middle');
            break;
    }
}

// 更新游戏状态
function update() {
    if (gameState === CONFIG.GAME_STATE_PLAYING || gameState === CONFIG.GAME_STATE_ZOOMING) {
        // Apply physics only when playing or zooming
        // Apply gravity
        lander.vy += CONFIG.GRAVITY;

        // Apply thrust
        if (lander.thrusting && lander.fuel > 0) {
            const thrustX = Math.cos(lander.angle) * CONFIG.THRUST_POWER;
            const thrustY = Math.sin(lander.angle) * CONFIG.THRUST_POWER;
            lander.vx -= thrustX; // Corrected direction
            lander.vy -= thrustY; // Corrected direction
            lander.fuel -= CONFIG.FUEL_CONSUMPTION_THRUST;
            if (lander.fuel < 0) lander.fuel = 0;
        }

        // Rotation
        if (lander.rotatingLeft && lander.fuel > 0) {
            lander.angle -= CONFIG.ROTATION_SPEED;
            lander.fuel -= CONFIG.FUEL_CONSUMPTION_ROTATION;
            if (lander.fuel < 0) lander.fuel = 0;
        }
        if (lander.rotatingRight && lander.fuel > 0) {
            lander.angle += CONFIG.ROTATION_SPEED;
            lander.fuel -= CONFIG.FUEL_CONSUMPTION_ROTATION;
            if (lander.fuel < 0) lander.fuel = 0;
        }

        // Update position
        lander.x += lander.vx;
        lander.y += lander.vy;

        // Check for out of bounds
        if (lander.x < 0 || lander.x > canvas.width || lander.y < 0) {
            gameState = CONFIG.GAME_STATE_CRASHED;
        }

        // Check for out of fuel
        if (lander.fuel <= 0 && lander.thrusting) {
            gameState = CONFIG.GAME_STATE_OUT_OF_FUEL;
        }
    }

    if (gameState === CONFIG.GAME_STATE_ZOOMING) {
        // Smoothly zoom and pan camera to the lander
        const targetZoom = 4.0;
        const zoomSpeed = 0.02;
        camera.zoom += (targetZoom - camera.zoom) * zoomSpeed;

        const targetX = lander.x;
        const targetY = lander.y;
        const panSpeed = 0.05;
        camera.x += (targetX - camera.x) * panSpeed;
        camera.y += (targetY - camera.y) * panSpeed;
    }

    // 检查着陆
    const landerBottomY = lander.y + CONFIG.LANDER_HEIGHT / 2;
    let terrainYAtLanderX = canvas.height; // 默认值，如果找不到对应地形点
    for (let i = 0; i < terrain.length - 1; i++) {
        const p1 = terrain[i];
        const p2 = terrain[i+1];
        if (lander.x >= p1.x && lander.x <= p2.x) {
            // 线性插值计算地形高度
            const ratio = (lander.x - p1.x) / (p2.x - p1.x);
            terrainYAtLanderX = p1.y * (1 - ratio) + p2.y * ratio;
            break;
        }
    }

    // Trigger zoom when close to the ground
    if (gameState === CONFIG.GAME_STATE_PLAYING && (terrainYAtLanderX - landerBottomY) < 100) {
        gameState = CONFIG.GAME_STATE_ZOOMING;
    }

    if (landerBottomY >= terrainYAtLanderX) {
        // Check for McDonald's collision
        if (mcdonalds.visible && lander.x > mcdonalds.x && lander.x < mcdonalds.x + mcdonalds.width) {
            // 计算垂直速度、水平速度和着陆角度
            const currentVerticalVelocity = Math.abs(lander.vy);
            const currentHorizontalVelocity = Math.abs(lander.vx);
            // lander.angle 是弧度，Math.PI / 2 是垂直向上，所以偏差是 Math.abs(lander.angle - Math.PI / 2)
            const currentLandingAngle = Math.abs(lander.angle - Math.PI / 2);

            if (currentVerticalVelocity <= CONFIG.MAX_SAFE_VERTICAL_VELOCITY &&
                currentHorizontalVelocity <= CONFIG.MAX_SAFE_HORIZONTAL_VELOCITY &&
                currentLandingAngle <= CONFIG.MAX_SAFE_ANGLE) {
                gameState = CONFIG.GAME_STATE_LANDED_MCDONALDS;
            } else {
                gameState = CONFIG.GAME_STATE_CRASHED_MCDONALDS;
            }
        } else {
                // 计算垂直速度、水平速度和着陆角度
                const currentVerticalVelocity = Math.abs(lander.vy);
                const currentHorizontalVelocity = Math.abs(lander.vx);
                // lander.angle 是弧度，Math.PI / 2 是垂直向上，所以偏差是 Math.abs(lander.angle - Math.PI / 2)
                const currentLandingAngle = Math.abs(lander.angle - Math.PI / 2);

                if (currentVerticalVelocity <= CONFIG.MAX_SAFE_VERTICAL_VELOCITY &&
                    currentHorizontalVelocity <= CONFIG.MAX_SAFE_HORIZONTAL_VELOCITY &&
                    currentLandingAngle <= CONFIG.MAX_SAFE_ANGLE) {
                gameState = CONFIG.GAME_STATE_LANDED_SEQUENCE; // Start landing sequence
                astronaut.x = lander.x;
                astronaut.y = lander.y;
                astronaut.visible = true;
            } else {
                gameState = CONFIG.GAME_STATE_CRASHED;
            }
        }
    }
}

// 游戏主循环
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 键盘事件监听
document.addEventListener('keydown', (e) => {
    // Allow reset only from end states or start screen with specific keys
    if ((gameState === CONFIG.GAME_STATE_CRASHED || 
         gameState === CONFIG.GAME_STATE_OUT_OF_FUEL || 
         gameState === CONFIG.GAME_STATE_LANDED_SEQUENCE ||
         gameState === CONFIG.GAME_STATE_CRASHED_MCDONALDS ||
         gameState === CONFIG.GAME_STATE_LANDED_MCDONALDS) && e.key.toLowerCase() === 'r') {
        resetGame();
        gameState = CONFIG.GAME_STATE_PLAYING;
        return;
    } else if (gameState === CONFIG.GAME_STATE_START) {
        resetGame();
        gameState = CONFIG.GAME_STATE_PLAYING;
        return;
    }

    if (gameState === CONFIG.GAME_STATE_PLAYING || gameState === CONFIG.GAME_STATE_ZOOMING) {
        switch (e.key) {
            case 'ArrowUp':
                lander.thrusting = true;
                break;
            case 'ArrowLeft':
                lander.rotatingLeft = true;
                break;
            case 'ArrowRight':
                lander.rotatingRight = true;
                break;
        }
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            lander.thrusting = false;
            break;
        case 'ArrowLeft':
            lander.rotatingLeft = false;
            break;
        case 'ArrowRight':
            lander.rotatingRight = false;
            break;
    }
});

// 初始化游戏
resetGame();

// 启动游戏循环
gameLoop();