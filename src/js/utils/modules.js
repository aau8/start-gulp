import { bodyLock, bodyUnlock, bodyLockToggle, removeAllClasses, getSiblings } from './functions.js'

// Аккордеон
// data-acc-toggle - кнопка при клике по которой показывается/скрывается тело аккордеона
// data-acc-body - тело аккордеона
// data-acc-hidden-sibling - аккордеоны будут скрываться при выборе других аккордеонов. !Атрибут указывается у контейнера (acc-list), в котором находятся аккордеоны
// data-acc-open="<acc-id>" - указывать у элемента, при клике по которому будет открываться указанный аккордеон (в паре обязательно использовать data-acc-id)
// data-acc-id="<acc-id>" - указывать у аккордеона, если планируется использовать data-acc-open. А так, необязательно
export function acc() {
    window.addEventListener("click", accDo)
    
    function accDo(e) {
        const dataAccOpen = e.target.getAttribute('data-acc-open')

        if (e.target.getAttribute('data-acc-toggle') || e.target.closest('[data-acc-toggle]') || dataAccOpen != null) {
            const accToggle = dataAccOpen != null ? document.querySelector(`[data-acc-id=${dataAccOpen}] [data-acc-toggle]`) : e.target
            const accContainer = !accToggle.closest("[data-acc-body]") ? accToggle.parentElement.parentElement : accToggle.closest("[data-acc-body]")
            const accElem = accToggle.parentElement
            const accBody = accToggle.nextElementSibling
        
            if (accBody.style.maxHeight) {
                accBody.style.maxHeight = null
                accElem.classList.remove("is-show")
            } else {
                const adjacentElems = getSiblings(accElem)
                const accHiddenSibling = accContainer.dataset.accHiddenSibling
    
                accElem.classList.add("is-show")
    
                if (accHiddenSibling != undefined && accHiddenSibling != 'false') {
    
                    for (let i = 0; i < adjacentElems.length; i++) {
                        const elem = adjacentElems[i]
                        const elemHeader = elem.querySelector("[data-acc-toggle]")
                        const elemBody = elem.querySelector("[data-acc-body]")
    
                        elem.classList.remove("is-show")
                        elemHeader.classList.remove("is-show")
                        elemBody.style.maxHeight = null
                    }
                }
    
                accBody.style.maxHeight = accBody.scrollHeight + "px"
                accContainer.style.maxHeight = parseInt(accContainer.scrollHeight) + accBody.scrollHeight + "px"
            }
        }
    }
}
//========================================================================================================================================================


