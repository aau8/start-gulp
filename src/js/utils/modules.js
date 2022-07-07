import { bodyLock, bodyUnlock, bodyLockToggle, removeAllClasses, getSiblings } from './functions.js'


/**
 * Аккордеон
 *
 * INFO: Атрибуты
 * data-acc-container - контейнер с аккордеонами
 * data-acc-hidden-sibling - (указывать у контейнера) если указан, при открытии аккордеона, все сосоднии будут закрываться
 * data-acc="<id-acc || Null>" - этот атрибут должен иметь элемент, являющийся аккордеоном
 * data-acc-toggler - элемент внутри аккордеона, открывающий его
 * data-acc-body - тело аккордеона
 * data-acc-opener="<id-acc>" - внешняя кнопка, открывающая аккордеон.
 *
 *
 * TODO: Что еще можно сделать
 * this.prevAcc - предыдущий аккордеон
 * this.update() - Функционал обновления аккордеонов
 * События
 * Сделать возможность не указывать атрибут у контейнера. В этом случае, контейнером будет являться родитель аккордеонов
 * Подумать надо объединением opener и toggler. Они выполняют примерно один и тот же функционал
 * this.toggle(<id-acc>) - если аккордеон открыт, он закроется. Если закрыт, он закроется
 */
export class Accordions {
    attrs = {
        container: 'data-acc-container',
        hiddenSibling: 'data-acc-hidden-sibling',
        acc: 'data-acc',
        toggler: 'data-acc-toggler',
        body: 'data-acc-body',
        opener: 'data-acc-opener',
    }

    classNames = {
        open: 'is-open'
    }

    _currentAcc = {}

    accArr = []
    hiddenSibling = false


    constructor(selector) {
        this.init(selector)
    }

    init(selector) {
        let _accArr = Array.from( null !== selector ? typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector : document.querySelectorAll(`[${this.attrs.container}]`))
        this.accArr = _accArr.map(e => Array.from(e.querySelectorAll(`[${this.attrs.acc}]`)))
        this._combAccArr = Array().concat(...this.accArr)
        this._combAccArr.forEach(_acc => this.close(_acc, false))
        this._clickToggler()
        this._outsideOpener()
    }

    open(selector) {
        const _acc = selector === undefined ? this._currentAcc.acc : typeof(selector) === 'string' ? document.querySelector(selector) : selector

        if (_acc.classList.contains(this.classNames.open)) return

        this._setCurrentAcc(_acc)

        if (this.hiddenSibling || this._currentAcc.container.hasAttribute(`${this.attrs.hiddenSibling}`)) {
            const _accElems = Array.from(this._currentAcc.container.querySelectorAll(`[${this.attrs.acc}]`))

            _accElems.forEach(_acc => {
                if (_acc.classList.contains(this.classNames.open)) {
                    this.close(_acc, false)
                }
            })
        }

        this._currentAcc.acc.classList.add(this.classNames.open)
        this._currentAcc.body.style = `
            max-height: ${this._currentAcc.body.scrollHeight}px;
            opacity: 1;
            visibility: visible;
        `
    }

    close(selector, makeCurrent = false) {
        const _acc = selector === undefined ? this._currentAcc.acc : typeof(selector) === 'string' ? document.querySelector(selector) : selector
        const _body = selector === undefined ? this._currentAcc.body : _acc.querySelector(`[${this.attrs.body}]`)
        if (makeCurrent) this._setCurrentAcc(_acc)

        _acc.classList.remove(this.classNames.open)
        _body.style = `
            max-height: 0;
            opacity: 0;
            visibility: hidden;
        `
    }

    _outsideOpener() {
        document.addEventListener('click', e => {

            if (e.target.hasAttribute(this.attrs.opener) || e.target.closest(`[${this.attrs.opener}]`)) {
                const _opener = e.target.hasAttribute(this.attrs.opener) ? e.target : e.target.closest(`[${this.attrs.opener}]`)
                const _acc = document.querySelector(`[${this.attrs.acc}=${_opener.getAttribute(this.attrs.opener)}]`)

                this.open(_acc)
            }
        })
    }

    _clickToggler() {
        this._combAccArr.forEach(_acc => {
            const _toggler = _acc.querySelector(`[${this.attrs.toggler}]`)

            _toggler.addEventListener('click', e => {
                this._setCurrentAcc(_acc)

                if (!_acc.classList.contains(this.classNames.open)) {
                    this.open()
                }
                else {
                    this.close()
                }
            })
        })
    }

