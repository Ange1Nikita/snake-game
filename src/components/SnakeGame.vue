<template>
    <div class="game-container">
        <h1>Змейка</h1>
        <div class="theme-buttons">
            <button @click="changeTheme('classic')">Классическая тема</button>
            <button @click="changeTheme('night')">Ночная тема</button>
            <button @click="changeTheme('space')">Космическая тема</button>
        </div>
        <div class="score-board">
            <p>Счёт: {{ score }}</p>
            <p>Рекорд: {{ highScore }}</p>
        </div>
        <canvas ref="gameCanvas" :width="canvasSize" :height="canvasSize" @touchstart="handleTouchStart"
            @touchmove="handleTouchMove" @touchend="handleTouchEnd"></canvas>
        <p v-if="gameOver">Игра окончена! Нажмите на экран для перезапуска.</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            canvasSize: 400,
            gridSize: 20,
            snake: [{ x: 10, y: 10 }],
            food: { x: 15, y: 15 },
            direction: { x: 0, y: 0 },
            gameOver: false,
            touchStartX: null,
            touchStartY: null,
            score: 0,
            highScore: 0,
            foodColorPhase: 0,
            comets: [], // Массив для хранения комет
            cometInterval: null, // Таймер для генерации комет
            maxComets: 5,
            speed: 0.2, // Скорость движения (часть клетки за шаг)
            initialSpeed: 0.2, // Начальная скорость
            headPosition: { x: 10, y: 10 }, // Плавные координаты головы
            gameLoopTimer: null, // Храним ID таймера
            updateInterval: 100, // Интервал обновления состояния игры (в миллисекундах)
            frameRate: 60, // Частота кадров для отрисовки (в FPS)
            lastUpdateTime: 0, // Время последнего обновления состояния игры
            currentTheme: "classic", // Текущая тема
            themes: {
                classic: {
                    background: ["#87CEEB", "#98FB98"], // Градиент фона
                    snake: { fill: "green", stroke: "darkgreen" }, // Цвет змейки
                    food: { stroke: "darkred" }, // Цвет еды
                },
                night: {
                    background: ["#000033", "#1a1a4d"], // Тёмный фон
                    snake: { fill: "#00ff00", stroke: "#00cc00" }, // Светящаяся змейка
                    food: { stroke: "#ff4500" }, // Оранжевая еда
                },
                space: {
                    background: ["#000000", "#000033"], // Космический фон
                    snake: { fill: "#ffffff", stroke: "#cccccc" }, // Белая змейка
                    food: { stroke: "#ffff00" }, // Жёлтая еда
                },
            },
        };
    },
    mounted() {
        // Загружаем сохранённую тему
        const savedTheme = localStorage.getItem("currentTheme");
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme; // Устанавливаем сохранённую тему
        } else {
            this.currentTheme = "classic"; // По умолчанию устанавливаем классическую тему
        }

        this.startGame();
        window.addEventListener("keydown", this.handleKeyDown);

        // Начинаем генерацию комет
        this.startCometSpawning();
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
        this.stopCometSpawning();
    },
    methods: {
        spawnComet() {
            if (this.comets.length >= this.maxComets) return;

            const maxX = this.canvasSize / this.gridSize - 1;

            const newComet = {
                x: Math.random() * maxX, // Случайная позиция по X
                y: -1, // Комета начинается за пределами экрана
                speed: Math.random() * 0.3 + 0.1, // Скорость от 0.1 до 0.4
                size: Math.random() * 2 + 1, // Размер кометы от 1 до 3
            };

            this.comets.push(newComet); // Добавляем комету в массив
        },
    startCometSpawning() {
        this.cometInterval = setInterval(() => {
            if (this.currentTheme === "space") {
                this.spawnComet(); // Генерируем новую комету
            }
        }, 2000); // Генерация комет каждые 2 секунды
    },
    stopCometSpawning() {
        clearInterval(this.cometInterval); // Останавливаем генерацию комет
    },
    changeTheme(themeName) {
        if (this.currentTheme !== themeName) {
            this.currentTheme = themeName;
            localStorage.setItem("currentTheme", themeName); // Сохраняем тему в localStorage
            console.log(`Тема изменена на: ${themeName}`);
            this.drawGame(); // Перерисовываем игру только если тема изменилась
        }
    },
    startGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.direction = { x: 0, y: 0 };
        this.gameOver = false;
        this.score = 0; // Сбрасываем счёт
        this.speed = this.initialSpeed; // Сбрасываем скорость
        this.headPosition = { x: 10, y: 10 }; // Сбрасываем плавные координаты головы
        this.lastUpdateTime = Date.now(); // Сбрасываем время последнего обновления

        // Запускаем отрисовку игры
        this.gameLoop();

        // Запускаем обновление состояния игры
        this.updateGameState();
    },
    updateGameState() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;

        // Обновляем состояние игры только если прошло достаточно времени
        if (deltaTime >= this.updateInterval) {
            this.lastUpdateTime = currentTime;

            let head = {
                x: this.snake[0].x + this.direction.x,
                y: this.snake[0].y + this.direction.y,
            };

            // Проверяем выход за границы
            if (head.x < 0) head.x = this.canvasSize / this.gridSize - 1; // Слева направо
            if (head.x >= this.canvasSize / this.gridSize) head.x = 0; // Справа налево
            if (head.y < 0) head.y = this.canvasSize / this.gridSize - 1; // Сверху вниз
            if (head.y >= this.canvasSize / this.gridSize) head.y = 0; // Снизу вверх

            // Добавляем новую голову в начало массива
            this.snake.unshift({ x: head.x, y: head.y });

            // Проверяем столкновение с едой
            if (head.x === this.food.x && head.y === this.food.y) {
                this.spawnFood(); // Генерируем новую еду
                this.score++;
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                }
                this.playSound("sounds/eat.mp3"); // Звук поедания яблока

                // Увеличиваем скорость
                if (this.speed < 1) {
                    this.speed += 0.01;
                }
            } else {
                // Удаляем хвост, если еда не съедена
                this.snake.pop();
            }

            // Проверяем столкновение с самой собой
            if (
                this.snake
                    .slice(1) // Исключаем голову
                    .some(segment => segment.x === head.x && segment.y === head.y)
            ) {
                this.gameOver = true;
                this.playSound("sounds/game-over.mp3"); // Звук окончания игры
                return;
            }
        }

        // Рекурсивно вызываем обновление состояния игры
        requestAnimationFrame(() => this.updateGameState());
    },
    gameLoop() {
        if (this.gameOver || !this.$refs.gameCanvas) return;

        // Плавное обновление координат головы
        this.headPosition.x += (this.snake[0].x - this.headPosition.x) * this.speed;
        this.headPosition.y += (this.snake[0].y - this.headPosition.y) * this.speed;

        // Обработка выхода за границы для плавных координат
        if (this.headPosition.x < 0) this.headPosition.x += this.canvasSize / this.gridSize;
        if (this.headPosition.x >= this.canvasSize / this.gridSize) this.headPosition.x -= this.canvasSize / this.gridSize;
        if (this.headPosition.y < 0) this.headPosition.y += this.canvasSize / this.gridSize;
        if (this.headPosition.y >= this.canvasSize / this.gridSize) this.headPosition.y -= this.canvasSize / this.gridSize;

        // Обновляем фазу цвета еды для анимации
        this.foodColorPhase += 0.05; // Увеличиваем фазу для плавного изменения цвета

        if (this.currentTheme === "space") {
            this.comets.forEach((comet) => {
                comet.y += comet.speed; // Комета движется вниз
                if (comet.y > this.canvasSize / this.gridSize) {
                    comet.y = -1; // Перемещаем комету наверх, если она вышла за экран
                }
            });
        }

        // Отрисовываем игру
        if (this.$refs.gameCanvas) {
            this.drawGame();
        }

        // Вычисляем интервал для следующего кадра
        const interval = 1000 / this.frameRate; // Интервал в миллисекундах
        this.gameLoopTimer = setTimeout(() => this.gameLoop(), interval);
    },
    drawGame() {
        const canvas = this.$refs.gameCanvas;
        const ctx = canvas.getContext("2d");

        // Получаем текущую тему
        const theme = this.themes[this.currentTheme];

        // Создаём градиент фона
        const gradient = ctx.createLinearGradient(0, 0, this.canvasSize, this.canvasSize);
        gradient.addColorStop(0, theme.background[0]);
        gradient.addColorStop(1, theme.background[1]);

        // Заливаем фон градиентом
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

        // Рисуем змейку
        ctx.fillStyle = theme.snake.fill;
        ctx.strokeStyle = theme.snake.stroke;
        ctx.lineWidth = 2;

        this.snake.forEach((segment, index) => {
            const radius = this.gridSize / 2;

            let centerX, centerY;
            if (index === 0) {
                // Плавные координаты для головы
                centerX = this.headPosition.x * this.gridSize + radius;
                centerY = this.headPosition.y * this.gridSize + radius;
            } else {
                // Дискретные координаты для остальных сегментов
                centerX = segment.x * this.gridSize + radius;
                centerY = segment.y * this.gridSize + radius;
            }

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // Рисуем еду с анимацией
        if (this.food) {
            const hue = Math.sin(this.foodColorPhase) * 30 + 30; // Вычисляем оттенок
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.strokeStyle = theme.food.stroke;
            ctx.lineWidth = 2;
            const foodRadius = this.gridSize / 2;
            const foodCenterX = this.food.x * this.gridSize + foodRadius;
            const foodCenterY = this.food.y * this.gridSize + foodRadius;

            ctx.beginPath();
            ctx.arc(foodCenterX, foodCenterY, foodRadius - 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
        // Рисуем кометы (только в космической теме)
        if (this.currentTheme === "space") {
            this.comets.forEach((comet) => {
                const cometCenterX = comet.x * this.gridSize + this.gridSize / 2;
                const cometCenterY = comet.y * this.gridSize + this.gridSize / 2;

                // Рисуем хвост кометы
                for (let i = 0; i < 3; i++) {
                    const size = comet.size * (1 - i * 0.3); // Размер уменьшается
                    const opacity = 1 - i * 0.3; // Прозрачность увеличивается
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`; // Белый цвет с прозрачностью
                    ctx.beginPath();
                    ctx.arc(
                        cometCenterX,
                        cometCenterY - i * this.gridSize * 0.2, // Хвост смещается вверх
                        size,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            });
        }
    },
    spawnFood() {
        const maxX = Math.floor(this.canvasSize / this.gridSize) - 1;
        const maxY = Math.floor(this.canvasSize / this.gridSize) - 1;

        let newFood;
        let attempts = 0; // Счётчик попыток, чтобы избежать бесконечного цикла

        do {
            newFood = {
                x: Math.floor(Math.random() * (maxX + 1)),
                y: Math.floor(Math.random() * (maxY + 1)),
            };
            attempts++;
        } while (
            this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) &&
            attempts < 100 // Ограничиваем количество попыток
        );

        if (attempts >= 100) {
            console.error("Не удалось сгенерировать еду после 100 попыток!");
            return;
        }

        this.food = newFood;
    },
    handleKeyDown(event) {
        if (this.gameOver && event.code === "Space") {
            this.startGame();
        }

        switch (event.code) {
            case "ArrowUp":
                if (this.direction.y === 0) this.direction = { x: 0, y: -1 };
                break;
            case "ArrowDown":
                if (this.direction.y === 0) this.direction = { x: 0, y: 1 };
                break;
            case "ArrowLeft":
                if (this.direction.x === 0) this.direction = { x: -1, y: 0 };
                break;
            case "ArrowRight":
                if (this.direction.x === 0) this.direction = { x: 1, y: 0 };
                break;
        }
    },
    handleTouchStart(event) {
        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    },
    handleTouchMove(event) {
        event.preventDefault(); // Предотвращаем прокрутку страницы
    },
    handleTouchEnd(event) {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;

        // Определяем направление в зависимости от разницы координат
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0 && this.direction.x === 0) this.direction = { x: 1, y: 0 }; // Вправо
            if (deltaX < 0 && this.direction.x === 0) this.direction = { x: -1, y: 0 }; // Влево
        } else {
            if (deltaY > 0 && this.direction.y === 0) this.direction = { x: 0, y: 1 }; // Вниз
            if (deltaY < 0 && this.direction.y === 0) this.direction = { x: 0, y: -1 }; // Вверх
        }
    },
    handleScreenClick() {
        if (this.gameOver) {
            this.startGame();
        }
    },
    playSound(src) {
        const audio = new Audio(src);
        audio.play();
    },
},
};
</script>

<style scoped>
.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.score-board {
    margin-bottom: 10px;
    font-size: 18px;
}

canvas {
    border: 1px solid black;
    background-color: #f0f0f0;
}

.theme-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;
}

.theme-buttons button {
    padding: 5px 10px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.theme-buttons button:hover {
    opacity: 0.8;
}
</style>