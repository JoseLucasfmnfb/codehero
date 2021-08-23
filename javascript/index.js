var totalCharacter = 0
var dataCharacters = []
var dataDetailedCharacter = []
var numberOfPages = 0
var pagesButtonsDisplay = 5
if (screen.width < 565) {
    pagesButtonsDisplay = 3
}
var fullName = 'José Lucas Toledo Oliveira'

document.addEventListener('DOMContentLoaded', async () => {
    let initials = getInitials(fullName)
    let candidate_name = document.getElementById('candidate_name')
    let candidate_initials = document.getElementById('candidate_initials')
    candidate_name.innerHTML = fullName
    candidate_initials.innerHTML = initials
    let offset = await 0
    await getHeroes(offset)
    createList()

    var inputSearch = document.getElementById('input_search');
    inputSearch.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("btn_search").click();
        }
    });
});

async function getHeroes(offset){
    let base_url = 'http://gateway.marvel.com/v1/public'
    let public_key = '6697bfd41bb727fec65bf0bfa9e55d21'
    let private_key = 'ff2beca3be5b3db9e463d6201d2b0c5f2a4d8d8f'
    let timestamp = + new Date()
    let combinatioForHash = '' + timestamp + private_key + public_key + ''
    let hash = md5(combinatioForHash)
    let requestURL = base_url + '/characters?limit=4&offset=' + offset + '&ts=' + timestamp + '&apikey=' + public_key + '&hash=' + hash + ''
    let data = fazGet(requestURL)
    let characters = JSON.parse(data)
    totalCharacter = characters.data.total
    dataCharacters = characters
    numberOfPages = Math.ceil(totalCharacter/4)+1
}

function searchHero(){
    let input_search = document.getElementById('input_search')
    console.log(input_search.value)
    let base_url = 'http://gateway.marvel.com/v1/public'
    let public_key = '6697bfd41bb727fec65bf0bfa9e55d21'
    let private_key = 'ff2beca3be5b3db9e463d6201d2b0c5f2a4d8d8f'
    let timestamp = + new Date()
    let combinatioForHash = '' + timestamp + private_key + public_key + ''
    let hash = md5(combinatioForHash)
    let requestURL = base_url + '/characters?name=' + input_search.value + '&ts=' + timestamp + '&apikey=' + public_key + '&hash=' + hash + ''
    let data = fazGet(requestURL)
    dataDetailedCharacter = JSON.parse(data)
    console.log(dataDetailedCharacter, 'dataDetailedCharacter')
    dismountListElements()
    mountDetailedPage()
}

function openCharacter(heroID){
    let base_url = 'http://gateway.marvel.com/v1/public'
    let public_key = '6697bfd41bb727fec65bf0bfa9e55d21'
    let private_key = 'ff2beca3be5b3db9e463d6201d2b0c5f2a4d8d8f'
    let timestamp = + new Date()
    let combinatioForHash = '' + timestamp + private_key + public_key + ''
    let hash = md5(combinatioForHash)
    let requestURL = base_url + '/characters/' + heroID + '?&ts=' + timestamp + '&apikey=' + public_key + '&hash=' + hash + ''
    let data = fazGet(requestURL)
    dataDetailedCharacter = JSON.parse(data)
    console.log(dataDetailedCharacter, 'dataDetailedCharacter')
    dismountListElements()
    mountDetailedPage()
}

function fazGet(url){
    let request = new XMLHttpRequest()
    request.open("GET", url, false)
    request.send()

    return request.responseText
}

function createList(){
    let heroes_content = document.getElementById('heroes_content')
    ul_characters = document.createElement('ul')
    ul_characters.setAttribute('id', 'ul_characters')
    heroes_content.appendChild(ul_characters)
    dataCharacters.data.results.forEach(element => {
        let li = createLi(element)
        ul_characters.appendChild(li)
    });
}