    _setCurrentAcc(_acc) {
        this._currentAcc.container = _acc.closest(`[${this.attrs.container}]`)
        this._curren,tAcc.acc = _acc
        this._currentAcc.toggler = _acc.querySelector(`[${this.attrs.toggler}]`)
        this._currentAcc.body = _acc.querySelector(`[${this.attrs.body}]`)
    }
}

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
 * TODO: Что еще можно сделать
 * (Атрибуты data-modal-hash и data-modal-hash-history. В случае если this.useHash === false)
 * data-modal-hash - указывается у модалки, которая должна открываться по хешу
 * data-modal-hash-history - указывается у модалки, которая должна быть сохранена в истории ( использовать вместе с первым атрибутом )
 * Прописать возомжные ошибки
 * Анимацию появления с помощью js
 * Если указан id модалки при загрузке страницы, то модалка должна открываться без плавной анимации
 * События
 * Если при this.useHash = true, до открытия модалки в url был указан хеш не принадлежащий ни к одной модалке, то при закрытии модалки в url должен указываться тот самый хеш
 * Возможность открытия нескольких модалок
 * Закрытие/открытие модалок по таймеру
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
        this._init()
    }

    // Открыть модальное окно
    open(modal) {
        if (typeof modal === 'string') {
            modal = document.querySelector(`[${this.attrs.modalId}=${modal}]`)
        }

        this.modalIsShow = true
        this.modalShow = modal
        this.modalShowId = modal.dataset.modalId

        this._modalBgClose()
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

    // Инизиализация Modal
    _init() {
        this._btnOpen()
        this._btnClose()
        if (this.keyEsc) this._keyEscClose()
        if (this.useHash) this._watchHash()
    }

    // Открыть модалку при клике по кнопке c атрибутом this.attrs.btnModalOpen
    _btnOpen() {
        document.addEventListener('click', e => {
            if (e.target.dataset.modalOpen != undefined || e.target.closest(`[${this.attrs.btnModalOpen}]`)) {
                const btnOpenModal = e.target.dataset.modalOpen != undefined ? e.target : e.target.closest(`[${this.attrs.btnModalOpen}]`)

                this.open(btnOpenModal.dataset.modalOpen)
                if (this.useHash) this._setHash()
            }
        })
    }

    // Закрыть модалку при клике по кнопке с атрибутом this.attrs.btnModalClose
    _btnClose() {
        document.addEventListener('click', e => {
            if (e.target.dataset.modalClose != undefined || e.target.closest(`[${this.attrs.btnModalClose}]`)) {
                if (this.useHash) this._clearHash()
                this.close(document.querySelector(`[${this.attrs.modalId}=${this.modalShowId}]`))
            }
        })
    }

    // Закрытие модалки при клике по фону. Работает только у модалок, у которых ест атрибут this.attrs.modalCloseOnBg
    _modalBgClose() {
        if (this.modalShow.dataset.closeOnBg === undefined) return

        this._modalBg = this.modalShow.querySelector(`.${this.classNames.modalBg}`)
        this._bgEvent = () => {
            if (this.useHash) this._clearHash()
            this.close(this.modalShow)
        }

        this._modalBg.addEventListener('click', this._bgEvent, { once: true })
    }

    // Закрытие модалки при нажатии клавиши Esc
    _keyEscClose() {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                if (this.useHash) this._clearHash()
                this.close()
            }
        })
    }

    // Следим за хешем
    _watchHash() {
        this._checkHash()
        if (this.historyHash) {
            window.addEventListener('hashchange', e => {
                this._checkHash()
            })
        }
    }

    // Проверка хеша
    _checkHash() {
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
    _setHash() {
        const href = location.origin + location.pathname + '#' + this.modalShowId
        history[this.historyHash ? 'pushState' : 'replaceState']({}, '', href)
    }

    // Удаление хеша
    _clearHash() {
        const href = location.href.replace(/#[\w-]+/, '');
        history[this.historyHash ? 'pushState' : 'replaceState']({}, '', href)
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


class Tabs {
    constructor() {

    }
}

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
    Accordions,
    Modals,
    tabs,
    labelTextfield,
    select,
    arrowUp,
    fixElemOverFooter,
    onlyDigit,
}