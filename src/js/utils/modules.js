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


/**
 * Модальное окно 
 * 
 * INFO: Атрибуты (все атрибуты находятся в св-ве attrs)
 * data-modal-id="<id-modal>" - (modalId) каждая модалка имеет этот атрибут, в котором мы указываем ее id
 * data-close-on-bg - (modalCloseOnBg) модалка, которая должна закрываться при клике по ее фону, должна иметь этот атрибут
 * data-modal-open="<id-modal>" - (btnModalOpen) имеет элемент, при нажатии на который открывается модалка
 * data-modal-close="<id-modal || Null>" - (btnModalClose) имеет элемент, при нажатии на который, модальное окно закрывается. Если елемент находится внутри модалки, которую он должен закрыть, в значении атрибута указывать id модалки необязательно (можно оставить его пустым). Значение стоит указывать, если элемент, который должен закрыть модалку, находится вне контейнера с атрибутом data-modal-id
 * 
 * INFO: Свойства
 * attrs - (Object) названия атрибутов
 * classNames - (Object) названия классов
 * modalList - (NodeList) список всех модальных окон (для обновления списка использовать updateModalList())
 * openingBtnList - (NodeList) список открывающих кнопок
 * modalIsShow - (Boolean) модальное окно показано
 * modalShow - (Element) показанное модальное окно
 * modalShowId - (String) id показанного модального окна
 * keyEsc - (Boolean) закрывать модалки при нажатии клавиши Esc. По умолчанию - true
 * useHash - (Boolean) использовать хеш. Если в url указан хеш равный id модалки, модалка откроется. По умолчанию - true
 * historyHash - (Boolean) сохранять хеш в истории браузера. Если useHash === false, то historyHash будет равен false. По умолчанию - false
 * hash - (String) значение хеша
 * 
 * INFO: Функции
 * open(<String || Element>) - метод, открывающий модалку
 * close(<String || Element || Null>) - метод, закрывающий модалку. Если скобки оставить пустыми, закроется открытая модалка
 * update() - метод, обновляющий список модалок (this.modalList) и список кнопок (this.openingBtnList)
 * updateModalList() - метод, обновляющий список модалок (this.modalList)
 * updateOpeningBtnList() - метод, обновляющий список кнопок (this.openingBtnList)
 * 
 * 
 * TODO: 
 * (Атрибуты data-modal-hash и data-modal-hash-history. В случае если this.useHash === false)
 * data-modal-hash - указывается у модалки, которая должна открываться по хешу
 * data-modal-hash-history - указывается у модалки, которая должна быть сохранена в истории ( использовать вместе с первым атрибутом )
 * Прописать возомжные ошибки
 * Сделать анимацию появления с помощью js
 * Если указан id модалки при загрузке страницы, то модалка должна открываться без плавной анимации
 * События у модалок
 * Если при this.useHash = true, до открытия модалки в url был указан хеш не принадлежащий ни к одной модалке, то при закрытии модалки в url должен указываться тот самый хеш
 */
export class Modals {
    attrs = {
        modalId: 'data-modal-id',
        modalCloseOnBg: 'data-close-on-bg',
        btnModalOpen: 'data-modal-open',
        btnModalClose: 'data-modal-close',
    }
    classNames = {
        modalShow: 'is-show',
        modalBg: 'modal__bg',
    }
    modalList = document.querySelectorAll(`[${this.attrs.modalId}]`)
    openingBtnList = document.querySelectorAll(`[${this.attrs.btnModalOpen}]`)
    modalIsShow = false
    modalShow = null
    modalShowId = null
    keyEsc = true
    useHash = true
    historyHash = !this.useHash ? false : false
    hash = null
    
    constructor(options) {
        this.init()
    }

    // Инизиализация Modal
    init() {
        this.btnOpen()
        this.btnClose()
        if (this.keyEsc) this.keyEscClose()
        if (this.useHash) this.watchHash()
    }

    // Открыть модальное окно
    open(modal) {        
        if (typeof modal === 'string') {
            modal = document.querySelector(`[${this.attrs.modalId}=${modal}]`)
        }

        this.modalIsShow = true
        this.modalShow = modal
        this.modalShowId = modal.dataset.modalId
        
        this.modalBgClose()
        modal.classList.add(this.classNames.modalShow)
        bodyLock()
    }