function createLi(element){
    li = document.createElement('li')
    li.setAttribute('onclick', 'openCharacter("' + element.id + '")')
    qtde_div_content = 3
    if (screen.width < 767) {
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

function mountDetailedPage(){
    let row_detail = document.getElementById('row_detail')
    let div_detail = document.getElementById('div_detail')
    let wrapper_btn_back = document.getElementById('wrapper_btn_back')
    wrapper_btn_back.classList.remove('d-none')
    row_detail.classList.remove('d-none')
    
    if (dataDetailedCharacter.data.results.length != 0) {
        let wrapper_details = document.createElement('div')
        wrapper_details.classList.add('wrapper_details')
        div_detail.appendChild(wrapper_details)
        let wrapper_image = document.createElement('div')
        wrapper_image.classList.add('wrapper_image')
        wrapper_details.appendChild(wrapper_image)
        let figure = document.createElement('figure')
        wrapper_image.appendChild(figure)
        let img = document.createElement('img')
        img.src = '' + dataDetailedCharacter.data.results[0].thumbnail.path + '.' + dataDetailedCharacter.data.results[0].thumbnail.extension + ''
        img.classList.add('img-responsive')
        figure.appendChild(img)
        let wrapper_info = document.createElement('div')
        wrapper_info.classList.add('wrapper_info')
        wrapper_details.appendChild(wrapper_info)
        let title = document.createElement('h2')
        wrapper_info.appendChild(title)
        title.innerHTML = dataDetailedCharacter.data.results[0].name
        let description = document.createElement('div')
        description.classList.add('description')
        description.innerHTML = dataDetailedCharacter.data.results[0].description
        wrapper_info.appendChild(description)
        let stories = document.createElement('div')
        stories.classList.add('stories')
        wrapper_info.appendChild(stories)
        let text_stories = '<b>Stories: </b>'
        dataDetailedCharacter.data.results[0].stories.items.forEach(stories_ => {
            text_stories += '' + stories_.name + ', '
        });
        stories.innerHTML = text_stories
        
        let series = document.createElement('div')
        series.classList.add('series')
        wrapper_info.appendChild(series)
        let text_series = '<b>Series: </b>'
        dataDetailedCharacter.data.results[0].series.items.forEach(series_ => {
            text_series += '' + series_.name + ', '
        });
        series.innerHTML = text_series
        
        let comics = document.createElement('div')
        comics.classList.add('comics')
        wrapper_info.appendChild(comics)
        let text_comics = '<b>Comics: </b>'
        dataDetailedCharacter.data.results[0].comics.items.forEach(comics_ => {
            text_comics += '' + comics_.name + ', '
        });
        comics.innerHTML = text_comics
    }else{
        let wrapper_not_found = document.createElement('div')
        wrapper_not_found.classList.add('wrapper_not_found')
        let message = document.createElement('div')
        message.classList.add('message')
        message.innerHTML = 'Nenhum personagem encontrado!'
        div_detail.appendChild(wrapper_not_found)
        wrapper_not_found.appendChild(message)
    }
}

function dismountList(){
    let heroes_content = document.getElementById('heroes_content')
    heroes_content.innerHTML = ''
}

function dismountListElements(){
    let row_search = document.getElementById('row_search')
    let row_list = document.getElementById('row_list')
    let ul_pagination = document.getElementById('ul_pagination')
    row_search.classList.add('d-none')
    row_list.classList.add('d-none')
    ul_pagination.classList.add('d-none')
}

function voltar(){
    let row_search = document.getElementById('row_search')
    let row_list = document.getElementById('row_list')
    let ul_pagination = document.getElementById('ul_pagination')
    let wrapper_btn_back = document.getElementById('wrapper_btn_back')
    let row_detail = document.getElementById('row_detail')
    let div_detail = document.getElementById('div_detail')
    row_search.classList.remove('d-none')
    row_list.classList.remove('d-none')
    ul_pagination.classList.remove('d-none')
    wrapper_btn_back.classList.add('d-none')
    row_detail.classList.add('d-none')
    div_detail.innerHTML = ''
    let offset = 0
}

async function firstPage(){
    let offset = await 0
    let pages = await document.querySelectorAll('.change_page')
    let btn_first_page = await document.getElementById('first_page')
    let btn_prev_page = await document.getElementById('prev_page')
    let btn_next_page = await document.getElementById('next_page')
    let btn_last_page = await document.getElementById('last_page')
    btn_first_page.classList.add('desativo')
    btn_prev_page.classList.add('desativo')
    btn_next_page.classList.remove('desativo')
    btn_last_page.classList.remove('desativo')
    for (let index = 0; index < pages.length; index++) {
        let element = await pages[index];
        await element.setAttribute('data-page_number', parseInt(index)+1)
        element.innerHTML = await parseInt(index)+1
        if (index == 0) {
            element.classList.add('ativo')
        }else{
            element.classList.remove('ativo')
        }
    }
    await dismountList()
    await getHeroes(offset)
    createList()
}

async function prevPage(){
    let clicked_element = document.getElementById('prev_page')
    let btn_first_page = document.getElementById('first_page')
    let btn_next_page = document.getElementById('next_page')
    let btn_last_page = document.getElementById('last_page')
    let next_sibling = clicked_element.nextElementSibling
    btn_next_page.classList.remove('desativo')
    btn_last_page.classList.remove('desativo')
    if (next_sibling.classList.contains('ativo')) {
        if (next_sibling.getAttribute('data-page_number') == 1) {
            clicked_element.classList.add('desativo')
            btn_first_page.classList.add('desativo')
        }else{
            let pages = document.querySelectorAll('.change_page')
            for (let index = 0; index < pages.length; index++) {
                let element = await pages[index];
                let updated_val = await parseInt(element.getAttribute('data-page_number'))-1
                await element.setAttribute('data-page_number', updated_val)
                element.innerHTML = await updated_val
            }
            let active_page = await document.querySelector('.change_page.ativo')
            let active_data_attribtue = await active_page.getAttribute('data-page_number')
            let next_offset = await (active_data_attribtue - 1)*4
            await dismountList()
            await getHeroes(next_offset)
            createList()
        }
    }else{
        let active_page = await document.querySelector('.change_page.ativo')
        let prev_active_page = await active_page.previousElementSibling
        await prev_active_page.classList.add('ativo')
        await active_page.classList.remove('ativo')
        let data_page = await prev_active_page.getAttribute('data-page_number')
        if (data_page == 1) {
            clicked_element.classList.add('desativo')
            btn_first_page.classList.add('desativo')
        }
        let prev_offset = await (data_page - 1)*4
        await dismountList()
        await getHeroes(prev_offset)
        createList()
    }
}

async function nextPage(){
    let clicked_element = document.getElementById('next_page')
    let btn_last_page = document.getElementById('last_page')
    let btn_first_page = document.getElementById('first_page')
    let btn_prev_page = document.getElementById('prev_page')
    let previous_sibling = clicked_element.previousElementSibling
    if (previous_sibling.classList.contains('ativo')) {
        let pages = document.querySelectorAll('.change_page')
        if (previous_sibling.getAttribute('data-page_number') == (numberOfPages-1)) {
            clicked_element.classList.add('desativo')
            btn_last_page.classList.add('desativo')
        }else{
            for (let index = 0; index < pages.length; index++) {
                let element = await pages[index];
                let updated_val = await parseInt(element.getAttribute('data-page_number'))+1
                await element.setAttribute('data-page_number', updated_val)
                element.innerHTML = await updated_val
            }
        }
        let active_page = await document.querySelector('.change_page.ativo')
        let active_data_attribtue = await active_page.getAttribute('data-page_number')
        let next_offset = await (active_data_attribtue - 1)*4
        await dismountList()
        await getHeroes(next_offset)
        createList()
    }else{
        let active_page = await document.querySelector('.change_page.ativo')
        let next_active_page = await active_page.nextElementSibling
        await next_active_page.classList.add('ativo')
        await active_page.classList.remove('ativo')
        let data_page = await next_active_page.getAttribute('data-page_number')
        let next_offset = await (data_page - 1)*4
        await dismountList()
        await getHeroes(next_offset)
        createList()
    }
    btn_first_page.classList.remove('desativo')
    btn_prev_page.classList.remove('desativo')
}

async function lastPage(){
    let offset = await totalCharacter - 1
    let pages = await document.querySelectorAll('.change_page')
    let btn_first_page = await document.getElementById('first_page')
    let btn_prev_page = await document.getElementById('prev_page')
    let btn_next_page = await document.getElementById('next_page')
    let btn_last_page = await document.getElementById('last_page')
    btn_first_page.classList.remove('desativo')
    btn_prev_page.classList.remove('desativo')
    btn_next_page.classList.add('desativo')
    btn_last_page.classList.add('desativo')
    for (let index = 0; index < pages.length; index++) {
        let element = await pages[index];
        await element.classList.remove('ativo')
        if (index == (pages.length - 1)) {
            await element.classList.add('ativo')
        }
        await element.setAttribute('data-page_number', (numberOfPages-pagesButtonsDisplay)+index)
        element.innerHTML = await (numberOfPages-pagesButtonsDisplay)+index
    }
    await dismountList()
    await getHeroes(offset)
    createList()
}

async function setPage(element){
    let active_page = await document.querySelector('.change_page.ativo')
    await active_page.classList.remove('ativo')
    await element.classList.add('ativo')
    if (element.getAttribute('data-page_number') != 1) {
        let btn_first_page = await document.getElementById('first_page')
        let btn_prev_page = await document.getElementById('prev_page')
        btn_first_page.classList.remove('desativo')
        btn_prev_page.classList.remove('desativo')
    }
    if (element.getAttribute('data-page_number') == 1) {
        let btn_first_page = await document.getElementById('first_page')
        let btn_prev_page = await document.getElementById('prev_page')
        btn_first_page.classList.add('desativo')
        btn_prev_page.classList.add('desativo')
    }
    if (element.getAttribute('data-page_number') != numberOfPages) {
        let btn_last_page = await document.getElementById('last_page')
        let btn_next_page = await document.getElementById('next_page')
        btn_last_page.classList.remove('desativo')
        btn_next_page.classList.remove('desativo')
    }
    if (element.getAttribute('data-page_number') == numberOfPages) {
        let btn_last_page = await document.getElementById('last_page')
        let btn_next_page = await document.getElementById('next_page')
        btn_last_page.classList.add('desativo')
        btn_next_page.classList.add('desativo')
    }
    let offset = await (parseInt(element.getAttribute('data-page_number'))-1)*4
    await dismountList()
    await getHeroes(offset)
    createList()
}

const getInitials = (name) => {
    let initials = name.split(' ');

    if(initials.length > 1) {
        initials = initials.shift().charAt(0) + initials.pop().charAt(0);
    } else {
        initials = name.substring(0, 2);
    }

    return initials.toUpperCase();
}