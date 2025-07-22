export class ChocoChips {
    constructor() {
        this.container = null;
        this.svgPaths = [
            '/svg/chocochip1.svg',
            '/svg/chocochip2.svg',
            '/svg/chocochip3.svg',
        ];
        this.isRunning = false;
        this.spawnInterval = null;
        this.activeElements = new Set();

        // 設定パラメータ
        this.config = {
            spawnRate: 50, // SVGの生成間隔秒数[ms]
            maxElements: 100, // 最大同時表示数
            sizeRange: { min: 40, max: 80 }, // サイズの範囲
            speedVariation: 0.3 // アニメーション速度の変動率
        };
    }

    init() {
        this.container = document.getElementById('background-animation');
        if (!this.container) {
            console.error('Background animation container not found');
            return;
        }

        this.start();
        this.setupEventListeners();
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.spawnInterval = setInterval(() => {
            this.createFloatingSVG();
        }, this.config.spawnRate);

        for (let i = 0; i < this.config.maxElements; i++) {
            setTimeout(() => this.createFloatingSVG(), i * 50);
        }
    }

    stop() {
        this.isRunning = false;
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
    }

    createFloatingSVG() {
        if (this.activeElements.size >= this.config.maxElements) {
            return;
        }

        const svgElement = document.createElement('div');
        svgElement.className = 'floating-svg';

        const randomSvgPath = this.svgPaths[Math.floor(Math.random() * this.svgPaths.length)];

        const imgElement = document.createElement('img');
        imgElement.src = randomSvgPath;
        imgElement.alt = 'floating decoration';

        imgElement.onerror = () => {
            console.error('Failed to load SVG:', randomSvgPath);
            svgElement.style.backgroundColor = this.getRandomColor();
            svgElement.style.borderRadius = '50%';
            svgElement.innerHTML = '';
        };

        imgElement.onload = () => {};

        svgElement.appendChild(imgElement);

        this.setProperties(svgElement);

        svgElement.classList.add('animation');

        this.container.appendChild(svgElement);
        this.activeElements.add(svgElement);

        this.setupElementRemoval(svgElement);
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setProperties(element) {
        const vw = window.innerWidth * 2;
        const randomOffset = (Math.random() - 1.0) * vw;
        const startX = (vw / 2) + randomOffset;
        const startY = -40;

        element.style.left = `${startX}px`;
        element.style.top = `${startY}px`;

        const startRotate = Math.floor(Math.random() * 360);
        element.style.setProperty('--start-rotate', `${startRotate}deg`);

        const moveDelay = Math.random() * 20;
        element.style.setProperty('--move-delay', `${moveDelay}s`);

        element.classList.add('animation-left-down');
        element.style.opacity = 1;
    }

    setupElementRemoval(element) {
        const handleAnimationEnd = () => {
            this.removeElement(element);
        };

        element.addEventListener('animationend', handleAnimationEnd);
        element.addEventListener('animationcancel', handleAnimationEnd);

        setTimeout(() => {
            if (this.activeElements.has(element)) {
                console.log('BackgroundAnimationManager: Force removing element after timeout');
                this.removeElement(element);
            }
        }, 300000); // 5分後に強制削除
    }

    removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
        this.activeElements.delete(element);
    }

    setupEventListeners() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });

        window.addEventListener('resize', () => {
            this.cleanup();
        });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.config.spawnRate = 8000; // 生成頻度を下げる
            this.config.maxElements = 5; // 最大要素数を減らす
        }
    }

    cleanup() {
        this.activeElements.forEach(element => {
            this.removeElement(element);
        });
        this.activeElements.clear();
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };

        // 実行中の場合は再起動
        if (this.isRunning) {
            this.stop();
            this.start();
        }
    }

    getStats() {
        return {
            activeElements: this.activeElements.size,
            isRunning: this.isRunning,
            config: this.config
        };
    }
}
