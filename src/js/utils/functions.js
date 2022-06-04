// Сокращенная запись нахождения одного элемента
export function find(selector) {
    return document.querySelector(selector)
}
//========================================================================================================================================================

// Сокращенная запись нахождения нескольких элементов
export function findAll(selectors) {
    return document.querySelectorAll(selectors)
}
//========================================================================================================================================================

// Удаляет у всех элементов items класс itemClass
export function removeAllClasses(items, itemClass) {
    if (typeof items == "string") {
        items = document.querySelectorAll(items)
    }

    for (let i = 0; i < items.length; i++) {
        if (typeof(itemClass) === 'object') {
            items[i].classList.remove(...itemClass)
        }
        else {
            items[i].classList.remove(itemClass)
        }
    }
}
//========================================================================================================================================================

// Удаляет у элемента item класс itemClass
export function removeClass(item, itemClass) {
    if (typeof item == "string") {
        item = document.querySelectorAll(item)
    }

    item.classList.remove(itemClass)
}
//========================================================================================================================================================


// Получаем все соседние элементы
export function getSiblings(elem) {
    var siblings = []
    var sibling = elem
    while (sibling.previousSibling) {
        sibling = sibling.previousSibling
        sibling.nodeType == 1 && siblings.push(sibling)
    }

    sibling = elem
    while (sibling.nextSibling) {
        sibling = sibling.nextSibling
        sibling.nodeType == 1 && siblings.push(sibling)
    }

    return siblings
}
//========================================================================================================================================================


// Возвращает рандомное целое число
export function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max) + 1
    return Math.floor(Math.random() * (max - min)) + min
}
//========================================================================================================================================================


// Проверка поддержки webp, добавление класса webp или no-webp тегу body
export function isWebp() {
    // Проверка поддержки webp
    function testWebP(callback) {
        let webP = new Image()

        webP.onload = webP.onerror = function () {
            callback(webP.height == 2)
        }

        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
    }

    testWebP(function (support) {
        let className = support === true ? "webp" : "no-webp"
        document.body.classList.add(className)
    })
}
//========================================================================================================================================================


// Вспомогательные модули блокировки прокрутки и резкого сдвига
export let bodyLockStatus = true;
export let bodyLockToggle = (delay = 100) => {
	if (document.documentElement.classList.contains('_lock')) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
}
// Разблокировать скролл
export let bodyUnlock = (delay = 100) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			document.documentElement.classList.remove("_lock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}

// Заблокировать скролл
export let bodyLock = (delay = 100) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		document.documentElement.classList.add("_lock");

		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}