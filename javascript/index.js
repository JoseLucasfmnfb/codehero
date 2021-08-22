var totalCharacter = 0;
document.addEventListener('DOMContentLoaded', async () => {
    await getHeroes();
    createList();
});

async function getHeroes(){
    base_url = 'http://gateway.marvel.com/v1/public';
    public_key = '6697bfd41bb727fec65bf0bfa9e55d21';
    private_key = 'ff2beca3be5b3db9e463d6201d2b0c5f2a4d8d8f';
    timestamp = + new Date();
    s = '' + timestamp + private_key + public_key + '';
    hash = md5(s);
    requestURL = base_url + '/characters?limit=4&ts=' + timestamp + '&apikey=' + public_key + '&hash=' + hash + '';
    data = fazGet(requestURL);
    characters = JSON.parse(data);
    totalCharacter = characters.data.total
    console.log(characters, 'characters');
}

function fazGet(url){
    let request = new XMLHttpRequest();
    request.open("GET", url, false)
    request.send()

    return request.responseText
}

function createList(){
    var ul_characters = document.getElementById('ul_characters')
    characters.data.results.forEach(element => {
        let li = createLi(element)
        ul_characters.appendChild(li)
    });
}

function createLi(element){
    li = document.createElement('li')
    qtde_div_content = 3
    if (screen.width > 565) {
        qtde_div_content = 1
    }
    for (let index = 0; index < qtde_div_content; index++) {
        let liInnerDiv = document.createElement('div')
        // liInnerDiv.classList.add('col-sm-4')
        // liInnerDiv.classList.add('col-12')
        liInnerDiv.classList.add('div-content')
        li.appendChild(liInnerDiv)
        if (index == 0) {
            let figure = document.createElement('figure')
            let img = document.createElement('img')
            let spanName = document.createElement('span')
            img.src = '' + element.thumbnail.path + '.' + element.thumbnail.extension + ''
            img.classList.add('img-responsive')
            spanName.innerHTML = element.name
            liInnerDiv.appendChild(figure)
            figure.appendChild(img)
            liInnerDiv.appendChild(spanName)
        }
        if (index == 1) {
            let text = ''
            element.series.items.forEach(series_ => {
                text += '' + series_.name + '<br>'
            });
            liInnerDiv.innerHTML = text
        }
        if (index == 2) {
            let text = ''
            element.events.items.forEach(events_ => {
                text += '' + events_.name + '<br>'
            });
            liInnerDiv.innerHTML = text
        }
    }
    return li
}