    // Закрыть модальное окно
    close(modal) {
        if (typeof modal === 'undefined') {
            if (this.modalShow != null) {
                modal = this.modalShow
            }
            else {
                console.error('[Modals]: Все модальные окна закрыты')
                return
            }
        }
        if (typeof modal === 'string') {
            modal = document.querySelector(`[${this.attrs.modalId}=${modal}]`)
        }
        if (this.modalShow.dataset.closeOnBg != undefined) {
            this._modalBg.removeEventListener('click', this._bgEvent)
        }

        this.modalIsShow = false
        this.modalShow = null
        this.modalShowId = null
        
        modal.classList.remove(this.classNames.modalShow)
        bodyUnlock()
    }
    
    // Открыть модалку при клике по кнопке c атрибутом this.attrs.btnModalOpen
    btnOpen() {
        document.addEventListener('click', e => {
            if (e.target.dataset.modalOpen != undefined || e.target.closest(`[${this.attrs.btnModalOpen}]`)) {
                const btnOpenModal = e.target.dataset.modalOpen != undefined ? e.target : e.target.closest(`[${this.attrs.btnModalOpen}]`)
    
                this.open(btnOpenModal.dataset.modalOpen)
                if (this.useHash) this.setHash()
            }
        })
    }

    // Закрыть модалку при клике по кнопке с атрибутом this.attrs.btnModalClose
    btnClose() {
        document.addEventListener('click', e => {
            if (e.target.dataset.modalClose != undefined || e.target.closest(`[${this.attrs.btnModalClose}]`)) {
                if (this.useHash) this.clearHash()
                this.close(document.querySelector(`[${this.attrs.modalId}=${this.modalShowId}]`))
            }
        })
    }

    // Закрытие модалки при клике по фону. Работает только у модалок, у которых ест атрибут this.attrs.modalCloseOnBg
    modalBgClose() {
        if (this.modalShow.dataset.closeOnBg === undefined) return

        this._modalBg = this.modalShow.querySelector(`.${this.classNames.modalBg}`)
        this._bgEvent = () => {
            if (this.useHash) this.clearHash()
            this.close(this.modalShow)
        }

        this._modalBg.addEventListener('click', this._bgEvent, { once: true })
    }

    // Закрытие модалки при нажатии клавиши Esc
    keyEscClose() {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                if (this.useHash) this.clearHash()
                this.close()
            }
        })
    }

    // Следим за хешем
    watchHash() {
        this.checkHash()
        if (this.historyHash) {
            window.addEventListener('hashchange', e => {
                this.checkHash()
            })
        }
    }
    
    // Проверка хеша
    checkHash() {
        const hash = window.location.hash.replace('#', '')
        this.hash = (hash === '') ? null : hash
    
        if (hash != '' && document.querySelector(`[data-modal-id=${hash}]`)) {
            this.open(hash)
        }
        if (hash === '' && this.historyHash && this.modalShow) {
            this.close()
        }
    }

    // Установка хеша, равного id модалки
    setHash() {
        const href = location.origin + location.pathname + '#' + this.modalShowId
        history[this.historyHash ? 'pushState' : 'replaceState']({}, '', href)
    }

    // Удаление хеша
    clearHash() {
        const href = location.href.replace(/#[\w-]+/, '');
        history[this.historyHash ? 'pushState' : 'replaceState']({}, '', href)
    }

    // Обновляет список модалок и кнопок
    update() {
        this.updateModalList()
        this.updateOpeningBtnList()
    }

    // Обновить список модальных окон
    updateModalList() {
        this.modalList = document.querySelectorAll(`[${this.attrs.modalId}]`)
    }

    // Обновить список кнопок, открывающих модальные окна
    updateOpeningBtnList() {
        this.openingBtnList = document.querySelectorAll(`[${this.attrs.btnModalOpen}]`)
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
    tabs,
    labelTextfield,
    select,
    arrowUp,
    fixElemOverFooter,
    onlyDigit,
    Modals
}