// Модальные окна
// data-close-on-bg - закрывать модалку при клике по фону
// data-modal-close - указывать у кнопок, при клике по которым, нужно закрыть модалку
// data-modal-open - элементы, открывающие модальное окно
// data-modal-id - идентификатор модального окна
export function modal() {
    // Открытие модальных окон при клике по кнопке
    openModalWhenClickingOnBtn()
    function openModalWhenClickingOnBtn() {
        window.addEventListener('click', e => {
            const target = e.target

            if (target.dataset.modalOpen != undefined || target.closest('[data-modal-open]')) {
                const btn = target.closest('[data-modal-open]') ? target.closest('[data-modal-open]') : target;
                const dataBtn = btn.dataset.modalOpen;
                const modal = document.querySelector(`#${dataBtn}`)

                e.preventDefault()
                window.location.hash = dataBtn
            }
        })
    }

    // Открытие модального окна, если в url указан его id
    openModalHash()
    function openModalHash() {
        if (window.location.hash) {
            const hash = window.location.hash.substring(1)
            const modal = document.querySelector(`.modal[data-modal-id=${hash}]`)
    
            if (modal) openModal(modal)
        }
    }

    // Показываем/убираем модальное окно при изменения хеша в адресной строке
    checkHash()
    function checkHash() {
        window.addEventListener('hashchange', e => {
            const hash = window.location.hash.replace('#', '')
            const modal = document.querySelector(`.modal[data-modal-id="${hash}"]`)

            e.preventDefault()

            if (modal && hash != '') {
                if (document.querySelector('.modal.is-show')) {
                    closeModal(document.querySelector('.modal.is-show'), false)
                }
                
                openModal(modal)
            }
            else {

                if (document.querySelector('.modal.is-show')) {
                    closeModal(document.querySelector('.modal.is-show'))
                }
            }
        })
    }

    // Закрытие модального окна при клике по заднему фону
    closeModalWhenClickingOnBg()
    function closeModalWhenClickingOnBg() {
        document.addEventListener('click', (e) => {
            const target = e.target

            if (target.classList.contains('modal__bg') && target.closest('.modal[data-close-on-bg]')) {
                closeModal(target.closest('.modal'))
                clearHash()
            }
        })
    }

    // Закрытие модальных окон при клике по крестику
    closeModalWhenClickingOnCross()
    function closeModalWhenClickingOnCross() {
        window.addEventListener('click', e => {
            const target = e.target

            if (target.classList.contains('[data-modal-close]') || target.closest('[data-modal-close]')) {
                closeModal(target.closest('.modal'))
                clearHash()
            }
        })
    }

    // Закрытие модальных окон при нажатии по клавише ESC
    closeModalWhenClickingOnESC()
    function closeModalWhenClickingOnESC() {
        const modalElems = document.querySelectorAll('.modal')
        for (let i = 0; i < modalElems.length; i++) {
            const modal = modalElems[i];
    
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape') {
                    closeModal(modal)
                    clearHash()
                }
            })
        }
    }

    // Сброс id модального окна в url
    function clearHash() {
        const windowTop = window.pageYOffset
        const href = location.href.replace(/#[\w-]+/, '');
        history.pushState({}, '', href)
        window.scrollTo(0, windowTop)
    }

    // Открытие модального окна
    function openModal(modal) {
        modal.classList.add('is-show')
        bodyLock()
    }

    // Закрытие модального окна
    function closeModal(modal, unlockBody) {
        modal.classList.remove('is-show')

        if (unlockBody != false) {
            bodyUnlock()
        }
    }
}
//========================================================================================================================================================


// Табы
// data-tab - указывается у контейнера с карточками и табами
// data-tab-btn="<category>" - кнопки(табы), при клике по которым меняется контент. Если указать в значении all, то покажутся все карточки.
// data-tab-card="<category>" - карточки с категорией, к которой они относятся
export function tabs() {
    const tabElems = document.querySelectorAll('[data-tab]')

    for (let i = 0; i < tabElems.length; i++) {
        const tab = tabElems[i];
        const btnElems = tab.querySelectorAll('[data-tab-btn]')
        const allCards = tab.querySelectorAll('[data-tab-card]')
    
        for (let i = 0; i < btnElems.length; i++) {
            const btn = btnElems[i];

            btn.addEventListener('click', e => {
                const btnData = btn.dataset.tabBtn
                const cardElems = tab.querySelectorAll(`[data-tab-card=${btnData}]`)

                removeAllClasses(btnElems, 'is-active')
                removeAllClasses(allCards, 'is-show')

                btn.classList.add('is-active')
                // tabRoller()

                if (btnData === 'all') {
                    for (let i = 0; i < allCards.length; i++) {
                        const card = allCards[i];
                        
                        card.classList.add('is-show')
                    }
                }
                else {
                    for (let i = 0; i < cardElems.length; i++) {
                        const card = cardElems[i];
                        
                        card.classList.add('is-show')
                    }
                }
            })
        }
    }

    // window.addEventListener('resize', e => {
    //     tabRoller()
    // })

    // Ползунок у табов
    // tabRoller()
    function tabRoller(tab) {
        const roller = tab.querySelector('[data-tab-roller]')
        const tabActive = tab.querySelector('[data-tab-btn].is-active')

        roller.style.width = tabActive.clientWidth - parseInt(window.getComputedStyle(tabActive).paddingRight) - parseInt(window.getComputedStyle(tabActive).paddingLeft) + 'px' // Определяем ширину ползунка
        roller.style.left = tabActive.offsetLeft + parseInt(window.getComputedStyle(tabActive).paddingRight) + 'px' // Определяем отступ слева у ползунка
    }
}
//========================================================================================================================================================


