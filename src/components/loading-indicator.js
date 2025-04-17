import gsap from 'gsap';

class LoadingIndicator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .loader {
                    display: none;
                    border: 4px solid #f3f3f3;
                    border-radius: 50%;
                    border-top: 4px solid #3498db;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 20px auto;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            <div class="loader"></div>
        `;
    }

    show() {
        const loader = this.shadowRoot.querySelector('.loader');
        gsap.fromTo(loader, 
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, display: 'block' }
        );
    }

    hide() {
        const loader = this.shadowRoot.querySelector('.loader');
        gsap.to(loader, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            display: 'none'
        });
    }
}

customElements.define('loading-indicator', LoadingIndicator);