export class DancingChocoChips {
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

        // 初期要素を生成
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
        // 最大要素数チェック
        if (this.activeElements.size >= this.config.maxElements) {
            return;
        }

        const svgElement = document.createElement('div');
        svgElement.className = 'floating-svg';

        // ランダムなSVGパスを選択
        const randomSvgPath = this.svgPaths[Math.floor(Math.random() * this.svgPaths.length)];

        // SVG画像要素を作成
        const imgElement = document.createElement('img');
        imgElement.src = randomSvgPath;
        imgElement.alt = 'floating decoration';

        // 画像の読み込みエラーをキャッチ
        imgElement.onerror = () => {
            console.error('Failed to load SVG:', randomSvgPath);
            // フォールバック: 色付きのdivを作成
            svgElement.style.backgroundColor = this.getRandomColor();
            svgElement.style.borderRadius = '50%';
            svgElement.innerHTML = ''; // imgElementを削除
        };

        imgElement.onload = () => {};

        svgElement.appendChild(imgElement);

        // ランダムなプロパティを設定
        this.setProperties(svgElement);

        // アニメーションクラスを追加
        svgElement.classList.add('animation');

        // コンテナに追加
        this.container.appendChild(svgElement);
        this.activeElements.add(svgElement);

        // アニメーション終了後の削除処理
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

        // ランダムな初期角度
        const startRotate = Math.floor(Math.random() * 360);
        element.style.setProperty('--start-rotate', `${startRotate}deg`);

        // アニメーションdurationと同じ値をdelayの最大値にする
        const animationDuration = 20; // 20秒（CSSと合わせる）
        const moveDelay = Math.random() * animationDuration; // 0〜20秒
        element.style.setProperty('--move-delay', `${moveDelay}s`);

        element.classList.add('animation-left-down');
        element.style.opacity = 1;
    }

    setupElementRemoval(element) {
        // アニメーション終了を監視
        const handleAnimationEnd = () => {
            this.removeElement(element);
        };

        element.addEventListener('animationend', handleAnimationEnd);
        element.addEventListener('animationcancel', handleAnimationEnd);

        // フェイルセーフ: 一定時間後に強制削除
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
        // ページの可視性変更時の処理
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });

        // リサイズ時の処理
        window.addEventListener('resize', () => {
            // this.cleanup();
        });

        // パフォーマンス配慮: prefers-reduced-motionの確認
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.config.spawnRate = 8000; // 生成頻度を下げる
            this.config.maxElements = 5; // 最大要素数を減らす
        }
    }

    cleanup() {
        // 既存の要素をすべて削除
        this.activeElements.forEach(element => {
            this.removeElement(element);
        });
        this.activeElements.clear();
    }

    // 設定の動的更新
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };

        // 実行中の場合は再起動
        if (this.isRunning) {
            this.stop();
            this.start();
        }
    }

    // 統計情報の取得
    getStats() {
        return {
            activeElements: this.activeElements.size,
            isRunning: this.isRunning,
            config: this.config
        };
    }
}