// Плейсхолдер текстовых полей
export function labelTextfield(container = document) {
    const textfieldElems = container.querySelectorAll('.tf')

    for (let i = 0; i < textfieldElems.length; i++) {
        const textfield = textfieldElems[i];
        const input = textfield.querySelector('input, textarea')

        if (input.value != '') {
            textfield.classList.add('has-change-label')
        }

        input.addEventListener('focus', e => {
            textfield.classList.add('has-change-label')
        })
        
        input.addEventListener('blur', e => {
            if (input.value === '') {
                textfield.classList.remove('has-change-label')
            }
        })
    }
}
//========================================================================================================================================================


// Списки выбора
export function select() {
    // Проверяем есть ли выбранные элементы при загрузке страницы. Если есть, то селект заполняется
    const selectedItemElems = document.querySelectorAll('.select-dropdown__item.is-selected')

    for (let i = 0; i < selectedItemElems.length; i++) {
        const selectedItem = selectedItemElems[i];
        const select = selectedItem.closest('.select')
        const sTitle = select.querySelector('.select-input__title')
        const sInput = select.querySelector('input[type=hidden]')

        sTitle.innerText = selectedItem.innerHTML
        sInput.value = selectedItem.innerHTML
        select.classList.add('is-valid')
    }

    // Если пользователь кликнул по селекту, то он открывается/закрывается. Также он закроется если кликнуть вне его области
    window.addEventListener('click', e => {
        const target = e.target

        // Если пользователь кликнул вне зоны селекта
        if (!target.classList.contains('select') && !target.closest('.select.is-open')) {
            
            if (document.querySelector('.select.is-open')) {
                document.querySelector('.select.is-open').classList.remove('is-open')
            }
        }

        // Если пользователь кликнул по шапке селекта
        if (target.classList.contains('select-input')) {
            target.parentElement.classList.toggle('is-open')
        }

        // Если пользователь выбрал пункт из списка селекта
        if (target.classList.contains('select-dropdown__item')) {
            const select = target.closest('.select')
            const sTitle = select.querySelector('.select-input__title')
            const sInput = select.querySelector('input[type=hidden]')
            const neighbourTargets = target.parentElement.querySelectorAll('.select-dropdown__item')

            sTitle.innerText = target.innerText
            sInput.value = target.innerText

            removeAllClasses(neighbourTargets, 'is-selected')
            target.classList.add('is-selected')

            select.classList.remove('is-open')
            select.classList.add('is-valid')
        }
    })
}
//========================================================================================================================================================


// Кнопка "Наверх"
export function arrowUp() {
    document.querySelector(".back-to-top").addEventListener("click", (e) => {
        window.scrollBy(0, -window.scrollY);
    });
}
//========================================================================================================================================================

// Фиксация элемента с position: fixed над подвалом (чтобы не загораживал контент в подвале)
export function fixElemOverFooter(elem) {
    const footer = document.querySelector('footer')
    
    window.addEventListener('scroll', fixElem)
    
    fixElem()
    function fixElem() {
        const footerPageY = footer.getBoundingClientRect().top
        
        if (footerPageY - window.innerHeight < 0) {
            if (!elem.classList.contains('is-fixed')) {
                elem.style.position = 'absolute'
                elem.style.bottom = document.body.scrollHeight - (footerPageY + window.scrollY) + parseInt(window.getComputedStyle(socialFixed).getPropertyValue('bottom')) + 'px'
                elem.classList.add('is-fixed')
            }
        }
        else {
            elem.removeAttribute('style')
            elem.classList.remove('is-fixed')
        }
    }
}

// Только цифры и точка в инпутах
// data-only-digit - input должен иметь этот атрибут
export function onlyDigit() {
    const inputDigitElems = document.querySelectorAll('[data-only-digit]')

    for (let i = 0; i < inputDigitElems.length; i++) {
        const input = inputDigitElems[i];
        
        input.addEventListener('keydown', e => {
            if (e.key.search(/[\d\.]/)) {
                e.preventDefault()
            }
        })

        input.addEventListener('paste', e => {
            if (e.clipboardData.getData('text/plain').search(/[\d\.]/)) {
                e.preventDefault()
            }
        })
    }
}
//========================================================================================================================================================


export default {
    acc,
    modal,
    tabs,
    labelTextfield,
    select,
    arrowUp,
    fixElemOverFooter,
    onlyDigit,
}