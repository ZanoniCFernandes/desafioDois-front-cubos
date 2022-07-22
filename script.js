const body = document.querySelector('body');

const inputPesquisa = document.querySelector('.input');

const divisoriaFilmes = document.querySelector('.movies');

const divHighlightVideo = document.querySelector('.highlight__video');
const tituloHighlight = document.querySelector('.highlight__title');
const avaliacaoHighlight = document.querySelector('.highlight__rating');
const generoHighlight = document.querySelector('.highlight__genres');
const lancamentoHighlight = document.querySelector('.highlight__launch');
const textoHighlight = document.querySelector('.highlight__description');
const linkVideoHighlight = document.querySelector('.highlight__video-link, a');

const botaoPaginaAnteriorCarrossel = document.querySelector('.btn-prev');
const botaoPaginaSeguinteCarrossel = document.querySelector('.btn-next');

const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const tituloModal = document.querySelector('.modal__title');
const imagemModal = document.querySelector('.modal__img');
const textoModal = document.querySelector('.modal__description');
const avaliacaoModal = document.querySelector('.modal__average');
const generoModal = document.querySelector('.modal__genres');

const botaoTema = document.querySelector('.btn-theme');

let exibicaoCarrossel = [];
let indice = 0;
let inicial;

let temaInicial = localStorage.getItem('tema');

console.log(temaInicial);

if (temaInicial === 'escuro') {
    trocarTema();
    temaInicial = 'escuro'
    localStorage.setItem('tema', 'escuro')
}

function trocarTema() {
    localStorage.setItem('tema', temaInicial === 'claro' ? 'escuro' : 'claro');

    botaoTema.src = botaoTema.src === 'file:///D:/Cubos/%23Desafio2/Front/desafio-frontend-integral-modulo-02-t05/assets/light-mode.svg' ? './assets/dark-mode.svg' : './assets/light-mode.svg';

    botaoPaginaAnteriorCarrossel.src = botaoPaginaAnteriorCarrossel.src === 'file:///D:/Cubos/%23Desafio2/Front/desafio-frontend-integral-modulo-02-t05/assets/seta-esquerda-preta.svg' ? './assets/seta-esquerda-branca.svg' : './assets/seta-esquerda-preta.svg';

    botaoPaginaSeguinteCarrossel.src = botaoPaginaSeguinteCarrossel.src === 'file:///D:/Cubos/%23Desafio2/Front/desafio-frontend-integral-modulo-02-t05/assets/seta-direita-preta.svg' ? './assets/seta-direita-branca.svg' : './assets/seta-direita-preta.svg';

    const corFundoGeral = body.style.getPropertyValue('--background-color') === '#242424' ? '#FFF' : '#242424';
    body.style.setProperty('--background-color', corFundoGeral);

    const corFundoDestaque = body.style.getPropertyValue('--highlight-background') === '#454545' ? '#FFF' : '#454545';
    body.style.setProperty('--highlight-background', corFundoDestaque);

    const corTexto = body.style.getPropertyValue('--highlight-description') === '#FFFFFF' ? '#000' : '#FFFFFF';
    body.style.setProperty('--highlight-description', corTexto);
    body.style.setProperty('--highlight-color', corTexto);
    body.style.setProperty('--color', corTexto);

    const corBordaInput = body.style.getPropertyValue('--input-border-color') === '#FFFFFF' ? '#979797' : '#FFFFFF';
    body.style.setProperty('--input-border-color', corBordaInput);

    const corSombra = body.style.getPropertyValue('--shadow-color') === '#FFF' ? '#000' : '#FFF';
    body.style.setProperty('--shadow-color', corSombra);
};

function exibirFilmes(pagina) {
    exibicaoCarrossel[pagina].forEach((filme) => {
        const divFilme = document.createElement('div');
        divFilme.classList.add('movie');

        divFilme.style.backgroundImage = `url('${filme.poster_path}')`

        const divFilmeInfo = document.createElement('div');
        divFilmeInfo.classList.add('movie__info');

        const tituloFilme = document.createElement('span');
        tituloFilme.classList.add('movie__title');
        tituloFilme.textContent = filme.title;


        const avaliacaoFilme = document.createElement('span');
        avaliacaoFilme.classList.add('movie__rating');
        avaliacaoFilme.textContent = filme.vote_average;

        const imagemEstrela = document.createElement('img');
        imagemEstrela.src = './assets/estrela.svg';
        imagemEstrela.alt = "Estrela";

        avaliacaoFilme.append(imagemEstrela);
        divFilmeInfo.append(tituloFilme, avaliacaoFilme);
        divFilme.append(divFilmeInfo);
        divisoriaFilmes.append(divFilme);

        divFilme.addEventListener('click', () => {
            modal.classList.remove('hidden');
            const promiseResposta = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/' + filme.id + '?language=pt-BR').then((resposta) => {
                const promiseBody = resposta.json()

                promiseBody.then((body) => {
                    tituloModal.textContent = body.title;
                    imagemModal.src = body.backdrop_path;
                    textoModal.textContent = body.overview;
                    avaliacaoModal.textContent = body.vote_average;

                    body.genres.forEach((genre) => {
                        const spanGenero = document.createElement('span');
                        spanGenero.classList.add('modal__genre');
                        spanGenero.textContent = genre.name;

                        generoModal.append(spanGenero);
                    });
                });
            });
        });


    });
};

