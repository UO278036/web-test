"use strict";
class Memoria {

    elements=[
        {
          "element": "HTML5",
          "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
        },
        {
          "element": "CSS3",
          "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
        },
        {
          "element": "JS",
          "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
        },
        {
          "element": "PHP",
          "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
        },
        {
          "element": "SVG",
          "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
        },
        {
          "element": "W3C",
          "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
        },
        {
          "element": "HTML5",
          "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
        },
        {
          "element": "CSS3",
          "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
        },
        {
          "element": "JS",
          "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
        },
        {
          "element": "PHP",
          "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
        },
        {
          "element": "SVG",
          "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
        },
        {
          "element": "W3C",
          "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
        }, 
      ];
      hasFlippedCard;
      lockBoard;
      firstCard;
      secondCard;

      constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }

    shuffleElements() {
        for (let i = this.elements.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.setCardState(this.firstCard, 'blocked');
            this.setCardState(this.secondCard, 'blocked');
            this.resetBoard();
        }, 700);
    }

    setCardState(card, state) {
        if (card) card.dataset.state = state;
    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    checkForMatch() {
        if (this.firstCard.dataset.element === this.secondCard.dataset.element) {
            this.disableCards();
        } else {
            this.unflipCards();
        }
    }

    disableCards() {
        this.setCardState(this.firstCard, 'revealed');
        this.setCardState(this.secondCard, 'revealed');
        this.resetBoard();
    }

    createElements() {
        this.elements.forEach(element => {
            document.write(`<article data-element="${element.element}" data-state="blocked">
                              <h3>Tarjeta de Memoria</h3>
                              <img src="${element.source}" alt="${element.element}" />
                            </article>`);
        });
    }

    addEventListeners() {
        const articles = document.querySelectorAll("article");
        articles.forEach(article => {
            article.addEventListener('click', () => this.flipCard(article));
        });
    }

    flipCard(selectedCard) {
        if (this.lockBoard || selectedCard === this.firstCard || selectedCard.dataset.state === 'revealed') return;

        selectedCard.dataset.state = 'flip';

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = selectedCard;
        } else {
            this.secondCard = selectedCard;
            this.checkForMatch();
        }
    }
}