var gallery = ["img/allemagne.jpg", "img/argentine.jpg", "img/canada.jpg", "img/espagne.jpg", "img/etats-unisPNG.png", // toutes les images
		       "img/finlandePNG.png", "img/france.jpg", "img/italie.jpg", "img/japon.jpg", "img/mexique.jpg", 
               "img/portugal.jpg", "img/royaume-uni.jpg", "img/suissePNG.png", "img/turquie.jpg", "img/israel.jpg",
               "img/allemagne.jpg", "img/argentine.jpg", "img/canada.jpg", "img/espagne.jpg", "img/etats-unisPNG.png", // toutes les images une seconde fois
		       "img/finlandePNG.png", "img/france.jpg", "img/italie.jpg", "img/japon.jpg", "img/mexique.jpg", 
               "img/portugal.jpg", "img/royaume-uni.jpg", "img/suissePNG.png", "img/turquie.jpg", "img/israel.jpg"];


var galleryDataset = ["allemagne", "argentine", "canada", "espagne", "etats-unis", "finlande", "france", "italie",    // nom de chaque pays pour placer en dataset
			          "japon", "mexique", "portugal", "royaume-uni", "suisse", "turquie", "israel",
			          "allemagne", "argentine", "canada", "espagne", "etats-unis", "finlande", "france", "italie", 
			          "japon", "mexique", "portugal", "royaume-uni", "suisse", "turquie", "israel"];


var imagesPlacees;												// récupère les chaînes retirées via array.splice()
var datasetPlaces;
var images = document.getElementsByClassName("img"); 			// récupère toutes les images, cartes supérieures, et le conteneur du score
var cards = document.getElementsByClassName("top");
var score = document.getElementById("score");
var clickedCardsNumber = 0;										// nombre de cartes actuellement cliquées (0, 1, ou 2 max)


function getRandomInt(max) 										// génère un entier aléatoire
{
  return Math.floor(Math.random() * Math.floor(max));
}

function shuffle() 												// boucle qui place chaque image sous une carte
{
	for (var i = 0; i < images.length; i++) 
	{
		let key = getRandomInt(gallery.length);					// pioche une image aléatoire dans l'array et la place en .src puis la retire de l'array etc
		images[i].src = gallery[key];
		cards[i].dataset.flag = galleryDataset[key];
		imagesPlacees = gallery.splice(key, 1);
		datasetPlaces = galleryDataset.splice(key, 1);			// place un dataset sur le div de la carte supérieure pour vérifier facilement les cartes cliquées
	}
}
function checkClickedCards() 						
{
	if (clickedCardsNumber > 1) 							   // si il y a plus d'une carte cliquée actuellement
		{
			var clickedCards = document.getElementsByClassName("clicked");      // récupère les cartes actuellement cliquées
			if (clickedCards[0].dataset.flag === clickedCards[1].dataset.flag)  // si elles sont identiques, elles sont validées pour rester retournées
			{
				clickedCards[0].classList.add("valide");
				clickedCards[1].classList.add("valide");
				clickedCards[0].classList.remove("clicked");
				clickedCards[0].classList.remove("clicked");					// 2x [0] vu que le premier est retiré
			}
			else
			{
				setTimeout(function() {											// si elles sont différentes, retire l'état clicked après 1s pour les recacher
					clickedCards[0].classList.remove("clicked");
					clickedCards[0].classList.remove("clicked");
				}, 1000);
			}
			clickedCardsNumber = 0; 											// replace le nombre actuel de cartes cliquées à 0
		}
}

shuffle(); 																		// place les images sous les cartes

for (var i = 0; i < cards.length; i++) 
{
	cards[i].addEventListener("click", function(e) {							// lorsqu'une carte est cliquée, ajout de la classe "clicked"

		e.target.classList.add("clicked");
		clickedCardsNumber += 1;												// incrémentation du nombre actuel de cartes cliquées, et lance checkClickedCards()
		checkClickedCards();
		score.dataset.score = parseInt(score.dataset.score) +1;					// incrémente le score actuel (nombre total de clics sur des cartes)
	});
}