function montarArray(array) {
    let paginaAtual = [];
    const arrayTemp = [];

    array.forEach((filme) => {
        paginaAtual.push(filme)
        if (paginaAtual.length === 5) {
            arrayTemp.push(paginaAtual)
            paginaAtual = [];
        }
    });
    return arrayTemp
};

function paginaAnteriorCarrossel() {
    if (indice === 0) {
        indice = exibicaoCarrossel.length - 1
    } else {
        indice--
    }
    limparFilmes();
    exibirFilmes(indice);
}

function paginaSeguinteCarrossel() {
    if (indice === exibicaoCarrossel.length - 1) {
        indice = 0;
    } else {
        indice++
    }
    limparFilmes();
    exibirFilmes(indice)
}

function limparGeneroModal(event) {
    const spanGenero = document.querySelectorAll('.modal__genre');
    spanGenero.forEach((genero) => {
        genero.remove()
    });
};

function limparFilmes(event) {
    const filmesExibidos = document.querySelectorAll('.movie');
    filmesExibidos.forEach((filme) => {
        filme.remove();
    })
};

function fecharModal(event) {
    modal.classList.add('hidden');
    limparGeneroModal()
};


const promiseRespostaVisualizacaoFilmes = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then((resposta) => {
    const promiseBody = resposta.json();
    promiseBody.then((body) => {
        exibicaoCarrossel = montarArray(body.results);

        inicial = body.results;
        exibirFilmes(indice);
    })
});


inputPesquisa.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && inputPesquisa.value === "") {
        indice = 0;
        limparFilmes();
        exibicaoCarrossel = montarArray(inicial);

        exibirFilmes(indice);
        inputPesquisa.value = '';
    }

    if (event.key === 'Enter' && inputPesquisa.value !== "") {
        indice = 0
        const promiseResposta = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=' + inputPesquisa.value).then((resposta) => {
            const promiseBody = resposta.json();
            let paginaAtual = [];
            limparFilmes();
            exibicaoCarrossel.splice(0, exibicaoCarrossel.length)

            promiseBody.then((body) => {
                exibicaoCarrossel = montarArray(body.results);
                exibirFilmes(indice)
            })
        });
        inputPesquisa.value = '';
    }
});


const promiseRespostaFilmeDiaGeral = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then((resposta) => {
    const PromiseBody = resposta.json();

    PromiseBody.then((body) => {
        divHighlightVideo.style.backgroundImage = `url('${body.backdrop_path}')`;
        tituloHighlight.textContent = body.title;
        avaliacaoHighlight.textContent = body.vote_average;
        let arrayGenero = [];

        body.genres.forEach((genero) => {
            arrayGenero.push(genero.name)
        })

        let arrayGeneroTratado = arrayGenero.join(", ")
        generoHighlight.textContent = arrayGeneroTratado;

        const dataLancamento = new Date(body.release_date).toLocaleString("pt-BR", { day: "numeric", month: "long", year: "numeric" })

        lancamentoHighlight.textContent = dataLancamento;

        textoHighlight.textContent = body.overview;
    })
})

const promiseRespostaFilmeDiaVideo = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then((resposta) => {
    const promiseBody = resposta.json();

    promiseBody.then((body) => {
        linkVideoHighlight.href = 'https://www.youtube.com/watch?v=' + body.results[0].key
    });
});



botaoPaginaAnteriorCarrossel.addEventListener('click', paginaAnteriorCarrossel);

botaoPaginaSeguinteCarrossel.addEventListener('click', paginaSeguinteCarrossel);

modal.addEventListener('click', fecharModal);

modalClose.addEventListener('click', fecharModal);

botaoTema.addEventListener('click', () => {
    trocarTema();
    localStorage.setItem('tema', temaInicial === 'claro' ? 'escuro' : 'claro');
});
